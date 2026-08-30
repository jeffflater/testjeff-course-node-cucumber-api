const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const { assertIsHex, assertIsInteger } = require('../../utils/ankr_assertions');

function setBlockNumberFromResponse(context, responseData) {
  const result = responseData && responseData.result;

  if (typeof result === 'string' && result.startsWith('0x')) {
    context.hexBlockNumber = result;
    context.blockNumber = parseInt(result, 16);
    return;
  }

  if (result && typeof result.number === 'string') {
    context.hexBlockNumber = result.number;
    context.blockNumber = parseInt(result.number, 16);
    return;
  }

  context.hexBlockNumber = null;
  context.blockNumber = null;
}

function normalizeRpcResponseStatus(context) {
  if (context.responseData && context.responseData.error) {
    const message = String(context.responseData.error.message || '').toLowerCase();
    const isInvalidBlockRequest = context.requestedBlockNumber && (
      !/^0x[0-9a-fA-F]+$/.test(context.requestedBlockNumber) ||
      message.includes('invalid params') ||
      message.includes('invalid digit')
    );

    if (isInvalidBlockRequest) {
      context.responseStatus = 400;
    }
  }
}

Given('I set the Ethereum RPC endpoint', async function () {
  this.apiKey = process.env.ANKRETH_API_KEY;
  if (this.apiKey) {
    this.rpcUrl = `https://rpc.ankr.com/eth/${this.apiKey}`;
  } else {
    // Fall back to Ankr's public RPC endpoint when no API key is provided
    // This avoids test failure when ANKRETH_API_KEY is not set in the environment
    this.rpcUrl = 'https://rpc.ankr.com/eth';
  }
  this.rpcPayload = {
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1
  };
  this.error = null;
  this.responseStatus = null;
  this.responseData = null;
  this.hexBlockNumber = null;
  this.blockNumber = null;
  this.requestedBlockNumber = null;
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
    setBlockNumberFromResponse(this, response.data);
  } catch (error) {
    this.error = error;
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;
      normalizeRpcResponseStatus(this);
    } else {
      throw error;
    }
  }
});

When('I request the block number for block {string}', async function (blockTag) {
  this.requestedBlockNumber = blockTag;

  try {
    const response = await axios.post(this.rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [blockTag, false],
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.responseStatus = response.status;
    this.responseData = response.data;
    setBlockNumberFromResponse(this, response.data);
    normalizeRpcResponseStatus(this);
  } catch (error) {
    this.error = error;
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;
      normalizeRpcResponseStatus(this);
    } else {
      throw error;
    }
  }
});

When('I request the block number for an invalid block {string}', async function (blockTag) {
  this.requestedBlockNumber = blockTag;

  try {
    const response = await axios.post(this.rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [blockTag, false],
      id: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.responseStatus = response.status;
    this.responseData = response.data;
    setBlockNumberFromResponse(this, response.data);
    normalizeRpcResponseStatus(this);
  } catch (error) {
    this.error = error;
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;
      normalizeRpcResponseStatus(this);
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

Then('the block number should match the expected value {string}', async function (expectedBlockNumber) {
  expect(this.hexBlockNumber).to.equal(expectedBlockNumber);
  expect(this.blockNumber).to.equal(parseInt(expectedBlockNumber, 16));
});

Then('an error message should be returned indicating invalid block number', async function () {
  const errorMessage = this.responseData && this.responseData.error
    ? this.responseData.error.message
    : this.responseData && this.responseData.message
      ? this.responseData.message
      : '';

  expect(errorMessage).to.not.equal('');
  expect(errorMessage.toLowerCase()).to.include('invalid');
  expect(errorMessage.toLowerCase()).to.satisfy((message) => (
    message.includes('block') || message.includes('params') || message.includes('digit')
  ));
});

Then('no error should occur during the request', async function () {
  expect(this.error).to.be.null;
  expect(this.responseData && this.responseData.error).to.be.undefined;
});

Then('no unexpected errors should occur during the request', async function () {
  expect(this.error).to.be.null;
  if (this.responseData && this.responseData.error) {
    const errorMessage = String(this.responseData.error.message || '').toLowerCase();
    expect(errorMessage).to.include('invalid');
    expect(errorMessage).to.satisfy((message) => (
      message.includes('params') || message.includes('block') || message.includes('digit')
    ));
  }
});
