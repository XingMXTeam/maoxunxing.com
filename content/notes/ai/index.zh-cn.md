---
title: "MCP 入门实战：Model Context Protocol 是什么？亲手写一个 MCP Server"
date: 2025-03-31
lastmod: 2026-10-23
description: "MCP（Model Context Protocol）入门实战：它解决什么问题、Host/Client/Server 架构与 Tools/Resources/Prompts 三大原语怎么理解，附一个最小可运行的 MCP Server 示例、客户端配置、Inspector 调试与常见报错解决方案。"
tags:
  - AI
  - MCP
faq:
  - q: "MCP 和 Function Calling 有什么区别？"
    a: "Function Calling 是各家模型厂商自己的工具调用格式，实现互不一致，工具绑死在某个应用里。MCP 是开放协议：工具写成独立的 Server，一次实现，任何支持 MCP 的客户端（Claude、Cursor 等）都能接入，工具和模型、应用彻底解耦。"
  - q: "MCP Server 用什么语言写？"
    a: "官方 SDK 有 TypeScript、Python、Java、Kotlin、C#、Go 等版本，社区还有 Rust、PHP 等实现。协议本身基于 JSON-RPC 2.0，理论上任何能处理 JSON 消息的语言都可以实现。"
  - q: "MCP 的传输方式选 stdio 还是 HTTP？"
    a: "本地工具（跑在用户自己机器上、给桌面客户端用）选 stdio，简单且无需处理鉴权；远程服务（部署在服务器上、多人共享）选 Streamable HTTP。早期的 HTTP+SSE 方案已在 2025 年 3 月的规范更新中被 Streamable HTTP 取代。"
slug: "mcp-server-guide"
---

> **一句话结论**：MCP（Model Context Protocol，模型上下文协议）是 Anthropic 在 2024 年 11 月开源的开放协议，用一套标准接口把 AI 应用和外部工具、数据源连接起来——工具写一次，任何支持 MCP 的客户端都能用。本文先讲清架构与三大原语，再动手写一个最小 Server 并接进客户端。

## MCP 是什么

MCP 是从 Function Call 发展而来。Function Call 不是标准协议，大家实现不一致，工具和某个应用、某个模型绑死，换个应用就要重写一遍。而 MCP 统一了协议，解耦了工具和大模型，是离 CodeAct 更近一步的标准。MCP 的设计是基于 C/S 架构，作为中间层抹平了 prompt 和工具的调用。

Anthropic 官方的比喻是：MCP 就像 AI 应用的 USB-C 接口——以前每个工具都要为每个应用单独适配，现在统一成一个插口。

MCP 特点：

- 通过大模型自动化决策（模型自己判断何时调用哪个工具）
- 标准化接口（基于 JSON-RPC 2.0 消息格式）
- 工具模块化（Server 独立开发、独立部署、跨客户端复用）

## 架构：Host、Client、Server

一次 MCP 连接里有三个角色：

- **Host**：用户直接使用的 AI 应用，比如 Claude Desktop、Cursor、各类 Agent 框架。它负责管理连接、把工具清单交给模型、执行模型发起的调用。
- **Client**：Host 内部为每个 Server 维护的一个连接对象，负责协议握手、消息转发。一个 Host 可以同时连多个 Server。
- **Server**：提供能力的独立程序，把自己的工具、资源、提示模板按协议暴露出来。它不知道、也不关心对面是哪个模型。

传输层有两种主流方式：

- **stdio**：Server 作为子进程跑在本地，靠标准输入输出传消息。适合本地工具，零网络配置。
- **Streamable HTTP**：Server 独立部署在远程，靠 HTTP 通信。适合多人共享的服务；它取代了早期规范里的 HTTP+SSE 方案（2025 年 3 月规范更新）。

## 三大原语：Tools、Resources、Prompts

Server 能暴露的东西分三类，区别在于「谁决定用它」：

| 原语 | 是什么 | 谁控制 |
| --- | --- | --- |
| **Tools（工具）** | 可执行的函数，如查数据库、发请求、读写文件 | 模型决定调用 |
| **Resources（资源）** | 只读数据，如文件内容、数据库记录，用 URI 标识 | 应用决定加载 |
| **Prompts（提示模板）** | 预置的提示词模板，用户可一键触发 | 用户决定使用 |

此外协议还定义了 Server 可以反向请求 Client 的能力，如 Sampling（借 Host 的模型生成内容）和 Roots（询问可访问的目录范围）——初学阶段先掌握三大原语即可。

顺带一提 A2A：Agent2Agent 是谷歌提出的 agent 间协作协议，Google Agent Development Kit (ADK) 是一个多 agent 的套件。两者的分工不同：MCP 解决「agent 怎么接工具」，A2A 解决「agent 之间怎么协作」，是互补关系，不是替代关系。

## 动手：一个最小可运行的 MCP Server

下面用官方 TypeScript SDK 写一个只有 ping 工具的 Server（`server.tool` 是当前 SDK 的注册方式；本文后面「实现笔记」里的 `server.resource` 同理）：

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "ping-pong",
  version: "1.0.0",
});

// 注册一个工具：模型可以调用 ping，拿到 pong
server.tool(
  "ping",
  { message: z.string() },
  async ({ message }) => ({
    content: [{ type: "text", text: `pong: ${message}` }],
  })
);

await server.connect(new StdioServerTransport());
```

把它接进客户端（以 Claude Desktop / Cursor 的 `mcpServers` 配置为例）：

```json
{
  "mcpServers": {
    "ping-pong": {
      "command": "node",
      "args": ["/path/to/your/server.js"]
    }
  }
}
```

重启客户端后，模型就能在对话里自己决定调用 `ping` 了——这就是 MCP 的完整闭环：Server 暴露工具，Host 发现工具，模型调用工具。

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

### 2. 资源（Resources）实现

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

## 调试工具

- MCP Inspector 可用于：
  - 查看可用资源列表
  - 测试资源读取功能
  - 验证资源模板配置

启动方式：`npx @modelcontextprotocol/inspector`，它会起一个网页界面，连上你的 Server 后可以逐个手动调用工具、查看请求与响应的原始 JSON——写 Server 时先用 Inspector 验证，再接客户端，能少踩一半的坑。

## 常见问题

### MCP 和 Function Calling 有什么区别？

Function Calling 是各家模型厂商自己的工具调用格式，实现互不一致，工具绑死在某个应用里。MCP 是开放协议：工具写成独立的 Server，一次实现，任何支持 MCP 的客户端（Claude、Cursor 等）都能接入，工具和模型、应用彻底解耦。

### MCP Server 用什么语言写？

官方 SDK 有 TypeScript、Python、Java、Kotlin、C#、Go 等版本，社区还有 Rust、PHP 等实现。协议本身基于 JSON-RPC 2.0，理论上任何能处理 JSON 消息的语言都可以实现。

### MCP 的传输方式选 stdio 还是 HTTP？

本地工具（跑在用户自己机器上、给桌面客户端用）选 stdio，简单且无需处理鉴权；远程服务（部署在服务器上、多人共享）选 Streamable HTTP。早期的 HTTP+SSE 方案已在 2025 年 3 月的规范更新中被 Streamable HTTP 取代。
