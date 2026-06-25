#!/usr/bin/env node

const path = require("path");
const config = require("./config");
const broadlink = require("./broadlink");

const commandName = process.argv[2];

async function main() {
  if (!commandName) {
    console.error("Usage: node tv/learn.js <command-name>");
    process.exitCode = 1;
    return;
  }

  try {
    const outputPath = path.join(
      config.rootDir,
      "tv",
      "brands",
      config.defaultBrand,
      "ir-codes",
      `${commandName}.txt`
    );

    console.log(`Learning ${commandName} into ${outputPath}`);
    console.log("Press the remote button after the device enters learning mode.");

    await broadlink.learnHexCode(outputPath);
    console.log(`Saved ${outputPath}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();