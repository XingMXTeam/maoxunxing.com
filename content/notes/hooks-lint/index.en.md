---
title: "Illegal Hook Call Causes Button to Become Unresponsive"
date: 2025-02-24
tag:
  - React
---
## Table of Contents
1. [Problem Background](#problem-background)
2. [Problem Description](#problem-description)
3. [Problem Analysis](#problem-analysis)
4. [Solution](#solution)
   - [4.1 Using ESLint to Show Errors During Development](#41-using-eslint-to-show-errors-during-development)
   - [4.2 Monitoring Illegal Hook Calls in Production](#42-monitoring-illegal-hook-calls-in-production)
   - [4.3 Handling Errors in a Separate DOM Tree](#43-handling-errors-in-a-separate-dom-tree)
   - [4.4 Safely Wrapping Callback Functions](#44-safely-wrapping-callback-functions)
5. [Summary and Recommendations](#summary-and-recommendations)
---
## Problem Background
In React projects, the use of Hooks must follow certain rules (e.g., they can only be called inside function components or custom Hooks). Violating these rules can lead to runtime errors or unexpected behavior.
---
## Problem Description
In the following code, a Hook is called directly within the `onOk` callback function of `Dialog.confirm`:
```javascript
Dialog.confirm({
  title: 'Please confirm',
  content: 'Are you sure you want to delete in batch?',
  style: { width: 400 },
  onOk: () => {
    const useProfitPouchGray = useInitGrayManage((s: any) => s.useProfitPouchGray());
  }
});
```
This illegal Hook call leads to the following issues:
1. **Button Unresponsive**: Because the Hook call violates the rules, React throws an error, preventing the callback function from executing correctly.
2. **ErrorBoundary Cannot Catch the Error**: The `componentDidCatch` lifecycle method cannot catch this type of error because it occurs outside of the rendering phase.
3. **Errors in a Separate DOM Tree Cannot Be Caught**: `Dialog.confirm` uses a separate DOM tree (implemented with `ReactDOM.createPortal`), so the `ErrorBoundary` in the root component has no effect on it.
4. **Errors in the `onOk` Callback Cannot Be Caught**: `onOk` is a regular function, and its errors will not be caught by React's error boundaries.
---
## Problem Analysis
According to the official React documentation, the use of Hooks must follow these rules:
1. **Only Call Hooks at the Top Level**: Do not call Hooks inside conditions, loops, or nested functions.
2. **Only Call Hooks from React Functions**: Do not call Hooks from regular JavaScript functions or class components.
The problem with the code above is that `useInitGrayManage` is a Hook, but it is called directly inside the `onOk` callback function. This violates the second rule, causing React to throw a runtime error.
Additionally:
- `ErrorBoundary` can only catch rendering errors within the main React DOM tree.
- `onOk` is a regular function, and its errors will not be caught by `ErrorBoundary` or any of React's built-in mechanisms.
---
## Solution
### 4.1 Using ESLint to Show Errors During Development
To detect illegal Hook calls early in the development phase, you can configure ESLint rules to enforce that Hook usage conforms to the specifications.
Here is an example configuration for `.eslintrc.js`:
```javascript
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint-config-ali/typescript/react',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended', // Recommended React Hooks rules
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', 'react-hooks'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error', // Checks if Hooks are used according to the rules
    'react-hooks/exhaustive-deps': 'warn', // Checks if dependencies for useEffect, etc., are complete
  },
};
```
#### Key Rule Explanations:
- **`react-hooks/rules-of-hooks`**: Used to detect whether Hooks are called in a valid context. If an illegal call is found, ESLint will report an error during development.
- **`react-hooks/exhaustive-deps`**: Ensures that the dependency array for Hooks like `useEffect` is complete, avoiding potential side-effect issues.
With the configuration above, you can promptly identify and fix illegal Hook call issues during the development phase.
---
### 4.2 Monitoring Illegal Hook Calls in Production
Although ESLint can catch most issues during development, it is still necessary to monitor for illegal Hook calls in the production environment to prevent uncaught errors from affecting the user experience.
#### Implementation Method:
1. **Global Error Catching**:
   Add global error listeners in the application's entry file to catch unhandled exceptions:
   ```javascript
   window.addEventListener('error', (event) => {
     console.error('Caught global error:', event.message);
     // Report the error to a monitoring system
   });
   window.addEventListener('unhandledrejection', (event) => {
     console.error('Caught unhandled Promise rejection:', event.reason);
     // Report the error to a monitoring system
   });
   ```
2. **Logging and Reporting Tools**:
   Use third-party logging tools (like Sentry or Bugsnag) to record and analyze production errors. These tools can help quickly locate issues and provide detailed error stack traces.
---
### 4.3 Handling Errors in a Separate DOM Tree
For the separate DOM tree used by `Dialog.confirm` (implemented with `ReactDOM.createPortal`), you can wrap its content section with a local `ErrorBoundary`. For example:
```javascript
class LocalErrorBoundary extends React.Component {
  state = { hasError: false };
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.error('LocalErrorBoundary caught an error:', error, info);
    // Report the error to a monitoring system
  }
  render() {
    if (this.state.hasError) {
      return <div>An error occurred. Please refresh the page or contact an administrator.</div>;
    }
    return this.props.children;
  }
}
function SafeDialogConfirm(options) {
  return Dialog.confirm({
    ...options,
    content: (
      <LocalErrorBoundary>
        {options.content}
      </LocalErrorBoundary>
    ),
  });
}
```
This method can catch errors in the rendering part of the `content`, but it cannot catch errors within the `onOk` callback.
---
### 4.4 Safely Wrapping Callback Functions
To catch errors in the `onOk` callback, you can safely wrap the callback function. For example:
```javascript
function safeCallback(callback) {
  return (...args) => {
    try {
      return callback(...args);
    } catch (error) {
      console.error('Caught an error in the callback function:', error);
      // Report the error to a monitoring system
    }
  };
}
const MyComponent = () => {
  const handleConfirm = () => {
    Dialog.confirm({
      title: 'Please confirm',
      content: 'Are you sure you want to delete in batch?',
      style: { width: 400 },
      onOk: safeCallback(() => {
        const useProfitPouchGray = useInitGrayManage((s: any) => s.useProfitPouchGray());
      }),
    });
  };
  return <button onClick={handleConfirm}>Open Dialog</button>;
};
```
#### Key Points:
- **`safeCallback`**: Wraps the callback function to catch and handle errors within it.
- **Error Reporting**: Report the captured errors to a logging system for subsequent analysis.
