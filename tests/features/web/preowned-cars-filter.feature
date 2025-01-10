
Feature: Verify Filter Functionality for Polestar Offers
  As a user of the Polestar website
  I want to apply filters to Pre Owned vehicle offers
  So that I can verify the filter functionality works correctly and display accurate results

  Background:
    Given I Landed on the Polestar Homepage
    And I accepted cookies and click on the View Offers button
    And I navigate to the Pre-Owned Vehicle Offers section and Clicked on Filter button
  
  Scenario Outline: Verify filters for Polestar Pre-owned <Car> (<ModelYear> Model) with <Powertrain> options.
    When I click on the "Car" filter and select the checkbox option for "<Car>"
    And  I click on the "Model year" filter and select the checkbox option for "<ModelYear>"
    And  I click on the "Powertrain" filter and select the checkbox option for "<Powertrain>"
    And  I click the "View" button.
    Then the results should match the filter criteria "<ExpectedResult>".

    Examples:
      | Car         | ModelYear | Powertrain      | ExpectedResult                       |
      | Polestar 2  | 2024      | All             | Polestar 2 Certified Pre-owned       |
      | Polestar 2  | 2023      | All             | Polestar 2 Certified Pre-owned       |
      | Polestar 2  | 2022      | All             | Polestar 2 Certified Pre-owned       |
      | Polestar 2  | 2021      | All             | Polestar 2 Certified Pre-owned       |
   