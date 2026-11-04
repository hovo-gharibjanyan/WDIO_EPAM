Feature: Practice Software Testing core functionality


  Rule: Guest functionality on the products page

    Background:
      Given the user is not signed in
      And the user is on the products page


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



  Rule: Guest functionality on a product details page

    Background:
      Given the user is not signed in
      And the user is on a product details page


    Scenario Outline: Add a product to the basket
      Given the basket contains <initialCount> products
      And the current product is "<product>"
      When the user adds the product to the basket
      Then the basket should contain <expectedCount> products
      And the basket counter should display "<expectedCount>"

      Examples:
        | initialCount | product            | expectedCount |
        | 0            | Combination Pliers | 1             |
        | 1            | Claw Hammer        | 2             |
        | 3            | Slip Joint Pliers  | 4             |


    Scenario Outline: Try to add a product to favorites without signing in
      Given the current product is "<product>"
      When the user adds the product to favorites
      Then the message "Unauthorized, can not add product to your favorite list." should be displayed
      And the product should not be added to favorites

      Examples:
        | product            |
        | Combination Pliers |
        | Claw Hammer        |
        | Slip Joint Pliers  |



  Rule: Guest checkout functionality

    Background:
      Given the user is not signed in
      And the basket contains an available product


    Scenario: Complete checkout as a guest
      Given the user is on the basket page
      When the user proceeds to checkout
      And the user chooses to continue as a guest
      And the user provides the required guest information
      And the user provides the required billing address
      And the user selects "Cash on Delivery" as the payment method
      Then the order should be created successfully
      And an order confirmation should be displayed



  Rule: Authentication functionality

    Scenario Outline: Sign in with a registered user
      Given the "<user>" account exists
      And the user is on the sign-in page
      When the user signs in as "<user>"
      Then the account page should be displayed
      And "<fullName>" should be displayed in the account menu

      Examples:
        | user          | fullName               |
        | standard_user | Jack Howe |



  Rule: Signed-in user functionality

    Background:
      Given the user is signed in


    Scenario Outline: Add a new product to favorites
      Given the user is viewing the "<product>" product details
      And the "<product>" product is not in the user's favorites
      When the user adds the product to favorites
      Then the message "Product added to your favorites list." should be displayed
      And "<product>" should be added to the user's favorites

      Examples:
        | product            |
        | Combination Pliers |
        | Claw Hammer        |
        | Slip Joint Pliers  |


    Scenario Outline: Add a product that is already in favorites
      Given the user is viewing the "<product>" product details
      And the "<product>" product is already in the user's favorites
      When the user adds the product to favorites
      Then the message "Product already in your favorites list." should be displayed
      And the product should not be duplicated in the user's favorites

      Examples:
        | product            |
        | Combination Pliers |
        | Claw Hammer        |
        | Slip Joint Pliers  |