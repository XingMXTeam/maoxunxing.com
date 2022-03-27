---
title: "Nodejs Debug"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS
---

1 如何调试  

第一步：启动inspector

``` shell
nodemon --inspect-brk xx.js
```

运行结果：

``` shell
[nodemon] starting `node --inspect-brk /Users/maoxunxing/alibaba/vite-comp/bin/index.js`
Debugger listening on ws://127.0.0.1:9229/b789951b-b593-482e-a365-575f547e3fc3
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
```

第二步： chrome开启监听client

``` shell
chrome://inspect/#devices
```

配置127.0.0.1:9229，然后点击inspect

2 更多进阶  

https://nodejs.org/en/docs/guides/debugging-getting-started/

