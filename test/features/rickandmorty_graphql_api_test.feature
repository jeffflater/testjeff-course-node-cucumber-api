Feature: Rick and Morty GraphQL character lookup

  @smoke
  Scenario: Query character by ID and validate fields
    Given I prepare a GraphQL query for character ID 1
    When I send the GraphQL request
    Then the response status should be 200
    Then the response should return character "Rick Sanchez"
    And the character should belong to the "Human" species
    And the response should contain a valid ID and status

  Scenario: Query character by name and validate fields
    Given I prepare a GraphQL query for character name "Morty Smith"
    When I send the GraphQL request
    Then the response status should be 200
    Then the response should return character "Morty Smith"
    And the character should belong to the "Human" species
    And the response should contain a valid ID and status


  Scenario: Invalid character ID query
    Given I prepare a GraphQL query for character ID 9999
    When I send the GraphQL request
    Then the response status should be 404
    And the response should contain an error message indicating character not found



  
