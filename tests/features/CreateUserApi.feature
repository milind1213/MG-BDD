@api
Feature: Create User API with Unique Payload

  Scenario: Successfully create a new user with unique details
    Given I prepare a unique user payload
    When I send a POST request to "api/users"
    Then the response contain a unique "id"
    And the response include the creation time "createdAt"
    