---
title: "Hooks don't work with yarn link"
date: 2021-11-29T12:06:58+08:00
draft: true
---

在本地tnpm link多个包时，报错Hooks Only Run in Function Component。这个情况一般是react有多个复制版本导致的。 

解决方案是将react react-dom都link到同一个


``` shell
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