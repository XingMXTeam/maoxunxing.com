---
title: "MobX状态管理指南"
date: 2019-11-25
---

## 目录

- [MobX 版本](#mobx-版本)
- [设计哲学](#设计哲学)
- [核心概念](#核心概念)
  - [可观察的状态（@observable）](#可观察的状态observable)
  - [计算值（@computed）](#计算值computed)
  - [反应（@observer 和 autorun）](#反应observer-和-autorun)
- [代码示例](#代码示例)
  - [示例代码](#示例代码)
  - [运行逻辑](#运行逻辑)
- [自定义反应：`autorun`](#自定义反应autorun)
  - [特点](#特点)

---

## MobX 版本

- **MobX 4**：支持 ES5 和装饰器语法，兼容性较好。
- **MobX 5**：完全基于 ES6 Proxy，性能更优，但不支持 IE11。

---

## 设计哲学

MobX 的设计哲学可以总结为以下几点：

1. **自动更新**：
   - 应用程序的状态应该自动获取，无需手动触发事件或调用分发器。
   - MobX 提供响应式机制，确保状态图表始终保持最新。

2. **高效更新**：
   - 使用虚拟依赖状态图表，只有在需要时才更新视图，避免不必要的渲染。

3. **简单且可扩展**：
   - 对代码侵入性小，易于集成到现有项目中。
   - 支持从小型应用扩展到复杂系统。

---

## 核心概念

### 可观察的状态（@observable）

- **定义**：`@observable` 用于标记一个状态是可观察的，任何对该状态的修改都会触发相关视图的更新。
- **特点**：
  - 自动追踪依赖关系。
  - 修改后会通知所有依赖该状态的观察者。

### 计算值（@computed）

- **定义**：`@computed` 用于定义基于其他可观察状态的派生值。
- **特点**：
  - 延迟计算：只有当被使用时才会重新计算。
  - 缓存结果：如果依赖的状态未改变，则不会重复计算。

### 反应（@observer 和 autorun）

- **@observer**：
  - 将 React 组件包装为观察者组件，使其能够响应状态变化并自动重新渲染。
- **autorun**：
  - 定义自定义的副作用函数，当依赖的状态发生变化时自动执行。

---

## 代码示例

以下是一个完整的 MobX 示例，展示如何使用 `@observable`、`@computed` 和 `@observer`。

### 示例代码

```js
import { observable, computed, observer } from "mobx";
import { observer as observerReact } from "mobx-react";

class TodoList {
    @observable todos = [];

    @computed get unfinishedTodoCount() {
        return this.todos.filter(todo => !todo.finished).length;
    }
}

const todoList = new TodoList();

// 观察者组件
@observer
class TodoListView extends Component {
    render() {
        return (
            <div>
                <ul>
                    {this.props.todoList.todos.map(todo => (
                        <TodoView todo={todo} key={todo.id} />
                    ))}
                </ul>
                Tasks left: {this.props.todoList.unfinishedTodoCount} {/* @1 */}
            </div>
        );
    }
}

// 单项组件
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

// 添加一些初始数据
todoList.todos.push(
    { id: 1, title: "Learn MobX", finished: false },
    { id: 2, title: "Build an App", finished: false }
);

export default function App() {
    return <TodoListView todoList={todoList} />;
}
```

### 运行逻辑

1. **点击单项**：
   - 当用户点击某个待办事项的复选框时，`TodoView` 会强制重新渲染。
   - 如果 `unfinishedTodoCount` 发生变化，`TodoListView` 也会重新渲染。

2. **删除注释代码**：
   - 如果删除 `Tasks left: {this.props.todoList.unfinishedTodoCount}` 这一行代码，`TodoListView` 不会重新渲染，因为没有依赖 `unfinishedTodoCount`。

---

## 自定义反应：`autorun`

`autorun` 是一种强大的工具，用于定义自定义的副作用函数。以下是一个简单的例子：

```js
import { observable, autorun } from "mobx";

class Store {
    @observable count = 0;
}

const store = new Store();

// 自动运行副作用
autorun(() => {
    console.log(`当前计数：${store.count}`);
});

// 修改状态
store.count++; // 输出：当前计数：1
store.count++; // 输出：当前计数：2
```

### 特点

- **自动追踪依赖**：`autorun` 会自动追踪其内部使用的可观察状态。
- **即时响应**：每当依赖的状态发生变化时，`autorun` 会立即执行。
