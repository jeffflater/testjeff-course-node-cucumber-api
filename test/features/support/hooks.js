const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
require('dotenv').config();

BeforeAll(async function () {
  // Runs once before all tests
});

AfterAll(async function () {
  // Runs once after all tests
});

Before(async function (scenario) {
  // Runs before each scenario
});

After(async function (scenario) {
  // Runs after each scenario
});
