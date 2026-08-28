# 🧪 TestJeff Course: Node.js + Cucumber API Testing

Welcome to the **TestJeff Course Repository** for mastering **API Testing with Node.js and Cucumber**. This repo contains hands-on examples, Docker integration, and complete test automation pipelines for REST, SOAP, GraphQL, WebSocket, and RPC APIs.

---

## 🚀 Course Overview

This repository supports the **TestJeff API Testing Course**. You'll learn how to:
- Structure and write Gherkin feature files
- Create step definitions using Cucumber.js
- Test various API protocols: REST, SOAP, GraphQL, WebSocket, and JSON-RPC
- Run tests in Dockerized environments
- Integrate with CI and generate test reports

---

## 📂 Project Structure

```
test/
├── features/
│   ├── support/            # Cucumber hooks (setup/teardown)
│   ├── steps/               # Step definitions (.js)
│   └── *.feature             # Gherkin feature files
└── utils/                    # Custom assertion helpers
.env                           # API keys and configuration variables
cucumber.js                    # Cucumber configuration
reports/                       # Test output (e.g., JUnit, HTML)
```

---

## 🛠️ Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [VS Code](https://code.visualstudio.com/)
- Node.js 18+ (if running outside Docker)
- API keys for third-party APIs (Finnhub, etc.)

---

## ⚙️ Setup

### Clone the repo

```bash
git clone https://github.com/testjeff/testjeff-course-node-cucumber-api.git
cd testjeff-course-node-cucumber-api
```

### Create a `.env` file

```env
FINNHUB_API_KEY=your_api_key_here
ANKRETH_API_KEY=your_api_key_here
```

### Build Docker image

```bash
docker build -t cucumber-test .
```

---

## ▶️ Run Tests

### VS Code Tasks

Use the preconfigured VS Code tasks:

- `Docker: Run Welcome from TestJeff`
- `Docker: Run Finnhub REST API Test`
- `Docker: Run TempConvert SOAP API Test`
- `Docker: Run Rick and Morty GraphQL API Test`
- `Docker: Run Bitstamp WebSocket API Test`
- `Docker: Run AnkrETH RPC API Test`
- `Docker: Run All Cucumber Tests`

Or run manually:

```bash
docker run --rm --env-file .env -v ${PWD}/reports:/app/reports --entrypoint npx cucumber-test cucumber-js test/features --format json:reports/cucumber-report.json --format junit:reports/junit-report.xml
```

Or, outside Docker:

```bash
npm install
npm test
```

---

## 🧪 Sample Feature

```gherkin
Feature: Get stock quote from Finnhub API

  Scenario: Successful stock quote fetch for AAPL
    Given I have a valid API key
    When I request a stock quote for "AAPL"
    Then the response status should be 200
    And the current price should be a positive number
    And the response should contain required quote fields
```

---

## 📘 Course Notes

Refer to the **Module Guide** included with the course to follow along lesson by lesson and get the most out of the provided examples.

---

## 🤖 GitHub Copilot

Try using Copilot to:
- Auto-generate step definitions from feature files
- Extend test coverage for edge cases
- Refactor and improve test logic

---

## 🧑‍💻 Contributing

Pull requests are welcome! If you have ideas for extending this project or submitting test cases, feel free to fork and contribute.

---

## 📜 License

ISC License — see `package.json` for details.
