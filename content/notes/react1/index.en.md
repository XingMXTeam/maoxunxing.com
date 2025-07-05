---
title: "A Deep Dive into React Events"
date: 2019-11-25
tags:
  - React
---
In React, event handling has some differences compared to native DOM event handling. Here are the basic usage and points to note about React events.
## 1. Event Names are camelCase
React event names use **camelCase**, such as `onClick`, `onMouseOver`, etc., instead of the lowercase form in native HTML (like `onclick`).
---
## 2. Passing a Function as an Event Handler
In JSX files, you need to pass a function reference as the event handler, not a string. Here is a simple example:
```jsx
import React, { Component } from 'react';
class Hello extends Component {
  clickHandler(e) {
    e.preventDefault();
    console.log("The link was clicked.");
  }
  render() {
    return (
      <div>
        <button onClick={this.clickHandler}>Click Me</button>
      </div>
    );
  }
}
export default Hello;
```
---
## 3. Preventing Default Behavior
In React, you must call `e.preventDefault()` to prevent the default behavior; you cannot achieve this by `return false`.
---
## 4. Synthetic Event Object
The React event object `e` is a **SyntheticEvent**, which is a wrapper around the native event object and provides cross-browser consistency.
### Properties of the Synthetic Event Object
Here are the main properties of the Synthetic Event object:
```javascript
boolean bubbles;                // Whether it bubbles
boolean cancelable;             // Whether the default action can be canceled
DOMEventTarget currentTarget;   // The DOM element to which the event handler is attached
boolean defaultPrevented;       // Whether the default action has been prevented
number eventPhase;              // The event propagation phase
boolean isTrusted;              // Whether the event was triggered by the user
DOMEvent nativeEvent;           // The native event object
void preventDefault();          // Prevents the default action
boolean isDefaultPrevented();   // Checks if the default action has been prevented
void stopPropagation();         // Stops event propagation
boolean isPropagationStopped(); // Checks if event propagation has been stopped
DOMEventTarget target;          // The original DOM element that triggered the event
number timeStamp;               // The timestamp of when the event occurred
string type;                    // The event type
```
---
## 5. Handling the `this` Binding Issue
In class components, `this` in an event handler defaults to `undefined`. To make `this` point to the current component instance, you can use one of the following methods:
### Method 1: Use `bind` to Bind `this`
```jsx
<button onClick={this.clickHandler.bind(this)}>Click Me</button>
```
### Method 2: Use an Arrow Function to Define the Event Handler
```jsx
clickHandler = (e) => {
  e.preventDefault();
  console.log("The link was clicked.");
}
```
### Method 3: Use an Arrow Function in JSX
```jsx
<button onClick={(e) => this.clickHandler(e)}>Click Me</button>
```
---
## 6. Passing Arguments to Event Handlers
If you need to pass extra parameters (like an ID) to an event handler, you can use the following two methods:
### Method 1: Use an Arrow Function
```jsx
<button onClick={(e) => this.clickHandler(this.id, e)}>Delete Row</button>
```
### Method 2: Use `bind`
```jsx
<button onClick={this.clickHandler.bind(this, this.id)}>Delete Row</button>
```
---
## 7. Asynchronously Accessing the Synthetic Event Object
For performance reasons, React nullifies all properties of the Synthetic Event object after the event handler has finished executing. Therefore, you cannot access these properties asynchronously.
### Example Problem
```jsx
clickHandler(id, e) {
  e.preventDefault();
  console.log("The link was clicked.");
  console.log(id);
  setTimeout(function() {
    console.log(e.bubbles); // Outputs null
  }, 0);
}
```
### Solution: Call `e.persist()`
By calling `e.persist()`, you can retain the property values of the Synthetic Event object, making them available in asynchronous code.
```jsx
clickHandler(id, e) {
  e.preventDefault();
  console.log("The link was clicked.");
  console.log(id);
  e.persist(); // Retain the event object
  setTimeout(function() {
    console.log(e.bubbles); // Outputs true
  }, 0);
}
```
---
## 8. Supporting Capture Phase Event Triggering
If you need to trigger an event during the capture phase, you can append `Capture` to the event name, for example:
```jsx
<button onClickCapture={this.clickHandler}>Click Me</button>
```
This will trigger `clickHandler` during the event capture phase, not the bubbling phase.
