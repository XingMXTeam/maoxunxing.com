---
title: "Lodash 的 Template 方法：模板语法详解"
date: 2022-01-24T13:15:59+08:00
---

`lodash` 是一个功能强大的 JavaScript 工具库，其中的 `template` 方法提供了灵活的模板渲染功能。通过模板语法，可以动态生成 HTML 或其他文本内容。本文将详细介绍 `lodash.template` 的用法及其模板语法。

---

## 目录

1. [背景与概述](#背景与概述)
2. [基本用法](#基本用法)
3. [模板语法](#模板语法)
   - [插值（Interpolation）](#插值interpolation)
   - [条件语句（Conditionals）](#条件语句conditionals)
   - [循环语句（Loops）](#循环语句loops)
   - [自定义分隔符](#自定义分隔符)
4. [代码示例](#代码示例)
5. [总结](#总结)

---

## 背景与概述

在前端开发中，动态生成 HTML 或其他文本内容是常见的需求。`lodash.template` 提供了一种简单而强大的方式来实现这一目标。通过模板语法，开发者可以在字符串中嵌入变量、逻辑表达式和循环结构，从而生成动态内容。

---

## 基本用法

`lodash.template` 的基本用法如下：

```javascript
const _ = require('lodash');

// 定义模板字符串
const templateString = 'Hello, <%= name %>!';

// 编译模板
const compiled = _.template(templateString);

// 渲染模板
const result = compiled({ name: 'World' });

console.log(result); // 输出: Hello, World!
```

---

## 模板语法

`lodash.template` 支持多种模板语法，包括插值、条件语句和循环语句。

### 插值（Interpolation）

插值用于将变量插入到模板中，默认使用 `<%= %>` 作为分隔符。

#### 示例
```javascript
const templateString = 'Welcome, <%= user.name %>!';
const compiled = _.template(templateString);
console.log(compiled({ user: { name: 'Alice' } })); // 输出: Welcome, Alice!
```

---

### 条件语句（Conditionals）

条件语句允许在模板中使用逻辑判断，默认使用 `<% if %>` 和 `<% else %>`。

#### 示例
```javascript
const templateString = `
<% if (isAdmin) { %>
  <p>Welcome, Admin!</p>
<% } else { %>
  <p>Welcome, Guest!</p>
<% } %>
`;

const compiled = _.template(templateString);
console.log(compiled({ isAdmin: true })); // 输出: <p>Welcome, Admin!</p>
```

---

### 循环语句（Loops）

循环语句允许在模板中遍历数组或对象，默认使用 `<% _.forEach %>` 或 `<% for %>`。

#### 示例
```javascript
const templateString = `
<ul>
  <% users.forEach(function(user) { %>
    <li><%= user.name %></li>
  <% }); %>
</ul>
`;

const compiled = _.template(templateString);
console.log(compiled({ 
  users: [{ name: 'Alice' }, { name: 'Bob' }] 
}));
// 输出:
// <ul>
//   <li>Alice</li>
//   <li>Bob</li>
// </ul>
```

---

### 自定义分隔符

默认情况下，`lodash.template` 使用 `<% %>` 作为逻辑分隔符，`<%= %>` 作为插值分隔符。如果需要自定义分隔符，可以通过 `_.templateSettings` 配置。

#### 示例
```javascript
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const templateString = 'Hello, {{ name }}!';
const compiled = _.template(templateString);
console.log(compiled({ name: 'World' })); // 输出: Hello, World!
```

---

## 代码示例

以下是一个完整的示例，展示如何结合插值、条件语句和循环语句生成动态内容：

```javascript
const _ = require('lodash');

const templateString = `
<h1>Welcome to our platform!</h1>
<% if (isLoggedIn) { %>
  <p>Hello, <%= user.name %>!</p>
<% } else { %>
  <p>Please log in to continue.</p>
<% } %>

<h2>User List:</h2>
<ul>
  <% users.forEach(function(user) { %>
    <li>{{= user.name }}</li>
  <% }); %>
</ul>
`;

// 自定义分隔符
_.templateSettings.interpolate = /{{=([\s\S]+?)}}/g;

const compiled = _.template(templateString);
const result = compiled({
  isLoggedIn: true,
  user: { name: 'Alice' },
  users: [{ name: 'Alice' }, { name: 'Bob' }]
});

console.log(result);
```

---

## 总结

- **插值**：通过 `<%= %>` 插入变量。
- **条件语句**：通过 `<% if %>` 和 `<% else %>` 实现逻辑判断。
- **循环语句**：通过 `<% _.forEach %>` 或 `<% for %>` 遍历数组或对象。
- **自定义分隔符**：通过 `_.templateSettings` 配置自定义分隔符。

`lodash.template` 提供了灵活且强大的模板渲染功能，适用于各种动态内容生成场景。希望本文能为你理解和使用 `lodash.template` 提供有价值的参考！