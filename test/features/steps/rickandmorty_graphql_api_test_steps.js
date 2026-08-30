const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const axios = require('axios');
const { assertIsInteger, assertIsString } = require('../../utils/rickandmorty_assertions');

const GRAPHQL_URL = 'https://rickandmortyapi.com/graphql';

function normalizeCharacterPayload(responseData) {
  if (!responseData || !responseData.data) {
    return responseData;
  }

  if (responseData.data.character !== undefined) {
    return responseData.data.character;
  }

  if (responseData.data.characters) {
    return responseData.data.characters.results && responseData.data.characters.results.length > 0
      ? responseData.data.characters.results[0]
      : null;
  }

  return responseData.data;
}

function getCharacterFromContext(context) {
  if (!context.responseData) {
    return null;
  }

  if (Array.isArray(context.responseData)) {
    return context.responseData[0] || null;
  }

  return context.responseData;
}

Given('I prepare a GraphQL query for character ID {int}', async function (characterId) {
  this.queryType = 'character-id';
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

Given('I prepare a GraphQL query for character name {string}', async function (characterName) {
  this.queryType = 'character-name';
  this.graphqlQuery = {
    query: `
      query {
        characters(filter: { name: "${characterName}" }) {
          results {
            id
            name
            species
            status
          }
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
    const normalizedResult = normalizeCharacterPayload(response.data);

    if (this.queryType === 'character-id' && (normalizedResult === null || response.data?.errors)) {
      this.responseStatus = 404;
      this.responseData = response.data?.errors?.[0] || { message: 'Character not found' };
    } else if (this.queryType === 'character-name' && normalizedResult === null) {
      this.responseStatus = 404;
      this.responseData = { message: 'Character not found' };
    } else {
      this.responseData = normalizedResult;
    }
  } catch (error) {
    if (error.response) {
      this.responseStatus = error.response.status;
      this.responseData = error.response.data;

      if (this.queryType === 'character-id' && this.responseData && this.responseData.errors) {
        this.responseStatus = 404;
        this.responseData = this.responseData.errors[0] || { message: 'Character not found' };
      }
    } else {
      throw error;
    }
  }
});

Then('the response should return character {string}', async function (expectedName) {
  const character = getCharacterFromContext(this);
  expect(character).to.not.equal(null);
  expect(character.name).to.equal(expectedName);
});

Then('the character should belong to the {string} species', async function (expectedSpecies) {
  const character = getCharacterFromContext(this);
  expect(character).to.not.equal(null);
  expect(character.species).to.equal(expectedSpecies);
});

Then('the response should contain a valid ID and status', async function () {
  const character = getCharacterFromContext(this);
  expect(character).to.not.equal(null);

  const id = parseInt(character.id, 10);
  assertIsInteger(id);
  expect(id).to.be.greaterThan(0);

  assertIsString(character.status);
  expect(character.status).to.not.be.empty;
});

Then('the response should contain an error message indicating character not found', async function () {
  const errorMessage = typeof this.responseData === 'string'
    ? this.responseData
    : JSON.stringify(this.responseData || {});

  expect(errorMessage.toLowerCase()).to.include('not found');
});
