---
title: "Midway 6 升级到 v8 踩坑记录"
date: 2025-02-06
tags:
  - nodejs
images:
  - nodejs-5/cover.png
---

## 目录
1. [this.ctx.render 方法不存在](#thisctxrender-方法不存在)
2. [TypeError: require(...).startCluster is not a function](#typeerror-requirestartcluster-is-not-a-function)
3. [start error: EROFS: read-only file system, mkdir '/home'](#start-error-ero-fs-read-only-file-system-mkdir-home)
4. [config 配置文件问题](#config-配置文件问题)
5. [Fatal JavaScript invalid size error](#fatal-javascript-invalid-size-error)
6. [移除 @ali/node-scripts 依赖](#移除-ali-node-scripts-依赖)
7. [手动添加 logger 依赖](#手动添加-logger-依赖)

---

## this.ctx.render 方法不存在

在升级过程中，可能会发现 `this.ctx.render` 方法不可用。这是因为默认情况下，Midway v8 不再自动启用视图渲染功能。

### 解决方案
1. 安装 `@midwayjs/view-nunjucks` 插件：
   ```bash
   npm install @midwayjs/view-nunjucks --save
   ```

2. 在 `src/configuration.ts` 中启用视图插件：
   ```typescript
   import * as webFramework from '@midwayjs/web';
   import { join } from 'path';
   import { Configuration } from '@midwayjs/decorator';
   import * as view from '@midwayjs/view-nunjucks';

   @Configuration({
     imports: [webFramework, view],
     importConfigs: [join(__dirname, './config/')],
   })
   export class AutoConfiguration {}
   ```

3. 在 `src/config/config.default.ts` 中配置 Nunjucks：
   ```typescript
   export const view = {
     defaultViewEngine: 'nunjucks',
     mapping: {
       '.nj': 'nunjucks',
     },
   };
   ```

---

## TypeError: require(...).startCluster is not a function

在运行项目时，可能会遇到以下错误：
```
TypeError: require(...).startCluster is not a function
```

### 解决方案
删除 `@ali/midway-bin` 依赖：
```bash
npm uninstall @ali/midway-bin
```

---

## start error: EROFS: read-only file system, mkdir '/home'

在启动项目时，可能会出现以下错误：
```
Error: EROFS: read-only file system, mkdir '/home'
```

### 解决方案
移除 `onelog` 相关的代码或依赖。例如，在 `src/configuration.ts` 中注释掉与 `onelog` 相关的导入和配置。

---

## config 配置文件问题

在升级后，`config` 文件中的某些导出方式可能不再兼容。例如，`export const development` 可能会导致问题。

### 解决方案
去掉 `export const development`，改为直接在 `config.default.ts` 中定义配置项。例如：
```typescript
export default {
  keys: 'your-secret-key',
  // 其他配置...
};
```

---

## Fatal JavaScript invalid size error

在运行项目时，可能会遇到以下错误：
```
Fatal error in , line 0
Fatal JavaScript invalid size error 169220804
```

### 解决方案
该问题通常与 Node.js 版本或内存限制有关。可以尝试以下方法：
1. 升级 Node.js 到最新稳定版本。
2. 增加 Node.js 的内存限制：
   ```bash
   node --max-old-space-size=4096 your-entry-file.js
   ```

---

## 移除 @ali/node-scripts 依赖

在升级过程中，`@ali/node-scripts` 可能会引发兼容性问题。

### 解决方案
移除 `@ali/node-scripts` 依赖：
```bash
npm uninstall @ali/node-scripts
```

---

## 手动添加 logger 依赖

根据 [Midway 官方博客](https://midway.alibaba-inc.com/blog/release/3.13.0/) 的说明，升级到 v8 后需要手动添加日志相关依赖。

### 解决方案
安装 `@midwayjs/logger`：
```bash
npm install @midwayjs/logger --save
```

然后在 `src/configuration.ts` 中引入并配置日志模块：
```typescript
import * as logger from '@midwayjs/logger';

@Configuration({
  imports: [logger],
})
export class AutoConfiguration {}
```

---

## 总结

升级到 Midway v8 的过程中，可能会遇到多种问题。本文总结了常见的踩坑点及解决方案，包括视图渲染、依赖冲突、配置文件调整等。建议在升级前仔细阅读官方文档，并逐步测试每个模块的功能，以确保项目的稳定性。