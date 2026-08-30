Feature: Ethereum RPC Block Number Retrieval

  @smoke
  Scenario: Validate latest block number response
    Given I set the Ethereum RPC endpoint
    When I request the latest block number
    Then the response status should be 200
    Then I should get a valid hex response
    And the block number should be a positive integer
    And the block number should match expected range
    And no error should occur during the request

  Scenario: Validate block number retrieval for a specific block
    Given I set the Ethereum RPC endpoint
    When I request the block number for block "0x10d4f"
    Then the response status should be 200
    Then I should get a valid hex response
    And the block number should match the expected value "0x10d4f"
    And no error should occur during the request

  Scenario: Invalid block number retrieval
    Given I set the Ethereum RPC endpoint
    When I request the block number for an invalid block "0xZZZZZ"
    Then the response status should be 400
    And an error message should be returned indicating invalid block number
    And no unexpected errors should occur during the request
