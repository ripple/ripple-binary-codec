function hexOnly(hex) {
  return hex.replace(/[^a-fA-F0-9]/g, "");
}

function unused() {}

function parseHexOnly(hex) {
  return Buffer.from(hexOnly(hex), "hex");
}

module.exports = {
  hexOnly,
  parseHexOnly,
  unused,
};
