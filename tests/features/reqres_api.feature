Feature: Validate Reqres API Endpoints

  Background:
    Given the baseURL is loaded from the configuration file

  Scenario: Get user list from API
    Given the endpoint is "/api/users?page=2"
    When I send a GET request
    Then the status code should be 200
    And the response should contain a list of users

  Scenario Outline: Create a new user via POST request
    Given the endpoint is "/api/users"
    And the request body is "<request_body>"
    When I send a POST request
    Then the status code should be 201
    And the response should contain the created user's details

  Examples:
    | request_body                                  |
    | { "name": "morpheus", "job": "leader" }       |

  Scenario Outline: Update an existing user via PATCH request
    Given the endpoint is "/api/users/<user_id>"
    And the request body is "<request_body>"
    When I send a PATCH request
    Then the status code should be 200
    And the response should contain the updated user's details

  Examples:
    | user_id | request_body                                        |
    | 2       | { "name": "morpheus", "job": "zion resident" }      |
