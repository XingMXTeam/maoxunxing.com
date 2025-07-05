---
title: "Regular's Dirty Check Mechanism"
date: 2019-11-25
tags:
  - Web Development
  - Regular
---

## 1. How `$update` Works

When the `$update` method is called, Regular will start from the **DigestRoot** (which is the top-level component created via `new` by default) and perform `$digest()` checks on each component layer by layer. This process ensures that all bound data changes can be correctly detected and updated to the view.

### Stability of Dirty Checking

- **Stability of Dirty Checking** refers to whether listeners trigger new data changes after data changes. If a listener changes other data being listened to during its execution, the framework needs to perform multiple rounds of checks until the listener expressions no longer change.
  
#### Example of an Unstable Listener

this.$watch('firstName', (firstName) => {
    this.data.nickname = firstName + "Mr.";
In this example, a change in `firstName` will trigger an update to `nickname`, and the update to `nickname` may in turn trigger changes in other listeners. To ensure the final state is stable, the framework performs multiple rounds of checks.
#### Stable Listener Example
this.$watch('title', (title) => {

    this.$refs.top.innerHTML = title;

```javascript

}, { stable: true });
Listeners marked with `{ stable: true }` are considered stable and will not trigger additional dirty checks. For example:
});
```
- Text Interpolation

- `r-html`
- Attribute Interpolation
These listeners typically involve one-way data flow and do not trigger new data changes.
## 2. List Performance Optimization

```javascript

Lists are the most likely places to encounter performance issues, as list updates involve a large number of DOM operations. Regular optimizes list updates in the following ways:

### Levenshtein Edit Distance Algorithm

Regular uses the **Levenshtein Edit Distance Algorithm** to optimize list updates. This algorithm can find the minimum number of operations needed to transition one string (or list item) to another without requiring additional markers. Its time complexity is **O(n²)**.

```

#### Characteristics of List Updates

- **Internal Diff Complexity**: Regular's list updates internally use an optimized Diff algorithm, reducing complexity to **O(n)**.

- **No Destroy and Rebuild**: During list updates, Regular does not destroy and rebuild DOM nodes but instead directly updates the values inside the nodes.
- **Lifecycle Limitations**: During the list update process, the `config` and `init` lifecycle hooks are not triggered.
## 3. Prototypes and Prototype Chains

### `__proto__` and `prototype`

- **`__proto__`** is an object's property that points to the prototype object of that object.

- **`prototype`** is a property on a constructor function used to define shared properties and methods for instance objects.
---

#### Example

function Person(name) {
    this.name = name;
Person.prototype.sayHello = function() {
console.log(`Hello, my name is ${this.name}`);

const person = new Person("Alice");
console.log(person.__proto__ === Person.prototype); // true
Through the above content, we have learned the core mechanisms and optimization strategies of the Regular framework, including:

1. **Dirty Checking Stability**: Distinguish between stable listeners and unstable listeners.
2. **List Performance Optimization**: Optimize list updates using the Levenshtein edit distance algorithm and internal Diff optimization.
4. **Prototypes and Prototype Chains**: Understand the differences between `__proto__` and `prototype` and their respective roles.

```javascript

}

};
```