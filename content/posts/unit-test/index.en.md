---
title: "How to Write Unit Tests"
date: 2021-08-27T10:20:36+08:00
description: ""
images:
  - unit-test/unit-test.jpeg
tags:
  - React
  - Web Development
---
This document provides a detailed guide on how to configure unit testing tools (like Mocha) and code coverage tools (like NYC) in a TypeScript project. It also includes instructions for using the required dependency libraries. It is suitable for developers who need to quickly set up a testing environment.
---
## Table of Contents
1. [Unit Testing](#unit-testing)
   - [Mocha Configuration](#mocha-configuration)
   - [Related Dependencies](#related-dependencies)
2. [Code Coverage](#code-coverage)
   - [NYC Configuration](#nyc-configuration)
   - [Calculating Coverage with Lerna](#calculating-coverage-with-lerna)
3. [Common npm Packages](#common-npm-packages)
---
## Unit Testing
### Mocha Configuration
#### Install Dependencies
```bash
npm install --save-dev mocha @types/mocha ts-node
```
#### Configure `mocha.opts`
Create a `mocha.opts` file in the project's root directory with the following content:
```
--require ts-node/register
test/**/*.test.ts
```
#### Example Code
```js
import "mocha";
describe("Example Test", () => {
  it("should pass the test", () => {
    const result = 1 + 1;
    if (result !== 2) {
      throw new Error("Test failed");
    }
  });
});
```
---
## Code Coverage
### NYC Configuration
#### Install Dependencies
```bash
npm install --save-dev nyc
```
#### Configure `package.json`
Add the following configuration to your `package.json`:
```json
{
  "nyc": {
    "include": [
      "src/*.ts",
      "src/**/*.ts"
    ],
    "exclude": [
      "typings",
      "dist"
    ],
    "extensions": [
      ".ts"
    ],
    "require": [
      "ts-node/register"
    ],
    "reporter": [
      "json",
      "html"
    ],
    "all": true
  }
}
```
#### Run Command
Add the following script to the `scripts` section of your `package.json`:
```json
"scripts": {
  "cov": "nyc mocha"
}
```
Run the command:
```bash
npm run cov
```
---
### Calculating Coverage with Lerna
If your project uses Lerna to manage a multi-package structure, you can calculate coverage using the following method:
```bash
nyc lerna run cov --concurrency=1
```
#### Configure NYC Subprocess Injection
Add the following to your `nyc` configuration:
```json
{
  "include": [
    "packages/*/src/*.ts",
    "packages/*/src/**/*.ts"
  ],
  "exclude": [
    "**/typings",
    "**/*.d.ts",
    "**/dist",
    "**/src/index.ts"
  ],
  "extensions": [
    ".ts"
  ],
  "reporter": [
    "json",
    "html"
  ],
  "all": true
}
```
> **Note**: `nyc` and `ts-node` only need to be installed at the top level.
---
## Common npm Packages
The following are commonly used npm packages and their functional descriptions:
### HTTP Request Related
- **whatwg-fetch**
  - Provides a polyfill for the `fetch` API, for compatibility in environments that do not natively support `fetch`.
- **msw**
  - Mock Service Worker, used to intercept and mock HTTP requests.
  - **setupServer**
    - Creates a server-side mock server.
  - **msw/node**
    - Provides mock support for the Node.js environment.
### Testing Tools
- **@testing-library/react**
  - React component testing library, provides the following methods:
    - `render`: Renders a component.
    - `fireEvent`: Triggers an event.
    - `waitFor`: Waits for a condition to be met asynchronously.
    - `screen`: Accesses DOM elements.
- **@testing-library/jest-dom/extend-expect**
  - Extends Jest's assertion methods, for example, `toBeInTheDocument`.
