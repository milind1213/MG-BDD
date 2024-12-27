const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I prepare a unique user payload', function () {
  this.userPayload = { name: `User_${Date.now()}`, job: 'Automation Tester',};
});

When('I send a POST request to {string}', async function (endpoint) {
  if (!this.apiContext) {
    throw new Error('API context is not initialized');
  }
  const response = await this.apiContext.post(endpoint,{ data: this.userPayload});
  this.responseData = await response.json();
  this.statusCode = response.status();
});

Then('the response status should be {int}', function (statusCode) {
  expect(this.statusCode).toBe(statusCode);
});

Then('the response contain a unique {string}', function (key) {
  expect(this.responseData[key]).toBeTruthy();
  expect(this.responseData[key]).not.toBeNull();
});

Then('the response include the creation time {string}', function (key) {
  expect(this.responseData[key]).toBeTruthy();
  const createdAtDate = new Date(this.responseData[key]);
  expect(createdAtDate.toString()).not.toBe('Invalid Date');
});
