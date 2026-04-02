---
title: "MCP Remote Mode vs. Local Mode"
date: 2026-01-14
tags:
  - MCP
---

What is the difference between configuring an MCP server with a `url` versus a command/package?

```json
{
  "mcpServers": {
    "guan": {
      "url": "https://guan-open.alibaba-inc.com/session/4347ef0c79ab595e9284f79cf3777558/sse"
    },
    "Figma": {
      "url": "https://mcp.figma.com/mcp"
    },
    "weavefox": {
      "command": "weavefox",
      "args": [
        "server"
      ],
      "disabled": false,
      "autoApprove": []
    },
    "ftraffic-code": {
      "url": "https://mcp.alibaba-inc.com/ftraffic-code/mcp",
      "headers": {}
    },
    "browsermcp": {
      "command": "npx",
      "args": [
        "@browsermcp/mcp@latest"
      ]
    }
  }
}
```

In short: **`url` is Remote Mode (SSE), and `command` is Local Mode (Stdio).**

Here is a detailed breakdown of the differences:

---

### 1. `url` Mode (SSE Transport)
This configuration is used to connect to a **Web Server** that is already running.

*   **How it works:** The client (such as Claude Desktop or a browser plugin) acts as an HTTP client and connects to the specified URL using the **SSE (Server-Sent Events)** protocol.
*   **Examples like `guan` or `Figma`:**
    *   These are HTTP services already deployed in the cloud or on a corporate internal network.
    *   The server-side code is already running on a remote host.
*   **Pros:**
    *   **No local environment needed:** Your computer does not need Node.js, Python, or any specific dependency packages installed.
    *   **Cross-platform:** It works on Windows, Mac, or even within a browser, as long as there is internet connectivity.
    *   **Centralized management:** A company can maintain a single server, and all employees can simply configure the same URL to use it.
*   **Cons:** It cannot directly access your local file system (unless the server happens to be running on your `localhost`).

---

### 2. `command` / `args` Mode (Stdio Transport)
This configuration is used to launch a **Local Process**.

*   **How it works:** The client spawns a **subprocess** directly on your machine and exchanges data via standard input/output (**stdio/stdin/stdout**).
*   **Examples like `browsermcp` or `weavefox`:**
    *   `command: "npx"` means the client will automatically execute `npx @browsermcp/mcp@latest`.
    *   This downloads (if necessary) and starts the tool locally on your machine.
*   **Pros:**
    *   **Local Permissions:** The process inherits your local privileges, allowing it to read/write files, control your local browser, or access local databases.
    *   **On-demand Startup:** The process is only started when you open the AI client and is automatically terminated when the client is closed.
*   **Cons:**
    *   **Environment Dependencies:** Your computer must have the required runtime installed (e.g., Node.js or Python).
    *   **Resource Consumption:** Each server runs as an independent local process, consuming local CPU and memory.

---

### 3. Key Differences Comparison Table

| Feature | `url` (SSE) | `command` (Stdio) |
| :--- | :--- | :--- |
| **Connection Target** | Remote Web Service / Already running service | Local executable / Script |
| **Startup Method** | Client only connects; does not start the service | Client is responsible for starting/killing the process |
| **Protocol** | HTTP / SSE | Stdin / Stdout (Pipes) |
| **Local Dependencies** | None (Internet access only) | Requires corresponding Runtimes (Node/Py) |
| **Typical Use Cases** | SaaS services (Figma), Internal Corporate APIs | File operations, local scripts, DB management |
| **Security** | Data transmitted over network (requires HTTPS) | Data transmitted locally between processes |
