---
title: "Vuex 核心概念与工作原理"
date: 2019-11-25
tags:
  - Vue.js
  - JavaScript
  - State Management
  - Frontend Development
---

## 1. 创建 Vuex Store 实例

- **`new Vuex.Store`**：
  - 使用 `new Vuex.Store` 创建一个 Vuex 的 Store 实例。
  - 这个实例承载了以下核心内容：
    - **State**：存储全局状态。
    - **Commit**：用于提交 mutations，同步更新 state。
    - **Dispatch**：用于触发 actions，处理异步逻辑。

---

## 2. Store 的继承与功能实现

- **`Store{}`**：
  - Store 内部继承了以下核心模块：
    - **Mutations**：定义如何修改 state 的方法。
    - **Actions**：定义处理异步逻辑的方法，并通过 `commit` 调用 mutations。
    - **Getters**：类似于计算属性，用于从 state 中派生数据。
  - 调用底层的 `commit` 方法来同步更新 state。

---

## 3. Store 的注入与全局访问

- **传递给入口 Vue 实例**：
  - 将创建的 store 实例传递给 Vue 的根实例（通常在入口文件中完成）。
  - 通过这种方式，所有组件都可以通过 `this.$store` 访问 Vuex 提供的功能：
    - **访问状态**：`this.$store.state.xxx`
    - **提交 mutations**：`this.$store.commit('mutationName', payload)`
    - **触发 actions**：`this.$store.dispatch('actionName', payload)`
    - **获取派生数据**：`this.$store.getters.xxx`

---

### 总结

Vuex 的核心是通过 `new Vuex.Store` 创建一个全局的状态管理实例，并将其实例注入到 Vue 根实例中。这样，所有组件都可以通过 `this.$store` 访问和操作全局状态、提交 mutations、触发 actions 或使用 getters。这种设计使得状态管理更加集中化和可维护。
