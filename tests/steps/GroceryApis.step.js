const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { GroceryPayloads } = require('../pages/api_pages/GroceryPayloads.js');
const axios = require('axios');
const AxioUtils = require('../commonPlatformUtils/CommonREST');
require('dotenv').config({ path: './configDirectory/.env' });

let response, savedToken, endPoint, itemId, payload = {};
const utils = new AxioUtils(process.env.BASE_URL_2);

Given('The Grocery baseURL is initialized', async function () {
    const baseURL = process.env.BASE_URL_2;
    console.log(`The base API URL is set to:${baseURL}`);
});

When('I send a GET request to the endpoint {string}.', async function (endpoint) {      
    response = await utils.GET(endpoint);
    console.log('Server Status Response :', response.data);
});

Then('The response status code should be {int}.', async function (statusCode) {
    console.log(`Checking if the response status is ${statusCode}`);
    utils.checkStatusCode(response, statusCode);
});

Then('The response body should have {string} as {string}.', async function (key, value) {
      const body = response.data;
      expect(body[key]).toBe(value);
});


Given('I create a token for client {string}', async function (clientName) {
    payload = GroceryPayloads.generateToken(clientName);
});

When('I send a POST request to {string}', async function (endPoint) {
    response = await utils.POST(endPoint,payload);
});

Then('I should receive a {int} status code', async function (statusCode) {
    utils.checkStatusCode(response, statusCode);
});

Then('The response should contain {string}', async function (fieldName) {
    const body = response.data;
    savedToken = body[fieldName];
    expect(body[fieldName]).toBeDefined();
    expect(savedToken).toBeDefined();
});

Then('The Featch Api response body should have {int}.', async function (expectedId) {        
    const body = await response.data;
    expect(body.id).toBe(expectedId);
});


Given('The Featch All Product API endpoint is {string}', async function (endpoint) {    
    console.log('Actual Status Code:', endpoint);
});


When('I send a GET request to the Featching All produtcts', async function () {       
    response = await utils.GET('/products/');
});


Then('The response body should contain a list of products.', async function () {      
    const products = await response.data;
    console.log('Fetch All Products Response:', products);
    expect(products.length).toBeGreaterThan(0);
});