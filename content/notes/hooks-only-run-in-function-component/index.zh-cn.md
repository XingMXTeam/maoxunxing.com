---
title: "Hooks don't work with yarn link"
date: 2021-11-29T12:06:58+08:00
---

在本地 tnpm link 多个包时，报错 Hooks Only Run in Function Component。这个情况一般是 react 有多个复制版本导致的。

解决方案是将 react react-dom 都 link 到同一个

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
