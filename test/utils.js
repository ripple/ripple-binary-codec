const fs = require('fs');
const assert = require('assert');
const {parseBytes} = require('../dist/utils/bytes-utils');

function hexOnly(hex) {
  return hex.replace(/[^a-fA-F0-9]/g, '');
}

function unused() {}

function captureLogs(func) {
  const finished = captureLogsAsync();
  try {
    func();
  } catch (e) {
    const log = finished();
    console.error(log);
    throw e;
  }
  return finished();
}

function parseHexOnly(hex, to) {
  return parseBytes(hexOnly(hex), to);
}

function loadFixture(relativePath) {
  const fn = __dirname + '/fixtures/' + relativePath;
  return require(fn);
}

function isBufferOrString(val) {
  return Buffer.isBuffer(val) || (typeof val === 'string');
}

function loadFixtureText(relativePath) {
  const fn = __dirname + '/fixtures/' + relativePath;
  return fs.readFileSync(fn).toString('utf8');
}

function fixturePath(relativePath) {
  return __dirname + '/fixtures/' + relativePath;
}

function prettyJSON(val) {
  return JSON.stringify(val, null, 2);
}

module.exports = {
  hexOnly,
  parseHexOnly,
  loadFixture,
  loadFixtureText,
  unused,
  captureLogs
};
