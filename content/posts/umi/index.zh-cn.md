---
title: "mobx-react和umi(乌米)替换redux和react-dom-router方案总结"
date: 2025-02-04
tags:
  - 状态管理
images:
  - umi/image.png
---

# 开始

[umi](https://umijs.org/zh/guide/#特性)
[mobx-state-tree](https://github.com/mobxjs/mobx-state-tree)
[umi-plugin-mobx-state-tree](https://github.com/umijs/umi-plugin-mobx-state-tree)

## umi初始化项目

`yarn create umi`

选择app  
选择antd <- 如果用了antdesign  

## umi创建页面

普通路由: `<Route path="/home" component={Home} />` 
直接创建对应页面: `umi g home/index`

动态路由: `/order-result/:type/:orderId`
创建动态页面: `umi g orderResult/$type/$orderId/index`

## umi修改入口页面

在src/pages下建立一个：**src/pages/document.ejs** 文件

复制模版内容：[template/document.ejs](https://github.com/umijs/umi/blob/master/packages/umi-build-dev/template/document.ejs)到上面文件

然后可以自己定义favicon和其他SEO信息：

``` html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```

## umi修改配置

定义在 **.umirc.js或者config/config.js**

``` js
// ...
  externals: { // 全局变量控制
    wx: 'wx',
    qq: 'qq',
  },
  devServer: {
    contentBase: path.join(__dirname, 'public') // 默认公共目录 本地跑服务时用到
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true, //是否用antd 
      dva: false,
      title: "国铁商旅", // 默认document.title的值
      dynamicImport: false,
      dll: true,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
    [
      "umi-plugin-mobx-state-tree",//umi-plugin-mobx-state-tree 插件的配置
      {
        exclude: [/^\$/] //这里是以$开头的stores不会被引用
      }
    ]
  ],
  // 全局路径别名
  alias: {
    '@src': path.resolve(__dirname, 'src'),
  },
``` 


## umi全局mixin样式注入

不用每次在样式文件中import公共的mixin

修改.umirc.js:

``` js
  //treeShaking: true,
  chainWebpack(config, {webpack}) {
    // 配置全局mixin
    config.module.rule('mixin-global')
      .test(/\.less$/)
      .use('mixin-with-resources-loader')
      .loader('sass-resources-loader')
      .options({
        resources: [
          path.resolve(__dirname, './src/less/mixin.less')
        ]
      });
  },
 //alias: { }
```

## 禁用某些文件的cssModules功能

``` js
//...
cssModulesExcludes: [
    '/src/pages/order/index.less',
]
//...
```

当然你可以完全禁用。具体配置项参看文档。


## less全局样式和cssModules样式共存

比如你有一个a.less和a.module.less，两者都需要 因为a.less的class名传递给antdesign的组件，需要重写某些样式：

``` a.less
:global {
    .some-class-name-used {

    }
}
```

## mobx-state-tree管理store

目录结构：

``` bash
-src 
    -stores (手动创建)
        xxx.js （store的key）
```

## 创建一个store

``` js
import { types } from "mobx-state-tree";

const userInfoInterface = types.model({
  username: '22',
  password: '123'
});

const XXX = types
  .model('Auth', {
    'type': types.array(types.string, ""),//数组
    'startStationCode': types.maybeNull(types.number),//可以为null
    'startTime': types.optional(types.union(types.number, types.string),0),//允许多个类型
    'userInfo': types.optional(userInfoInterface, {}), //有默认值，允许为undefined。
    'userInfo2': types.maybe(userInfoInterface) //无默认值
  })
  .actions(self => ({
     // 定义的action
     async login(username, password) {

     }
  }));
export default XXX;
```

## 全局注册Stores

umi-plugin-mobx-state-tree 约定加载 src/stores 下的所有文件(可通过设置 exclude 排除某些文件)默认开启按需加载

也就是说不用自己创建实例：

``` js
const store = Store.create({
    todos: [{
        title: "Get coffee"
    }]
)
```

并通过Provider的方式注入：

``` js
// 伪代码
<Providēr store={store}></Providēr>
```

## React组件注册

``` js

// 注解的方式响应式
@observer
class ComponentA extends Component {
    componentDidMount() {
        // 调用store里面的action
        this.props.login()
        // 获取store上的数据
        const { userInfo } = this.props
        // 异步请求后，stores变化。需要主动监听某个数据变化。
        // 比如这里，登陆成功后，跳转到首页
        reaction(
            () => {
                const { userInfo } = this.props
                return userInfo.token
            },
            token => {
                if (token) {
                    this.props.history.push('/home')
                }
            }
        );
        // 另一种写法：
        // autorun(() => {
        // const { userInfo } = this.props
        // if (userInfo.token) {
        // this.props.history.push('/home')
        // }
        // });
    }
}
export default withRouter(inject(({ stores }, ownProps) => ({
  login: stres.xxx.login,//传递stores上的action
  userInfo: stores.xxx.userInfo, //传递stores上的数据
  ...ownProps //传递组件上的数据
}))(ComponentA));
//这种写法某些情况下可能会有问题： }))(observer(ComponentA)));

```

## 外部调用stores的action

**umi-plugin-mobx-state-tree** 会将stores实例注册到window上：

获取store：

``` js
// getStore.js
export default () => {
    return window.mobx_app.mobx_stores || {}
}

// a.js
import getStore from 'getStore'
const xxxStore = getStore().xxx
xxxStore.login()
```
