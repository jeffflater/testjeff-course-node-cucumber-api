const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const { assertIsFloat, assertIsInteger } = require('../../utils/finnhub_assertions');

const API_URL = 'https://finnhub.io/api/v1/quote';
const QUOTE_FIELDS = ['c', 'h', 'l', 'o', 'pc', 't'];

Given('I have a valid API key', async function () {
  this.apiKey = process.env.FINNHUB_API_KEY;
  expect(this.apiKey).to.not.be.undefined;
});

When('I request a stock quote for {string}', async function (symbol) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        symbol: symbol,
        token: this.apiKey
      }
    });
    this.responseStatus = response.status;
    this.responseData = response.data;
  } catch (error) {
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;
    } else {
      throw error;
    }
  }
});

Then('the current price should be a positive number', async function () {
  const currentPrice = this.responseData.c;
  assertIsFloat(currentPrice);
  expect(currentPrice).to.be.greaterThan(0);
});

Then('the response should contain required quote fields', async function () {
  for (const field of QUOTE_FIELDS) {
    expect(this.responseData).to.have.property(field);
    if (field === 't') {
      assertIsInteger(this.responseData[field]);
    } else {
      assertIsFloat(this.responseData[field]);
    }
  }
});
