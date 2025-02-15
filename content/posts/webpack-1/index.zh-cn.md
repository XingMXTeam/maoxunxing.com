---
title: "Webpack Externals "
description: ""
date: 2024-09-08
tags:
  - Webpack
images:
  - webpack-1/a.png
---

{{< table_of_contents >}}

## Externals

这种方式声明的脚本会以`<script>`的方式加载，在首页不会默认加载，只有在用到`import _ from 'lodash'` 是会umd的方式加载，然后赋值给`_`

副作用：`import _ from 'lodash'`会被重写成

```js

import('./lodash.js').then(res => ...)

```

```js
module.exports = {
  // ...
  externalsType: 'script',
  externals: {
    lodash: ['https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js', '_'],
  },
};
```

## 如何判断包是否被externals了？

一般在umd的头部， 发现`root['packageName']` 那么这个包就是被externals掉了