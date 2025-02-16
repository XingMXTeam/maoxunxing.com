---
title: "容易搞混的比较函数"
description: "sort vs toSorted vs localCompare"
date: 2024-09-08
tags:
  - JS
images:
  - javascript-1/a.webp
---
在 JavaScript 中，数组和字符串的排序是常见的操作。以下是几种常用的排序方法及其特点。

## **1. `sort` 方法**

### 特点
- **会改变原数组**。
- 默认按照字符串的 Unicode 编码进行排序（升序）。
- 如果需要自定义排序规则，可以传入一个比较函数。

### 示例代码
```js
var a = [1, 4, 2, 3];
a.sort();
console.log(a); // 输出: [1, 2, 3, 4]
```

### 注意事项
- 对于数字数组，默认的 `sort` 方法可能会导致意外结果，因为它会将数字转换为字符串后按字典顺序排序。例如：
  ```js
  var nums = [10, 2, 30, 5];
  nums.sort();
  console.log(nums); // 输出: [10, 2, 30, 5] （错误结果）
  ```
- 解决方法：使用比较函数。
  ```js
  nums.sort((a, b) => a - b);
  console.log(nums); // 输出: [2, 5, 10, 30]
  ```

---

## **2. `toSorted` 方法**

### 特点
- **不会改变原数组**，返回一个新的排序后的数组。
- 这是 ES2023 引入的新方法，适用于需要保留原始数组的场景。

### 示例代码
```js
var a = [1, 4, 2, 3];
var sortedArray = a.toSorted();
console.log(sortedArray); // 输出: [1, 2, 3, 4]
console.log(a); // 输出: [1, 4, 2, 3] （原数组未改变）
```

### 注意事项
- 如果需要兼容旧版浏览器，请注意 `toSorted` 可能不被支持，需使用其他方法代替。

---

## **3. `localeCompare` 方法**

### 特点
- 主要用于**字符串比较**，支持本地化排序规则。
- 返回值：
  - `-1`：表示第一个字符串小于第二个字符串。
  - `0`：表示两个字符串相等。
  - `1`：表示第一个字符串大于第二个字符串。
- 支持通过选项参数（如 `sensitivity`）调整比较行为。

### 示例代码
```js
const a = 'réservé'; // 带重音符号的小写
const b = 'RESERVE'; // 不带重音符号的大写

// 默认比较（区分大小写和重音）
console.log(a.localeCompare(b)); 
// 输出: -1

// 忽略大小写和重音（仅基于基础字符）
console.log(a.localeCompare(b, 'en', { sensitivity: 'base' })); 
// 输出: 0

// 比较数字字符串
console.log('1'.localeCompare('1')); // 输出: 0
console.log('10'.localeCompare('2')); // 输出: 1 （字典顺序）
```

### 参数说明
- **`locales`**：指定语言环境（如 `'en'` 表示英语，`'zh'` 表示中文）。
- **`options`**：配置对象，常用选项包括：
  - `sensitivity`：控制比较的敏感度（`'base'`、`'accent'`、`'case'`、`'variant'`）。
  - `numeric`：是否启用数字排序（`true` 表示按数值大小排序）。

### 示例：数字字符串的正确排序
默认情况下，`localeCompare` 按字典顺序排序，可能导致数字字符串排序错误。可以通过 `numeric: true` 解决：
```js
console.log('10'.localeCompare('2', undefined, { numeric: true })); 
// 输出: 1 （按数值大小排序）
```

---

## **总结**

| 方法          | 是否改变原数组 | 适用场景                     | 注意事项                                   |
|---------------|----------------|------------------------------|------------------------------------------|
| `sort`        | 是             | 需要直接对数组进行排序       | 默认按字典顺序排序，数字需使用比较函数。 |
| `toSorted`    | 否             | 需要保留原数组并生成新数组   | ES2023 新特性，可能不支持旧版浏览器。    |
| `localeCompare` | 否           | 字符串的本地化比较           | 支持多种语言环境和自定义选项。           |

通过以上方法，可以根据具体需求选择合适的排序方式，确保代码的正确性和可维护性。