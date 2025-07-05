---
title: "Core Implementation and Middleware Mechanism of Redux"
date: 2019-11-25
tags:
  - Redux
---

Below is a collection of code for the core implementation of Redux and its middleware mechanism, including detailed explanations of the application layer, Reducers, `createStore`, and `applyMiddleware`.

## 1. Application Layer Code

At the application layer, we enhance `createStore` with `applyMiddleware` and create a Store instance. Then we use `subscribe` to listen for state changes and trigger state updates with `dispatch`.

// Application layer
const store = applyMiddleware(logger, xxx)(createStore)(reducer1, { title: '12313' });
store.subscribe(() => {

let state = store.getState();
```javascript
console.log('Current state:', state);
store.dispatch({

  type: 'CHANGE_TITLE',
data: {
    title: '123123'
## 2. Reducer Definition
});
A Reducer is a pure function used to calculate the new state based on the current state and the Action.
// Reducer

  switch (action.type) {

    case 'CHANGE_TITLE':

      return Object.assign({}, state, action.data);

  }
});
```
default:
---
      return state;
## 3. Core Implementation of `createStore`
`createStore` is the core method of Redux, responsible for creating the Store and providing the `getState`, `subscribe`, and `dispatch` methods.
// Redux core implementation of createStore
function createStore(reducer, initState) {
```javascript

  let store = new Regular();

function reducer1(state, action) {

  let state = initState;

// Get the current state
  store.getState = () => state;
  // Subscribe to state changes
  store.subscribe = (listener) => store.$on('change', listener);
  }

}
```

// Dispatch Action
---

  store.dispatch = function (action) {
    state = reducer(state, action); // Call Reducer to update state
    store.$emit('change'); // Notify subscribers that the state has been updated
return action; // Supports chain calls
  };
```javascript

  return store;
## 4. Middleware Mechanism: `applyMiddleware`
`applyMiddleware` is Redux's middleware enhancer, used to extend the functionality of the `dispatch` method.

// applyMiddleware implementation

function applyMiddleware(middlewares) {

  return function (createStore) {

return function (reducer, initState) {
      // Create the original Store
      let store = createStore(reducer, initState);
      // Use reduceRight to combine multiple middleware into a new dispatch
let dispatch = middlewares.reduceRight(
        (nextDispatch, middleware) => middleware(nextDispatch),
        store.dispatch

      );
// Return the enhanced Store
      return Object.assign({}, store, { dispatch });
  };
## 5. Middleware Example: Logger

Middleware is an extension point for Redux, allowing us to insert custom logic before and after the execution of `dispatch`. Here is a simple Logger middleware example:
}
```
// Logger middleware
---
  return function (action) {

    console.log('Action started:', action);

const result = next(action); // Calling the next middleware or original dispatch

    console.log('Action finished:', result);

    return result;
```javascript
  };
## 6. Workflow Summary
### 1. Create Store
- Use `createStore` to create a Store, passing in the Reducer and initial state.
- The Store provides the `getState`, `subscribe`, and `dispatch` methods.
### 2. Enhanced Store
- Use `applyMiddleware` to enhance `createStore`, adding middleware support.
- Middleware are combined using `reduceRight`, forming a new `dispatch` method.
### 3. State Update Flow

1. Call `store.dispatch(action)`.

2. Middleware executes sequentially, processing the Action.

3. Finally, the Reducer is called to update the state.

4. Trigger the callback functions of subscribers (e.g., `store.subscribe`).
## 7. Additional Key Points

### 1. The role of middleware

    };
Middleware can:

}

```
- Insert logging, error capture, and other logic before and after `dispatch`.
---
- Supports asynchronous operations (such as Redux Thunk or Redux Saga).

### 2. The function of `reduceRight`

- `reduceRight` combines middleware from right to left, ensuring that the execution order of middleware is from outside to inside.

### 3. Alternative syntax for `Object.assign`

In modern JavaScript, you can use the spread operator to replace `Object.assign`:

```javascript
return {

function logger(next) {

  ...store,

  dispatch

## 8. Summary

The code above demonstrates the core implementation and middleware mechanism of Redux, including:
1. **`createStore`**: The core method for managing state.
2. **`applyMiddleware`**: Enhances the `dispatch` function through middleware.
}
```
3. **Reducer**: A pure function used to calculate the new state.

---

4. **Middleware**: Extends `dispatch`, supporting features like logging, asynchronous operations, etc.

Through these mechanisms, Redux provides a predictable state management solution suitable for complex application scenarios.

---
```javascript
};
```

---
