---
title: "JavaScript 技术知识点整理"
description: "sort vs toSorted vs localCompare"
date: 2024-09-08
tags:
  - JS
images:
  - javascript-1/a.webp
---

## 目录

1. [数组遍历](#数组遍历)
2. [位运算符](#位运算符)
3. [异常处理](#异常处理)
4. [Promise](#promise)
5. [Symbol](#symbol)
6. [深浅拷贝](#深浅拷贝)
7. [Lodash 工具库](#lodash-工具库)
8. [解构赋值](#解构赋值)
9. [Spread 语法](#spread-语法)
10. [特殊属性](#特殊属性)
11. [Set 转数组](#set-转数组)

---

## 数组遍历

### `for...of` 遍历数组
```javascript
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item); // 输出 1, 2, 3
}
```

### `forEach` 方法
`forEach` 方法可以传递第二个参数作为 `this`：
```javascript
const obj = { multiplier: 2 };
[1, 2, 3].forEach(function (item) {
  console.log(item * this.multiplier);
}, obj); // 输出 2, 4, 6
```

### 兼容性处理
`Object.values(undefined)` 会报错，需兼容处理：
```javascript
const safeValues = (obj) => (obj ? Object.values(obj) : []);
console.log(safeValues(undefined)); // 输出 []
```

---

## 位运算符

### 常见用法
```javascript
// 取整
const a = ~~12.12; // 12

// 左移位
12 << 1; // 24

// 右移位
12 >> 1; // 6
```

### 应用场景
1. **判断奇偶**:
   ```javascript
   const isOdd = (num) => num & 1;
   console.log(isOdd(3)); // true
   console.log(isOdd(4)); // false
   ```

2. **除以 2**:
   ```javascript
   const divideByTwo = (num) => num >> 1;
   console.log(divideByTwo(10)); // 5
   ```

3. **赋值与校验**:
   - 使用 `|` 进行按位或赋值。
   - 使用 `&` 校验特定标志位。

---

## 异常处理

### 减少缩进的封装
通过封装 `try...catch` 减少代码嵌套：
```javascript
const tryAndCatch = async (fn) => {
  try {
    return [null, await fn()];
  } catch (e) {
    return [e, null];
  }
};

// 使用示例
(async () => {
  const [err, result] = await tryAndCatch(async () => {
    throw new Error("Test error");
  });
  if (err) console.error(err.message); // 输出 "Test error"
})();
```

---

## Promise

### 控制权反转（IoC）
Promise 实现控制权反转的典型场景是弹窗组件：
```javascript
// 弹窗只负责 UI 展示，操作结果返回给调用方
function showModal() {
  return new Promise((resolve) => {
    const close = (result) => resolve(result);
    document.getElementById("confirmBtn").onclick = () => close(true);
    document.getElementById("cancelBtn").onclick = () => close(false);
  });
}

// 调用方处理结果
showModal().then((result) => {
  console.log(result ? "Confirmed" : "Cancelled");
});
```

---

## Symbol

### 全局注册与获取
`Symbol.for` 用于注册或获取全局 Symbol：
```javascript
const sym1 = Symbol.for("key");
const sym2 = Symbol.for("key");
console.log(sym1 === sym2); // true
```

### 序列化问题
`Symbol` 在序列化时会丢失，可以通过自定义 `JSON.stringify` 的第二个参数解决：
```javascript
const obj = { key: Symbol.for("value") };
const str = JSON.stringify(obj, (key, value) =>
  typeof value === "symbol" ? value.toString() : value
);
console.log(str); // {"key":"Symbol(value)"}
```

---

## 深浅拷贝

### 浅拷贝问题
浅拷贝无法复制对象内部的引用类型：
```javascript
var a = [{ aa: 123 }];
var b = [...a];
b.forEach((i) => {
  i.xx = 123;
});
console.log(a); // a 被影响了
```

### 深拷贝解决方案
使用递归或第三方库（如 Lodash）实现深拷贝：
```javascript
const _ = require("lodash");
var a = [{ aa: 123 }];
var b = _.cloneDeep(a);
b[0].xx = 123;
console.log(a); // a 不受影响
```

---

## Lodash 工具库

### `chunk` 方法
将数组分片：
```javascript
const _ = require("lodash");
const arr = [1, 2, 3, 4, 5];
console.log(_.chunk(arr, 2)); // [[1, 2], [3, 4], [5]]
```

### `Promise.allSettled`
处理多个异步任务，无论成功或失败都会返回结果：
```javascript
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("Error"),
]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'Error' }
  // ]
});
```

---

## 解构赋值

### 默认值问题
以下写法存在问题：当 `b` 存在 `a`，但 `a` 为空时，不会赋予默认值：
```javascript
const b = { a: null };
const { a = {} } = b;
console.log(a); // null
```

---

## Spread 语法

### 数组与对象的区别
```javascript
[...undefined]; // 报错
{ ...undefined }; // 正常
```

---

## 特殊属性

### `window.name`
`window.name` 是特殊属性，赋值时会自动转换为字符串：
```javascript
var name1 = ["3", "32"];
window.name = ["3", "32"];
console.log(window.name); // "3,32"
```

---

## Set 转数组

### Spread 写法
直接将 `Set` 转换为数组：
```javascript
var a = new Set();
a.add(2);
var aArr = [...a]; // [2]
```
