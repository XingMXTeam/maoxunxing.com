---
title: "Jsx Runtime报错"
date: 2022-01-24T13:15:59+08:00
---

```shell
node_modules/_@alife_ae-data-util@0.0.7-beta.1642998062985@@alife/ae-data-util/lib/hooks/medusa/index.js:10:28: error: Could not read from file: /Users/maoxunxing/alibaba/ae-seller-components/node_modules/.vite-plugin-externals/react.1a37f6a0.js/jsx-runtime
    10 │ import { jsx as _jsx } from "react/jsx-runtime";
       ╵                             ~~~~~~~~~~~~~~~~~~~

error when starting dev server:
Error: Build failed with 1 error:
node_modules/_@alife_ae-data-util@0.0.7-beta.1642998062985@@alife/ae-data-util/lib/hooks/medusa/index.js:10:28: error: Could not read from file: /Users/maoxunxing/alibaba/ae-seller-components/node_modules/.vite-plugin-externals/react.1a37f6a0.js/jsx-runtime
```

解决方案：
修改 tsconfig.ts

```json
"compilerOptions": {
    "baseUrl": ".",
    "outDir": "./lib",
    "module": "esnext",
    "target": "es6",
    "lib": ["esnext", "dom"],
    "sourceMap": true,
    "allowJs": false,
    "jsx": "react", // change react-jsx to react
}
```
