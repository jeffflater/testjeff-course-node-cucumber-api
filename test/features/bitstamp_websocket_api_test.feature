Feature: Bitstamp WebSocket BTC price feed

  Scenario: Receive real-time BTC/USD trade price
    Given the WebSocket connection to Bitstamp is established
    When I subscribe to BTC/USD trades
    Then I should receive a trade event
    And the price should be a valid number
