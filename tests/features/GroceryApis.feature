@smoke
Feature: Groceries API Test Suite
  To verify the functionality of the groceries API endpoints
  I want to test the end-to-end workflow including token generation, product management, cart, and order operations.

  Background:
     Given The the base API URL is "https://simple-grocery-store-api.glitch.me"
      
  Scenario: Verify server status is up or Not
     When I send a GET request to the endpoint "/status".
     Then The response status code should be 200.
     And The response body should have "status" as "UP".

  Scenario: Generate access token
     Given The API endpoint "/api-clients"
     And I generate the payload for token creation with client name "TestClient"
     When I send a POST request
     Then The response status code should be 201
     And The response body should contain the field "accessToken"
     And I save the "accessToken".

   Scenario: Fetch product by ID
     Given The Featch API endpoint "/products/4643"
     When I send a GET request to the endpoint "/products/4643".
     Then The response status code should be 200.
     And The Featch Api response body should have 4643.

   Scenario: Fetch all products
     Given The Featch All Product API endpoint is "/products"
     When I send a GET request to the Featching All produtcts
     Then The response status code should be 200.
     And The response body should contain a list of products.