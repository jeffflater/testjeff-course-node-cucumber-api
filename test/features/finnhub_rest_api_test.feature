Feature: Get stock quote from Finnhub API

  Scenario: Successful stock quote fetch for AAPL
    Given I have a valid API key
    When I request a stock quote for "AAPL"
    Then the response status should be 200
    And the current price should be a positive number
    And the response should contain required quote fields
