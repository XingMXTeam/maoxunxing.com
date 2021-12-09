---
title: "How to Tree Shaking"
date: 2021-12-06T19:40:56+08:00
draft: true
---

## webpack开启tree-shaking

package.json: 设置sideEffects

``` json
"sideEffects": [
	"*.css",
	"*.scss"
],
```

webpack.commmon.js
```
optimization: {
	//usedExports: false
}

resolve: {
	//es是兼容老的构建产物中包含es的
	mainFields: ['browser', 'module', 'es', 'main'],
}
```

.babelrc： 禁止转换模块，交由webpack进行模块化处理

```
presets [["env", { "modules": false }]]
```


