---
title: "Hooks don't work with yarn link"
date: 2021-11-29T12:06:58+08:00
---

When linking multiple packages in local tnpm, the error Hooks Only Run in Function Component is reported. this situation is usually caused by multiple replicated versions of react.

The solution is to link all react react-dom to the same

```shell
cd PACKAGE_YOU_DEBUG_LOCALLY
yarn link
yarn install
cd node_modules/react
yarn link
cd ../../node_modules/react-dom
yarn link
cd YOUR_PROJECT
yarn link PACKAGE_YOU_DEBUG_LOCALLY
yarn link react
yarn link react-dom
```
