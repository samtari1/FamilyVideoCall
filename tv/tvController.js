const fs = require("fs");
const path = require("path");
const config = require("./config");
const broadlink = require("./broadlink");

function resolveBrandDir(brand = config.defaultBrand) {
  return path.join(config.brandsDir, brand);
}

function resolveCommandsFile(brand = config.defaultBrand) {
  const brandDir = resolveBrandDir(brand);
  const brandCommands = path.join(brandDir, "commands.json");
  const fallbackCommands = path.join(config.brandsDir, config.defaultBrand, "commands.json");

  if (fs.existsSync(brandCommands)) {
    return brandCommands;
  }

  if (fs.existsSync(fallbackCommands)) {
    return fallbackCommands;
  }

  throw new Error(
    `No TV command map found. Expected ${brandCommands} or ${fallbackCommands}.`
  );
}

function loadCommands(brand = config.defaultBrand) {
  const commandsFile = resolveCommandsFile(brand);
  const commandMap = JSON.parse(fs.readFileSync(commandsFile, "utf8"));

  return {
    brand,
    brandDir: path.dirname(commandsFile),
    commandMap
  };
}

function resolveCommandPath(commandName, brand = config.defaultBrand) {
  const { brandDir, commandMap } = loadCommands(brand);
  const relativePath = commandMap[commandName];

  if (!relativePath) {
    throw new Error(`Unknown TV command: ${commandName}`);
  }

  return path.join(brandDir, relativePath);
}

async function send(commandName, options = {}) {
  const brand = options.brand || config.defaultBrand;
  const commandPath = resolveCommandPath(commandName, brand);

  await broadlink.sendHexFile(commandPath);
}

async function powerOn(options = {}) {
  return send("power", options);
}

async function switchHDMI(inputNumber, options = {}) {
  return send(`hdmi${inputNumber}`, options);
}

async function switchToGrandmaInput(options = {}) {
  return send(options.commandName || config.grandmaInput, options);
}

async function mute(options = {}) {
  return send("mute", options);
}

async function handlePortalAction(action) {
  if (action !== "call") {
    return;
  }

  await powerOn();
  await switchToGrandmaInput();
}

module.exports = {
  handlePortalAction,
  loadCommands,
  mute,
  powerOn,
  resolveBrandDir,
  resolveCommandPath,
  send,
  switchHDMI,
  switchToGrandmaInput
};