@a1
Feature: Shopping for Cars and Selecting the Available Car Model
 
 Background:
   Given I launch the URL and land on the homepage
     And I accept cookies from the homepage
     And I click on "Shopping tools" from the homepage
     And I select the "Available cars" option.

  Scenario: Entering pin code and selecting address
    When I enter zip code and select an address from the suggestions
    Then I should continue with the selected Retailer address
     And I verify the default "Polestar 2" car model displayed in filter
     And I see car Modelyear, Powertrain and prices in dollars
  
  Scenario: Viewing additional car options
    When I enter zip code and select an address from the suggestions
     And I should continue with the selected Retailer address
     And I click on the "Show more" button
    Then I should see more car options with Modelyear, Powertrain and price details
 
  Scenario: Verifying Sort By filter
    When I enter zip code and select an address from the suggestions
     And I should continue with the selected Retailer address
     And I check the Sort by filter options
    Then I verify the default sort "Quick Delivery" filter applied
     And I Apply High Price Filter the the Cars Dispaly should be High to Low Sorted order 
     And I Apply Low Price  Filter the the Cars Dispaly should be Low to Low Sorted order 
 
 Scenario Outline: Verify filter options with different combinations of selections
    When I enter zip code and select an address from the suggestions
     And I should continue with the selected Retailer address
   Given I am on the car selection page
    When I select the following filters:
      | Exterior    | Version    | Packs      | Options    | Interior    | Wheels     |
      | <Exterior>  | <Version>  | <Packs>    | <Options>  | <Interior>  | <Wheels>   |
    And  I Click on the results button  
    Then I should see cars that match the selected filters

   Examples:
      # Case 1: Select all options for exterior, version, packs, options, interior, and wheels
      | Exterior  | Version                                     | Packs       | Options                     | Interior                | Wheels           |
      | Snow      | Long range Dual motor with Performance pack | Performance | Harman Kardon premium sound | Charcoal Nappa leather  | 20" Performance  |
      | Space     | Long range Dual motor with Performance pack | Climate     | Harman Kardon premium sound | Zinc Nappa leather      | 20" Performance  |
      | Storm     | Long range Dual motor with Performance pack | Performance | Harman Kardon premium sound | Charcoal WeaveTech      | 20" Performance  |

      # Case 2: Select only a few options from each category (some are left blank or not selected)
      | Exterior  | Version  | Packs       | Options                       | Interior                | Wheels           |
      | Snow      |          | Performance | Harman Kardon premium sound   | Charcoal Nappa leather  | 20" Performance  |
      | Space     |          |             | Harman Kardon premium sound   | Zinc Nappa leather      | 20" Performance  |
      |           |          | Climate     |                               | Slate WeaveTech         | 20" Performance  |
      
      # Case 3: Select some options from only specific categories (more selective filtering)
      | Exterior  | Version                                     | Packs       | Options  | Interior                | Wheels            |
      | Snow      | Long range Dual motor with Performance pack | Performance |          | Charcoal Nappa leather  | 20" Performance   |
      |           | Long range Dual motor with Performance pack |             |          | Zinc Nappa leather      | 20" Performance   |
      
      # Case 4: Test all versions with specific interior and wheels combination
      | Exterior  | Version             | Packs       | Options                       | Interior                | Wheels               |
      |           |                     | Performance | Harman Kardon premium sound   | Charcoal Nappa leather  | 20" Performance      |
      |           |                     | Performance | Harman Kardon premium sound   | Slate WeaveTech         | 20" Performance      |
      |           |                     | Pilot       | Harman Kardon premium sound   | Charcoal Nappa leather  | 20" Performance      |

  # # Scenario for applying multiple filter combinations dynamically
  # Scenario: Apply dynamic combinations of filters with different selections
  #   Given I am on the car selection page
  #   When I apply the following filter combinations:
  #     | Exterior  | Version                                     | Packs       | Options                     | Interior                | Wheels           |
  #     | Snow      | Long range Dual motor with Performance pack | Performance | Harman Kardon premium sound | Charcoal Nappa leather  | 20" Performance  |
  #     | Space     | Long range Dual motor with Performance pack |             | Harman Kardon premium sound | Zinc Nappa leather      | 20" Performance  |
  #   Then I should see the filtered cars matching the combinations
  #   And I should be able to view the cars with the applied filters

  # # Scenario for resetting filters dynamically based on a user's action
  # Scenario: Reset filters dynamically
  #   Given I am on the car selection page
  #   When I select "Clear All Filters"
  #   Then I should see all the cars available without any filters applied