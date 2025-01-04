@a1
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
   Given The user details for update are
      | Name              | Email                           | Status |
      | Allasani Peddana  | allasani.peddana@1234.com | active |
    When A Patch request is made to update the user with the saved ID
    Then The system should respond with 200 OK status
    And  The response should include the following details:
      | Name             | Email                           | Status |
      | Allasani Peddana | allasani.peddana@1234.com | active |
    And  The user ID should remain the same
    And  The updated user details should be reflected


  Scenario Outline: Delete the user via "Delete User" API
     When  A Delete request is made to delete the user with the saved ID
     Then  The system should respond with a 204 No Content status
     And   The user should no longer exist in the system
