---
title: "mobx-react和umi(乌米)替换redux和react-dom-router方案总结"
date: 2025-02-04
tags:
  - Web开发
  - 工程
images:
  - umi/image.png
---

本文档详细介绍了如何使用 [Umi](https://umijs.org/zh/guide/#特性) 框架结合 [MobX-State-Tree](https://github.com/mobxjs/mobx-state-tree) 进行项目开发。内容涵盖了从项目初始化到状态管理的完整流程，并提供了详细的配置和代码示例。

---

## 目录

1. [开始](#开始)
   - [Umi](#umi)
   - [MobX-State-Tree](#mobx-state-tree)
   - [Umi 插件：umi-plugin-mobx-state-tree](#umi-plugin-mobx-state-tree)
2. [Umi 初始化项目](#umi初始化项目)
3. [Umi 创建页面](#umi创建页面)
4. [Umi 修改入口页面](#umi修改入口页面)
5. [Umi 修改配置](#umi修改配置)
6. [Umi 全局 Mixin 样式注入](#umi全局mixin样式注入)
7. [禁用某些文件的 CSS Modules 功能](#禁用某些文件的cssmodules功能)
8. [Less 全局样式和 CSS Modules 样式共存](#less全局样式和cssmodules样式共存)
9. [MobX-State-Tree 管理 Store](#mobx-state-tree管理store)
   - [目录结构](#目录结构)
   - [创建一个 Store](#创建一个store)
   - [全局注册 Stores](#全局注册stores)
10. [React 组件注册](#react组件注册)
11. [外部调用 Stores 的 Action](#外部调用stores的action)

---

## 开始

### Umi
[Umi](https://umijs.org/zh/guide/#特性) 是一个可插拔的企业级前端应用框架，支持 React 和 TypeScript，内置路由、构建工具等功能，适合快速搭建现代化前端项目。

### MobX-State-Tree
[MobX-State-Tree](https://github.com/mobxjs/mobx-state-tree) 是一个强大的状态管理库，基于 MobX 提供了类型安全和树形结构的状态管理能力。

### Umi 插件：umi-plugin-mobx-state-tree
[umi-plugin-mobx-state-tree](https://github.com/umijs/umi-plugin-mobx-state-tree) 是 Umi 官方提供的插件，用于集成 MobX-State-Tree 到 Umi 项目中，简化状态管理的配置。

---

## Umi 初始化项目

通过以下命令快速初始化一个 Umi 项目：
```bash
yarn create umi
```
选择 `app` 模板，并根据需要选择是否启用 Ant Design（如需使用 Ant Design，请勾选）。

---

## Umi 创建页面

### 普通路由
普通路由可以直接通过以下方式定义：
```jsx
<Route path="/home" component={Home} />
```
然后通过 Umi 命令生成对应页面：
```bash
umi g home/index
```

### 动态路由
动态路由支持路径参数，例如：
```
/order-result/:type/:orderId
```
可以通过以下命令生成动态页面：
```bash
umi g orderResult/$type/$orderId/index
```

---

## Umi 修改入口页面

在 `src/pages` 下创建一个 `document.ejs` 文件：
```bash
touch src/pages/document.ejs
```
将模板内容从 [template/document.ejs](https://github.com/umijs/umi/blob/master/packages/umi-build-dev/template/document.ejs) 复制到该文件中，然后自定义 SEO 信息或 Favicon：
```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```

---

## Umi 修改配置

Umi 的配置文件可以是 `.umirc.js` 或 `config/config.js`。以下是一个示例配置：
```js
export default {
  externals: { // 全局变量控制
    wx: 'wx',
    qq: 'qq',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'), // 默认公共目录
  },
  plugins: [
    ['umi-plugin-react', {
      antd: true, // 是否启用 Ant Design
      dva: false,
      title: "国铁商旅", // 默认 document.title
      dynamicImport: false,
      dll: true,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
    ["umi-plugin-mobx-state-tree", {
      exclude: [/^\$/], // 排除以 $ 开头的 stores
    }],
  ],
  alias: {
    '@src': path.resolve(__dirname, 'src'),
  },
};
```

---

## Umi 全局 Mixin 样式注入

通过 `chainWebpack` 配置全局 Mixin 样式注入：
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

---

## 禁用某些文件的 CSS Modules 功能

如果需要禁用某些文件的 CSS Modules 功能，可以在配置中添加：
```js
cssModulesExcludes: [
  '/src/pages/order/index.less',
]
```

---

## Less 全局样式和 CSS Modules 样式共存

如果需要同时使用全局样式和 CSS Modules 样式，可以在 `.less` 文件中使用 `:global`：
```less
:global {
  .some-class-name-used {
    color: red;
  }
}
```

---

## MobX-State-Tree 管理 Store

### 目录结构
```bash
-src 
    -stores (手动创建)
        xxx.js （store 的 key）
```

### 创建一个 Store
```js
import { types } from "mobx-state-tree";

const userInfoInterface = types.model({
  username: '22',
  password: '123'
});

const XXX = types
  .model('Auth', {
    type: types.array(types.string, ""), // 数组
    startStationCode: types.maybeNull(types.number), // 可以为 null
    startTime: types.optional(types.union(types.number, types.string), 0), // 多个类型
    userInfo: types.optional(userInfoInterface, {}), // 有默认值，允许为 undefined
    userInfo2: types.maybe(userInfoInterface) // 无默认值
  })
  .actions(self => ({
    async login(username, password) {
      // 登录逻辑
    }
  }));

export default XXX;
```

### 全局注册 Stores
`umi-plugin-mobx-state-tree` 会自动加载 `src/stores` 下的所有文件（可通过 `exclude` 排除某些文件），并按需加载。无需手动创建实例或通过 `Provider` 注入。

---

## React 组件注册

```js
@observer
class ComponentA extends Component {
  componentDidMount() {
    this.props.login(); // 调用 store 中的 action
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
  login: stores.xxx.login, // 传递 store 上的 action
  userInfo: stores.xxx.userInfo, // 传递 store 上的数据
  ...ownProps
}))(ComponentA));
```

---

## 外部调用 Stores 的 Action

通过 `umi-plugin-mobx-state-tree` 注册的 stores 实例会被挂载到 `window` 对象上：
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