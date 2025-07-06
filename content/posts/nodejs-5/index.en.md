---
title: "Pitfalls of Upgrading Midway from v6 to v8"
date: 2025-02-06
tags:
  - nodejs
---
## Table of Contents
1. [this.ctx.render method does not exist](#thisctxrender-method-does-not-exist)
2. [TypeError: require(...).startCluster is not a function](#typeerror-requirestartcluster-is-not-a-function)
3. [start error: EROFS: read-only file system, mkdir '/home'](#start-error-ero-fs-read-only-file-system-mkdir-home)
4. [Config file issues](#config-file-issues)
5. [Fatal JavaScript invalid size error](#fatal-javascript-invalid-size-error)
6. [Remove @ali/node-scripts dependency](#remove-alinode-scripts-dependency)
7. [Manually add logger dependency](#manually-add-logger-dependency)
---
## this.ctx.render method does not exist
During the upgrade process, you may find that the `this.ctx.render` method is unavailable. This is because, by default, Midway v8 no longer automatically enables the view rendering feature.
### Solution
1. Install the `@midwayjs/view-nunjucks` plugin:
   ```bash
   npm install @midwayjs/view-nunjucks --save
   ```
2. Enable the view plugin in `src/configuration.ts`:
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
3. Configure Nunjucks in `src/config/config.default.ts`:
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
When running the project, you may encounter the following error:
```
TypeError: require(...).startCluster is not a function
```
### Solution
Remove the `@ali/midway-bin` dependency:
```bash
npm uninstall @ali/midway-bin
```
---
## start error: EROFS: read-only file system, mkdir '/home'
When starting the project, the following error may occur:
```
Error: EROFS: read-only file system, mkdir '/home'
```
### Solution
Remove `onelog`-related code or dependencies. For example, comment out the imports and configurations related to `onelog` in `src/configuration.ts`.
---
## Config file issues
After the upgrade, some export methods in the `config` file may no longer be compatible. For example, `export const development` might cause issues.
### Solution
Remove `export const development` and define the configuration items directly in `config.default.ts`. For example:
```typescript
export default {
  keys: 'your-secret-key',
  // other configurations...
};
```
---
## Fatal JavaScript invalid size error
When running the project, you may encounter the following error:
```
Fatal error in , line 0
Fatal JavaScript invalid size error 169220804
```
### Solution
This issue is usually related to the Node.js version or memory limits. You can try the following methods:
1. Upgrade Node.js to the latest stable version.
2. Increase the Node.js memory limit:
   ```bash
   node --max-old-space-size=4096 your-entry-file.js
   ```
---
## Remove @ali/node-scripts dependency
During the upgrade process, `@ali/node-scripts` may cause compatibility issues.
### Solution
Remove the `@ali/node-scripts` dependency:
```bash
npm uninstall @ali/node-scripts
```
---
## Manually add logger dependency
According to the [Midway Official Blog](https://midway.alibaba-inc.com/blog/release/3.13.0/), after upgrading to v8, you need to manually add logging-related dependencies.
### Solution
Install `@midwayjs/logger`:
```bash
npm install @midwayjs/logger --save
```
Then, import and configure the logger module in `src/configuration.ts`:
```typescript
import * as logger from '@midwayjs/logger';
@Configuration({
  imports: [logger],
})
export class AutoConfiguration {}
```
---
## Summary
During the upgrade to Midway v8, you may encounter various issues. This article summarizes common pitfalls and their solutions, including view rendering, dependency conflicts, and configuration file adjustments. It is recommended to carefully read the official documentation and test each module's functionality step-by-step before upgrading to ensure the project's stability.
