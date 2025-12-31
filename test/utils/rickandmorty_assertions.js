const { expect } = require('chai');

function assertIsInteger(value) {
  expect(typeof value).to.equal('number');
  expect(Number.isInteger(value)).to.be.true;
}

function assertIsString(value) {
  expect(typeof value).to.equal('string');
}

module.exports = {
  assertIsInteger,
  assertIsString
};
