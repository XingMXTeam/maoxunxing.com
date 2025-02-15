---
title: "Decode Url Safe"
date: 2021-12-10T10:12:21+08:00
tags:
  - JavaScript
  - 错误处理
  - 编码
---

# `decodeURIComponent` 可能抛出错误的解决方案

在 JavaScript 中，`decodeURIComponent` 是一个用于解码 URI 组件的函数。然而，如果传入的字符串包含无效的编码字符（例如未正确闭合的百分号 `%`），它会抛出 `URIError` 异常。

---

## 问题描述

### 示例代码
```js
decodeURIComponent("%C4%97%");

// VM158:1 Uncaught URIError: URI malformed
//     at decodeURIComponent (<anonymous>)
//    at <anonymous>:1:1
```

### 问题分析
- **原因**：
  - `%C4%97%` 是一个无效的 URI 编码字符串，因为最后一个 `%` 没有跟随有效的两位十六进制字符。
  - 当 `decodeURIComponent` 遇到这种格式错误时，会抛出 `URIError: URI malformed` 异常。

- **影响**：
  - 如果未捕获该异常，程序可能会中断执行，导致不可预期的行为。

---

## 解决方案

为了避免程序因异常而崩溃，可以使用 `try...catch` 块捕获 `URIError` 并进行处理。

### 示例代码
```ts
try {
  decodeURIComponent('%C4%97%');
} catch (error) {
  if (error instanceof URIError) {
    console.error('Invalid URI component:', error.message);
    // 在这里可以提供默认值或执行其他逻辑
  } else {
    throw error; // 如果是其他类型的错误，重新抛出
  }
}
```

---

## 补充说明

### 1. 捕获特定错误类型
- 使用 `instanceof URIError` 确保只捕获与 URI 解码相关的错误，避免掩盖其他潜在问题。

### 2. 提供默认值
- 如果需要在解码失败时返回一个默认值，可以在 `catch` 块中实现：
  ```ts
  function safeDecodeURIComponent(uri: string, defaultValue: string = ''): string {
    try {
      return decodeURIComponent(uri);
    } catch (error) {
      if (error instanceof URIError) {
        console.warn(`Failed to decode URI component: ${uri}`);
        return defaultValue;
      }
      throw error; // 重新抛出非 URIError 的错误
    }
  }

  // 示例调用
  const decoded = safeDecodeURIComponent('%C4%97%', 'default-value');
  console.log(decoded); // 输出: default-value
  ```

### 3. 验证输入的有效性
- 在调用 `decodeURIComponent` 之前，可以通过正则表达式验证输入是否为有效的 URI 编码字符串：
  ```ts
  function isValidURIComponent(uri: string): boolean {
    try {
      decodeURIComponent(uri);
      return true;
    } catch {
      return false;
    }
  }

  // 示例调用
  console.log(isValidURIComponent('%C4%97%')); // 输出: false
  console.log(isValidURIComponent('%C4%97'));  // 输出: true
  ```

---

## 总结

通过使用 `try...catch` 块捕获 `URIError`，可以有效避免因无效 URI 编码导致的程序崩溃。此外，结合默认值处理和输入验证，可以进一步提升代码的健壮性和用户体验。

