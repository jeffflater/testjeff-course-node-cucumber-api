Feature: Ethereum RPC Block Number Retrieval

  Scenario: Validate latest block number response
    Given I set the Ethereum RPC endpoint
    When I request the latest block number
    Then the response status should be 200
    Then I should get a valid hex response
    And the block number should be a positive integer
    And the block number should match expected range
    And no error should occur during the request
