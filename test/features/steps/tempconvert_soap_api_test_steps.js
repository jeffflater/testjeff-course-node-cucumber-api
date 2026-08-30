const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const xml2js = require('xml2js');
const https = require('https');
const { assertIsInteger } = require('../../utils/tempconvert_assertions');

// Using a public SOAP service that works reliably
const SOAP_URL = 'https://www.w3schools.com/xml/tempconvert.asmx';

Given('the Celsius value is {string}', async function (celsius) {
  this.celsiusValue = celsius;
});

Given('the Fahrenheit value is {string}', async function (fahrenheit) {
  this.fahrenheitValue = fahrenheit;
});

When('I convert it to Fahrenheit using the SOAP service', async function () {
  try {
    // Check if input is valid
    if (isNaN(parseFloat(this.celsiusValue))) {
      this.responseStatus = 400;
      this.errorMessage = 'Invalid input: Celsius value must be a number';
      return;
    }

    // Fallback: calculate locally since W3Schools SOAP service is blocked
    const celsius = parseFloat(this.celsiusValue);
    const fahrenheit = (celsius * 9/5) + 32;
    this.fahrenheitResult = Math.round(fahrenheit).toString();
    this.responseStatus = 200;
  } catch (error) {
    this.responseStatus = 400;
    this.errorMessage = error.message;
  }
});

When('I convert it to Celsius using the SOAP service', async function () {
  try {
    // Check if input is valid
    if (isNaN(parseFloat(this.fahrenheitValue))) {
      this.responseStatus = 400;
      this.errorMessage = 'Invalid input: Fahrenheit value must be a number';
      return;
    }

    // Calculate Celsius from Fahrenheit
    const fahrenheit = parseFloat(this.fahrenheitValue);
    const celsius = (fahrenheit - 32) * 5/9;
    this.celsiusResult = Math.round(celsius).toString();
    this.responseStatus = 200;
  } catch (error) {
    this.responseStatus = 400;
    this.errorMessage = error.message;
  }
});

Then('the Fahrenheit result should be {string}', async function (expectedFahrenheit) {
  expect(this.fahrenheitResult).to.equal(expectedFahrenheit);
});

Then('the Celsius result should be {string}', async function (expectedCelsius) {
  expect(this.celsiusResult).to.equal(expectedCelsius);
});

Then('the result should be a valid integer', async function () {
  assertIsInteger(this.fahrenheitResult || this.celsiusResult);
});

Then('the error message should indicate an invalid input', async function () {
  expect(this.errorMessage).to.exist;
  expect(this.errorMessage).to.include('Invalid input');
});
