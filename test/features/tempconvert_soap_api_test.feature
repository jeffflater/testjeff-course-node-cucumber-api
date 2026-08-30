Feature: Temperature Conversion using SOAP API

  @smoke
  Scenario: Convert Celsius to Fahrenheit and verify correctness
    Given the Celsius value is "100"
    When I convert it to Fahrenheit using the SOAP service
    Then the response status should be 200
    Then the Fahrenheit result should be "212"
    And the result should be a valid integer


  Scenario: Convert Fahrenheit to Celsius and verify correctness
    Given the Fahrenheit value is "32"
    When I convert it to Celsius using the SOAP service
    Then the response status should be 200
    Then the Celsius result should be "0"
    And the result should be a valid integer


  Scenario: Send an invalid Celsius value and verify error handling
    Given the Celsius value is "invalid"
    When I convert it to Fahrenheit using the SOAP service
    Then the response status should be 400
    And the error message should indicate an invalid input

    
  
