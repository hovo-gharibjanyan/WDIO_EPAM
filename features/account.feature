Feature: Authentication

  Rule: Authentication functionality
    @smoke
    Scenario Outline: Sign in with a registered user
      Given the "<user>" account exists
      And the user is on the sign-in page
      When the user signs in as "<user>"
      Then the account page should be displayed
      And "<fullName>" should be displayed in the account menu

      Examples:
        | user          | fullName               |
        | standard_user | Jack Howe |
