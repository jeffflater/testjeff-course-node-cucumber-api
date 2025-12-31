Feature: Temperature Conversion using SOAP API

  Scenario: Convert Celsius to Fahrenheit and verify correctness
    Given the Celsius value is "100"
    When I convert it to Fahrenheit using the SOAP service
    Then the response status should be 200
    Then the Fahrenheit result should be "212"
    And the result should be a valid integer
