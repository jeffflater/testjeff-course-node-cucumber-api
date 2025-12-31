const { Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

Then('the response status should be {int}', async function (expectedStatus) {
  expect(this.responseStatus).to.equal(expectedStatus);
});
