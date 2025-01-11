
Feature: GoRest User Management APIs
  As a tester, I want to validate the core operations of the Gorest user Management APIs
  so that I can ensure it functions correctly for listing, creating, updating, and deleting users.

  Background:
    Given The API is initialized with the base URL
    And   Authentication is performed with a valid access token

  Scenario: Retrive the List of users via using "List Users" API
    When  A Get Request is made to retrieve the list of users
    Then  The system should respond with a 200 OK status
    And   The response should contain a list of users

  Scenario: Create a new user By Using the "Create User" API
    Given The user details are:
      | Name               | Gender | Email                        | Status |
      | Tenali Ramakrishna | Male   | tenali.ramakrishna@abdce.com | Active |
    When  A Post request is made to create a new user
    Then  The system should respond with a 201 Created status
    And   The response should include the following:
      | Name               | Status |
      | Tenali Ramakrishna | Active |
    And   The user ID should be saved for future use
    And   I save the user ID for later

  Scenario: Update the user details By Using the "Update User" API
   Given  The user details for update are
      | Name              | Email                           | Status |
      | Allasani Peddana  | allasani.peddana@1234.com | active |
    When  A Patch request is made to update the user with the saved ID
    Then  The system should respond with 200 OK status
    And   The response should include the following details:
      | Name             | Email                           | Status |
      | Allasani Peddana | allasani.peddana@1234.com | active |
    And   The user ID should remain the same
    And   The updated user details should be reflected

  Scenario Outline: Delete the user via "Delete User" API
    When  A Delete request is made to delete the user with the saved ID
    Then  The system should respond with a 204 No Content status
     And  The user should no longer exist in the system

  Scenario: Create a new user with an invalid access token
    Given Authenticating is with a Invalid access token
    When  A Post Request is made to to Create an new user with Invalid token
    Then  The system should respond with a 401 Unauthorized status
    And   The response should include an error message indicating "Invalid token" with invalid token

  Scenario: Create a new user with an Empty Access Token
    Given Authenticating is with a empty access token
    When  A Post Request is made to to Create an new user with empty token
    Then  The system should respond with a 401 Unauthorized status
    And   The response should include an error message indicating "Authentication failed" with empty token

  Scenario: Retrieve the list of users with an Invalid Endpoint
    When  A GET request is made to an invalid endpoint "/users-invalid"
    Then  The system should respond with a 404 Not Found status with invalid endpoint
    And   The response should include an error message indicating "Resource not found"

  Scenario: Update a user with an invalid UserID
    Given The user details for update are
      | Name              | Email                           | Status |
      | Allasani Peddana  | allasani.peddana@1234.com       | Active |
    When  A PATCH request is made to update the user with ID "invalid-id"
    Then  The system should respond with a 404 Not Found status with invalid id
    And   The user update api response should include an error message indicating "Resource not found" 

  Scenario: Delete a user with a non-existent or Empty User ID
    When  A DELETE request is made to delete the user with ID ""
    Then  The system should respond with a 404 Not Found status with empty id
    And   The delete api response should include an error message

  Scenario: Create a user with an invalid email format
    Given The details for create user:
      | Name               | Gender | Email            | Status |
      | Tenali Ramakrishna | Male   | invalid-email.com| Active |
    When  A POST request is made to create a new user with Invalid email format
    Then  The system should respond with a 422 Unprocessable Entity status
    And   The response should include an error message for the invalid email format
  


