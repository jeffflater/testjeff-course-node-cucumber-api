const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const WebSocket = require('ws');
const { assertIsNumber } = require('../../utils/bitstamp_assertions');

const WS_URL = 'wss://ws.bitstamp.net';
const CHANNEL = 'live_trades_btcusd';

Given('the WebSocket connection to Bitstamp is established', async function () {
  this.wsContext = {
    received: false,
    lastPrice: null,
    closed: false,
    error: null,
    opened: false
  };

  await new Promise((resolve, reject) => {
    this.ws = new WebSocket(WS_URL);

    this.ws.on('open', () => {
      this.wsContext.opened = true;
      resolve();
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.event === 'trade' && message.channel === CHANNEL) {
          this.wsContext.lastPrice = parseFloat(message.data.price);
          this.wsContext.received = true;
        }
      } catch (err) {
        this.wsContext.error = err;
      }
    });

    this.ws.on('error', (error) => {
      this.wsContext.error = error;
      reject(error);
    });

    this.ws.on('close', () => {
      this.wsContext.closed = true;
    });

    setTimeout(() => {
      if (!this.wsContext.opened) {
        reject(new Error('WebSocket connection timeout'));
      }
    }, 5000);
  });
});

When('I subscribe to BTC\\/USD trades', async function () {
  const subscribeMessage = JSON.stringify({
    event: 'bts:subscribe',
    data: {
      channel: CHANNEL
    }
  });

  this.ws.send(subscribeMessage);

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (this.wsContext.error) {
        reject(this.wsContext.error);
      } else {
        resolve();
      }
    }, 10000);

    const checkInterval = setInterval(() => {
      if (this.wsContext.received) {
        clearTimeout(timeout);
        clearInterval(checkInterval);
        resolve();
      }
      if (this.wsContext.error) {
        clearTimeout(timeout);
        clearInterval(checkInterval);
        reject(this.wsContext.error);
      }
    }, 100);
  });
});

Then('I should receive a trade event', async function () {
  expect(this.wsContext.received).to.be.true;
  expect(this.wsContext.lastPrice).to.not.be.null;
});

Then('the price should be a valid number', async function () {
  assertIsNumber(this.wsContext.lastPrice);
  expect(this.wsContext.lastPrice).to.be.greaterThan(0);

  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    this.ws.close();
  }
});
