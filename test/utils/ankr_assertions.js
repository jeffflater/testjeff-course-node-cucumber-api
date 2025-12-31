const { expect } = require('chai');

function assertIsHex(value) {
  expect(typeof value).to.equal('string');
  expect(value.startsWith('0x')).to.be.true;
  const hexPattern = /^0x[0-9a-fA-F]+$/;
  expect(hexPattern.test(value)).to.be.true;
}

function assertIsInteger(value) {
  expect(typeof value).to.equal('number');
  expect(Number.isInteger(value)).to.be.true;
}

module.exports = {
  assertIsHex,
  assertIsInteger
};
