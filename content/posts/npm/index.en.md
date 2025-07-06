---
title: "What You Need to Know About NPM"
description: ""
date: 2024-09-10
tags:
  - NPM
  - Web Development
images:
  - npm/npm.webp
custom_toc:
  - title: "npm vs pnpm"
  - title: "Component Library TS Type Definitions"
  - title: "UNPKG"
  - title: "Parsing package.json Fields"
  - title: "files"
  - title: "Deleting node_modules"
  - title: "npm link"
---
## npm vs pnpm
## What are Ghost Dependencies?
**Ghost Dependencies** are dependencies that are used in the project but not explicitly declared in `package.json`. This situation often occurs with npm and Yarn because their flattened dependency structure allows access to packages that are not directly declared.
### Example
Suppose your project has a direct dependency on `express`:
```json
{
  "dependencies": {
    "express": "4.17.1"
  }
}
```
`express` depends on `body-parser`, so `body-parser` will also be installed in `node_modules`.
In your code, you can use `body-parser` directly, even though it's not declared in `package.json`:
```javascript
const bodyParser = require('body-parser');
```
This code will run, but `body-parser` is actually a **ghost dependency**.
### Problems
1. **Reliability Issues**  
   If `express` no longer depends on `body-parser` in the future, your code might suddenly break.
   
2. **Version Inconsistency**  
   Different developers might install different versions of dependencies, leading to inconsistent project behavior.
3. **Maintenance Difficulty**  
   Ghost dependencies make the project's dependency relationships ambiguous, increasing maintenance costs.
## Problems Solved by pnpm
pnpm addresses many issues found in traditional package managers (like npm and Yarn), including the problem of ghost dependencies, through its strict dependency tree structure and optimized storage mechanism.
### 1. Disk Space Efficiency
- **Feature**: pnpm uses hard links and symbolic links to share packages, avoiding duplicate installations of the same package.
- **Problem Solved**: Reduces disk space usage, which is especially significant in large projects.
### 2. Installation Speed
- **Feature**: pnpm is generally faster than npm, particularly when installing dependencies for large projects.
- **Problem Solved**: Speeds up the initial project setup and dependency update process, improving development efficiency.
### 3. Dependency Management
- **Feature**: pnpm uses a strict dependency tree structure, only allowing access to explicitly declared dependencies.
- **Problem Solved**: Eliminates the "ghost dependency" problem, enhancing project reliability and maintainability.
### 4. Single Store
- **Feature**: pnpm maintains a centralized package store (global store) on the system, and all projects share these packages.
- **Problem Solved**: Further saves disk space and speeds up package installation across multiple projects.
### 5. Parallel Installation
- **Feature**: pnpm installs packages in parallel by default, making full use of multi-core CPU performance.
- **Problem Solved**: Reduces dependency installation time for large projects, improving installation efficiency.
### 6. Better Lock File
- **Feature**: pnpm's lock file (`pnpm-lock.yaml`) is more concise and easier to manage in version control.
- **Problem Solved**: Improves team collaboration and version consistency, ensuring identical dependency installation results across different environments.
---
## Component Library TS Type Definitions
## Component Export Declaration
### Example: Component Export
In a component library, it's common to provide a default export and type definitions for each component. For example:
```javascript
// Button/index.ts
export { default as Button } from './Button';
export type { ButtonProps } from './Button';
```
### The `exports` field in `package.json`
To support both CommonJS and ESM module systems while providing type definition files, you can use the `exports` field in `package.json` for fine-grained module export configuration.
```json
{
  "name": "my-component-library",
  "version": "1.0.0",
  "main": "cjs/index.js", // CommonJS entry point
  "module": "esm/index.js", // ESM entry point
  "types": "esm/types/index.d.ts", // Type definition file for the main entry point
  "exports": {
    "./button": {
      "require": "./cjs/Button/index.js", // CommonJS import path
      "import": "./esm/Button/index.js", // ESM import path
      "types": "./esm/types/Button/index.d.ts" // Type definition for the Button component
    },
    "./modal": {
      "require": "./cjs/Modal/index.js", // CommonJS import path
      "import": "./dist/Modal/index.js", // ESM import path
      "types": "./cjs/types/Modal/index.d.ts" // Type definition for the Modal component
    }
  }
}
```
## TypeScript Configuration (`tsconfig.json`)
To ensure TypeScript can correctly resolve modules and generate type definition files, you need to configure `tsconfig.json` appropriately.
### Example Configuration
```json
{
  "compilerOptions": {
    "moduleResolution": "node16", // Supports ESM module resolution for Node.js 16+
    "declaration": true, // Enable generation of type definition files
    "declarationDir": "./esm/types", // Output directory for type definition files
    "outDir": "./dist", // Output directory for compiled files
    "target": "ESNext", // Target ECMAScript version
    "module": "ESNext", // Use ES modules
    "strict": true // Enable strict mode
  }
}
```
### Restart TypeScript Server
After modifying `tsconfig.json`, it is recommended to restart the TypeScript server to ensure the configuration takes effect:
1. Open the VSCode command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`).
2. Type `TypeScript: Restart TS Server` and press Enter.
## Providing Type Definitions Based on TypeScript Version
To maintain compatibility with different versions of TypeScript, you can use the `typesVersions` field to specify corresponding type definition files for different TypeScript versions.
### Example Configuration
```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/cjs/index.js", // CommonJS entry point
  "module": "dist/esm/index.js", // ESM entry point
  "types": "dist/cjs/index.d.ts", // Default type definition file
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js", // CommonJS import path
      "import": "./dist/esm/index.js" // ESM import path
    }
  },
  "typesVersions": {
    "<4.5": { // Type definitions for TypeScript < 4.5
      "*": ["dist/cjs/index.d.ts"]
    },
    ">=4.5": { // Type definitions for TypeScript >= 4.5
      "*": ["dist/esm/index.d.ts"]
    }
  }
}
```
### Explanation
- **`<4.5`**: For older versions of TypeScript, use CommonJS type definition files.
- **`>=4.5`**: For TypeScript 4.5 and higher, use ESM type definition files.
---
## UNPKG
[UNPKG](https://unpkg.com/) is a content delivery network (CDN) based on [npm](https://www.npmjs.com/) that allows developers to directly access and load resources from npm packages via a browser. It provides a convenient way for front-end development to quickly include necessary libraries or tools without downloading or installing them.
## Core Features of UNPKG
1. **Direct Access to npm Packages**  
   UNPKG offers a simple way for developers to access any package published on npm directly through a URL.
2. **Version Management Support**  
   You can specify a specific version of an npm package to load, ensuring that the dependency versions used in your project are stable and consistent.
3. **Real-time Package Content Browsing**  
   UNPKG provides an online browsing feature for npm package contents, making it easy for developers to view the structure and files of a package.
4. **Fast Resource Loading**  
   As a CDN, UNPKG utilizes globally distributed nodes to accelerate resource loading, improving page performance.
## How to Use UNPKG
### Accessing Library Files
With UNPKG, you can directly include resources from npm packages in your HTML file. For example, to load the `lodash` library:
```html
<script src="https://unpkg.com/lodash"></script>
```
The code above will load the latest version of `lodash` and attach it to the global variable `_`.
### Loading a Specific Version of a Resource
To avoid compatibility issues caused by version updates, you can specify a particular version of a resource to load. For example, to load version `4.17.21` of `lodash`:
```html
<script src="https://unpkg.com/lodash@4.17.21"></script>
```
### Browsing Package Contents
UNPKG also supports browsing the contents of an npm package directly in the browser. Simply visit the following URL:
```
https://unpkg.com/<package-name>/
```
For example, to access the contents of the `lodash` package:
```
https://unpkg.com/lodash/
```
This will display the directory structure of the `lodash` package, including its files and subdirectories.
## Advantages of UNPKG
1. **No Installation Required**  
   Developers can directly include required libraries via a URL without manual downloading or installation.
2. **Version Control**  
   Supports specifying version numbers to ensure the stability of project dependencies.
3. **Fast Loading**  
   Leveraging the globally distributed nodes of a CDN, UNPKG provides efficient resource loading speeds.
4. **Transparency**  
   You can directly view the contents of an npm package to understand its file structure and dependencies.
5. **Seamless Integration with the npm Ecosystem**  
   All packages published to npm can be accessed through UNPKG, fully leveraging npm's vast ecosystem.
---
## Parsing package.json Fields
## main
The `main` field specifies the default entry file when a package is loaded with `require`. For example, when using a package in `umd` format, you can specify the entry file with `main`.
```json
{
  "main": "dist/my-package.umd.js"
}
```
## exports
The `exports` field can restrict how external modules access the package's internal modules. For example:
```json
{
  "exports": {
    ".": "./index.js",
    "./feature": "./feature.js"
  }
}
```
With `exports`, you can explicitly specify which modules can be accessed externally, thereby enhancing the package's security and controllability. It can define multiple file export declarations.
`exports` has a higher priority than `main`. For details, see the [documentation](https://nodejs.org/api/packages.html#package-entry-points).
## sideEffects
The `sideEffects` field is used to identify which files or modules have side effects (a side effect is anything that affects the outside world).
- `sideEffects: false` indicates that no files have side effects.
- `sideEffects: ["*.css"]` indicates that CSS files have side effects.
```json
{
  "sideEffects": {
    "es/index.js" // Specifies the entry file; typically, the entry file should not be removed
  }
}
```
## module
The `module` field is typically used to support `import/export` syntax, specifying an entry file that conforms to the ES Module specification. By distinguishing between `main` and `module`, you can support multiple import methods.
## alias
`alias` supports multi-version management of npm packages, ensuring that different versions of dependencies can be loaded correctly.
## package-lock.json
`package-lock.json` is npm's lock file, used to lock the specific versions of dependencies in a project, ensuring that the installed dependencies are consistent across different environments.
### Common Operations
- Deleting `node_modules` and re-running `npm install` will generate a new `package-lock.json` file.
- Using `npm i` or `npm update` will update the `package-lock.json` file.
## Case Studies
### Case 1: Automatic Upgrade Causes Page Abnormalities
#### Problem Description
Due to an automatic upgrade of a component library package (like `next`), the page behaves abnormally, for example, `setState` causes an infinite loop. Moreover, the issue only appears for some users, making it difficult to locate.
#### Solution
By comparing the `package-lock.json` files, it was found that the `next` version had been upgraded. To avoid similar issues:
1. **Do not modify the `package-lock.json` file unless absolutely necessary**.
2. If deleting `node_modules` causes some package versions to be automatically upgraded, only the specific package versions should be adjusted, not a wholesale update.
### Case 2: Problem with tnpm's resolutions Configuration
#### Problem Description
When using `tnpm`, after configuring the `resolutions` field, deleting `node_modules` does not automatically generate a `package-lock.json` file.
#### Solution
Change `tnpm`'s `resolutions` configuration to npm's `overrides` configuration to ensure that the `package-lock.json` file can be generated correctly.
---
## files
In `package.json`, the `files` field is used to specify which files or directories will be included in the content of an npm package when it is published. By explicitly listing the files to be included, developers can more precisely control the content of the published package and avoid including unnecessary files.
## Official Documentation Link
For more information, you can refer to the [npm official documentation](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files).
## Function and Purpose
### Main Functions
- **Control Packaging Scope**:
  - The `files` field defines a whitelist of files or directories. Only the listed files and directories will be included in the npm published package.
  - Other unlisted files (unless they are default included files) will be excluded.
- **Reduce Package Size**:
  - By including only necessary files, you can effectively reduce the size of the npm package, improving download and installation speed.
- **Protect Sensitive Information**:
  - Avoid accidentally publishing test files, configuration files, or other non-essential content to npm.
## Default Behavior
Even if the `files` field is not defined, npm will default to including the following files or directories:
1. `package.json`
2. `README` (supports various extensions, such as `.md`, `.txt`, etc.)
3. `CHANGELOG` (supports various extensions, such as `.md`, `.txt`, etc.)
4. `LICENSE` / `LICENCE` (supports various extensions, such as `.md`, `.txt`, etc.)
5. `index.js` or another entry file (as defined by the `main` field)
Additionally, the `.npmignore` file will override the behavior of the `files` field. If `.npmignore` exists, it will further filter out unwanted files.
## How to Use
### Basic Syntax
In `package.json`, `files` is an array where each element is a string representing a file path or directory path. For example:
```json
{
  "files": [
    "dist/",
    "src/",
    "index.js",
    "README.md"
  ]
}
```
### Example Explanation
- `"dist/"`: Includes the entire `dist` directory and all its sub-files.
- `"src/"`: Includes the entire `src` directory and all its sub-files.
- `"index.js"`: Includes only the `index.js` file in the root directory.
- `"README.md"`: Includes only the `README.md` file in the root directory.
## Points to Note
1. **Priority Rules**:
   - If both `.npmignore` and `files` are defined, `files` has higher priority.
   - The `.gitignore` file does not affect the behavior of the `files` field.
2. **Excluding Specific Files**:
   - If you need to exclude certain files, you can use it in conjunction with `.npmignore`.
   - For example, adding `*.log` to `.npmignore` can exclude all log files.
3. **Debugging Packaged Content**:
   - Use the following command to see the actual packaged content:
     ```bash
     npm pack
     ```
   - This command will generate a `.tgz` file, which you can decompress to see the finally included files.
## Example Configuration
The following is a complete `package.json` example showing how to use the `files` field:
```json
{
  "name": "example-package",
  "version": "1.0.0",
  "description": "An example package demonstrating the use of the 'files' field.",
  "main": "dist/index.js",
  "files": [
    "dist/",
    "src/",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "devDependencies": {
    "typescript": "^4.0.0"
  }
}
```
---
## Deleting node_modules
```shell
find . -name "node_modules" -type d -prune -print -exec rm -rf "{}" \;
```
---
## npm link
## **1. Basic Usage of `npm link`**
`npm link` is a convenient way to link a local package to a project, often used for development and debugging. However, you might encounter some issues during its use.
### **2. Common Problems and Solutions**
#### **2.1 Deleting Redundant `node_modules` Packages**
- **Problem Description**:
  - After running `npm link`, you might find that the linked package cannot be found.
  - This could be due to redundant or incomplete dependency packages in `node_modules`.
- **Solution**:
  - Check if the packages under `node_modules` are complete.
  - If there's an issue, you can try deleting the redundant `node_modules` and reinstalling dependencies:
    ```shell
    rm -rf node_modules package-lock.json
    npm install
    ```
- **Possible Cause**:
  - Different versions of `npm` might cause dependency resolution issues.
#### **2.2 Node.js Version Consistency**
- **Problem Description**:
  - If you switched the Node.js version using a command like `nvm use 14` before running `npm link`, it might lead to an inconsistent linked directory structure.
- **Solution**:
  - Ensure that both linked projects use the same Node.js version.
  - You can check and switch versions with the following commands:
    ```shell
    nvm list
    nvm use <version>
    ```
#### **2.3 React Hooks Error Problem**
- **Problem Description**:
  - When using `npm link`, you might encounter the following error:
    ```
    Hooks can only be called inside the body of a function component.
    ```
  - The reason is that there are multiple `react` instances in the project (i.e., multiple versions of `react` and `react-dom`).
- **Solution**:
  - Move the `react` and `react-dom` dependencies to `peerDependencies` to ensure the sub-project does not install `react` on its own.
  - Link the parent project's `react` and `react-dom`. The specific steps are as follows:
    ```shell
    # 1. In the child project, remove the direct dependencies on react and react-dom
    npm uninstall react react-dom
    # 2. In the child project's package.json, add peerDependencies
    "peerDependencies": {
      "react": "^17.0.0",
      "react-dom": "^17.0.0"
    }
    # 3. Link the parent project's react and react-dom
    cd PARENT_PROJECT/node_modules/react
    npm link
    cd ../react-dom
    npm link
    # 4. In the child project, link the parent project's react and react-dom
    cd CHILD_PROJECT
    npm link react
    npm link react-dom
    ```
## **1. Quickly View README**
Quickly view the content of a `README` file via the command line:
```shell
readme net
```
## **2. Quickly Install npm Packages**
Use `npmi` to quickly install npm packages:
```shell
npm install -g npmi
```
## **3. Explanation**
- **`readme net`**:
  - Used to quickly view the `README` file content of a project.
  - Ensure the relevant tool is correctly installed and configured.
- **`npmi`**:
  - A simplified npm installation tool that improves installation efficiency.
  - After installation, you can directly use `npmi <package-name>` to install dependency packages.
- **`npm version patch`**
  -  Automatically updates to a new patch version.
---
## Install two different versions of a package
```text
"antdmo2": "npm:antd-mobile@^2.3.4",
"antdmo5": "npm:antd-mobile@5.33.0",
```
