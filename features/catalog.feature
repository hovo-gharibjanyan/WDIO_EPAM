Feature: Product catalog

  Rule: Guest functionality on the products page

    Background:
      Given the user is not signed in
      And the user is on the products page

    @smoke
    Scenario Outline: View product details
      Given the "<product>" product is available in the product catalog
      When the user opens the "<product>" product
      Then the product details page should be displayed
      And the product name should be "<product>"
      And the product price should be "<price>"
      And the product category should be "<category>"
      And the product brand should be "<brand>"

      Examples:
        | product            | price  | category | brand                | 
        | Combination Pliers | $14.15 | Pliers   | ForgeFlex Tools      |
        | Claw Hammer        | $11.48 | Hammer   | MightyCraft Hardware |
        | Slip Joint Pliers  | $9.17  | Pliers   | MightyCraft Hardware |


    Scenario Outline: Search for products by keyword                                      
      Given the search field is available
      When the user searches for "<searchTerm>"
      Then only products containing "<searchTerm>" in their names should be displayed
      And the search results should be displayed

      Examples:
        | searchTerm |
        | hammer     |
        | pliers     |
        | saw        |


    Scenario Outline: Sort products
      Given no sort option is selected
      When the user selects "<sortOption>"
      Then "<sortOption>" should be displayed as the selected sort option
      And the products should be displayed in "<expectedOrder>" order

      Examples:
        | sortOption         | expectedOrder         |
        | Name (A - Z)       | ascending name        |
        | Name (Z - A)       | descending name       |
        | Price (Low - High) | ascending price       |
        | Price (High - Low) | descending price      |
        | CO₂ Rating (A - E) | ascending CO₂ rating  |
        | CO₂ Rating (E - A) | descending CO₂ rating |


    Scenario Outline: Filter products by category
      Given no product category is selected
      When the user selects the "<category>" category
      Then the "<category>" category should be displayed as selected
      And only products from the "<category>" category should be displayed

      Examples:
        | category    |
        | Hammer      |
        | Pliers      |
        | Drill       |
        | Safety Gear |


    Scenario Outline: Filter and sort products
      Given no product category is selected
      And no sort option is selected
      When the user selects the "<category>" category
      And the user selects "<sortOption>"
      Then the "<category>" category should be displayed as selected
      And "<sortOption>" should be displayed as the selected sort option
      And only products from the "<category>" category should be displayed
      And the filtered products should be displayed in "<expectedOrder>" order

      Examples:
        | category | sortOption         | expectedOrder    |
        | Hammer   | Price (Low - High) | ascending price  |
        | Pliers   | Price (High - Low) | descending price |
        | Drill    | Name (A - Z)       | ascending name   |
