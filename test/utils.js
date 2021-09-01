const fs = require('fs')
const path = require('path')

const { Buffer } = require('buffer/')

/* eslint-disable @typescript-eslint/promise-function-async --
 * this is not async... */
function hexOnly(hex) {
  return hex.replace(/[^a-fA-F0-9]/gu, '')
}
/* eslint-enable @typescript-eslint/promise-function-async */

function parseHexOnly(hex) {
  return Buffer.from(hexOnly(hex), 'hex')
}

/* eslint-disable @typescript-eslint/promise-function-async --
 * didn't know that require is async */
function loadFixture(relativePath) {
  const absolutePath = path.join(__dirname, 'fixtures', relativePath)
  /* eslint-disable global-require, node/global-require, import/no-dynamic-require --
   * just for loading test fixtures */
  return require(absolutePath)
  /* eslint-enable global-require, node/global-require, import/no-dynamic-require */
}
/* eslint-enable @typescript-eslint/promise-function-async */

function loadFixtureText(relativePath) {
  const absolutePath = path.join(__dirname, 'fixtures', relativePath)
  /* eslint-disable node/no-sync --
   * just for tests */
  return fs.readFileSync(absolutePath).toString('utf8')
  /* eslint-enable node/no-sync */
}

module.exports = {
  hexOnly,
  parseHexOnly,
  loadFixture,
  loadFixtureText,
}
