#!/usr/bin/env node

const broadlink = require("./broadlink");

async function main() {
  try {
    const devices = await broadlink.discoverDevices();

    if (!devices.length) {
      console.log("No BroadLink devices found.");
      return;
    }

    console.log(`Found ${devices.length} BroadLink device(s)`);

    for (const device of devices) {
      console.log("================================");
      console.log(`Host: ${device.host}`);
      console.log(`Model: ${device.model}`);
      console.log(`Locked: ${device.isLocked}`);
      console.log(`Class: ${device.constructor.name}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();