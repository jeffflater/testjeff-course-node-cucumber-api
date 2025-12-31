const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const { assertIsInteger, assertIsString } = require('../../utils/rickandmorty_assertions');

const GRAPHQL_URL = 'https://rickandmortyapi.com/graphql';

Given('I prepare a GraphQL query for character ID {int}', async function (characterId) {
  this.graphqlQuery = {
    query: `
      query {
        character(id: ${characterId}) {
          id
          name
          species
          status
        }
      }
    `
  };
});

When('I send the GraphQL request', async function () {
  try {
    const response = await axios.post(GRAPHQL_URL, this.graphqlQuery, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.responseStatus = response.status;
    this.responseData = response.data.data.character;
  } catch (error) {
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;
    } else {
      throw error;
    }
  }
});

Then('the response should return character {string}', async function (expectedName) {
  expect(this.responseData.name).to.equal(expectedName);
});

Then('the character should belong to the {string} species', async function (expectedSpecies) {
  expect(this.responseData.species).to.equal(expectedSpecies);
});

Then('the response should contain a valid ID and status', async function () {
  const id = parseInt(this.responseData.id, 10);
  assertIsInteger(id);
  expect(id).to.be.greaterThan(0);

  assertIsString(this.responseData.status);
  expect(this.responseData.status).to.not.be.empty;
});
