---
title: "redux实现"
date: 2019-11-25
---

# Redux 核心实现与中间件机制

以下是 Redux 的核心实现以及中间件机制的代码整理，包含应用层、Reducer、`createStore` 和 `applyMiddleware` 的详细说明。

---

## 1. 应用层代码

在应用层，我们通过 `applyMiddleware` 增强 `createStore`，并创建一个 Store 实例。然后使用 `subscribe` 监听状态变化，并通过 `dispatch` 触发状态更新。

```javascript
// 应用层
const store = applyMiddleware(logger, xxx)(createStore)(reducer1, { title: '12313' });

store.subscribe(() => {
  let state = store.getState();
  console.log('当前状态:', state);
});

store.dispatch({
  type: 'CHANGE_TITLE',
  data: {
    title: '123123'
  }
});
```

---

## 2. Reducer 定义

Reducer 是一个纯函数，用于根据当前状态和 Action 计算新的状态。

```javascript
// Reducer
function reducer1(state, action) {
  switch (action.type) {
    case 'CHANGE_TITLE':
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}
```

---

## 3. `createStore` 核心实现

`createStore` 是 Redux 的核心方法，负责创建 Store 并提供 `getState`、`subscribe` 和 `dispatch` 方法。

```javascript
// Redux 核心 createStore 实现
function createStore(reducer, initState) {
  let store = new Regular();
  let state = initState;

  // 获取当前状态
  store.getState = () => state;

  // 订阅状态变化
  store.subscribe = (listener) => store.$on('change', listener);

  // 分发 Action
  store.dispatch = function (action) {
    state = reducer(state, action); // 调用 Reducer 更新状态
    store.$emit('change'); // 通知订阅者状态已更新
    return action; // 支持链式调用
  };

  return store;
}
```

---

## 4. 中间件机制：`applyMiddleware`

`applyMiddleware` 是 Redux 的中间件增强器，用于扩展 `dispatch` 方法的功能。

```javascript
// applyMiddleware 实现
function applyMiddleware(middlewares) {
  return function (createStore) {
    return function (reducer, initState) {
      // 创建原始 Store
      let store = createStore(reducer, initState);

      // 使用 reduceRight 将多个中间件组合成一个新的 dispatch
      let dispatch = middlewares.reduceRight(
        (nextDispatch, middleware) => middleware(nextDispatch),
        store.dispatch
      );

      // 返回增强后的 Store
      return Object.assign({}, store, { dispatch });
    };
  };
}
```

---

## 5. 中间件示例：Logger

中间件是 Redux 的扩展点，允许我们在 `dispatch` 执行前后插入自定义逻辑。以下是一个简单的 Logger 中间件示例：

```javascript
// Logger 中间件
function logger(next) {
  return function (action) {
    console.log('Action 开始:', action);
    const result = next(action); // 调用下一个中间件或原始 dispatch
    console.log('Action 结束:', result);
    return result;
  };
}
```

---

## 6. 工作流程总结

### 1. 创建 Store
- 使用 `createStore` 创建 Store，传入 Reducer 和初始状态。
- Store 提供了 `getState`、`subscribe` 和 `dispatch` 方法。

### 2. 增强 Store
- 使用 `applyMiddleware` 对 `createStore` 进行增强，添加中间件支持。
- 中间件通过 `reduceRight` 组合，形成一个新的 `dispatch` 方法。

### 3. 状态更新流程
1. 调用 `store.dispatch(action)`。
2. 中间件依次执行，处理 Action。
3. 最终调用 Reducer 更新状态。
4. 触发订阅者的回调函数（如 `store.subscribe`）。

---

## 7. 关键点补充

### 1. 中间件的作用
中间件可以：
- 在 `dispatch` 前后插入日志记录、错误捕获等逻辑。
- 支持异步操作（如 Redux Thunk 或 Redux Saga）。

### 2. `reduceRight` 的作用
- `reduceRight` 从右到左依次组合中间件，确保中间件的执行顺序是从外到内。

### 3. `Object.assign` 的替代写法
在现代 JavaScript 中，可以使用对象展开运算符替代 `Object.assign`：

```javascript
return {
  ...store,
  dispatch
};
```

---

## 8. 总结

以上代码展示了 Redux 的核心实现和中间件机制，包括：
1. **`createStore`**：管理状态的核心方法。
2. **`applyMiddleware`**：通过中间件增强 `dispatch` 功能。
3. **Reducer**：纯函数，用于计算新状态。
4. **中间件**：扩展 `dispatch`，支持日志记录、异步操作等功能。

通过这些机制，Redux 提供了一个可预测的状态管理解决方案，适用于复杂的应用场景。