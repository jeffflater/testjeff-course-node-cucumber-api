Feature: Rick and Morty GraphQL character lookup

  Scenario: Query character by ID and validate fields
    Given I prepare a GraphQL query for character ID 1
    When I send the GraphQL request
    Then the response status should be 200
    Then the response should return character "Rick Sanchez"
    And the character should belong to the "Human" species
    And the response should contain a valid ID and status
