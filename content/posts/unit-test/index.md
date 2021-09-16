---

---

## 单测

@types/mocha 
ts-node

mocha.opts  

```
--require ts-node/register
test/**/*.test.ts
```

``` js
import 'mocha'
```

## 覆盖率

``` js
// cov: nyc mocha
npm run cov
```

``` js
{
  "nyc": {
    "include": {
      "src/*.tx",
      "src/**/*.ts"
    },
    "exclude": {
      "typings",
      "dist"
    },
    "extensions": {
      ".ts"
    },
    "require": {
      "ts-node/register"
    },
    "reporter": {
      "json",
      "html"
    },
    "all": true
  }
}
```

lerna 下统计测试覆盖率

``` js
nyc lerna run cov --concurrency = 1
```

spawn-wrapper 注入子进程

``` js
{
  "include": [
    "packages/*/src/*.ts",
    "packages/*/src/**/*.ts"
  ],
  "exclude": [
    "**/typings",
    "**/*.d.ts",
    "**/dist",
    "**/src/index.ts",
  ],
  "extensions": [
    ".ts"
  ],
  "reporter": [
    "json",
    "html"
  ],
  "all": true
}
```

nyc，ts-node 只在顶层安装
