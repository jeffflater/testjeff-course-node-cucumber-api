Feature: Bitstamp WebSocket BTC price feed

  @smoke
  Scenario: Receive real-time BTC/USD trade price
    Given the WebSocket connection to Bitstamp is established
    When I subscribe to BTC/USD trades
    Then I should receive a trade event
    And the price should be a valid number


  Scenario: Receive real-time BTC/EUR trade price
    Given the WebSocket connection to Bitstamp is established
    When I subscribe to BTC/EUR trades
    Then I should receive a trade event
    And the price should be a valid number


  Scenario: Invalid subscription request
    Given the WebSocket connection to Bitstamp is established
    When I subscribe to an invalid channel
    Then I should receive an error message
    And the error message should indicate an invalid subscription

  

