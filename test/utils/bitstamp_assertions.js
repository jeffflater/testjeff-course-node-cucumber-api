const { expect } = require('chai');

function assertIsNumber(value) {
  expect(typeof value).to.equal('number');
  expect(Number.isFinite(value)).to.be.true;
}

module.exports = {
  assertIsNumber
};
