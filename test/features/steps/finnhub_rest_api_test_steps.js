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

When('I request stock quotes for {string}', async function (symbols) {
  this.symbols = symbols.split(',').map(s => s.trim());
  this.allResponses = {};
  
  for (const symbol of this.symbols) {
    try {
      const response = await axios.get(API_URL, {
        params: {
          symbol: symbol,
          token: this.apiKey
        }
      });
      this.allResponses[symbol] = {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        this.allResponses[symbol] = {
          status: error.response.status,
          data: error.response.data
        };
      } else {
        throw error;
      }
    }
  }
  
  // Set the response status from the first symbol
  this.responseStatus = this.allResponses[this.symbols[0]].status;
  this.responseData = this.allResponses[this.symbols[0]].data;
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

Then('the response should contain an error message indicating the symbol is not found', async function () {
  expect(this.responseData).to.exist;
  expect(this.responseData).to.be.an('object');
  // Finnhub API returns empty data for invalid symbols
  const hasNoData = !this.responseData.c || this.responseData.c === null;
  const hasError = 'error' in this.responseData;
  expect(hasNoData || hasError).to.be.true;
});

Then('the response should contain quotes for all requested symbols', async function () {
  expect(this.allResponses).to.exist;
  for (const symbol of this.symbols) {
    expect(this.allResponses).to.have.property(symbol);
    expect(this.allResponses[symbol].status).to.equal(200);
    expect(this.allResponses[symbol].data).to.be.an('object');
  }
});

Then('each quote should have a positive current price', async function () {
  for (const symbol of this.symbols) {
    const currentPrice = this.allResponses[symbol].data.c;
    assertIsFloat(currentPrice);
    expect(currentPrice).to.be.greaterThan(0, `${symbol} current price should be positive`);
  }
});
