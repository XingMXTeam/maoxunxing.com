---
title: "JavaScript #1期：js中容易搞混的比较函数"
description: "sort vs toSorted vs localCompare"
date: 2024-09-08
tags:
  - JavaScript
images:
  - javascript-1/a.webp
---

{{< table_of_contents >}}

## sort

sort方法会改变原数组

```js
var a = [1,4,2,3]
a.sort()
console.log(a)

```

## toSorted

toSorted不会改变原数组

```js
var a = [1,4,2,3]
a.toSorted()
console.log(a)
```

## localCompare

主要对比字符串

```js
const a = 'réservé'; // With accents, lowercase
const b = 'RESERVE'; // No accents, uppercase

console.log(a.localeCompare(b));
// Expected output: -1
console.log(a.localeCompare(b, 'en', { sensitivity: 'base' }));
// Expected output: 0

'1'.localeCompare('1')
// 0
```