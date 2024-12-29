@b
Feature: Verify Filter Functionality for Polestar Offers
  As a user of the Polestar website
  I want to apply filters to new vehicle offers
  So that I can verify the filter functionality works correctly and display accurate results

  Background:
    Given I navigate to the Homepage
    And I accept cookies and click on the "View Offers" button
    And I navigate to the "New Vehicle Offers" and Clicked on "Filter" button
  
  Scenario Outline: Verify filters for Polestar <Car> (<ModelYear> Model) with <Powertrain> options
    When I click on the "Car" filter and select the checkbox for "<Car>"
    And  I click on the "Model year" filter and select the checkbox for "<ModelYear>"
    And  I click on the "Powertrain" filter and select the checkbox for "<Powertrain>"
    And  I click the "View" button
    Then the results should match the filter criteria "<ExpectedResult>"

    Examples:
      | Car         | ModelYear | Powertrain              | ExpectedResult                       |
      | Polestar 3  | 2025      | Long range Single motor | No offers found.                     |
      | Polestar 2  | 2024      | All                     | No offers found.                     |
      | Polestar 2  | 2025      | All                     | No offers found.                     |
      | Polestar 2  | 2024      | Long range Single motor | Polestar 2 Long range Single motor   |
      | Polestar 3  | 2025      | All                     | Polestar 3                           |
