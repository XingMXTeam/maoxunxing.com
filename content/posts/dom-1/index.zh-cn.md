---
title: "DOM问题总结"
date: 2025-02-06
tags:
  - front-end
  - programming
description: ""
---

## 目录
1. [动态插入JS脚本](#动态插入js脚本)
2. [嵌套a标签问题及解决方案](#嵌套a标签问题及解决方案)
   - [问题描述](#问题描述)
   - [解决方案1: a标签代理](#解决方案1-a标签代理)
   - [解决方案2: 样式控制](#解决方案2-样式控制)
3. [HTML结构的异步加载](#html结构的异步加载)
4. [通过Sass.js实现SCSS编译功能](#通过sassjs实现scss编译功能)

---

## 动态插入JS脚本

在HTML中，可以通过`<script>`标签的`type="importmap"`或`type="module"`属性来动态插入JavaScript脚本。例如：

```html
<script type="importmap">
  {
    "imports": {
      "my-module": "/path/to/my-module.js"
    }
  }
</script>
```

或者使用`type="module"`来加载模块化脚本：

```html
<script type="module" src="/path/to/module.js"></script>
```

这些方式可以在返回的HTML字符串中动态插入脚本，从而实现按需加载或动态功能扩展。

---

## 嵌套a标签问题及解决方案

### 问题描述

在HTML中，`<a>`标签不能嵌套另一个`<a>`标签。如果嵌套，可能会导致布局问题（如提前闭合），特别是在服务端渲染（SSR）场景下，可能会出现内容被截断的情况。

### 解决方案1: a标签代理

通过React组件的方式，可以实现一个`AnchorProxy`组件，用于动态处理`href`属性的变化，避免嵌套`<a>`标签的问题。

以下是实现代码：

```jsx
const AnchorProxy = (props) => {  
  const { href: jumpUrl, target = '_blank', paramKeys, ...args } = props;  
  
  const clickFunc = (event) => {  
    const targetEle = event.target;  

    // 必须通过原生的JS去操作，因为一些三方或者二方的JS会往href上挂载参数  
  };  

  return <a href={href} target={target} {...args} onClick={clickFunc} ref={aRef}></a>;  
};
```

**说明：**
- `paramKeys` 是需要动态添加到`href`中的参数键。
- `getParams`、`addLandingArgs` 和 `removeLandingArgs` 是辅助函数，分别用于获取参数、添加参数和移除参数。

### 解决方案2: 样式控制

通过CSS布局（如`grid`布局）将底部内容与主内容并列，从而避免嵌套`<a>`标签的需求。

示例：
```css
.container {
  display: grid;
  grid-template-rows: auto 50px; /* 主内容 + 底部 */
}
```

这种方式适用于布局上的调整，避免逻辑上的嵌套问题。

---

## HTML结构的异步加载

在浏览器中查看源代码时，看到的是HTML的原始结构；而在开发者工具中查看元素时，可能会看到一些异步加载的内容（如`<link>`、`<script>`标签）。这是因为某些资源是通过JavaScript动态插入的。

例如：
```javascript
document.body.appendChild(document.createElement('script')).src = '/path/to/script.js';
```

这种动态加载的方式常用于性能优化或按需加载。

---

## 通过Sass.js实现SCSS编译功能

[Sass.js](https://github.com/medialize/sass.js) 是一个基于JavaScript的Sass编译器，可以在浏览器中直接编译SCSS代码为CSS。

以下是一个简单的使用示例：

```javascript
const Sass = (window as any).Sass;  

Sass.compile(scss, (res) => {  
    if (res && res.text) {  
        resolve(res.text);  
    } else if (res && res.status === 3) {  
        resolve('');  
    } else {  
        resolve(-1);  
    }  
});
```

**说明：**
- `scss` 是需要编译的SCSS代码字符串。
- `resolve` 是Promise的回调函数，用于处理编译结果。
- 如果编译成功，返回编译后的CSS代码；如果失败，返回空字符串或错误码。

## a标签download属性，有同源限制

---