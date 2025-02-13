---
title: "NodeJS #0期：Nodejs Debug"
date: 2021-10-19T14:28:57+08:00
tags:
  - NodeJS
---

# 调试 Node.js 程序

---

## **1. 调试步骤**

### **第一步：启动 Inspector**

使用 `nodemon` 启动调试模式：

```shell
nodemon --inspect-brk xx.js
```

运行结果示例：

```shell
[nodemon] starting `node --inspect-brk /Users/maoxunxing/alibaba/vite-comp/bin/index.js`
Debugger listening on ws://127.0.0.1:9229/b789951b-b593-482e-a365-575f547e3fc3
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
```

### **第二步：在 Chrome 中开启监听**

1. 打开 Chrome 浏览器并访问以下地址：
   ```shell
   chrome://inspect/#devices
   ```
2. 配置调试地址为 `127.0.0.1:9229`。
3. 点击 **Inspect** 按钮，进入调试界面。

---

## **2. 更多进阶内容**

参考官方文档以了解更多调试技巧和配置方法：

- [Node.js 官方调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)
```