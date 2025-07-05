---
title: "Vuex Principles & Vue's Reactive Design Implementation"
date: 2019-11-25
tags:
  - Vue
---
## 1. Creating a Vuex Store Instance
- **`new Vuex.Store`**:
  - Use `new Vuex.Store` to create a Vuex Store instance.
  - This instance holds the following core components:
    - **State**: Stores the global state.
    - **Commit**: Used to commit mutations for synchronously updating the state.
    - **Dispatch**: Used to trigger actions for handling asynchronous logic.
## 2. Store Inheritance and Functionality Implementation
- **`Store{}`**:
  - The Store internally inherits the following core modules:
    - **Mutations**: Defines methods for modifying the state.
    - **Actions**: Defines methods for handling asynchronous logic and calls mutations via `commit`.
    - **Getters**: Similar to computed properties, used to derive data from the state.
  - Calls the underlying `commit` method to synchronously update the state.
## 3. Store Injection and Global Access
- **Passing to the root Vue instance**:
  - Pass the created store instance to the root Vue instance (usually done in the entry file).
  - This way, all components can access the features provided by Vuex through `this.$store`:
    - **Accessing state**: `this.$store.state.xxx`
    - **Committing mutations**: `this.$store.commit('mutationName', payload)`
    - **Dispatching actions**: `this.$store.dispatch('actionName', payload)`
    - **Getting derived data**: `this.$store.getters.xxx`
---
## Vue and Regular Integration
https://sq.sf.163.com/blog/article/193853627654062080
## Vue Source Code
https://juejin.cn/post/6844903422882398215
---
## Vue's Reactivity Implementation
The following is a simple implementation of a reactive system, based on the fundamental principles of Vue:
```js
class Vue {
	constructor(options) {
		this.data = options.data;
		this.el = options.el;
		this.observe(this.data); // Data Interception
		this.render(); // Initial Render
	}
	// Data Interception
	observe(obj) {
		const self = this;
		Object.keys(obj).forEach((key) => {
			let value = obj[key];
			Object.defineProperty(obj, key, {
				get() {
					return value;
				},
				set(newValue) {
					value = newValue;
					self.notify(key); // Notify update on data change
				},
			});
		});
	}
	// Notify Update
	notify() {
		this.render();
	}
	// Render Function
	render() {
		const el = document.querySelector(this.el);
		const newVNode = this.createVNode(this.data.count); // Create Virtual DOM
		const oldVNode = el.__vnode; // Get old Virtual DOM
		this.diff(el, oldVNode, newVNode); // Compare new and old Virtual DOM and update the real DOM
		el.__vnode = newVNode; // Update the current Virtual DOM
	}
	// Create Virtual DOM Node
	createVNode(value) {
		return {
			type: 'div',
			props: {},
			children: [String(value)],
		};
	}
	// Recursively create real DOM
	createDOM(vNode) {
		const dom = document.createElement(vNode.type);
		vNode.dom = dom;
		vNode.children.forEach((child) => {
			dom.appendChild(this.createDOM(child));
		});
		return dom;
	}
	// Compare differences between new and old Virtual DOM and update
	diff(parent, oldVNode, newVNode) {
		if (!oldVNode) {
			parent.appendChild(this.createDOM(newVNode)); // Add node
		} else if (!newVNode) {
			parent.removeChild(oldVNode.dom); // Remove node
		} else if (this.isDifferent(oldVNode, newVNode)) {
			parent.replaceChild(this.createDOM(newVNode), oldVNode.dom); // Replace node
		} else {
			newVNode.dom = oldVNode.dom; // Recurse through child nodes
			for (
				let i = 0;
				i < newVNode.children.length || i < oldVNode.children.length;
				i++
			) {
				this.diff(
					newVNode.dom,
					oldVNode.children[i],
					newVNode.children[i]
				);
			}
		}
	}
	// Check if nodes are different
	isDifferent(oldVNode, newVNode) {
		return (
			oldVNode.type !== newVNode.type ||
			oldVNode.children !== newVNode.children
		);
	}
}
// Example Usage
const vm = new Vue({
	el: '#app', // Specify DOM node
	data: {
		count: 0, // Define data model
	},
});
document.querySelector('#increment').addEventListener('click', function () {
	vm.data.count++; // Modify data to trigger update
});
```
## Reactivity System Logic
1.  **Data Interception**:
    -   Use `Object.defineProperty` to intercept data and listen for changes.
    -   When data changes, trigger a view update.
2.  **Template Parsing**:
    -   Parse the template to generate a render function (the `render` method).
    -   The render function is responsible for mapping data to the DOM.
3.  **Dependency Collection and Updates**:
    -   During initialization, collect dependencies via a `Watcher`.
    -   When data changes, notify the `Watcher` to trigger an update.
### Three Core Components
#### Virtual DOM
- **Definition**: The Virtual DOM is a JavaScript object that describes the structure and properties of the real DOM.
- **Purpose**:
  - Improve performance: By comparing the new and old Virtual DOM, only the parts that have changed are updated.
  - Provide cross-platform capability: The Virtual DOM can be mapped to different rendering targets (like browsers, mobile, etc.).
- **Core Algorithm**:
  - `diff` algorithm: Recursively compares the new and old Virtual DOM trees to find differences and update the real DOM.
#### Parser
- **Functionality**:
  - Parses directives, event bindings, etc., in the template.
  - Converts the template into an AST (Abstract Syntax Tree) and then generates a render function.
- **Implementation Method**:
  - Uses the `with` function to execute string code and dynamically inject context.
  - Example:
    ```js
    const render = new Function(`with(this) { return _c('div', {}, [_s(count)]) }`);
    ```
#### Observer (Data Interception)
- **Functionality**:
  - Intercepts the properties of a data object to listen for changes.
  - Each `Observer` instantiates a `Dep` object to manage dependencies.
- **Core Methods**:
  - `depend`: Adds a subscriber (`Watcher`).
  - `notify`: Notifies all subscribers to update.
### Dependency Collection and Update Flow
1.  **Initialization Phase**:
    -   Vue traverses the component template and collects all observed data expressions (like computed properties, data properties accessed in the template).
    -   For each expression, a `Watcher` instance is created and associated with the component.
2.  **Rendering Phase**:
    -   During the component rendering process, every time observed data is accessed, the relevant `Dep` instance is notified.
    -   The `Dep` instance adds the current `Watcher` to its dependency list.
3.  **Update Phase**:
    -   When the data changes, the `Dep` instance notifies all dependent `Watchers`.
    -   The `Watcher` triggers the component's update logic (like re-rendering the affected parts of the template).
### Concrete Example
- [Simple Reactive System Example](https://github.com/XingMXTeam/simple-reactivity/blob/master/test.html)
