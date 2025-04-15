---
title: "MCP Server 初尝试"
date: 2025-03-31
description: ""
draft: true
tags:
  - AI
---


# MCP servers 实现笔记

## 1. 基础设置

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

- 需要初始化 McpServer 并指定名称和版本
- 通过 capabilities 声明服务器支持的功能
- 使用 StdioServerTransport 处理标准输入输出通信

## 2. 资源(Resources)实现要点

### 正确的资源模板结构
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

### 关键注意点：
1. URI 格式匹配：
   - list 返回的 uri 必须匹配 ResourceTemplate 中定义的模式
   - 例如：如果模板是 "echo://{message}"，则列表中的 URI 也应该使用 "echo://" 开头

2. 必需的元数据字段：
   - name：资源名称
   - description：资源描述
   - mimeType：内容类型
   - uri：资源标识符

3. 返回格式：
   - list 回调必须返回 `{ resources: [...] }` 格式
   - read 回调必须返回 `{ contents: [...] }` 格式

## 3. 常见错误及解决方案

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

## 5. 最佳实践

1. URI 设计：
   - 使用清晰的协议前缀（如 echo://）
   - 合理设计参数部分（如 {message}）

2. 错误处理：
   - 实现适当的错误处理机制
   - 返回清晰的错误信息

3. 资源描述：
   - 提供清晰的资源名称和描述
   - 正确设置 MIME 类型

这些经验总结自我们刚才解决问题的过程，希望对你后续开发 MCP 服务器有所帮助！
