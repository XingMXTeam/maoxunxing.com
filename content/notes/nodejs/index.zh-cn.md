---
title: "Error: connect ECONNREFUSED"
date: 2025-03-03
tags:
  - nodejs
---

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