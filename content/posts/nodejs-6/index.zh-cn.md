---
title: "Node.js 案例"
date: 2019-11-25
tags:
  - nodejs
custom_toc:
  - title: "Node.js Debug"
  - title: "Node.js 案例"
  - title: "NodeParty 笔记"
---


## Node.js Debug


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


## **2. 更多进阶内容**

参考官方文档以了解更多调试技巧和配置方法：

- [Node.js 官方调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/)

---

## Node.js 案例


```text
<ref *1> Error: connect ECONNREFUSED 127.0.0.1:7001 at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1247:16) { errno: -61, code: 'ECONNREFUSED', syscall: 'connect', address: '127.0.0.1',
```

这个报错是本地起node服务报的。不是因为端口被占用了，而是因为node版本不对，用的14可以。

webstorm指定node版本：

{{< img src="image.png" alt="WebStorm Node Version" caption="WebStorm Node Version" maxWidth="450px" align="center" >}}


vscode: launch.json

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/node.js"
        }
    ]
}
```

---

## NodeParty 笔记

## **1. 测试与工具**

### **Fixtures**

- **定义**：Fixtures 是连调数据，用于测试环境中的数据准备和模拟。

### **Marmot**

- **用途**：CI/CD 工具链。
- **特点**：
  - 提供高效率的开发流程。
  - 支持 Node BFF（Backend For Frontend）服务，提升前端开发效率。

### **JSON Schema Protocol**

- **定义**：一种用于描述 JSON 数据结构的协议。
- **应用**：常用于 API 的定义和验证。

## **2. 团队与项目**

### **徐达峰 (Xudafeng)**

- **贡献**：
  - 开源项目贡献者，推动前端技术发展。
  - 相关项目如 `apfe-ci` 和 `amur graphql`。

### **Ant Design**

- **定位**：面向 B 端的 UI 组件库。
- **特点**：
  - 高复用性：提供完备的工具链和 JS-SDK。
  - 场景丰富：支持复杂的业务场景。


## **3. 前端复杂性与解决方案**

### **前端复杂性的体现**

- 主要体现在多样的业务场景。
- 解决方案：
  - 使用高复用的工具链（如 `apfe-ci`）。
  - 引入 Node BFF 服务，减少前后端耦合。

### **跨端开发**

- **挑战**：
  - 更新大对象时可能引发性能问题。
  - 不同端之间的兼容性。
- **解决方案**：
  - 使用虚拟 DOM（如 `vm-vdom-page-view`）进行优化。
  - 在 DOM 中添加标记以区分不同状态。

## **4. 权限与安全**

### **权限管理**

- **两种类型**：
  1. **API 级别权限**：控制接口访问。
  2. **字段级别权限**：精细化控制数据字段的访问。
- **实现方式**：
  - 使用 Session 或 Token 进行身份验证。
  - 通常针对 SPA（单页应用）进行权限管理。

## **5. 实时监控与动画**

### **Chameleon**

- **功能**：实时监控系统，帮助快速发现和解决问题。

### **动画引擎**

- **作用**：通过互动创新提升用户体验。
- **应用场景**：复杂交互场景下的动画效果。

## **6. 技术框架与协议**

### **Service Mesh**

- **定义**：一种微服务架构模式，用于服务间通信。
- **相关技术**：`sofa-rpc-node`。

### **Amur GraphQL**

- **特点**：
  - 提供灵活的 API 定义方式。
  - 支持复杂的数据查询和操作。

### **Scheme API 定义**

- **背景**：可以生成多个嵌套请求。
- **优势**：提高接口的灵活性和复用性。

## **7. 性能优化**

### **QPS（Queries Per Second）**

- **定义**：每秒查询率，衡量系统性能的重要指标。
- **优化方向**：
  - 减少不必要的请求。
  - 使用缓存机制。

### **TWA（Trusted Web Activity）**

- **用途**：在 Android 平台上实现更流畅的 Web 应用体验。
- **优势**：提升跨端开发的性能和一致性。


## **8. 其他技术点**

### **每个国家的支付宝 App**

- **特点**：
  - 根据各国需求定制化开发。
  - 支持本地化支付和金融服务。

### **SDK 文档与开发**

- **程序员关注点**：
  - 清晰的文档说明。
  - 易用的开发工具。

### **团队工具积累**

- **实践**：基于业务需求逐步积累和完善工具链。

