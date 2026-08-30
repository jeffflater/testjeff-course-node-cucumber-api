const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

BeforeAll(async function () {
  // Runs once before all tests
  // Clean up reports directory
  const reportsDir = path.join(__dirname, '../../..', 'reports');
  if (fs.existsSync(reportsDir)) {
    const files = fs.readdirSync(reportsDir);
    for (const file of files) {
      const filePath = path.join(reportsDir, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    }
  }
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
