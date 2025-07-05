---
title: "MobX State Management Guide"
date: 2019-11-25
tags:
  - Mobx
  - State Management
---

- [MobX Versions](#mobx-versions)

## Table of Contents
- [Design Philosophy](#design-philosophy)
- [Core Concepts](#core-concepts)
  - [Observable State (@observable)](#observable-state-observable)
  - [Computed Values (@computed)](#computed-values-computed)
- [Reaction (@observer and autorun)](#reactionobserver-和-autorun)
- [Code Example](#code-example)
  - [Example Code](#example-code)
  - [Execution Logic](#execution-logic)
- [Custom Reaction: `autorun`](#custom-reactionautorun)
  - [Features](#features)

## MobX Versions

- **MobX 4**: Supports ES5 and decorator syntax, with good compatibility.

- **MobX 5**: Fully based on ES6 Proxy, better performance, but does not support IE11.
---

## Design Philosophy

The design philosophy of MobX can be summarized in the following points:

1. **Automatic Updates**

- The application state should be automatically obtained without manually triggering events or calling a dispatcher.
   - MobX provides a reactive mechanism to ensure the state graph remains up-to-date.
2. **Efficient Updates**:

---
   - Use a virtual dependency state graph to update views only when necessary, avoiding unnecessary rendering.

3. **Simple and Scalable**:
   - Low code intrusion, easy to integrate into existing projects.
   - Supports scaling from small applications to complex systems.

## Core Concepts

### Observable State (@observable)

- **Definition**: `@observable` is used to mark a state as observable, and any modification to this state will trigger updates to related views.

- **Features**:
  - Automatically tracks dependencies.
- Changes will notify all observers that depend on this state.
### Calculated Value (@computed)

- **Definition**: `@computed` is used to define derived values based on other observable states.

- **Features**:
- Lazy computation: It is recalculated only when it is used.
  - Cache results: It will not be recalculated if the dependent state has not changed.
### Reaction (@observer and autorun)

---

- **@observer**:
- Wrap a React component as an observer component to make it able to respond to state changes and automatically re-render.
- **autorun**:
  - Define a custom side-effect function that automatically executes when the dependent state changes.

## Code Example

Here is a complete MobX example showing how to use `@observable`, `@computed`, and `@observer`.

### Example Code

```js

import { observable, computed, observer } from “mobx”;
import { observer as observerReact } from "mobx-react";
class TodoList {

    @observable todos = [];
    @computed get unfinishedTodoCount() {

return this.todos.filter(todo => !todo.finished).length;
const todoList = new TodoList();
// Observer component
@observer

class TodoListView extends Component {

    render() {
        return (
            <div>
<ul>
                    {this.props.todoList.todos.map(todo => (
                        <TodoView todo={todo} key={todo.id} />
---
                    ))}
</ul>
                Tasks left: {this.props.todoList.unfinishedTodoCount} {/* @1 */}
            </div>
        );
// Single component
const TodoView = observer(({ todo }) => (
    <li>
        <input

type="checkbox"
            checked={todo.finished}
            onClick={() => (todo.finished = !todo.finished)}
        />
{todo.title}
    </li>
));
    }
}
// Add some initial data
todoList.todos.push(

    { id: 1, title: "Learn MobX", finished: false },
    { id: 2, title: "Build an App", finished: false }
);
export default function App() {
    return <TodoListView todoList={todoList} />;

### Execution Logic
1. **Click an item**:
- When the user clicks the checkbox of a certain todo item, `TodoView` will force a re-render.
   - If `unfinishedTodoCount` changes, `TodoListView` will also re-render.

2. **Remove commented-out code**:

   - If you delete the line of code `Tasks left: {this.props.todoList.unfinishedTodoCount}`, `TodoListView` will not re-render, because it does not depend on `unfinishedTodoCount`.
## Custom Reactivity: `autorun`
`autorun` is a powerful tool for defining custom side-effect functions. Here is a simple example:

```js
import { observable, autorun } from “mobx”;

    }

}

class Store {

    @observable count = 0;
const store = new Store();

// Automatically runs side effects
autorun(() => {
    console.log(`Current count: ${store.count}`);

// Modify state

store.count++; // Output: Current count: 1
store.count++; // Output: Current count: 2
### Features
- **Automatic dependency tracking**: `autorun` automatically tracks the observable state it uses internally.

- **Immediate response**: Whenever the dependent state changes, `autorun` executes immediately.
}
```
---

}

});
```