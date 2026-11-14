Feature: Basket and checkout

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
