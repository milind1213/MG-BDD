const { test, expect } = require('@playwright/test');
const { GroceryPayloads } = require('./pages/PoleAPIs/GroceryApisPayloads.js');
const config = require('../configDirectory/testConfig.js');

let accessToken;
let cartId;
let itemId;
let orderId;

test.describe.serial('Groceries API Test Suite', () => {
  test.beforeAll(async () => {
    console.log('Starting the Groceries API Test Suite...');
  });

  test.afterAll(async () => {
    console.log('Completed the Groceries API Test Suite.');
  });

  test('Verify server status is up', async ({ request }) => {
    const response = await request.get(`${config.BASE_URL}/status`);
    const body = await response.json();
    console.log('Server Status Response:', body);
    expect(response.status()).toBe(200);
    expect(body.status).toBe('UP');
  });

  test('Generate access token', async ({ request }) => {
    const payload = GroceryPayloads.generateTokenPayload();
    console.log('Generating Access Token with Payload:', payload);

    const response = await request.post(`${config.BASE_URL}/api-clients`, { data: payload });
    const body = await response.json();
    console.log('Access Token Response:', body);

    expect(response.status()).toBe(201);
    accessToken = body.accessToken;
    expect(accessToken).toBeDefined();
  });

  test('Fetch product by ID', async ({ request }) => {
    const response = await request.get(`${config.BASE_URL}/products/4643`);
    const body = await response.json();
    console.log('Fetch Product Response:', body);

    expect(response.status()).toBe(200);
    expect(body.id).toBe(4643);
    expect(body.name).toBeDefined();
  });

  test('Fetch all products', async ({ request }) => {
    const response = await request.get(`${config.BASE_URL}/products/`);
    const products = await response.json();
    console.log('Fetch All Products Response:', products);

    expect(response.status()).toBe(200);
    expect(products.length).toBeGreaterThan(0);
  });

  test('Create a new cart', async ({ request }) => {
    const response = await request.post(`${config.BASE_URL}/carts/`);
    const body = await response.json();
    console.log('Create Cart Response:', body);

    expect(response.status()).toBe(201);
    cartId = body.cartId;
    expect(cartId).toBeDefined();
  });

  test('Add item to cart', async ({ request }) => {
    expect(cartId).toBeDefined();
    const payload = GroceryPayloads.addItemPayload();
    console.log('Adding Item to Cart with Payload:', payload);

    const response = await request.post(`${config.BASE_URL}/carts/${cartId}/items`, { data: payload });
    const body = await response.json();
    console.log('Add Item Response:', body);

    expect(response.status()).toBe(201);
    itemId = body.itemId;
    expect(itemId).toBeDefined();
  });

  test('Update cart item quantity', async ({ request }) => {
    expect(cartId).toBeDefined();
    expect(itemId).toBeDefined();

    const payload = GroceryPayloads.updateCartItemPayload(3);
    console.log('Updating Cart Item Quantity with Payload:', payload);

    const response = await request.patch(`${config.BASE_URL}/carts/${cartId}/items/${itemId}`, { data: payload });
    console.log('Update Cart Item Response:', await response.text());

    expect(response.status()).toBe(204);
  });

  test('Create order', async ({ request }) => {
    expect(cartId).toBeDefined();
    expect(accessToken).toBeDefined();

    const payload = GroceryPayloads.createOrderPayload(cartId, 'Test User');
    console.log('Creating Order with Payload:', payload);

    const response = await request.post(`${config.BASE_URL}/orders/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: payload,
    });
    const body = await response.json();
    console.log('Create Order Response:', body);

    expect(response.status()).toBe(201);
    orderId = body.orderId;
    expect(orderId).toBeDefined();
  });

  test('Fetch all orders', async ({ request }) => {
    expect(accessToken).toBeDefined();

    const response = await request.get(`${config.BASE_URL}/orders/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const body = await response.json();
    console.log('Fetch All Orders Response:', body);

    expect(response.status()).toBe(200);
    expect(body.length).toBeGreaterThan(0);
  });

  test('Update order customer name', async ({ request }) => {
    expect(orderId).toBeDefined();
    expect(accessToken).toBeDefined();

    const payload = GroceryPayloads.updateOrderPayload('Updated User');
    console.log('Updating Order Customer Name with Payload:', payload);

    const response = await request.patch(`${config.BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: payload,
    });
    console.log('Update Order Response:', await response.text());

    expect(response.status()).toBe(204);
  });

  test('Delete order', async ({ request }) => {
    expect(orderId).toBeDefined();
    expect(accessToken).toBeDefined();

    const response = await request.delete(`${config.BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('Delete Order Response:', await response.text());

    expect(response.status()).toBe(204);
  });
});
