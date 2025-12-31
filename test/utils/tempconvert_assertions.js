const { expect } = require('chai');

function assertIsInteger(value) {
  const parsed = parseInt(value, 10);
  expect(Number.isInteger(parsed)).to.be.true;
}

function assertIsFloat(value) {
  const parsed = parseFloat(value);
  expect(Number.isFinite(parsed)).to.be.true;
}

module.exports = {
  assertIsInteger,
  assertIsFloat
};
