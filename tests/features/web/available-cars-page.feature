@web
Feature: Shopping for Cars and Selecting the Available Car Model

 Background:
   Given I launch the URL and land on the homepage
     And I accept cookies from the homepage
     And I click on "Shopping tools" from the homepage
     And I select the "Available cars" option.

 Scenario Outline: Verify 'Sort By' filters functionality
     When I enter zip code and select an address from the suggestions
      And I should continue with the selected Retailer address
     Then I verify the default sort "Quickest delivery" filter applied
      And I Apply Price "<SortFilter>" Filter the Cars Display should be "<DisplayOrder>" Sorted order 
   Examples:
      | SortFilter      | DisplayOrder  |
      | High to low     | descending    |
      | Low to high     | ascending     |

 Scenario Outline: Verify Car Filters with Various Combinations of Selections
     When I enter zip code and select an address from the suggestions
      And I should continue with the selected Retailer address
     When I apply the following filters from car selection page : 
       | Exterior    | Version    | Packs      | Options    | Interior    | Wheels     |
       | <Exterior>  | <Version>  | <Packs>    | <Options>  | <Interior>  | <Wheels>   |
     And I Click on the results button  
    Then I should see cars that match the selected filters:
       | Exterior    | Version    | Packs      | Options    | Interior    | Wheels     |
       | <Exterior>  | <Version>  | <Packs>    | <Options>  | <Interior>  | <Wheels>   |
    Examples:
    # Case 1: Select all options for exterior, version, packs, options, interior, and wheels
       | Exterior     | Version               | Packs       | Options                     | Interior                | Wheels           |
      # | Magnesium    | Long range Dual motor | Performance | Harman Kardon premium sound | Charcoal Nappa leather  | 20" Performance  |
       | Storm        | Long range Dual motor | Performance | Harman Kardon premium sound | Charcoal WeaveTech      | 20" Performance  |
    # Case 2: Select only a few options from each category (some are left blank or not selected)
       |              | Long range Dual motor | Performance | Harman Kardon premium sound | Charcoal Nappa leather  | 20" Performance  |
       | Space        |                       |             | Harman Kardon premium sound | Zinc Nappa leather      | 20" Performance  |
       | Midnight     | Long range Dual motor | Climate     |                             | Slate WeaveTech         | 20" Performance  |
    # Case 3: Select some options from only specific categories (more selective filtering)
      # | Magnesium    |                       | Performance |                             | Charcoal Nappa leather  | 20" Performance  |
       | Vapour       |                       | Pilot       | Harman Kardon premium sound | Zinc Nappa leather      |                  |
    # Case 4: Test all versions with specific interior and wheels combination
       | Storm        | Long range Dual motor | Performance |                              | Charcoal Nappa leather |                  |
      # | Midnight     |                       | Performance |                              | Slate WeaveTech        | 20" Performance  |

 Scenario: Verify Default Filters for Car Details by Pin Code and Address
     When I enter zip code and select an address from the suggestions
     Then I should continue with the selected Retailer address
      And I verify the default "Polestar 2" car model displayed in filter
      And I see car Modelyear, Powertrain, and prices in dollars
 
 Scenario: Viewing More Car Options with Details by clicking show more
     When I enter zip code and select an address from the suggestions
      And I should continue with the selected Retailer address
      And I click on the "Show more" button
     Then I should see more car options with Modelyear, Powertrain, and price details
