const fs = require("fs");
const path = require("path");
const config = require("./config");

let broadlinkModule = null;
let cachedDevice = null;
let cachedDevicePromise = null;

function loadBroadlinkModule() {
  if (broadlinkModule) {
    return broadlinkModule;
  }

  try {
    broadlinkModule = require("node-broadlink");
    return broadlinkModule;
  } catch {
    throw new Error(
      "node-broadlink is not installed. Run npm install before using TV controls."
    );
  }
}

async function discoverDevices(timeoutMs = config.discoveryTimeoutMs) {
  const broadlink = loadBroadlinkModule();
  const devices = await broadlink.discover(timeoutMs);
  return Array.isArray(devices) ? devices : [];
}

async function getDevice() {
  if (cachedDevice) {
    return cachedDevice;
  }

  if (!cachedDevicePromise) {
    cachedDevicePromise = (async () => {
      const devices = await discoverDevices();

      if (!devices.length) {
        throw new Error("No BroadLink RM4C device was discovered on the network.");
      }

      const device = devices[0];

      if (typeof device.auth === "function") {
        await device.auth();
      }

      cachedDevice = device;
      return device;
    })();
  }

  return cachedDevicePromise;
}

function readHexPayload(filePath) {
  const hex = fs.readFileSync(filePath, "utf8").trim().replace(/\s+/g, "");

  if (!hex) {
    throw new Error(`IR code file is empty: ${filePath}`);
  }

  return Buffer.from(hex, "hex");
}

async function sendHexFile(filePath) {
  const device = await getDevice();

  if (typeof device.sendData !== "function") {
    throw new Error("The discovered BroadLink device does not support sendData().");
  }

  await device.sendData(readHexPayload(filePath));
}

async function learnHexCode(outputPath) {
  const device = await getDevice();

  if (typeof device.enterLearning !== "function" || typeof device.checkData !== "function") {
    throw new Error("The discovered BroadLink device does not support learning mode.");
  }

  await device.enterLearning();

  while (true) {
    try {
      const data = await device.checkData();

      if (data) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, Buffer.from(data).toString("hex") + "\n");
        return outputPath;
      }
    } catch {
      // Keep polling until the remote button is captured.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

module.exports = {
  discoverDevices,
  getDevice,
  learnHexCode,
  sendHexFile
};