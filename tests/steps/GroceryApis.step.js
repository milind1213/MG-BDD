const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { GroceryPayloads } = require('../pages/rest_api_pages/GroceryPayloads.js');
const axios = require('axios');
require('dotenv').config({ path: './configDirectory/.env' });

let response, savedToken, endPoint, itemId, payload = {};

Given(`The the base API URL is {string}`, (baseURL) => {
    console.log(`The base API URL is set to:${baseURL}`);
});

When(`I send a GET request to the endpoint {string}.`, async (endpoint) => {
    const url = `${process.env.BASE_URL_2}${endpoint}`;
    console.log(`Sending a GET request to ${url}`);
    response = await axios.get(url);
});

Then(`The response status code should be {int}.`, (statusCode) => {
    console.log('Response Status:', response.status);
    expect(response.status).toBe(statusCode);
});

Then(`The response body should have {string} as {string}.`, (key, value) => {
    const body = response.data;
    console.log('Response Body:', body);
    expect(body[key]).toBe(value);
});

Given(`The API endpoint {string}`, (endpoint) => {
    endPoint = endpoint;
    console.log(`API endpoint set to:`,endPoint);
});

Given(`I generate the payload for token creation with client name {string}`, (clientName) => {
    payload = GroceryPayloads.generateToken(clientName);
    console.log('Generated payload for token creation:', payload);
});

When(`I send a POST request`, async () => {
    const url = `${process.env.BASE_URL_2}${endPoint}`;
    console.log(`Sending a POST request to ${url} with payload:`, payload);
    response = await axios.post(url, payload);
});

Then(`The response body should contain the field {string}`, (fieldName) => {
    const body = response.data;
    console.log('Response Body:', body);
    expect(body[fieldName]).toBeDefined();
});

Then(`I save the {string}.`, (fieldName) => {
    const body = response.data;
    savedToken = body[fieldName];
    console.log(`Saved ${fieldName}:`, savedToken);
    expect(savedToken).toBeDefined();
});

Then('The response status code should be {int}', async function (statusCode) {
    console.log('Expected Status Code:', statusCode);
    console.log('Actual Status Code:', response.status);
    expect(response.status).toBe(statusCode);
});

Given('The Featch API endpoint {string}', async function (endpoint) {
    console.log('Actual Status Code:', endpoint);
});

When('When I send a GET request to the endpoint {string}".', async function (endpoint) {
    response = await axios.get(`${process.env.BASE_URL_2}${endpoint}`);
});

Then('The Featch Api response body should have {int}.', async function (endpoint) {
    const body = await response.data;
    console.log('Fetch Product Response:', body);
    expect(body.id).toBe(endpoint);
});

Given('The Featch All Product API endpoint is {string}', async function (endpoint) {
    console.log('Actual Status Code:', endpoint);
});

When('I send a GET request to the Featching All produtcts', async function () {
    response = await axios.get(`${process.env.BASE_URL_2}/products/`);
});

Then('The response body should contain a list of products.', async function () {
    const products = await response.data;
    console.log('Fetch All Products Response:', products);
    expect(products.length).toBeGreaterThan(0);
});
