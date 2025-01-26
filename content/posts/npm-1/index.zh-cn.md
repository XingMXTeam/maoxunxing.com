---
title: "NPM #1期：pnpm vs npm"
description: "什么是幽灵依赖问题"
date: 2024-09-10
tags:
  - NPM
images:
  - npm-1/npm.webp
---

{{< table_of_contents >}}

## 幽灵依赖

幽灵依赖（Ghost Dependencies）是指项目中使用了未在 package.json 中明确声明的依赖。这通常发生在 npm 和 Yarn 中，因为它们的扁平化依赖结构允许访问未直接声明的包。

举个例子：

1. 假设你的项目直接依赖 express：

```package.json
{
  "dependencies": {
    "express": "4.17.1"
  }
}
```

Express 依赖 body-parser，所以 body-parser 也被安装到 node_modules。
在你的代码中，你可以直接使用 body-parser，尽管没有声明它：

```js
const bodyParser = require('body-parser');
```

1. 这段代码能工作，但 body-parser 是个"幽灵依赖"。

问题在于：

1. 如果未来 express 不再依赖 body-parser，你的代码可能会突然崩溃。
不同的开发者可能安装不同版本的依赖，导致不一致。

pnpm 通过严格的依赖树结构解决了这个问题，只允许访问明确声明的依赖。这提高了项目的可靠性和可维护性，
但也可能需要更多的初始设置工作。

## pnpm 解决的问题

1. 磁盘空间效率：
pnpm 使用硬链接和符号链接来共享包，大大减少了磁盘空间使用。
解决问题：减少了重复安装相同包的存储开销。

2. 安装速度：
pnpm 通常比 npm 更快，特别是在安装大型项目依赖时。
解决问题：加快了项目的初始设置和依赖更新过程。

3. 依赖管理：
pnpm 使用严格的依赖树结构，防止访问未声明的依赖。
解决问题：减少了"幽灵依赖"问题，提高了项目的可靠性。

4. 单一存储：
pnpm 在系统中维护一个集中的包存储，所有项目共享。
解决问题：进一步节省磁盘空间，加快了多个项目的包安装。

5. 并行安装：
pnpm 默认并行安装包，提高了效率。
解决问题：减少了大型项目的依赖安装时间。

6. 更好的锁文件：
pnpm 的锁文件（pnpm-lock.yaml）更简洁，易于版本控制。
解决问题：改善了团队协作和版本一致性

