---
title: "Jsx Runtime Error"
date: 2022-01-24T13:15:59+08:00
tags:
  - React
---

Error Messages and Solutions

## **1. Error Messages**

### **Error Description**

The following error occurred when starting the development server:

```shell
node_modules/_@alife_ae-data-util@0.0.7-beta.1642998062985@@alife/ae-data-util/lib/hooks/medusa/index.js:10:28: error: Could not read from file: /Users/maoxunxing/alibaba/ae-seller-components/node_modules/.vite-plugin-externals/react.1a37f6a0.js/jsx-runtime
    10 │ import { jsx as _jsx } from “react/jsx-runtime”;
       ╵                             ~~~~~~~~~~~~~~~~~~~

error when starting dev server:
Error: Build failed with 1 error:
node_modules/_@alife_ae-data-util@0.0.7-beta.1642998062985@@alife/ae-data-util/lib/hooks/medusa/index.js:10:28: error: Could not read from file: /Users/maoxunxing/alibaba/ae-seller-components/node_modules/.vite-plugin-externals/react.1a37f6a0.js/jsx-runtime
```

---

## **2. Solution**

### **Modify the `tsconfig.json` file**

Change the `jsx` configuration in `tsconfig.json` from `“react-jsx”` to `“react”`.

#### **Modified configuration**

```json
{
  “compilerOptions”: {
    “baseUrl”: “.”,
    “outDir”: “./lib”,
    “module”: “esnext”,
    “target”: “es6”,
    “lib”: [‘esnext’, “dom”],
    “sourceMap”: true,
    “allowJs”: false,
    “jsx”: ‘react’ // Change “react-jsx” to “react”
  }
}
```

---

## **3. Notes**

1. **`jsx` Configuration Notes**:
   - `“react-jsx”`: A new JSX conversion method for React 17+.
   - `“react”`: A traditional React JSX conversion method with better compatibility.

2. **Clear Cache**:
   - After modifying the configuration, it is recommended to clear the project cache and reinstall dependencies:
 ```shell
     rm -rf node_modules package-lock.json
     npm install
     ```

3. **Verify Fix**:
   - Ensure the development server is restarted after modifications and verify the issue is resolved.
