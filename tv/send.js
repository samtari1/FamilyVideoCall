#!/usr/bin/env node

const tvController = require("./tvController");

const commandName = process.argv[2];

async function main() {
  if (!commandName) {
    console.error("Usage: node tv/send.js <command-name>");
    process.exitCode = 1;
    return;
  }

  try {
    await tvController.send(commandName);
    console.log(`Sent ${commandName}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();