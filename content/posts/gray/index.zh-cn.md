---
title: "前端工程指南"
date: 2025-02-06
tags:
  - 工程
  - Web开发
custom_toc:
  - title: "工程基础"
  - title: "灰度设计"
  - title: "Lerna 多包管理案例"
  - title: "Babel"
  - title: "疲劳度设计"
  - title: "umi 方案"
  - title: "JSONPath 字段裁剪"
  - title: "免登方案"
  - title: "metaq"
  - title: "rpc"
---

## 工程基础


## 工程目录拆分

### 背景
在一个老的工程中进行页面改版升级时，是否选择新建目录隔离新老页面，还是直接在旧页面上改造？

### 专业技术建议
- **推荐方案**：尽量在旧页面上进行改造，避免多份副本带来的维护性问题。
- **理由**：
  - 新建目录可能导致逻辑分散，增加维护成本。
  - 在旧页面上改造可以复用现有组件和逻辑，减少重复开发。

## 如何从头开始构建一个工程体系

### 初始化项目
1. 使用 GitHub 初始化项目仓库。
2. 使用 Lerna 初始化多包结构：
   ```bash
   npx lerna init
   ```
3. 初始化 TypeScript 配置：
   ```bash
   npx tsc --init
   ```

### 添加缓存支持
```bash
npx lerna add-caching
```

### 创建核心包
创建一个新的包 `app-core`：
```bash
npx create app-core --es-module
```

### 配置 TypeScript
在 `package.json` 中添加以下配置：
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./lib"
  },
  "include": [
    "./src"
  ]
}
```

### 修改构建脚本
在 `package.json` 中添加以下脚本：
```json
"scripts": {
  "tsc": "tsc",
  "test": "node ./__tests__/app-core.test.js",
  "start": "ts-node src/app-core.ts",
  "publish": "lerna run tsc && lerna publish"
}
```

### 运行构建
使用 Lerna 运行构建命令：
```bash
lerna run tsc
```

### 修改发布路径
将 `dist` 改为 `lib`：
```json
"main": "lib/app-core.js",
"module": "lib/app-core.module.js",
"directories": {
  "lib": "lib",
  "test": "__tests__"
},
"files": [
  "lib"
]
```

## 插件化构建工具（build-scripts）

### 核心概念
`build-scripts` 是一个基于 Webpack 的插件化工程构建工具，支持快速搭建一套开箱即用的工程方案。

> 一次性启动，会启动三个服务

### 示例插件
以下是一个忽略 `moment` 本地化的插件示例：
```js
const webpack = require('webpack');

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
  });
};
```

## 资源管理

### 静态资源发布
静态资源可以发布到以下位置：
- assets/tnpm/Faas/webapp/小程序/weex

### 本地构建与云端构建
- **本地构建**：使用代码仓库的目录。
- **云端构建**：动态构建并发布。

### WebApp 构建
WebApp 包括 HTML 文件，`assets` 会动态同步到 CDN。

## 稳定性保障

### 流控与降级
- **流控**：限制流量以保护系统。
- **降级**：在高负载情况下关闭部分非核心功能。

### 过载保护
通过限流和降级策略，确保系统在高并发场景下的稳定性。

## Lerna 多包管理

### Link 包
在多包项目中，可以通过以下命令链接包：
```bash
lerna add @hospital-sdk/doctor --scope=integration
```

## 总论：构建时与运行时

### 构建时
构建时的核心是 `build-scripts`，它通过 `Context` 对象管理插件的运行。构建时的主要任务包括：
- **生成产物**：如 JS/CSS 文件 (分端构建)。
- **启动服务**：如本地开发服务器。
- **插件机制**：插件可以动态更新配置项或执行 IO 操作。

> 内部有Context对象管理插件的运行，会依次运行注册的插件。其中WebpackService是Context的一个实例。

#### 插件加载
`build.json` 中配置的插件名会被 Node 加载：

> node可以根据（插件名+默认目录）加载这些插件，加载后会获得fn构造函数

```js
const pluginPath = require.resolve('webpack', { paths: [this.rootDir] });
let fn = require(pluginPath);
fn = fn.default || fn || (() => void);
```

### 运行时
运行时的核心是微应用容器，是一个技术容器，主要包括以下内容：
- **主应用与子应用通信**：通过消息总线共享实例。
- **生命周期管理**：通过 `namespace` 的 `flow` 对象管理。
- **路由管理**：使用 `react-router` 的核心代码, 只有一个history对象。

> ice的runtimemodule插件逻辑（实例化了两个运行时对象）
> message对象共享实例，每个微应用都会创建一个message实例
> 入口文件会自动包裹生命周期函数
> 运行时会加载运行时插件，并且渲染运行时容器
> 解决运行时polyfill问题： import 'core-js/stable';  import 'regenerator-runtime/runtime';
> @ice/stark-module管理微应用渲染
> @ice/stark-data 管理数据

#### 示例调度函数
以下是一个简单的调度函数实现：
```js
export function schedule(cb: (...args: any[]) => any) {
  let _promise: Promise<any> | null = null;
  return (...args: any[]) => {
    if (_promise) {
      return;
    }
    _promise = Promise.resolve().then(() => {
      cb(...args);
      _promise = null;
    });
  };
}
```

## 常用 NPM 包

以下是一些常用的 NPM 包及其用途：
- **fast-blob**：快速处理二进制数据。
- **es-module-lexer**：ES 模块词法分析器。
- **esbuild**：高性能的 JavaScript/TypeScript 构建工具。
- **globby**：文件匹配工具。
- **fs-extra**：增强版文件系统操作库。
- **chalk**：终端美化工具。
- **chokidar**：监听文件变化。
- **object-hash**：生成对象的哈希值。
- **code-red**： 轻量级的 JavaScript AST（抽象语法树）操作工具。
- **periscopic**：作用域分析工具。
- **estree-walker**：遍历和操作 ESTree 格式的 AST。
- **@types/estree**：ESTree 的 TypeScript 类型定义。
- **acorn**：轻量级的 JavaScript 解析器。
- **cheerio**：服务器端的 jQuery 实现。
- **mkdirp**：递归创建目录。
- **debug**：轻量级调试工具。

## 常见问题解决

### OpenSSL 配置问题
在 Node.js 中遇到以下错误：
```
node: --openssl-legacy-provider is not allowed in NODE_OPTIONS
```

#### 解决方法
升级 Node.js 到最新版本，或者在环境变量中移除 `NODE_OPTIONS` 的相关配置。



---

## 灰度设计

## CDN 分桶机制

### 核心原理
CDN 会根据用户的请求信息（如 IP 地址、User-Agent 等）或预设规则，将用户分配到不同的 **分桶** 中。每个分桶可以对应一组特定的资源或服务版本。

### 实现方式
1. **Cookie 带入分桶信息**：
   - CDN 在响应用户请求时，会在返回的 HTTP 响应头中设置一个特殊的 Cookie。
   - 该 Cookie 包含了用户的分桶信息（如 `bucket_id`），用于标识用户所属的分桶。
   ```http
   Set-Cookie: bucket_id=1; Path=/; HttpOnly
   ```

2. **自动分桶逻辑**：
   - CDN 根据预设规则（如哈希算法、随机分配等）为每个用户生成唯一的分桶 ID。
   - 用户后续的请求会携带该 Cookie，CDN 根据分桶 ID 决定返回哪个版本的资源。

### 示例场景
假设我们有三个分桶（Bucket A、Bucket B、Bucket C），分别对应不同的静态资源版本：
- Bucket A：旧版本资源。
- Bucket B：新版本资源（灰度测试）。
- Bucket C：备用资源。

当用户首次访问时，CDN 会为其分配一个分桶，并通过 Cookie 持久化分桶信息。后续请求中，CDN 根据 Cookie 中的分桶 ID 返回对应的资源。


## 网关侧灰度发布

### 核心原理
网关作为系统的流量入口，可以根据 CDN 带入的分桶信息或其他请求特征（如 Header、Query 参数等），进一步对流量进行精细化控制，实现灰度发布。

### 实现方式
1. **读取分桶信息**：
   - 网关从请求的 Cookie 或其他字段中提取分桶 ID。
   - 根据分桶 ID 将流量路由到不同的后端服务或功能版本。
   ```javascript
   const bucketId = request.cookies.bucket_id || 'default';
   if (bucketId === '1') {
     // 路由到灰度版本
     proxyToGrayService(request);
   } else {
     // 路由到默认版本
     proxyToDefaultService(request);
   }
   ```

2. **动态调整灰度比例**：
   - 网关支持动态配置灰度比例，例如将 10% 的流量分配到新版本。
   - 可以通过管理后台或配置文件实时调整灰度策略。

3. **监控与回滚**：
   - 网关侧记录灰度流量的日志和指标，便于监控新版本的表现。
   - 如果发现问题，可以快速回滚到旧版本。

### 示例场景
假设我们需要对某个新功能进行灰度测试：
- 配置网关将 5% 的流量分配到新版本服务。
- 其余 95% 的流量继续使用旧版本服务。
- 通过分析日志和用户反馈，逐步扩大新版本的流量比例，直到全量上线。

下面介绍一下文件灰度。文件灰度是指在部署过程中，将新版本的代码、配置文件或其他静态资源（如HTML、CSS、JavaScript文件等）逐步推送到部分服务器或节点上，而不是一次性全量更新。

FaaS应用的代码都存储在机器本地，比如源站模版。如果希望实现文件灰度发布，并让前端Web页面能够强制命中灰度版本，可以结合本地部署特点和灰度策略进行设计。以下是几种可行的解决方案：


### 1. **通过负载均衡器定向流量**
#### 实现方式：
- 在你的FaaS环境中，使用负载均衡器（如Nginx、HAProxy）将流量分配到不同的机器。
- 每台机器上部署不同版本的代码（如灰度版本和稳定版本）。
- 前端通过特定的请求头、Cookie或URL参数，强制命中灰度机器。

#### 示例：
假设你的负载均衡器配置如下：
```nginx
upstream faas_backend {
    server 192.168.1.10; # 稳定版本
    server 192.168.1.11; # 灰度版本
}

server {
    listen 80;

    location /api/ {
        if ($arg_gray = "true") {
            proxy_pass http://192.168.1.11; # 强制命中灰度机器
            break;
        }
        proxy_pass http://faas_backend; # 默认负载均衡
    }
}
```

前端代码：
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 利用负载均衡器实现灰度分流，简单高效。
- 可以根据URL参数灵活控制灰度命中。

#### 缺点：
- 需要手动维护不同机器上的代码版本。
- 如果灰度机器数量较多，管理成本较高。

### 2. **通过文件路径区分灰度版本**
#### 实现方式：
- 在每台机器上部署不同版本的代码，并通过文件路径区分灰度版本。
- 前端通过URL参数动态加载对应的代码路径。

#### 示例：
假设你的FaaS应用代码目录结构如下：
```
/faas/
  /stable/  # 稳定版本代码
  /gray/    # 灰度版本代码
```

后端伪代码（Node.js示例）：
```javascript
app.get('/api/function', (req, res) => {
  const isGray = req.query.gray === 'true';
  const codePath = isGray ? '/faas/gray/' : '/faas/stable/';
  
  // 动态加载对应版本的代码
  const handler = require(codePath + 'functionHandler');
  handler(req, res);
});
```

前端代码：
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 不需要额外的负载均衡器配置。
- 文件路径清晰，便于管理和回滚。

#### 缺点：
- 需要在每台机器上维护多个代码版本。
- 如果代码更新频繁，可能会增加部署复杂度。

### 3. **通过功能开关（Feature Toggle）实现灰度**
#### 实现方式：
- 在代码中引入功能开关，用于控制是否启用灰度逻辑。
- 前端通过请求头或URL参数传递灰度标识，后端根据标识决定执行哪个版本的逻辑。

#### 示例：
后端伪代码（Node.js示例）：
```javascript
app.get('/api/function', (req, res) => {
  const isGray = req.query.gray === 'true';

  if (isGray) {
    // 执行灰度逻辑
    res.send({ message: 'This is the gray version' });
  } else {
    // 执行稳定逻辑
    res.send({ message: 'This is the stable version' });
  }
});
```

前端代码：
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 无需维护多个代码版本，所有逻辑集中在一个代码库中。
- 灰度逻辑可以通过开关动态调整，灵活性高。

#### 缺点：
- 功能开关的管理需要额外的工具或框架支持。
- 如果灰度逻辑过于复杂，可能导致代码可读性下降。

### 4. **通过本地缓存或文件哈希区分灰度**
#### 实现方式：
- 在每台机器上部署不同版本的代码，并为每个版本生成唯一的文件哈希值。
- 前端通过指定哈希值加载对应的代码版本。

#### 示例：
假设你的代码目录结构如下：
```
/faas/
  /v1/  # 版本1代码
  /v2/  # 版本2代码
```

后端伪代码（Node.js示例）：
```javascript
app.get('/api/function', (req, res) => {
  const version = req.query.version || 'v1'; // 默认加载v1版本
  const codePath = `/faas/${version}/`;

  // 动态加载对应版本的代码
  const handler = require(codePath + 'functionHandler');
  handler(req, res);
});
```

前端代码：
```javascript
const version = 'v2'; // 强制加载灰度版本
fetch(`/api/function?version=${version}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 文件版本化管理，便于追踪和回滚。
- 可以通过哈希值精确控制灰度范围。

#### 缺点：
- 需要维护多个版本的代码文件。
- 如果版本过多，可能导致磁盘空间占用增加。

### 总结

| **方法**                     | **适用场景**                                   | **优点**                                      | **缺点**                                      |
|------------------------------|-----------------------------------------------|---------------------------------------------|---------------------------------------------|
| **负载均衡器定向流量**       | 多台机器部署不同版本                          | 简单高效，适合大规模灰度                     | 需要手动维护不同机器上的代码版本             |
| **文件路径区分灰度版本**     | 单机多版本部署                                | 文件路径清晰，便于管理                       | 部署复杂度较高                               |
| **功能开关**                 | 单一代码库，逻辑分离                          | 灵活性高，无需维护多个版本                   | 功能开关管理复杂，代码可读性可能下降         |
| **本地缓存或文件哈希区分**   | 精确控制灰度范围                              | 文件版本化管理，便于追踪和回滚               | 需要维护多个版本文件，磁盘占用可能增加       |

在你的场景中，由于代码存储在本地机器上，建议优先考虑**功能开关**或**文件路径区分灰度版本**的方式。这两种方法既能满足灰度发布的需求，又不会显著增加部署和管理的复杂度。如果未来扩展到多台机器，则可以引入负载均衡器来进一步优化灰度策略。

## 灰度放量

方案 1: 写一个 ID 值，当用户 ID 大于该值时启用功能（类似白名单机制）。


---


## Lerna 多包管理案例


在使用 Lerna 管理的多包项目中，执行编译时出现了 TypeScript 报错。经过排查，发现问题与 `node`、`typescript` 和 `@types/node` 的版本兼容性有关。


## 错误描述

编译过程中，TypeScript 报出了以下错误：

```text
[TS Error] '(' expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:309:91)

[TS Error] ',' expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:312:51)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:312:75)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:313:4)

[TS Error] ')' expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:314:15)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:314:49)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:315:24)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:315:65)

[TS Error] Expression expected.(node_modules/_@types_node@22.13.5@@types/node/https.d.ts:316:4)
```

这些错误均指向 `@types/node` 的类型定义文件 `https.d.ts`，表明类型定义文件中存在语法问题。

## 问题分析

根据错误提示和进一步排查，得出以下结论：

1. **版本不兼容**：
   - 当前项目中使用的 `@types/node` 版本为 `22.13.5`，而项目的 `typescript` 版本为 `^4.1.3`。
   - `@types/node` 的高版本（如 `22.x`）可能引入了新的语法或特性，而低版本的 `typescript` 无法解析这些新特性，从而导致编译报错。

2. **子包依赖问题**：
   - 在 Lerna 管理的多包项目中，根目录的 `package.json` 配置了 `"overrides"` 和 `"resolutions"` 来强制指定 `@types/node` 的版本为 `16.18.68`。
   - 然而，子包中仍然依赖了更高版本的 `@types/node`（`22.13.5`），并且在执行 `npm run build` 后动态安装了该版本。

3. **`skipLibCheck` 配置无效**：
   - 虽然已经在 `tsconfig.json` 中设置了 `"skipLibCheck": true`，但该配置仅跳过库类型的检查，并不能解决版本冲突的根本问题。


## 解决方案

### 1. 根目录版本降级

首先，在根目录的 `package.json` 中尝试通过 `overrides` 和 `resolutions` 强制指定 `@types/node` 的版本为 `16.18.68`：

```json
"overrides": {
  "@types/node": "16.18.68"
},
"resolutions": {
  "@types/node": "16.18.68"
}
```

同时，将 `node` 和 `typescript` 的版本分别降级到兼容范围：

```json
"node": "20",
"typescript": "^4.1.3"
```

然而，这种方式并未完全解决问题，因为子包中仍然会动态安装高版本的 `@types/node`。


### 2. 子包单独指定版本

为了彻底解决子包中的版本冲突问题，在每个子包的 `package.json` 中单独添加 `resolutions` 配置，强制指定 `@types/node` 的版本为 `16.18.68`：

```json
"resolutions": {
  "@types/node": "16.18.68"
}
```

这样可以确保子包在安装依赖时不会引入高版本的 `@types/node`。


### 3. 清理并重新安装依赖

执行以下命令清理项目并重新安装依赖：

```bash
lerna clean -y
npm install
```

确保所有子包的 `node_modules` 已被正确清理，并重新安装指定版本的依赖。


### 4. 验证解决方案

执行 `npm run build` 进行编译，确认不再出现上述 TypeScript 报错。

---

## babel

> 目前最新的编译工具是： https://swc.rs/docs/usage/cli

## Babel CLI 参数

### `--copy-files`

在使用 Babel 编译代码时，`--copy-files` 参数可以用于 **附带拷贝非编译的文件**。  
这在项目中存在非 JavaScript 文件（如 `.json`、`.css` 等）时非常有用，确保这些文件能够被复制到输出目录，而不会被忽略。

## .babelrc 配置文件

Babel 的核心配置文件是 `.babelrc`，它定义了如何转换代码。以下是一个示例配置：

```json
{
  "presets": [
    ["env", { "loose": false }]
  ]
}
```

### Presets 配置

- **`env` Preset**：这是 Babel 的一个通用预设，支持将现代 JavaScript 转换为向后兼容的版本。
- **`loose` 选项**：控制是否启用宽松模式（Loose Mode）。默认值为 `false`。


## Loose 模式详解

### Loose 模式的优缺点

#### 工作原理
在 Babel 中，`loose` 模式会将类（Class）编译为基于原型链的实现方式，而非默认的 `Object.defineProperty` 定义方式。

#### 优点
- 编译后的代码更接近传统的 JavaScript 写法，易于理解和调试。
- 在某些情况下，性能可能会略有提升。

#### 缺点
- **枚举问题**：通过 `for...of` 枚举时，原型链上的方法会被枚举出来，而默认的 `Object.defineProperty` 定义方式可以通过 `enumerable` 属性控制不可枚举性。
- **兼容性风险**：宽松模式可能会导致某些现代 JavaScript 特性无法完全兼容。

### 副作用分析

当使用默认的 `Object.defineProperty` 定义类时，虽然可以避免枚举问题，但可能会引入一些副作用：
- 编译后的代码可能变得冗长且复杂。
- 在某些环境中，可能存在性能开销或兼容性问题。

因此，在选择是否启用 `loose` 模式时，需要根据项目的具体需求权衡利弊。

---

## 疲劳度设计


## 技术实现

- **覆盖式安装缓存**：  
  如果删除后重新安装，缓存会被清空。缓存通常存储在本地文件中，建议将相关逻辑集成到启动任务中。

## 业务分析

### 风险评估

1. **接口流量攻击**  
   - PC 端的请求依赖 JS 执行，因此流量攻击的风险相对较低。  
   - 服务端采用单机限流策略，并对接口 QPS 进行评估，确保系统稳定性。

2. **重复写/批量写的风险**  
   - 需要避免因重复写或批量写导致的数据异常问题。

3. **接口疲劳度**  
   - 定义接口请求的疲劳度规则：例如，端外每 10 次发起一次请求；如果未命中疲劳度规则，则不发起请求。  
   - 如果服务端修改了疲劳度值，需要第二次请求才会生效。

4. **新老版本升级**  
   - 老版本用户点击过的按钮，在新版本中应保持不可点击状态，避免重复触发。

5. **按钮疲劳度差异**  
   - 不同按钮的疲劳度可能不同，需针对具体场景进行差异化配置。

6. **不同埋点占比**  
   - 针对不同的埋点数据，设置合理的占比分配，以满足数据分析需求。

### 疲劳度逻辑

- **疲劳度定义**：  
  根据业务需求，为每个按钮或接口设置独立的疲劳度规则。  
  - 示例：  
    - 按钮 A：每 10 分钟允许点击一次。  
    - 按钮 B：每 24 小时允许点击一次。  

- **服务端更新疲劳度值**：  
  当服务端调整疲劳度规则时，客户端需在下一次请求时同步最新规则。

## 预案/限流/兜底

- **默认值返回**：  
  如果未命中疲劳度规则或发生异常，默认返回“不弹窗”状态，避免影响用户体验。

- **限流策略**：  
  - 单机限流：限制单台服务器的 QPS，防止过载。  
  - 接口限流：根据业务需求，设置接口级别的请求频率限制。

- **兜底方案**：  
  在极端情况下（如服务不可用），返回默认值或静态配置，确保系统可用性。

## 可测性评估

1. **测试方法**  
   - **Mock IP 测试**：通过模拟不同的 IP 地址，验证疲劳度规则是否正确应用。  
   - **修改系统时间**：调整系统时间，测试疲劳度的时间窗口逻辑是否符合预期。  

2. **客户端虚拟版本测试**  
   - 使用虚拟版本号模拟不同客户端版本，验证新老版本的兼容性和疲劳度逻辑。

## 监控预警

- **监控指标**  
  - 接口调用频率（QPS）。  
  - 疲劳度命中率（命中/未命中比例）。  
  - 异常请求占比（如超限、重复写等）。  

- **预警机制**  
  - 设置阈值报警：当接口 QPS 超过预设值时，触发报警。  
  - 日志记录：详细记录每次请求的疲劳度命中情况，便于问题排查。  

- **日志分析**  
  - 定期分析日志数据，评估疲劳度规则的实际效果，并优化规则配置。

---

## umi 方案


### Umi
[Umi](https://umijs.org/zh/guide/#特性) 是一个可插拔的企业级前端应用框架，支持 React 和 TypeScript，内置路由、构建工具等功能，适合快速搭建现代化前端项目。

### MobX-State-Tree
[MobX-State-Tree](https://github.com/mobxjs/mobx-state-tree) 是一个强大的状态管理库，基于 MobX 提供了类型安全和树形结构的状态管理能力。

### Umi 插件：umi-plugin-mobx-state-tree
[umi-plugin-mobx-state-tree](https://github.com/umijs/umi-plugin-mobx-state-tree) 是 Umi 官方提供的插件，用于集成 MobX-State-Tree 到 Umi 项目中，简化状态管理的配置。

## Umi 初始化项目

通过以下命令快速初始化一个 Umi 项目：
```bash
yarn create umi
```
选择 `app` 模板，并根据需要选择是否启用 Ant Design（如需使用 Ant Design，请勾选）。

## Umi 创建页面

### 普通路由
普通路由可以直接通过以下方式定义：
```jsx
<Route path="/home" component={Home} />
```
然后通过 Umi 命令生成对应页面：
```bash
umi g home/index
```

### 动态路由
动态路由支持路径参数，例如：
```
/order-result/:type/:orderId
```
可以通过以下命令生成动态页面：
```bash
umi g orderResult/$type/$orderId/index
```

## Umi 修改入口页面

在 `src/pages` 下创建一个 `document.ejs` 文件：
```bash
touch src/pages/document.ejs
```
将模板内容从 [template/document.ejs](https://github.com/umijs/umi/blob/master/packages/umi-build-dev/template/document.ejs) 复制到该文件中，然后自定义 SEO 信息或 Favicon：
```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```

## Umi 修改配置

Umi 的配置文件可以是 `.umirc.js` 或 `config/config.js`。以下是一个示例配置：
```js
export default {
  externals: { // 全局变量控制
    wx: 'wx',
    qq: 'qq',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // 默认公共目录
  },
  plugins: [
    ['umi-plugin-react', {
      antd: true, // 是否启用 Ant Design
      dva: false,
      title: "国铁商旅", // 默认 document.title
      dynamicImport: false,
      dll: true,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
    ["umi-plugin-mobx-state-tree", {
      exclude: [/^\$/], // 排除以 $ 开头的 stores
    }],
  ],
  alias: {
    '@src': path.resolve(__dirname, 'src'),
  },
};
```

## Umi 全局 Mixin 样式注入

通过 `chainWebpack` 配置全局 Mixin 样式注入：
```js
chainWebpack(config, { webpack }) {
  config.module.rule('mixin-global')
    .test(/\.less$/)
    .use('mixin-with-resources-loader')
    .loader('sass-resources-loader')
    .options({
      resources: [
        path.resolve(__dirname, './src/less/mixin.less')
      ]
    });
}
```

## 禁用某些文件的 CSS Modules 功能

如果需要禁用某些文件的 CSS Modules 功能，可以在配置中添加：
```js
cssModulesExcludes: [
  '/src/pages/order/index.less',
]
```

## Less 全局样式和 CSS Modules 样式共存

如果需要同时使用全局样式和 CSS Modules 样式，可以在 `.less` 文件中使用 `:global`：
```less
:global {
  .some-class-name-used {
    color: red;
  }
}
```

## MobX-State-Tree 管理 Store

### 目录结构
```bash
-src 
    -stores (手动创建)
        xxx.js （store 的 key）
```

### 创建一个 Store
```js
import { types } from "mobx-state-tree";

const userInfoInterface = types.model({
  username: '22',
  password: '123'
});

const XXX = types
  .model('Auth', {
    type: types.array(types.string, ""), // 数组
    startStationCode: types.maybeNull(types.number), // 可以为 null
    startTime: types.optional(types.union(types.number, types.string), 0), // 多个类型
    userInfo: types.optional(userInfoInterface, {}), // 有默认值，允许为 undefined
    userInfo2: types.maybe(userInfoInterface) // 无默认值
  })
  .actions(self => ({
    async login(username, password) {
      // 登录逻辑
    }
  }));

export default XXX;
```

### 全局注册 Stores
`umi-plugin-mobx-state-tree` 会自动加载 `src/stores` 下的所有文件（可通过 `exclude` 排除某些文件），并按需加载。无需手动创建实例或通过 `Provider` 注入。

## React 组件注册

```js
@observer
class ComponentA extends Component {
  componentDidMount() {
    this.props.login(); // 调用 store 中的 action
    const { userInfo } = this.props;

    reaction(
      () => {
        return userInfo.token;
      },
      token => {
        if (token) {
          this.props.history.push('/home');
        }
      }
    );
  }
}

export default withRouter(inject(({ stores }, ownProps) => ({
  login: stores.xxx.login, // 传递 store 上的 action
  userInfo: stores.xxx.userInfo, // 传递 store 上的数据
  ...ownProps
}))(ComponentA));
```

## 外部调用 Stores 的 Action

通过 `umi-plugin-mobx-state-tree` 注册的 stores 实例会被挂载到 `window` 对象上：
```js
// getStore.js
export default () => {
  return window.mobx_app.mobx_stores || {};
};

// a.js
import getStore from 'getStore';
const xxxStore = getStore().xxx;
xxxStore.login();
```

---

## JSONPath 字段裁剪


### JSON提取

1. 提取 `countDown` 字段。
2. 提取 `products` 列表中的前 5 个元素。
3. 提取每个 `product` 的 `id`。

```json
{
  "data": "data",
  "data": {
    "countDown": "countDown",
    "products": "products[0:5]",
    "products": {
      "id": "id"
    }
  }
}
```

### 使用 JSONPath 实现字段裁剪

1. **提取 `countDown` 字段：**
   ```jsonpath
   $.data.countDown
   ```

2. **提取 `products` 列表中的前 5 个元素：**
   ```jsonpath
   $.data.products[0:5]
   ```

3. **提取每个 `product` 的 `id`：**
   ```jsonpath
   $.data.products[0:5].id
   ```

---

## 免登方案


## 问题场景

A 站点内嵌 B 站点，两个站点的域名不同。需要实现 A 站点用户免登录跳转到 B 站点。

## 解决方案

### 方案 1：通过免登接口实现

- **实现方式**  
  A 站点通过调用 B 站点提供的免登接口，携带必要的参数（如重定向地址、语言等），实现用户的免登录跳转。
  
- **关键点**
  - **重定向参数**：用于跳转回目标页面。
  - **其他必要参数**：如语言，用于切换 B 站点的语言环境。
  
- **限制**
  - 如果浏览器禁用了第三方 Cookie，则无法将 Cookie 写入 B 站点，导致免登失败。

### 方案 2：通过 Token 实现

- **实现方式**  
  A 站点请求服务端换取一个临时 Token，然后通过 iframe 访问 B 站点的免登 URL，并将 Token 传递给 B 站点。

- **关键点**
  - **Token 传递方式**  
    - 推荐通过请求头传递 Token，避免将敏感信息暴露在 URL 中。
  - **Token 时效性**  
    - 设置合理的 Token 有效期，确保安全性。
  - **来源验证**  
    - 验证 Token 的来源是否合法，防止伪造请求。
  - **异常监控**  
    - 对免登过程中的异常情况进行监控，及时发现问题。
  - **HTTPS 安全性**  
    - 确保所有通信都通过 HTTPS 进行，防止中间人攻击。

- **兜底页面**  
  - B 站点需提供一个统一的免登失败兜底页面，用于处理免登失败的情况。

## 安全性与兜底措施

1. **安全性**
   - **Token 安全性**  
     - 使用短时效 Token，减少泄露风险。
     - 验证 Token 的合法性，确保其由可信服务端签发。
   - **HTTPS 加密**  
     - 所有通信必须使用 HTTPS，防止数据被窃取或篡改。
   - **来源校验**  
     - 校验请求来源，防止跨站攻击。

2. **兜底措施**
   - **免登失败页面**  
     - 提供友好的免登失败页面，引导用户手动登录或其他操作。
   - **日志记录**  
     - 记录免登过程中的关键日志，便于排查问题。

---

## metaq

在现代分布式系统中，随着用户量和请求量的增加，服务端可能会面临以下挑战：
- **高并发请求**：短时间内大量请求涌入，可能导致服务器资源耗尽。
- **服务稳定性下降**：过多的请求可能导致服务响应变慢或崩溃。
- **扩展性不足**：传统的同步处理方式难以应对突发流量。

为了解决这些问题，引入消息队列（如 MetaQ）成为一种有效的手段。

## MetaQ 的作用

MetaQ 是一种高性能的消息队列中间件，主要作用包括：
- **削峰填谷**：通过异步处理请求，平滑高峰期的流量压力。
- **解耦系统**：将生产者和消费者分离，降低系统间的耦合度。
- **提高可靠性**：消息队列可以持久化消息，确保数据不丢失。
- **支持分布式架构**：适用于大规模分布式系统，提升系统的扩展性和容错能力。

## MetaQ 跨单元

可以跨单元监听metaq消息，不可以跨单元发送消息。

---

## rpc


## RPC概述

RPC（Remote Procedure Call，远程过程调用）是一种让客户端能够像调用本地方法一样调用远程服务器上的方法的技术。其核心思想是通过网络实现跨进程或跨机器的函数调用。


## 注册中心与动态IP管理

在分布式系统中，**注册中心**（如ConfigCenter）用于管理服务的动态IP地址和元信息。它的主要作用包括：
- **服务注册**：服务启动时向注册中心注册自己的地址。
- **服务发现**：客户端通过注册中心获取目标服务的地址。
- **动态管理**：支持服务上下线、负载均衡等功能。


## RPC协议规范

RPC协议定义了客户端与服务端之间的通信规范。以下是一个典型的RPC请求格式示例：

```json
{
    "serviceName": "xxx",
    "methodName": "getList"
}
```

- `serviceName`：指定要调用的服务名称。
- `methodName`：指定要调用的方法名称。

该请求经过序列化后会变成一个字符串，通过网络传输到服务端进行反序列化和处理。


## 代理模式的本质

RPC的核心机制之一是**代理模式**。代理层位于客户端和服务端之间，负责处理以下任务：
- **序列化/反序列化**：将请求对象转换为字节流以便传输，并在接收端还原为对象。
- **网络通信**：负责数据包的发送和接收。
- **错误处理**：捕获并处理网络异常或服务端错误。

代理机制使得应用程序可以专注于业务逻辑本身，而无需关心底层的复杂性。


## 网络通信问题：国内到新加坡的IP路由

在国内访问新加坡的IP时，可能会遇到以下问题：
- **运营商拦截**：某些运营商可能会拦截特定的HTTPS请求。
- **DNS解析差异**：通过域名访问时，DNS返回的IP可能与直接`ping`得到的IP不同，导致访问失败。

**建议：**
- 在内部应用机器之间通信时，建议使用HTTP而非HTTPS，以避免证书卸载等问题。


## 泛化调用

泛化调用是一种不依赖具体接口定义的调用方式，适用于动态场景。以下是泛化调用的特点：
- **灵活性高**：无需提前定义接口，适合动态生成的请求。
- **兼容性强**：可以在不同语言或框架间实现通用调用。

## HSF泛化参数构造

HSF（High-Speed Service Framework）是阿里巴巴的一种高性能服务框架，支持泛化调用。以下是构造HSF泛化参数的关键步骤：

1. **确定服务名称和方法名称**：明确需要调用的服务和方法。
2. **构建参数列表**：根据方法签名构造参数。
3. **序列化请求**：将请求对象序列化为字节流。

**注意事项：**
- 参数类型需与服务端方法签名一致。
- 确保序列化方式与服务端兼容。

## 案例
node调用hsf， 入参是一个对象。 对象的字段不能是枚举，和List<自定义对象>

技术：
枚举改为string
自定义对象改为List`<<Map, String>>`类型

## RPC接口缓存

hsf是如何根据参数缓存的？

key: id(xxx)_method(get/post)_uid(唯一id) , 底层是一个`Map<string, Promise<any>>`