---
title: "MCP Server 初尝试"
date: 2025-03-31
description: ""
tags:
  - AI
  - MCP
---

## MCP 历史

MCP 是从Function Call发展而来。Function Call 不是标准协议，大家实现不一致。 而MCP 统一了协议，解耦了工具和大模型，是CodeAct更近一步的标准。MCP 的设计是基于C/S架构，作为中间层抹平了prompt和工具的调用。

MCP特点：
- 通过大模型自动化决策
- 标准化接口
- 工具模块化

A2A： agent2agent是谷歌提出的。Google Agent Development Kit (ADK) 是一个多agent的套件。

## MCP servers 实现笔记

### 1. 基础设置

```javascript
const server = new McpServer({
    name: "ping-pong",
    version: "1.0.0",
    capabilities: {
        resources: {
            subscribe: true,
            listChanged: true
        }
    }
});
```

### 2. 资源(Resources)实现

```javascript
server.resource(
    "echo",                          // 资源名称
    new ResourceTemplate(
        "echo://{message}",          // URI 模板
        {
            list: () => ({           // 列表回调
                resources: [{        // 必须返回 resources 数组
                    uri: "echo://hello",
                    name: "Echo Resource",           // 必填
                    description: "...",              // 必填
                    mimeType: "text/plain"          // 必填
                }]
            })
        }
    ),
    async (uri, { message }) => ({   // 读取回调
        contents: [{
            uri: uri.href,
            mimeType: "text/plain",
            text: `Resource echo: ${message}`
        }]
    })
);
```

### 3. 常见错误及解决方案

1. `template.resourceTemplate.listCallback is not a function`
   - 原因：ResourceTemplate 参数结构错误
   - 解决：确保正确传递 list 回调函数

2. `result.resources is not iterable`
   - 原因：list 回调返回格式错误
   - 解决：确保返回 `{ resources: [...] }` 格式

3. `Resource not found`
   - 原因：URI 不匹配
   - 解决：确保 list 中的 URI 与模板格式一致

4. `Required field missing`
   - 原因：缺少必需的元数据字段
   - 解决：确保包含所有必需字段（name, description, mimeType）

## 4. 调试工具

- MCP Inspector (v0.7.0) 可用于：
  - 查看可用资源列表
  - 测试资源读取功能
  - 验证资源模板配置
