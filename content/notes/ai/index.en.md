---
title: "First Attempt at MCP Server"
date: 2025-03-31
description: “”
tags:
  - AI
  - MCP
---

## MCP History

MCP evolved from Function Call. Function Call is not a standardized protocol, and implementations vary widely. MCP unifies the protocol, decoupling tools from large models, and represents a further standardization of CodeAct. MCP is designed based on a client-server architecture, acting as an intermediary layer to bridge the gap between prompts and tool invocations.

MCP Features:
- Automated decision-making via large models
- Standardized interfaces
- Tool modularization

A2A: Agent2Agent was proposed by Google. The Google Agent Development Kit (ADK) is a multi-agent suite.

## MCP Server Implementation Notes

### 1. Basic Setup

```javascript
const server = new McpServer({
    name: “ping-pong”,
    version: “1.0.0”,
    capabilities: {
        resources: {
            subscribe: true,
            listChanged: true
        }
    }
});
```

### 2. Resource Implementation

```javascript
server.resource(
    “echo”,                          // Resource name
    new ResourceTemplate(
        “echo://{message}”,          // URI template
        {
            list: () => ({           // List callback
                resources: [{        // Must return an array of resources
                    uri: “echo://hello”,
                    name: “Echo Resource”,           // Required
                    description: “...”,              // Required
                    mimeType: “text/plain”          // Required
                }]
            })
        }
    ),
    async (uri, { message }) => ({   // Read callback
        contents: [{
            uri: uri.href,
            mimeType: “text/plain”,
            text: `Resource echo: ${message}`
        }]
    })
);
```

### 3. Common errors and solutions

1. `template.resourceTemplate.listCallback is not a function`
   - Cause: ResourceTemplate parameter structure error
   - Solution: Ensure that the list callback function is passed correctly

2. `result.resources is not iterable`
   - Cause: Incorrect format of list callback return
   - Solution: Ensure that the return format is `{ resources: [...] }`

3. `Resource not found`
   - Cause: URI mismatch
   - Solution: Ensure that the URI in the list matches the template format

4. `Required field missing`
   - Cause: Required metadata fields are missing
   - Solution: Ensure that all required fields (name, description, mimeType) are included

## 4. Debugging Tools

- MCP Inspector (v0.7.0) can be used for:
  - Viewing the list of available resources
  - Testing resource reading functionality
  - Verifying resource template configuration