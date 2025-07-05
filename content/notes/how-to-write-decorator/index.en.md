---
title: "ES6 Knowledge"
date: 2021-10-21T19:17:54+08:00
tags:
  - ES6
---
## How to Write a Decorator
A decorator is essentially a Higher-Order Component (HOC) that takes a function as an argument and returns a new function. It is compiled using a Babel plugin.
### **2. Example Code**
Here is an example implementation of a decorator:
```js
class Provider extends React.Component {
  render() {
    return this.props.children;
  }
}
export const DecoratorDemo = (props) => (WrappedComponent) => {
  const Wrapped = React.forwardRef(function (innerProps, ref) {
    return (
      <Provider {...props} innerProps={{ ...innerProps }}>
        <WrappedComponent {...innerProps} ref={ref} />
      </Provider>
    );
  });
  // Copy static methods
  return Object.assign(Wrapped, WrappedComponent);
};
```
### **3. Disadvantages of Decorators**
#### **3.1 Hidden Code Injection at Runtime**
- Decorators inject hidden code at runtime, which can be confusing for developers who expect the source code to follow traditional semantics.
#### **3.2 Difficulty in Debugging**
- Decorators need to be compiled before they can run, which can make debugging difficult and hard to trace the root of a problem.
#### **3.3 Impact on API Contracts**
- Decorators are generated at runtime and can affect API contracts, leading to unexpected behavior.
---
## import
`import * as path from 'path';` and `import path from 'path';`
are two different syntaxes for importing modules. The former exports all content. The latter exports the default, and since `path` has no default export, it will cause an error.
---
In JavaScript classes, the binding of `this` is a common issue. Especially when passing a class member function as a callback, `this` can lose its original context, leading to runtime errors.
Here is a typical example:
```js
function test(fn) {
  fn();
}
class A {
  a = 123;
  fnB() {
    console.log(this.a); // 'this' here is undefined
  }
  fnA() {
    test(this.fnB); // Incorrect usage
  }
}
```
In the code above, `this` inside the `fnB` method becomes `undefined` when called because its context is lost during the transfer.
- In JavaScript, the `this` of a function is dynamically bound and depends on how the function is called.
  - When `this.fnB` is passed as an argument to the `test` function, `fnB` is invoked as a regular function (not a method call). In this case, `this` no longer points to the class instance but becomes `undefined` (in strict mode).
- If a class member function relies on `this` to access instance properties or methods, it will result in a runtime error.
### Solutions
#### Arrow Function Binding for `this`
Arrow functions do not create their own `this`; they inherit it from the outer scope. Therefore, you can use an arrow function to ensure `this` always points to the class instance.
#### Example
```js
class A {
  a = 123;
  fnB = () => {
    console.log(this.a); // Ensures 'this' points to the class instance
  };
  fnA() {
    test(this.fnB); // Correct usage
  }
}
```
### Explicit `this` Binding
By explicitly binding `this` with the `Function.prototype.bind` method, you can ensure that the context during the function call is always the class instance.
#### Example
```js
class A {
  a = 123;
  fnB() {
    console.log(this.a); // Ensures 'this' points to the class instance
  }
  fnA() {
    test(this.fnB.bind(this)); // Use bind to bind 'this'
  }
}
```
#### Code Example
The following is a complete example demonstrating how to solve the issue of losing `this`:
```js
function test(fn) {
  fn();
}
class A {
  a = 123;
  // Using an arrow function
  fnB = () => {
    console.log('Arrow function:', this.a);
  };
  // Using explicit binding
  fnC() {
    console.log('Explicit binding:', this.a);
  }
  fnA() {
    test(this.fnB); // Arrow function method
    test(this.fnC.bind(this)); // Explicit binding method
  }
}
const instance = new A();
instance.fnA();
// Output:
// Arrow function: 123
// Explicit binding: 123
```
