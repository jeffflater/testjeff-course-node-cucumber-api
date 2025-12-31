Feature: Welcome Message

  Scenario: Student runs the welcome test
    Given the course has started
    When the student runs the first test
    Then TestJeff welcomes the student
    And confirms the setup is working
