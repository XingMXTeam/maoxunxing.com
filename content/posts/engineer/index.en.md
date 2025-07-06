title: "Frontend Engineering Guide"
date: 2025-02-06
tags:
  - Engineering
  - Web Development
custom_toc:
  - title: "Engineering Basics"
  - title: "Grayscale Design"
  - title: "Lerna Multi-package Management Case Study"
  - title: "Babel"
  - title: "Fatigue Design"
  - title: "Umi Solution"
  - title: "JSONPath Field Pruning"
  - title: "Login-free Solution"
  - title: "metaq"
  - title: "rpc"
---
## Engineering Basics
## Project Directory Splitting
### Background
When upgrading a page in an old project, should you create a new directory to isolate the new and old pages, or should you directly modify the old page?
### Professional Technical Advice
- **Recommended Solution**: Try to modify the old page directly to avoid maintenance issues caused by multiple copies.
- **Reasons**:
  - Creating a new directory can lead to scattered logic and increased maintenance costs.
  - Modifying the old page allows for the reuse of existing components and logic, reducing redundant development.
## How to Build an Engineering System from Scratch
### Initialize Project
1. Use GitHub to initialize the project repository.
2. Use Lerna to initialize a multi-package structure:
   ```bash
   npx lerna init
   ```
3. Initialize TypeScript configuration:
   ```bash
   npx tsc --init
   ```
### Add Caching Support
```bash
npx lerna add-caching
```
### Create Core Package
Create a new package `app-core`:
```bash
npx create app-core --es-module
```
### Configure TypeScript
Add the following configuration to `package.json`:
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
### Modify Build Script
Add the following script to `package.json`:
```json
"scripts": {
  "tsc": "tsc",
  "test": "node ./__tests__/app-core.test.js",
  "start": "ts-node src/app-core.ts",
  "publish": "lerna run tsc && lerna publish"
}
```
### Run Build
Use Lerna to run the build command:
```bash
lerna run tsc
```
### Modify Publish Path
Change `dist` to `lib`:
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
## Pluggable Build Tool (build-scripts)
### Core Concept
`build-scripts` is a Webpack-based pluggable engineering build tool that supports quickly setting up an out-of-the-box engineering solution.
> Starting it once will launch three services.
### Example Plugin
The following is an example of a plugin that ignores `moment` localization:
```js
const webpack = require('webpack');
module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.plugin('ignore').use(webpack.IgnorePlugin, [/^\.\/locale$/, /moment$/]);
  });
};
```
## Resource Management
### Static Resource Publishing
Static resources can be published to the following locations:
- assets/tnpm/Faas/webapp/MiniProgram/weex
### Local Build vs. Cloud Build
- **Local Build**: Uses the directory from the code repository.
- **Cloud Build**: Dynamically builds and publishes.
### WebApp Build
WebApp includes HTML files, and `assets` will be dynamically synchronized to the CDN.
## Stability Assurance
### Flow Control and Degradation
- **Flow Control**: Limits traffic to protect the system.
- **Degradation**: Shuts down some non-core functions under high load.
### Overload Protection
Ensure system stability in high-concurrency scenarios through rate limiting and degradation strategies.
## Lerna Multi-package Management
### Link Package
In a multi-package project, you can link packages with the following command:
```bash
lerna add @hospital-sdk/doctor --scope=integration
```
## Conclusion: Build-time vs. Runtime
### Build-time
The core of build-time is `build-scripts`, which manages plugin execution through a `Context` object. The main tasks at build-time include:
- **Generating Artifacts**: Such as JS/CSS files (built for different environments).
- **Starting Services**: Such as a local development server.
- **Plugin Mechanism**: Plugins can dynamically update configuration items or perform I/O operations.
> There is a Context object inside that manages the execution of plugins, running registered plugins sequentially. WebpackService is an instance of Context.
#### Plugin Loading
Plugin names configured in `build.json` will be loaded by Node:
> Node can load these plugins based on (plugin name + default directory), and after loading, it gets the fn constructor.
```js
const pluginPath = require.resolve('webpack', { paths: [this.rootDir] });
let fn = require(pluginPath);
fn = fn.default || fn || (() => void);
```
### Runtime
The core of runtime is the micro-application container, which is a technology container mainly including:
- **Communication between Main and Sub-applications**: Sharing instances through a message bus.
- **Lifecycle Management**: Managed by the `flow` object of the `namespace`.
- **Routing Management**: Uses the core code of `react-router`, with only one history object.
> ice's runtimemodule plugin logic (instantiated two runtime objects)
> The message object shares instances; each micro-application creates a message instance.
> The entry file automatically wraps lifecycle functions.
> The runtime loads runtime plugins and renders the runtime container.
> To solve runtime polyfill issues: import 'core-js/stable'; import 'regenerator-runtime/runtime';
> @ice/stark-module manages micro-application rendering.
> @ice/stark-data manages data.
#### Example Scheduling Function
The following is a simple implementation of a scheduling function:
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
## Common NPM Packages
Here are some commonly used NPM packages and their purposes:
- **fast-blob**: Fast processing of binary data.
- **es-module-lexer**: ES module lexer.
- **esbuild**: High-performance JavaScript/TypeScript bundler.
- **globby**: File matching tool.
- **fs-extra**: Enhanced file system operations library.
- **chalk**: Terminal styling tool.
- **chokidar**: File change watcher.
- **object-hash**: Generate hash values for objects.
- **code-red**: A lightweight JavaScript AST (Abstract Syntax Tree) manipulation tool.
- **periscopic**: Scope analysis tool.
- **estree-walker**: Traverse and manipulate ESTree format ASTs.
- **@types/estree**: TypeScript type definitions for ESTree.
- **acorn**: A lightweight JavaScript parser.
- **cheerio**: Server-side jQuery implementation.
- **mkdirp**: Recursively create directories.
- **debug**: Lightweight debugging utility.
## Common Problem Solving
### OpenSSL Configuration Issue
Encountered the following error in Node.js:
```
node: --openssl-legacy-provider is not allowed in NODE_OPTIONS
```
#### Solution
Upgrade Node.js to the latest version, or remove the relevant configuration from the `NODE_OPTIONS` environment variable.
---
## Grayscale Design
## CDN Bucketing Mechanism
### Core Principle
The CDN assigns users to different **buckets** based on their request information (such as IP address, User-Agent, etc.) or preset rules. Each bucket can correspond to a specific set of resources or service versions.
### Implementation
1. **Passing Bucket Information via Cookie**:
   - When responding to a user request, the CDN sets a special Cookie in the returned HTTP response header.
   - This Cookie contains the user's bucket information (e.g., `bucket_id`), used to identify the user's assigned bucket.
   ```http
   Set-Cookie: bucket_id=1; Path=/; HttpOnly
   ```
2. **Automatic Bucketing Logic**:
   - The CDN generates a unique bucket ID for each user based on preset rules (such as a hash algorithm, random assignment, etc.).
   - Subsequent user requests will carry this Cookie, and the CDN will determine which version of the resource to return based on the bucket ID.
### Example Scenario
Suppose we have three buckets (Bucket A, Bucket B, Bucket C), corresponding to different static resource versions:
- Bucket A: Old version resources.
- Bucket B: New version resources (grayscale testing).
- Bucket C: Backup resources.
When a user visits for the first time, the CDN assigns them a bucket and persists the bucket information via a Cookie. In subsequent requests, the CDN returns the corresponding resources based on the bucket ID in the Cookie.
## Gateway-side Grayscale Release
### Core Principle
As the system's traffic entry point, the gateway can perform fine-grained traffic control based on the bucket information from the CDN or other request characteristics (like Headers, Query parameters, etc.) to achieve grayscale release.
### Implementation
1. **Reading Bucket Information**:
   - The gateway extracts the bucket ID from the request's Cookie or other fields.
   - It routes traffic to different backend services or feature versions based on the bucket ID.
   ```javascript
   const bucketId = request.cookies.bucket_id || 'default';
   if (bucketId === '1') {
     // Route to the grayscale version
     proxyToGrayService(request);
   } else {
     // Route to the default version
     proxyToDefaultService(request);
   }
   ```
2. **Dynamically Adjusting Grayscale Ratio**:
   - The gateway supports dynamic configuration of the grayscale ratio, for example, allocating 10% of the traffic to the new version.
   - The grayscale strategy can be adjusted in real-time through a management console or configuration files.
3. **Monitoring and Rollback**:
   - The gateway logs and metrics for grayscale traffic are recorded to facilitate monitoring the performance of the new version.
   - If problems are found, it can be quickly rolled back to the old version.
### Example Scenario
Suppose we need to conduct a grayscale test for a new feature:
- Configure the gateway to allocate 5% of the traffic to the new version service.
- The remaining 95% of the traffic continues to use the old version service.
- By analyzing logs and user feedback, gradually increase the traffic ratio for the new version until it is fully rolled out.
Next, let's introduce file grayscale. File grayscale refers to the process of gradually pushing new versions of code, configuration files, or other static resources (such as HTML, CSS, JavaScript files, etc.) to some servers or nodes during deployment, instead of a one-time full update.
The code for FaaS applications is stored locally on the machine, like origin server templates. If you want to implement file grayscale release and allow the frontend web page to forcibly hit the grayscale version, you can design it by combining local deployment characteristics and grayscale strategies. Here are several feasible solutions:
### 1. **Directing Traffic via a Load Balancer**
#### Implementation:
- In your FaaS environment, use a load balancer (like Nginx, HAProxy) to distribute traffic to different machines.
- Deploy different versions of the code (e.g., grayscale version and stable version) on each machine.
- The frontend can force a hit on the grayscale machine through a specific request header, Cookie, or URL parameter.
#### Example:
Suppose your load balancer is configured as follows:
```nginx
upstream faas_backend {
    server 192.168.1.10; # Stable version
    server 192.168.1.11; # Grayscale version
}
server {
    listen 80;
    location /api/ {
        if ($arg_gray = "true") {
            proxy_pass http://192.168.1.11; # Force hit on the grayscale machine
            break;
        }
        proxy_pass http://faas_backend; # Default load balancing
    }
}
```
Frontend code:
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```
#### Advantages:
- Simple and efficient grayscale traffic splitting using a load balancer.
- Flexible control over grayscale hits using URL parameters.
#### Disadvantages:
- Requires manual maintenance of code versions on different machines.
- Management costs can be high if there are many grayscale machines.
### 2. **Differentiating Grayscale Versions by File Path**
#### Implementation:
- Deploy different versions of the code on each machine and differentiate them by file path.
- The frontend dynamically loads the corresponding code path via a URL parameter.
#### Example:
Suppose your FaaS application code directory structure is as follows:
```
/faas/
  /stable/  # Stable version code
  /gray/    # Grayscale version code
```
Backend pseudo-code (Node.js example):
```javascript
app.get('/api/function', (req, res) => {
  const isGray = req.query.gray === 'true';
  const codePath = isGray ? '/faas/gray/' : '/faas/stable/';
  
  // Dynamically load the corresponding version of the code
  const handler = require(codePath + 'functionHandler');
  handler(req, res);
});
```
Frontend code:
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```
#### Advantages:
- No need for extra load balancer configuration.
- Clear file paths make management and rollback easier.
#### Disadvantages:
- Requires maintaining multiple code versions on each machine.
- Frequent code updates can increase deployment complexity.
### 3. **Implementing Grayscale with Feature Toggles**
#### Implementation:
- Introduce feature toggles in the code to control whether to enable grayscale logic.
- The frontend passes a grayscale identifier via a request header or URL parameter, and the backend decides which version of the logic to execute based on the identifier.
#### Example:
Backend pseudo-code (Node.js example):
```javascript
app.get('/api/function', (req, res) => {
  const isGray = req.query.gray === 'true';
  if (isGray) {
    // Execute grayscale logic
    res.send({ message: 'This is the gray version' });
  } else {
    // Execute stable logic
    res.send({ message: 'This is the stable version' });
  }
});
```
Frontend code:
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```
#### Advantages:
- No need to maintain multiple code versions; all logic is in one codebase.
- Grayscale logic can be dynamically adjusted with toggles, offering high flexibility.
#### Disadvantages:
- Feature toggle management requires additional tools or frameworks.
- Complex grayscale logic can reduce code readability.
### 4. **Differentiating Grayscale via Local Cache or File Hash**
#### Implementation:
- Deploy different versions of the code on each machine and generate a unique file hash for each version.
- The frontend loads the corresponding code version by specifying the hash value.
#### Example:
Suppose your code directory structure is as follows:
```
/faas/
  /v1/  # Version 1 code
  /v2/  # Version 2 code
```
Backend pseudo-code (Node.js example):
```javascript
app.get('/api/function', (req, res) => {
  const version = req.query.version || 'v1'; // Load v1 by default
  const codePath = `/faas/${version}/`;
  // Dynamically load the corresponding version of the code
  const handler = require(codePath + 'functionHandler');
  handler(req, res);
});
```
Frontend code:
```javascript
const version = 'v2'; // Force load the grayscale version
fetch(`/api/function?version=${version}`)
  .then(response => response.json())
  .then(data => console.log(data));
```
#### Advantages:
- Versioned file management makes tracking and rollback easy.
- The grayscale scope can be precisely controlled by hash values.
#### Disadvantages:
- Requires maintaining multiple versions of code files.
- Too many versions can lead to increased disk space usage.
### Summary
| **Method**                     | **Applicable Scenario**                        | **Advantages**                                | **Disadvantages**                             |
|------------------------------|-----------------------------------------------|---------------------------------------------|---------------------------------------------|
| **Load Balancer Traffic Direction** | Deploying different versions on multiple machines | Simple, efficient, suitable for large-scale grayscale | Requires manual maintenance of code versions on different machines |
| **File Path Differentiation**     | Single-machine, multi-version deployment      | Clear file paths, easy to manage             | Higher deployment complexity                 |
| **Feature Toggle**                 | Single codebase, logic separation             | High flexibility, no need to maintain multiple versions | Complex feature toggle management, may reduce code readability |
| **Local Cache or File Hash**   | Precise control of grayscale scope            | Versioned file management, easy tracking and rollback | Requires maintaining multiple version files, may increase disk usage |
In your scenario, since the code is stored on local machines, it is recommended to prioritize the **Feature Toggle** or **File Path Differentiation** methods. These two methods can meet the needs of grayscale release without significantly increasing deployment and management complexity. If you expand to multiple machines in the future, you can introduce a load balancer to further optimize the grayscale strategy.
## Grayscale Rollout
Solution 1: Write an ID value. When the user ID is greater than this value, the feature is enabled (similar to a whitelist mechanism).
---
## Lerna Multi-package Management Case Study
When compiling a multi-package project managed by Lerna, a TypeScript error occurred. After investigation, the problem was found to be related to the version compatibility of `node`, `typescript`, and `@types/node`.
## Error Description
During compilation, TypeScript reported the following errors:
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
These errors all point to the type definition file `https.d.ts` of `@types/node`, indicating a syntax problem in the type definition file.
## Problem Analysis
Based on the error messages and further investigation, the following conclusions were drawn:
1. **Version Incompatibility**:
   - The version of `@types/node` used in the current project is `22.13.5`, while the project's `typescript` version is `^4.1.3`.
   - Higher versions of `@types/node` (like `22.x`) may introduce new syntax or features that lower versions of `typescript` cannot parse, leading to compilation errors.
2. **Sub-package Dependency Issues**:
   - In the Lerna-managed multi-package project, the root `package.json` configured `"overrides"` and `"resolutions"` to force the version of `@types/node` to `16.18.68`.
   - However, a sub-package still depended on a higher version of `@types/node` (`22.13.5`), and this version was dynamically installed after running `npm run build`.
3. **`skipLibCheck` Configuration Ineffective**:
   - Although `"skipLibCheck": true` was set in `tsconfig.json`, this configuration only skips checking library types and cannot solve the root problem of version conflict.
## Solution
### 1. Downgrade Version in Root Directory
First, in the root `package.json`, try to force the version of `@types/node` to `16.18.68` using `overrides` and `resolutions`:
```json
"overrides": {
  "@types/node": "16.18.68"
},
"resolutions": {
  "@types/node": "16.18.68"
}
```
At the same time, downgrade the versions of `node` and `typescript` to a compatible range:
```json
"node": "20",
"typescript": "^4.1.3"
```
However, this approach did not completely solve the problem, as sub-packages would still dynamically install a higher version of `@types/node`.
### 2. Specify Version in Sub-packages Individually
To completely resolve the version conflict in sub-packages, add a `resolutions` configuration to each sub-package's `package.json` to force the version of `@types/node` to `16.18.68`:
```json
"resolutions": {
  "@types/node": "16.18.68"
}
```
This ensures that sub-packages will not install a higher version of `@types/node` when installing dependencies.
### 3. Clean and Reinstall Dependencies
Run the following commands to clean the project and reinstall dependencies:
```bash
lerna clean -y
npm install
```
Ensure that the `node_modules` of all sub-packages have been correctly cleaned and that the specified versions of dependencies are reinstalled.
### 4. Verify the Solution
Run `npm run build` to compile and confirm that the aforementioned TypeScript errors no longer appear.
---
## babel
> The latest compilation tool is: https://swc.rs/docs/usage/cli
## Babel CLI Parameters
### `--copy-files`
When compiling code with Babel, the `--copy-files` parameter can be used to **copy non-compiled files along with the compiled ones**.
This is very useful when the project contains non-JavaScript files (like `.json`, `.css`, etc.), ensuring these files are copied to the output directory instead of being ignored.
## .babelrc Configuration File
Babel's core configuration file is `.babelrc`, which defines how to transform the code. Here is an example configuration:
```json
{
  "presets": [
    ["env", { "loose": false }]
  ]
}
```
### Presets Configuration
- **`env` Preset**: This is a general-purpose preset for Babel that supports converting modern JavaScript into a backward-compatible version.
- **`loose` option**: Controls whether to enable Loose Mode. The default value is `false`.
## Detailed Explanation of Loose Mode
### Advantages and Disadvantages of Loose Mode
#### How it Works
In Babel, `loose` mode compiles classes to a prototype-based implementation, rather than the default `Object.defineProperty` definition.
#### Advantages
- The compiled code is closer to traditional JavaScript, making it easier to understand and debug.
- In some cases, performance may be slightly improved.
#### Disadvantages
- **Enumeration Issue**: When enumerating with `for...of`, methods on the prototype chain will be enumerated. The default `Object.defineProperty` method can control non-enumerability with the `enumerable` property.
- **Compatibility Risk**: Loose mode may cause some modern JavaScript features to not be fully compatible.
### Side Effect Analysis
When using the default `Object.defineProperty` to define classes, although enumeration issues can be avoided, it may introduce some side effects:
- The compiled code can become verbose and complex.
- In some environments, there may be performance overhead or compatibility issues.
Therefore, when choosing whether to enable `loose` mode, you need to weigh the pros and cons based on the specific needs of the project.
---
## Fatigue Design
## Technical Implementation
- **Cache with Overwriting Installation**:
  If you delete and then reinstall, the cache will be cleared. The cache is usually stored in a local file. It is recommended to integrate the relevant logic into the startup task.
## Business Analysis
### Risk Assessment
1. **Interface Traffic Attack**
   - PC-side requests rely on JS execution, so the risk of traffic attacks is relatively low.
   - The server adopts a single-machine rate-limiting strategy and evaluates the interface QPS to ensure system stability.
2. **Risk of Repeated/Batch Writes**
   - Need to avoid data abnormality issues caused by repeated or batch writes.
3. **Interface Fatigue**
   - Define interface request fatigue rules: for example, initiate a request once every 10 times from outside the app; if the fatigue rule is not met, do not initiate the request.
   - If the server modifies the fatigue value, it will take effect on the second request.
4. **New and Old Version Upgrades**
   - Buttons that have been clicked by users of the old version should remain unclickable in the new version to avoid repeated triggers.
5. **Button Fatigue Differences**
   - The fatigue level of different buttons may vary. Differentiated configuration is required for specific scenarios.
6. **Different Tracking Point Proportions**
   - Set reasonable proportions for different tracking data to meet data analysis needs.
### Fatigue Logic
- **Fatigue Definition**:
  Set independent fatigue rules for each button or interface based on business requirements.
  - Example:
    - Button A: Allowed to be clicked once every 10 minutes.
    - Button B: Allowed to be clicked once every 24 hours.
- **Server-side Update of Fatigue Value**:
  When the server adjusts the fatigue rules, the client needs to synchronize the latest rules on the next request.
## Contingency Plan/Rate Limiting/Fallback
- **Default Value Return**:
  If the fatigue rule is not met or an exception occurs, return a "do not show pop-up" state by default to avoid affecting the user experience.
- **Rate Limiting Strategy**:
  - Single-machine rate limiting: Limit the QPS of a single server to prevent overload.
  - Interface rate limiting: Set request frequency limits at the interface level based on business needs.
- **Fallback Plan**:
  In extreme cases (such as service unavailability), return a default value or static configuration to ensure system availability.
## Testability Assessment
1. **Testing Methods**
   - **Mock IP Testing**: Verify whether the fatigue rules are applied correctly by simulating different IP addresses.
   - **Modify System Time**: Adjust the system time to test whether the fatigue time window logic meets expectations.
2. **Client-side Virtual Version Testing**
   - Use virtual version numbers to simulate different client versions and verify the compatibility and fatigue logic of new and old versions.
## Monitoring and Alerting
- **Monitoring Metrics**
  - Interface call frequency (QPS).
  - Fatigue hit rate (hit/miss ratio).
  - Proportion of abnormal requests (e.g., exceeding limits, repeated writes, etc.).
- **Alerting Mechanism**
  - Set threshold alarms: Trigger an alarm when the interface QPS exceeds a preset value.
  - Logging: Record the fatigue hit status of each request in detail for easy troubleshooting.
- **Log Analysis**
  - Regularly analyze log data to evaluate the actual effectiveness of fatigue rules and optimize rule configurations.
---
## Umi Solution
### Umi
[Umi](https://umijs.org/guide/#features) is a pluggable enterprise-level frontend application framework that supports React and TypeScript. It has built-in features like routing and build tools, making it suitable for quickly building modern frontend projects.
### MobX-State-Tree
[MobX-State-Tree](https://github.com/mobxjs/mobx-state-tree) is a powerful state management library that provides type-safe and tree-structured state management capabilities based on MobX.
### Umi Plugin: umi-plugin-mobx-state-tree
[umi-plugin-mobx-state-tree](https://github.com/umijs/umi-plugin-mobx-state-tree) is an official Umi plugin for integrating MobX-State-Tree into Umi projects, simplifying the configuration of state management.
## Initialize Umi Project
Quickly initialize a Umi project with the following command:
```bash
yarn create umi
```
Choose the `app` template and select whether to enable Ant Design as needed (if you need to use Ant Design, please check the box).
## Create Umi Page
### Normal Route
A normal route can be defined directly as follows:
```jsx
<Route path="/home" component={Home} />
```
Then generate the corresponding page with a Umi command:
```bash
umi g home/index
```
### Dynamic Route
Dynamic routes support path parameters, for example:
```
/order-result/:type/:orderId
```
You can generate a dynamic page with the following command:
```bash
umi g orderResult/$type/$orderId/index
```
## Modify Umi Entry Page
Create a `document.ejs` file under `src/pages`:
```bash
touch src/pages/document.ejs
```
Copy the template content from [template/document.ejs](https://github.com/umijs/umi/blob/master/packages/umi-build-dev/template/document.ejs) into this file, and then customize SEO information or the Favicon:
```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```
## Modify Umi Configuration
Umi's configuration file can be `.umirc.js` or `config/config.js`. Here is an example configuration:
```js
export default {
  externals: { // Global variable control
    wx: 'wx',
    qq: 'qq',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // Default public directory
  },
  plugins: [
    ['umi-plugin-react', {
      antd: true, // Whether to enable Ant Design
      dva: false,
      title: "China Railway Business Travel", // Default document.title
      dynamicImport: false,
      dll: true,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
    ["umi-plugin-mobx-state-tree", {
      exclude: [/^\$/], // Exclude stores starting with $
    }],
  ],
  alias: {
    '@src': path.resolve(__dirname, 'src'),
  },
};
```
## Umi Global Mixin Style Injection
Configure global Mixin style injection via `chainWebpack`:
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
## Disable CSS Modules for Certain Files
If you need to disable the CSS Modules feature for certain files, you can add this to your configuration:
```js
cssModulesExcludes: [
  '/src/pages/order/index.less',
]
```
## Coexistence of Global Less Styles and CSS Modules
If you need to use both global styles and CSS Modules styles, you can use `:global` in your `.less` file:
```less
:global {
  .some-class-name-used {
    color: red;
  }
}
```
## Managing Stores with MobX-State-Tree
### Directory Structure
```bash
-src 
    -stores (create manually)
        xxx.js (key for the store)
```
### Create a Store
```js
import { types } from "mobx-state-tree";
const userInfoInterface = types.model({
  username: '22',
  password: '123'
});
const XXX = types
  .model('Auth', {
    type: types.array(types.string, ""), // Array
    startStationCode: types.maybeNull(types.number), // Can be null
    startTime: types.optional(types.union(types.number, types.string), 0), // Multiple types
    userInfo: types.optional(userInfoInterface, {}), // Has a default value, allows undefined
    userInfo2: types.maybe(userInfoInterface) // No default value
  })
  .actions(self => ({
    async login(username, password) {
      // Login logic
    }
  }));
export default XXX;
```
### Register Stores Globally
`umi-plugin-mobx-state-tree` will automatically load all files under `src/stores` (you can exclude some files via `exclude`) and load them on demand. There is no need to manually create instances or inject them via a `Provider`.
## React Component Registration
```js
@observer
class ComponentA extends Component {
  componentDidMount() {
    this.props.login(); // Call an action from the store
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
  login: stores.xxx.login, // Pass an action from the store
  userInfo: stores.xxx.userInfo, // Pass data from the store
  ...ownProps
}))(ComponentA));
```
## Calling Store Actions Externally
The store instances registered by `umi-plugin-mobx-state-tree` will be attached to the `window` object:
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
## JSONPath Field Pruning
### JSON Extraction
1. Extract the `countDown` field.
2. Extract the first 5 elements from the `products` list.
3. Extract the `id` of each `product`.
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
### Using JSONPath for Field Pruning
1. **Extract the `countDown` field:**
   ```jsonpath
   $.data.countDown
   ```
2. **Extract the first 5 elements from the `products` list:**
   ```jsonpath
   $.data.products[0:5]
   ```
3. **Extract the `id` of each `product`:**
   ```jsonpath
   $.data.products[0:5].id
   ```
---
## Login-free Solution
## Problem Scenario
Site A embeds Site B, and the two sites have different domains. It is necessary to implement a login-free jump for users from Site A to Site B.
## Solutions
### Solution 1: Via a Login-free API
- **Implementation**
  Site A calls a login-free API provided by Site B, carrying necessary parameters (such as redirect address, language, etc.), to achieve a login-free jump for the user.
  
- **Key Points**
  - **Redirect Parameter**: Used to jump back to the target page.
  - **Other Necessary Parameters**: Such as language, used to switch the language environment of Site B.
  
- **Limitation**
  - If the browser has disabled third-party cookies, the cookie cannot be written to Site B, causing the login-free process to fail.
### Solution 2: Via a Token
- **Implementation**
  Site A requests a temporary token from the server, then accesses Site B's login-free URL via an iframe, passing the token to Site B.
- **Key Points**
  - **Token Transmission Method**
    - It is recommended to pass the token through the request header to avoid exposing sensitive information in the URL.
  - **Token Validity**
    - Set a reasonable token validity period to ensure security.
  - **Source Verification**
    - Verify that the source of the token is legitimate to prevent forged requests.
  - **Exception Monitoring**
    - Monitor for exceptions during the login-free process to identify problems in a timely manner.
  - **HTTPS Security**
    - Ensure all communication is done over HTTPS to prevent man-in-the-middle attacks.
- **Fallback Page**
  - Site B needs to provide a unified fallback page for login-free failures to handle cases where the process fails.
## Security and Fallback Measures
1. **Security**
   - **Token Security**
     - Use short-lived tokens to reduce the risk of leakage.
     - Verify the legitimacy of the token to ensure it was issued by a trusted server.
   - **HTTPS Encryption**
     - All communication must use HTTPS to prevent data from being stolen or tampered with.
   - **Source Validation**
     - Validate the request source to prevent cross-site attacks.
2. **Fallback Measures**
   - **Login-free Failure Page**
     - Provide a friendly failure page to guide users to log in manually or take other actions.
   - **Logging**
     - Record key logs during the login-free process to facilitate troubleshooting.
---
## metaq
In modern distributed systems, as the number of users and requests increases, the server may face the following challenges:
- **High Concurrency Requests**: A large number of requests arriving in a short period can exhaust server resources.
- **Decreased Service Stability**: Too many requests can cause service response to slow down or crash.
- **Insufficient Scalability**: Traditional synchronous processing methods struggle to cope with sudden traffic spikes.
To solve these problems, introducing a message queue (like MetaQ) has become an effective approach.
## The Role of MetaQ
MetaQ is a high-performance message queue middleware with the following main functions:
- **Peak Shaving and Valley Filling**: Smooths out traffic pressure during peak periods by processing requests asynchronously.
- **System Decoupling**: Separates producers and consumers, reducing the coupling between systems.
- **Improving Reliability**: Message queues can persist messages, ensuring no data is lost.
- **Supporting Distributed Architecture**: Suitable for large-scale distributed systems, enhancing system scalability and fault tolerance.
## MetaQ Cross-Unit
You can listen to metaq messages across units, but you cannot send messages across units.
## Sequential Messages
By default, order is not guaranteed. This can be handled at the business level, for example, a state that is further along cannot be updated by a state that is behind it. This ensures that the state does not regress.
---
## rpc
## RPC Overview
RPC (Remote Procedure Call) is a technology that allows a client to call methods on a remote server as if they were local methods. Its core idea is to implement function calls across processes or machines over a network.
## Registry Center and Dynamic IP Management
In a distributed system, a **registry center** (like ConfigCenter) is used to manage the dynamic IP addresses and metadata of services. Its main functions include:
- **Service Registration**: A service registers its own address with the registry center upon startup.
- **Service Discovery**: A client obtains the address of a target service from the registry center.
- **Dynamic Management**: Supports functions like service online/offline, load balancing, etc.
## RPC Protocol Specification
The RPC protocol defines the communication specification between the client and the server. The following is an example of a typical RPC request format:
```json
{
    "serviceName": "xxx",
    "methodName": "getList"
}
```
- `serviceName`: Specifies the name of the service to be called.
- `methodName`: Specifies the name of the method to be called.
This request is serialized into a string, transmitted over the network to the server, and then deserialized and processed.
## The Essence of the Proxy Pattern
One of the core mechanisms of RPC is the **proxy pattern**. The proxy layer sits between the client and the server and is responsible for handling the following tasks:
- **Serialization/Deserialization**: Converts request objects into a byte stream for transmission and restores them to objects at the receiving end.
- **Network Communication**: Responsible for sending and receiving data packets.
- **Error Handling**: Catches and handles network exceptions or server-side errors.
The proxy mechanism allows the application to focus on the business logic itself, without needing to worry about the underlying complexity.
## Network Communication Issues: IP Routing from China to Singapore
When accessing an IP in Singapore from within China, you may encounter the following issues:
- **Carrier Interception**: Some carriers may intercept specific HTTPS requests.
- **DNS Resolution Differences**: When accessing via a domain name, the IP returned by DNS may differ from the IP obtained by a direct `ping`, leading to access failure.
**Recommendation:**
- When communicating between internal application machines, it is recommended to use HTTP instead of HTTPS to avoid issues like certificate offloading.
## Generic Invocation
Generic invocation is a calling method that does not rely on a specific interface definition, suitable for dynamic scenarios. The characteristics of generic invocation are as follows:
- **High Flexibility**: No need to define interfaces in advance, suitable for dynamically generated requests.
- **Strong Compatibility**: Can achieve universal calls between different languages or frameworks.
## HSF Generic Parameter Construction
HSF (High-Speed Service Framework) is a high-performance service framework from Alibaba that supports generic invocation. The key steps for constructing HSF generic parameters are as follows:
1. **Determine Service and Method Names**: Clearly identify the service and method to be called.
2. **Construct Parameter List**: Construct parameters according to the method signature.
3. **Serialize Request**: Serialize the request object into a byte stream.
**Notes:**
- Parameter types must be consistent with the server-side method signature.
- Ensure the serialization method is compatible with the server side.
## Case Study
A Node.js application calls HSF, with an object as an input parameter. The fields of the object cannot be enums or `List<CustomObject>`.
Technology:
Change enum to string.
Change custom object to `List<Map<String, String>>` type.
## RPC Interface Caching
How does HSF cache based on parameters?
key: id(xxx)_method(get/post)_uid(unique_id), the underlying structure is a `Map<string, Promise<any>>`
---
