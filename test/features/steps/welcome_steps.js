const { Given, When, Then } = require('@cucumber/cucumber');

Given('the course has started', async function () {
  console.log('\n========================================');
  console.log('Welcome to the TestJeff API Testing Course!');
  console.log('========================================');
});

When('the student runs the first test', async function () {
  console.log('\nYou have successfully run your first test!');
});

Then('TestJeff welcomes the student', async function () {
  console.log('\nTestJeff says: "Congratulations on starting your API testing journey!"');
});

Then('confirms the setup is working', async function () {
  console.log('\nYour Node.js + Cucumber setup is working correctly!');
  console.log('You are ready to begin testing APIs.');
  console.log('========================================\n');
});
