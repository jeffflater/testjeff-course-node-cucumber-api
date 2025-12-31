const { expect } = require('chai');

function assertIsFloat(value) {
  expect(typeof value).to.equal('number');
  expect(Number.isFinite(value)).to.be.true;
}

function assertIsInteger(value) {
  expect(typeof value).to.equal('number');
  expect(Number.isInteger(value)).to.be.true;
}

module.exports = {
  assertIsFloat,
  assertIsInteger
};
