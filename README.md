# Toolshop E2E Test Automation Framework

Automated end-to-end tests for [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com/), created for the EPAM practical task covering WebdriverIO, Mocha, and Chai.

## Tech stack

- **JavaScript (ES modules)** and **Node.js**
- **WebdriverIO (WDIO)** for browser automation
- **Mocha** for test organization and execution
- **Chai** for assertions using **Assert**, **Expect**, and **Should**
- **Page Object Model (POM)** for reusable page interactions
- **Gherkin** (`.feature`) for scenario descriptions and example data
- **`@cucumber/gherkin`** to parse Examples tables; the actual test runner is **Mocha**, not Cucumber

## Test coverage

The framework automates the Module 2 scenarios covering:

| Area | Checks |
| --- | ---: |
| Product details | 3 |
| Product search | 3 |
| Product sorting (name, price, CO₂) | 6 |
| Category filtering | 4 |
| Combined filtering and sorting | 3 |
| Add to basket | 3 |
| Favorites without authentication | 3 |
| Guest checkout (Cash on Delivery) | 1 |
| Registered user sign-in | 1 |
| Add new favorites | 3 |
| Prevent duplicate favorites | 3 |
| **Module 2 checks** | **33** |
| Additional smoke checks | 2 |
| **Total** | **35** |

**Latest recorded local full-suite result:** 13 spec files passed, with 35 passing checks. This describes a local run, not a CI guarantee.

## Project structure

```text
WDIO_EPAM/
├── features/
│   └── practice_software_testing.feature
├── test/
│   ├── pageobjects/
│   │   ├── base.page.js
│   │   ├── products.page.js
│   │   ├── product-details.page.js
│   │   ├── cart.page.js
│   │   ├── checkout.page.js
│   │   ├── login.page.js
│   │   ├── account.page.js
│   │   └── favorites.page.js
│   ├── specs/
│   │   └── *.e2e.js
│   └── utils/
│       ├── feature-data.js
│       └── test-users.js
├── .env                 # Local only; do not commit
├── .gitignore
├── package.json
├── wdio.conf.js
└── README.md
```

The Page Objects hold selectors and UI actions. The spec files define test cases and assertions. `feature-data.js` reads Gherkin Examples tables and supplies data to parameterized Mocha tests.

## Prerequisites

- **Node.js 22+** and npm (the project uses `process.loadEnvFile()`)
- Google Chrome installed
- Access to the public Toolshop site
- A valid Toolshop account for authenticated scenarios

## Installation

From the repository root:

```bash
npm install
```

Create a local `.env` file at the repository root:

```dotenv
STANDARD_USER_EMAIL=your-test-user@example.com
STANDARD_USER_PASSWORD=your-test-password
```

The expected full name in the **Sign in with a registered user** scenario is defined in `features/practice_software_testing.feature`. Update its example data if you use a different account.

**Security:** Never commit `.env`, real passwords, authentication tokens, or `node_modules/`. Keep these paths in `.gitignore`. If an `.env.example` file is provided, it should contain variable names only and no real credentials.

## Run tests

Run the full configured WDIO suite:

```bash
npx wdio run ./wdio.conf.js
```

Run a single specification:

```bash
npx wdio run ./wdio.conf.js --spec ./test/specs/product-details.e2e.js
```

Other examples:

```bash
npx wdio run ./wdio.conf.js --spec ./test/specs/login.e2e.js
npx wdio run ./wdio.conf.js --spec ./test/specs/favorites-duplicate.e2e.js
```

The spec reporter prints passed/failed results in the terminal.

## Test design

1. **Gherkin** describes scenarios and `Examples` data in `features/practice_software_testing.feature`.
2. **`getScenarioExamples()`** parses the feature file and returns objects for each Examples row.
3. **Mocha** registers tests with `describe()` and `it()`; some specs use `beforeEach()` for browser-session setup.
4. **Page Objects** expose reusable operations such as `openProductByName()`, `signIn()`, and `addToFavorites()`.
5. **Chai** checks actual results against expected results using all three assertion interfaces.

Example assertion styles used in this project:

```js
assert.strictEqual(actualCategory, category);  // Assert
chaiExpect(actualPrice).to.equal(price);        // Expect
actualName.should.equal(product);               // Should
```

### Test isolation

The favorites scenarios modify server-side data for the signed-in user. When the same account is used by multiple parallel tests, they can interfere with each other. The successful local regression run used sequential spec execution. For reliable parallel runs, use isolated accounts or properly managed independent test data.

## Notes for reviewers

- The `.feature` file supplies scenario descriptions and test data; it is **not executed by Cucumber**.
- The project exercises all three Chai interfaces required by the practical task.
- The original WDIO starter example (`test.e2e.js` with `page.js`/`secure.page.js`) is unrelated to Toolshop and should be excluded or removed from the submitted test suite.
- A GitHub **Pull Request** (or GitLab **Merge Request**, if required by EPAM) is used for code review.
