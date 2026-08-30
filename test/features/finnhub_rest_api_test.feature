Feature: Get stock quote from Finnhub API

  @smoke
  Scenario: Successful stock quote fetch for AAPL
    Given I have a valid API key
    When I request a stock quote for "AAPL"
    Then the response status should be 200
    And the current price should be a positive number
    And the response should contain required quote fields


  Scenario: Unsuccessful stock quote fetch for invalid symbol
    Given I have a valid API key
    When I request a stock quote for "INVALID_SYMBOL"
    Then the response status should be 200
    And the response should contain an error message indicating the symbol is not found


  Scenario: Successful stock quote fetch for multiple symbols
    Given I have a valid API key
    When I request stock quotes for "AAPL,MSFT,GOOGL"
    Then the response status should be 200
    And the response should contain quotes for all requested symbols
    And each quote should have a positive current price

