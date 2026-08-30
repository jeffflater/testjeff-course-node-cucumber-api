const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('chai');
const WebSocket = require('ws');
const { assertIsNumber } = require('../../utils/bitstamp_assertions');

setDefaultTimeout(60000);

const WS_URL = 'wss://ws.bitstamp.net';

Given('the WebSocket connection to Bitstamp is established', async function () {
  this.wsContext = {
    received: false,
    lastPrice: null,
    lastChannel: null,
    closed: false,
    error: null,
    errorMessage: null,
    opened: false,
    subscribedChannels: {}
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

        // subscription succeeded for a channel
        if (message.event === 'bts:subscription_succeeded' && message.channel) {
          this.wsContext.subscribedChannels[message.channel] = true;
        }

        // trade events for any channel
        if (message.event === 'trade' && message.data && message.data.price) {
          this.wsContext.lastPrice = parseFloat(message.data.price);
          this.wsContext.lastChannel = message.channel || null;
          this.wsContext.received = true;
        }

        // capture error messages if Bitstamp returns them
        if (message.event && message.event.toLowerCase().includes('error')) {
          this.wsContext.error = true;
          this.wsContext.errorMessage = message.data && message.data.error ? message.data.error : (message.message || JSON.stringify(message));
        }

        // some error payloads come as { status: 'error', message: '...'}
        if (message.status && message.status.toLowerCase() === 'error') {
          this.wsContext.error = true;
          this.wsContext.errorMessage = message.message || JSON.stringify(message);
        }

      } catch (err) {
        this.wsContext.error = err;
        this.wsContext.errorMessage = err.message;
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

When(/^I subscribe to (BTC\/USD|BTC\/EUR) trades$/, async function (pair) {
  const channelMap = {
    'BTC/USD': 'live_trades_btcusd',
    'BTC/EUR': 'live_trades_btceur'
  };

  const channel = channelMap[pair];
  if (!channel) throw new Error(`Unsupported pair: ${pair}`);

  const subscribeMessage = JSON.stringify({
    event: 'bts:subscribe',
    data: { channel }
  });

  this.ws.send(subscribeMessage);

  await new Promise((resolve, reject) => {
    // give more time for less active pairs (e.g., BTC/EUR)
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (this.wsContext.error) {
        reject(this.wsContext.error);
      } else {
        reject(new Error(`No ${pair} trade event received after subscribing`));
      }
    }, 30000);

    const checkInterval = setInterval(() => {
      // accept any trade event received on the connection (channel may be omitted)
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

When('I subscribe to an invalid channel', async function () {
  const channel = 'invalid_channel_xyz';
  const subscribeMessage = JSON.stringify({
    event: 'bts:subscribe',
    data: { channel }
  });

  this.ws.send(subscribeMessage);

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (this.wsContext.errorMessage) {
        clearTimeout(timeout);
        clearInterval(checkInterval);
        resolve();
      } else {
        reject(new Error('No error message received for invalid subscription'));
      }
    }, 10000);

    const checkInterval = setInterval(() => {
      if (this.wsContext.errorMessage) {
        clearTimeout(timeout);
        clearInterval(checkInterval);
        resolve();
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

Then('I should receive an error message', async function () {
  expect(this.wsContext.errorMessage || this.wsContext.error).to.exist;
});

Then('the error message should indicate an invalid subscription', async function () {
  const msg = this.wsContext.errorMessage || (this.wsContext.error && this.wsContext.error.message) || '';
  expect(msg).to.be.a('string');
  expect(msg.toLowerCase()).to.match(/invalid|subscription|channel/);

  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
    this.ws.close();
  }
});
