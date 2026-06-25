const path = require("path");

const rootDir = path.join(__dirname, "..");

module.exports = {
  rootDir,
  brandsDir: path.join(__dirname, "brands"),
  defaultBrand: process.env.TV_BRAND || "default",
  grandmaInput: process.env.TV_GRANDMA_INPUT || "hdmi2",
  discoveryTimeoutMs: Number(process.env.TV_DISCOVERY_TIMEOUT_MS || 5000)
};