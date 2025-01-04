@api
Feature: Groceries API Test Suite
    To verify the functionality of the Groceries API, 
    Including Token Generation, Product Management, Cart, and Order Operations.

  Background:
     Given  The Grocery baseURL is initialized
   
  Scenario: Check if the server is up and running via API
     When   I send a GET request to the endpoint "/status".
     Then   The response status code should be 200.
     And    The response body should have "status" as "UP".

  Scenario: Validate the Access token Generation API functionality
     Given  I create a token for client "TestClient"
     When   I send a POST request to "/api-clients"
     Then   I should receive a 201 status code
     And    The response should contain "accessToken"

  Scenario: Verify the API functionaliy to fetch a specific products by ID 
     Given  I send a GET request to the endpoint "/products/4643".
     Then   The response status code should be 200.
     And    The Featch Api response body should have 4643.

  Scenario: Validate the API functionality to fetch the complete list of products.
     Given  The Featch All Product API endpoint is "/products"
     When   I send a GET request to the Featching All produtcts
     Then   The response status code should be 200.
     And    The response body should contain a list of products.