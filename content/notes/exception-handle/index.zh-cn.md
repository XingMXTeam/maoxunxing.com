---
title: "前端异常处理"
date: 2021-08-24
tags:
  - JavaScript
description: ""
images:
  - exception-handle/eception-handle.png
---

在 JavaScript 中，异常处理是确保程序稳定性和健壮性的重要手段。以下是两种常见的异常处理方式及其适用场景。

## 1. 异常隔离

### 基本语法

```javascript
try {
  // 可能抛出异常的代码
} catch (error) {
  // 捕获并处理异常
}
```

### 主要场景

- **虚拟机（VM）或动态执行的 JS 代码**：
  - 当需要执行动态生成的代码时，使用 `try {} catch {}` 可以捕获运行时错误。
  - 示例：
    ```javascript
    try {
      eval("someInvalidCode()"); // 动态执行可能出错的代码
    } catch (error) {
      console.error("捕获到异常:", error.message);
    }
    ```

### 特点

- **同步代码**：`try {} catch {}` 只能捕获同步代码中的异常。
- **局限性**：无法捕获异步代码（如 `Promise` 或 `setTimeout`）中的异常。

---

## 2. Promise 异常处理：`.then().catch()`

### 基本语法

```javascript
promise
  .then((result) => {
    // 成功处理逻辑
  })
  .catch((error) => {
    // 捕获并处理异常
  });
```

### 主要场景

- **处理异步代码中的异常**：
  - `try {} catch {}` 无法捕获异步代码中的异常，而 `.catch()` 是专门用于处理 `Promise` 链中异常的方式。
  - 示例：
    ```javascript
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("异步操作失败"));
      }, 1000);
    })
      .then((result) => {
        console.log("成功:", result);
      })
      .catch((error) => {
        console.error("捕获到异常:", error.message);
      });
    ```

### 特点

- **异步代码支持**：可以捕获 `Promise` 链中的异常。
- **链式调用**：通过 `.catch()` 统一处理异常，避免重复的错误处理逻辑。
- **与 `async/await` 结合**：
  - 在 `async` 函数中，可以通过 `try {} catch {}` 捕获 `await` 表达式中的异常。
  - 示例：
    ```javascript
    async function fetchData() {
      try {
        const result = await someAsyncFunction();
        console.log("成功:", result);
      } catch (error) {
        console.error("捕获到异常:", error.message);
      }
    }
    ```