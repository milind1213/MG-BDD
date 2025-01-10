const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const axios = require("axios");
const AxioUtils = require("../../common-platform-utils/common-rest.js");
const config = require("../../common-platform-utils/common-constants.js");
const {GroceryPayloads} = require("../../page-objects/api-objects/grocery-payloads.js");
const log = require('../../../utils/logger');

let response,savedToken,endPoint,itemId,payload = {};
const utils = new AxioUtils(config.BASE_URL_2);

Given("The Grocery baseURL is initialized", async function () {
  const baseURL = config.BASE_URL_2;
  log(`The base API URL is set to:[${baseURL}]`);
});

When("I send a GET request to the endpoint {string}.",
  async function (endpoint) {
  try{
       response = await utils.GET(endpoint);
       log("Server Status Response :", response.data);
     } catch (error)
     {
       response = error.response;
       log("Error Response Data:", error.response.data);
     }
   }
);

Then("The response status code should be {int}.", async function (statusCode) {
  log(`Checking if the response status is [${statusCode}]`);
  utils.checkStatusCode(response, statusCode);
});

Then("The response body should have {string} as {string}.", async function (key, value) {
    const body = response.data;
    expect(body[key]).toBe(value);
    log(`Validation in response with Actual [${key}] and Expected [${value}]`);
  }
);

Given("I create a token for client {string}", async function (clientName) {
  payload = GroceryPayloads.generateToken(clientName);
});

Then("I should receive a {int} status code", async function (statusCode) {
  utils.checkStatusCode(response, statusCode);
});

Then("The response should contain {string}", async function (fieldName) {
  const body = response.data;
  savedToken = body[fieldName];
  expect(body[fieldName]).toBeDefined();
  expect(savedToken).toBeDefined();
});

Then("The Featch Api response body should have {int}.",async function (expectedId) {
    const body = await response.data;
    expect(body.id).toBe(expectedId);
  }
);

Given("The Featch All Product API endpoint is {string}", async function (endpoint) {
    log(`Featch All Product API endpoint is ${endpoint}`);
  }
);

When("I send a GET request to the Featching All produtcts", async function () {
   response = await utils.GET("/products/");
});

Then("The response body should contain a list of products.", async function () {
  const products = await response.data;
  log("Fetch All Products Response:", products);
  expect(products.length).toBeGreaterThan(0);
});

When("I send a POST request to {string}", async function (endPoint) {
  try {
    response = await utils.POST(endPoint, payload);
  } catch (error) {
    response = error.response;
    log("Error Response Data:", error.response.data);
  }
});

Then('I should receive a {int} Bad Request status code', async function (statusCode) {
  utils.checkStatusCode(response, statusCode);
});

Then("The response body should contain an error message indicating {string}", async function (message) {
  log(`Validating the Actual [${ + JSON.stringify(response.data.error)}] with Expected error [${message}]`)
  expect(response.data.error).toBe(message);  
});

 
Given("I send a GET request to the NonExist Product ID endpoint {string}", async function (endpoint) {
  try {
    response = await utils.GET(`${endpoint}`);  
  } catch (error) {
    response = error.response;
    log("Error Response Data:",  + JSON.stringify(error.response.data));
  }
});

Then("The response status code should be {int} Not Found", async function (statusCode) {
   utils.checkStatusCode(response, statusCode);
});

Then("The response body should contain an error message indicating {string} with NonExistentId Request", async function (errorMessage) {
  log(`Validating the Actual [${ + JSON.stringify(response.data.error)}] with Expected error [${errorMessage}]`)
  expect(response.data.error).toBe(errorMessage); 
});


Then("The response status code should be {int} Bad Request", async function (statusCode) {
  utils.checkStatusCode(response, statusCode);
});

Then("The response body should contain an error message indicating {string} with Invalid ID", async function (errorMessage) {
  log(`Validating the Actual [${ + JSON.stringify(response.data.error)}] with Expected error [${errorMessage}]`)
  expect(response.data.error).toBe(errorMessage); 
});

Then("The response status code should be {int} Service Unavailable", async function (statusCode) {
  utils.checkStatusCode(response, statusCode);
});
