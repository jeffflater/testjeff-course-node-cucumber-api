const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const xml2js = require('xml2js');
const { assertIsInteger } = require('../../utils/tempconvert_assertions');

const SOAP_URL = 'https://www.w3schools.com/xml/tempconvert.asmx';

Given('the Celsius value is {string}', async function (celsius) {
  this.celsiusValue = celsius;
});

When('I convert it to Fahrenheit using the SOAP service', async function () {
  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CelsiusToFahrenheit xmlns="https://www.w3schools.com/xml/">
      <Celsius>${this.celsiusValue}</Celsius>
    </CelsiusToFahrenheit>
  </soap:Body>
</soap:Envelope>`;

  try {
    const response = await axios.post(SOAP_URL, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'https://www.w3schools.com/xml/CelsiusToFahrenheit'
      }
    });

    this.responseStatus = response.status;

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    this.fahrenheitResult = result['soap:Envelope']['soap:Body']
      ['CelsiusToFahrenheitResponse']['CelsiusToFahrenheitResult'];
  } catch (error) {
    if (error.response) {
      this.responseStatus = error.response.status;
    } else {
      throw error;
    }
  }
});

Then('the Fahrenheit result should be {string}', async function (expectedFahrenheit) {
  expect(this.fahrenheitResult).to.equal(expectedFahrenheit);
});

Then('the result should be a valid integer', async function () {
  assertIsInteger(this.fahrenheitResult);
});
