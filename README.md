# TestJeff API Testing Course - Node.js + Cucumber

A comprehensive API testing course using Node.js and Cucumber.js, covering REST, GraphQL, SOAP, JSON-RPC, and WebSocket APIs.

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with JUnit report
```bash
npm run test:junit
```

## Project Structure

```
testjeff-course-node-cucumber-api/
├── .env                              # Environment variables (API keys)
├── .github/
│   └── workflows/
│       └── cucumber.api.test.yml     # CI/CD pipeline
├── cucumber.js                       # Cucumber configuration
├── Dockerfile                        # Docker configuration
├── package.json                      # Node.js dependencies
├── README.md                         # This file
├── reports/                          # Test output directory
└── test/
    ├── features/
    │   ├── support/
    │   │   └── hooks.js              # Cucumber hooks (setup/teardown)
    │   ├── steps/                    # Step definitions
    │   │   ├── welcome_steps.js
    │   │   ├── shared_test_steps.js
    │   │   ├── finnhub_rest_api_test_steps.js
    │   │   ├── rickandmorty_graphql_api_test_steps.js
    │   │   ├── ankreth_rpc_api_test_steps.js
    │   │   ├── tempconvert_soap_api_test_steps.js
    │   │   └── bitstamp_websocket_api_test_steps.js
    │   └── *.feature                 # Gherkin feature files
    └── utils/                        # Custom assertion helpers
        ├── finnhub_assertions.js
        ├── rickandmorty_assertions.js
        ├── ankr_assertions.js
        ├── tempconvert_assertions.js
        └── bitstamp_assertions.js
```

## API Tests Included

| Test | Protocol | API | Description |
|------|----------|-----|-------------|
| Welcome | N/A | N/A | Smoke test to verify setup |
| Finnhub | REST | finnhub.io | Stock quote retrieval |
| Rick and Morty | GraphQL | rickandmortyapi.com | Character lookup |
| Ankr Ethereum | JSON-RPC | rpc.ankr.com | Blockchain block number |
| W3Schools | SOAP | w3schools.com | Temperature conversion |
| Bitstamp | WebSocket | ws.bitstamp.net | Real-time BTC trades |

## Docker Usage

### Build
```bash
docker build -t cucumber-test .
```

### Run
```bash
docker run --rm --env-file .env -v ${PWD}/reports:/app/reports cucumber-test test
```

### Run with JUnit reports
```bash
docker run --rm --env-file .env -v ${PWD}/reports:/app/reports cucumber-test test:junit
```

## Environment Variables

Create a `.env` file with:

```
FINNHUB_API_KEY=your_finnhub_api_key
ANKRETH_API_KEY=your_ankr_api_key
```

## License

ISC
