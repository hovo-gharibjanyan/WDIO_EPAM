Feature: Favorites

  Rule: Guest favorites functionality

    Background:
      Given the user is not signed in
      And the user is on a product details page

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
