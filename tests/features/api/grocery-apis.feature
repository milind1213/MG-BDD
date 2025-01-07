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

   Scenario: Access Token Generation with Invalid Client Name
      Given I create a token for client " "
      When I send a POST request to "/api-clients"
      Then I should receive a 400 Bad Request status code
      And The response body should contain an error message indicating "Invalid or missing client name."

   Scenario: Fetching Product by Nonexistent ID
      Given I send a GET request to the NonExist Product ID endpoint "/products/9999999"
      Then The response status code should be 404 Not Found
      And The response body should contain an error message indicating "No product with id 9999999." with NonExistentId Request

   Scenario: Fetching Product with Invalid ID Format
      Given I send a GET request to the endpoint "/products/abc123".
      Then The response status code should be 400 Bad Request
      And The response body should contain an error message indicating "The product id must be a number." with Invalid ID

