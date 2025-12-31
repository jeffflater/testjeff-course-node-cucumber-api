const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const { assertIsHex, assertIsInteger } = require('../../utils/ankr_assertions');

Given('I set the Ethereum RPC endpoint', async function () {
  this.apiKey = process.env.ANKRETH_API_KEY;
  expect(this.apiKey).to.not.be.undefined;

  this.rpcUrl = `https://rpc.ankr.com/eth/${this.apiKey}`;
  this.rpcPayload = {
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1
  };
  this.error = null;
});

When('I request the latest block number', async function () {
  try {
    const response = await axios.post(this.rpcUrl, this.rpcPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.responseStatus = response.status;
    this.responseData = response.data;
    this.hexBlockNumber = response.data.result;
    this.blockNumber = parseInt(this.hexBlockNumber, 16);
  } catch (error) {
    this.error = error;
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;
    } else {
      throw error;
    }
  }
});

Then('I should get a valid hex response', async function () {
  assertIsHex(this.hexBlockNumber);
});

Then('the block number should be a positive integer', async function () {
  assertIsInteger(this.blockNumber);
  expect(this.blockNumber).to.be.greaterThan(0);
});

Then('the block number should match expected range', async function () {
  expect(this.blockNumber).to.be.greaterThan(1000000);
});

Then('no error should occur during the request', async function () {
  expect(this.error).to.be.null;
  expect(this.responseData.error).to.be.undefined;
});
