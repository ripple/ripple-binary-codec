'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};var assert = require('assert');
var coreTypes = require('./coretypes');var
quality =




coreTypes.quality,_coreTypes$binary = coreTypes.binary,bytesToHex = _coreTypes$binary.bytesToHex,signingData = _coreTypes$binary.signingData,multiSigningData = _coreTypes$binary.multiSigningData,binaryToJSON = _coreTypes$binary.binaryToJSON,serializeObject = _coreTypes$binary.serializeObject;

function decode(binary) {
  assert(typeof binary === 'string', 'binary must be a hex string');
  return binaryToJSON(binary);
}

function encode(json) {
  assert((typeof json === 'undefined' ? 'undefined' : _typeof(json)) === 'object');
  return bytesToHex(serializeObject(json));
}

function encodeForSigning(json) {
  assert((typeof json === 'undefined' ? 'undefined' : _typeof(json)) === 'object');
  return bytesToHex(signingData(json));
}

function encodeForMultisigning(json, signer) {
  assert((typeof json === 'undefined' ? 'undefined' : _typeof(json)) === 'object');
  assert.equal(json.SigningPubKey, '');
  return bytesToHex(multiSigningData(json, signer));
}

function encodeQuality(value) {
  assert(typeof value === 'string');
  return bytesToHex(quality.encode(value));
}

function decodeQuality(value) {
  assert(typeof value === 'string');
  return quality.decode(value).toString();
}

module.exports = {
  decode: decode,
  encode: encode,
  encodeForSigning: encodeForSigning,
  encodeForMultisigning: encodeForMultisigning,
  encodeQuality: encodeQuality,
  decodeQuality: decodeQuality };