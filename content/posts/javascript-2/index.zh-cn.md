---
title: "JavaScript 技术知识点整理"
description: "sort vs toSorted vs localCompare"
date: 2024-09-08
tags:
  - JavaScript
  - Web开发
images:
  - javascript-1/a.webp
---

## 目录

1. [数组遍历](#数组遍历)
2. [位运算符](#位运算符)
3. [异常处理](#异常处理)
4. [Promise](#promise)
5. [Symbol](#symbol)
6. [深浅拷贝](#深浅拷贝)
7. [Lodash 工具库](#lodash-工具库)
8. [解构赋值](#解构赋值)
9. [Spread 语法](#spread-语法)
10. [特殊属性](#特殊属性)
11. [Set 转数组](#set-转数组)

---

## 数组遍历

### `for...of` 遍历数组
```javascript
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item); // 输出 1, 2, 3
}
```

### `forEach` 方法
`forEach` 方法可以传递第二个参数作为 `this`：
```javascript
const obj = { multiplier: 2 };
[1, 2, 3].forEach(function (item) {
  console.log(item * this.multiplier);
}, obj); // 输出 2, 4, 6
```

### 兼容性处理
`Object.values(undefined)` 会报错，需兼容处理：
```javascript
const safeValues = (obj) => (obj ? Object.values(obj) : []);
console.log(safeValues(undefined)); // 输出 []
```

---

## 位运算符

### 常见用法
```javascript
// 取整
const a = ~~12.12; // 12

// 左移位
12 << 1; // 24

// 右移位
12 >> 1; // 6
```

### 应用场景
1. **判断奇偶**:
   ```javascript
   const isOdd = (num) => num & 1;
   console.log(isOdd(3)); // true
   console.log(isOdd(4)); // false
   ```

2. **除以 2**:
   ```javascript
   const divideByTwo = (num) => num >> 1;
   console.log(divideByTwo(10)); // 5
   ```

3. **赋值与校验**:
   - 使用 `|` 进行按位或赋值。
   - 使用 `&` 校验特定标志位。

---

## 异常处理

### 减少缩进的封装
通过封装 `try...catch` 减少代码嵌套：
```javascript
const tryAndCatch = async (fn) => {
  try {
    return [null, await fn()];
  } catch (e) {
    return [e, null];
  }
};

// 使用示例
(async () => {
  const [err, result] = await tryAndCatch(async () => {
    throw new Error("Test error");
  });
  if (err) console.error(err.message); // 输出 "Test error"
})();
```

---

## Promise

### 控制权反转（IoC）
Promise 实现控制权反转的典型场景是弹窗组件：
```javascript
// 弹窗只负责 UI 展示，操作结果返回给调用方
function showModal() {
  return new Promise((resolve) => {
    const close = (result) => resolve(result);
    document.getElementById("confirmBtn").onclick = () => close(true);
    document.getElementById("cancelBtn").onclick = () => close(false);
  });
}

// 调用方处理结果
showModal().then((result) => {
  console.log(result ? "Confirmed" : "Cancelled");
});
```

---

## Symbol

### 全局注册与获取
`Symbol.for` 用于注册或获取全局 Symbol：
```javascript
const sym1 = Symbol.for("key");
const sym2 = Symbol.for("key");
console.log(sym1 === sym2); // true
```

### 序列化问题
`Symbol` 在序列化时会丢失，可以通过自定义 `JSON.stringify` 的第二个参数解决：
```javascript
const obj = { key: Symbol.for("value") };
const str = JSON.stringify(obj, (key, value) =>
  typeof value === "symbol" ? value.toString() : value
);
console.log(str); // {"key":"Symbol(value)"}
```

---

## 深浅拷贝

### 浅拷贝问题
浅拷贝无法复制对象内部的引用类型：
```javascript
var a = [{ aa: 123 }];
var b = [...a];
b.forEach((i) => {
  i.xx = 123;
});
console.log(a); // a 被影响了
```

### 深拷贝解决方案
使用递归或第三方库（如 Lodash）实现深拷贝：
```javascript
const _ = require("lodash");
var a = [{ aa: 123 }];
var b = _.cloneDeep(a);
b[0].xx = 123;
console.log(a); // a 不受影响
```

---

## Lodash 工具库

### `chunk` 方法
将数组分片：
```javascript
const _ = require("lodash");
const arr = [1, 2, 3, 4, 5];
console.log(_.chunk(arr, 2)); // [[1, 2], [3, 4], [5]]
```

### `Promise.allSettled`
处理多个异步任务，无论成功或失败都会返回结果：
```javascript
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("Error"),
]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'Error' }
  // ]
});
```

---

## 解构赋值

### 默认值问题
以下写法存在问题：当 `b` 存在 `a`，但 `a` 为空时，不会赋予默认值：
```javascript
const b = { a: null };
const { a = {} } = b;
console.log(a); // null
```

---

## Spread 语法

### 数组与对象的区别
```javascript
[...undefined]; // 报错
{ ...undefined }; // 正常
```

---

## 特殊属性

### `window.name`
`window.name` 是特殊属性，赋值时会自动转换为字符串：
```javascript
var name1 = ["3", "32"];
window.name = ["3", "32"];
console.log(window.name); // "3,32"
```

---

## Set 转数组

### Spread 写法
直接将 `Set` 转换为数组：
```javascript
var a = new Set();
a.add(2);
var aArr = [...a]; // [2]
```

## TC39

[TC39](https://github.com/tc39)

---


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



## 什么是 A11Y？

**可访问性**（通常缩写为 **A11y** —— 即 “a” 加上 11 个字符再加 “y”）在 Web 开发中指的是让尽可能多的人能够使用网站，即使这些人在某些方面的能力受到限制。

- **核心概念**：A11y 确保残障人士（包括视觉、听觉、运动或认知障碍者）能够无障碍地使用网站。
- **目标**：创建包容性的数字体验，无论用户的生理或认知能力如何，都能平等地获取信息和服务。

---

## 知识图谱

以下是理解和实施 Web 可访问性的关键资源：

### 1. W3C Web 可访问性倡议 (WAI)
**Web 可访问性倡议 (WAI)** 制定了策略、指南和资源，旨在让残障人士能够无障碍地使用 Web。

- **官网**: [W3C WAI 指南](https://www.w3.org/WAI/GL/)

### 2. WAI-ARIA (Accessible Rich Internet Applications)
**WAI-ARIA** 定义了一种方法，使动态 Web 内容和应用程序对残障人士更加友好。

- **规范**: [WAI-ARIA 规范](https://www.w3.org/TR/wai-aria/)
- **用途**: 提供角色、状态和属性，以增强交互式和动态内容的可访问性。

### 3. HTML 可访问性 (HTML-ARIA)
本文档描述了如何结合 HTML 使用 ARIA 角色和属性来提高可访问性。

- **资源**: [HTML-ARIA 最佳实践](https://w3c.github.io/html-aria/)

---


## 性能

W3C 提供了丰富的性能相关资源，帮助开发者优化网站和应用的加载速度、响应时间和用户体验。

- **性能相关资源**  
  访问 [W3C 性能工作组](https://www.w3.org/webperf/) 获取最新的性能标准和最佳实践。

> **补充说明**：性能优化是 Web 开发中的重要环节，建议关注 W3C 的性能标准更新，例如 LCP（最大内容绘制）、CLS（累计布局偏移）等核心指标。

---

## 应用

W3C 的应用开发资源涵盖了现代 Web 应用的技术规范和指南，帮助开发者构建高效、安全的 Web 应用。

- **应用相关资源**  
  访问 [Web 应用工作组](https://w3c.github.io/webappswg/) 获取最新的技术规范和开发指南。

> **补充说明**：Web 应用开发涉及多个领域，包括前端框架、后端接口、安全性等。建议结合实际项目需求，深入研究相关规范。

---

## 测试

W3C 提供了全面的测试资源，帮助开发者验证其应用是否符合 Web 标准。

- **测试相关资源**  
  访问 [Web 平台测试结果](https://wpt.fyi/results/?label=experimental&label=master&aligned) 查看最新的测试结果和兼容性报告。

> **补充说明**：测试是确保 Web 应用质量的重要步骤，建议在开发过程中使用自动化测试工具，并定期检查浏览器兼容性。

## HTTP

https://datatracker.ietf.org/doc/html/rfc7231#page-70

## CSS
https://www.w3.org/People/xiaoqian/talks/bytedance-2021/Overview.html
https://2024.stateofcss.com/en-US/
https://www.w3.org/Style/CSS/read
https://www.w3.org/TR/css-2020/
https://www.w3.org/Style/CSS/
https://linxz.github.io/blog/defensive-css

---


## **W3C 相关资源**

- **HTML 工作组 (W3C)**  
  [https://www.w3.org/groups/wg/htmlwg](https://www.w3.org/groups/wg/htmlwg)  
  W3C 的 HTML 工作组负责制定和维护 HTML 标准。

- **HTML Accessibility API Mappings (HTML-AAM)**  
  [https://w3c.github.io/html-aam/](https://w3c.github.io/html-aam/)  
  定义了 HTML 元素如何映射到无障碍 API，帮助开发者创建更友好的无障碍内容。

- **HTML ARIA 标准**  
  [https://w3c.github.io/html-aria/](https://w3c.github.io/html-aria/)  
  提供了关于如何在 HTML 中使用 ARIA（Accessible Rich Internet Applications）的指导，确保 Web 内容对残障用户更加友好。

---

## **WHATWG 相关资源**

- **WHATWG 官网**  
  [https://whatwg.org/](https://whatwg.org/)  
  WHATWG 是一个社区驱动的标准组织，专注于开发 HTML 和其他 Web 技术的最新规范。

- **HTML 规范（WHATWG）**  
  [https://html.spec.whatwg.org/review-drafts/2020-01/](https://html.spec.whatwg.org/review-drafts/2020-01/)  
  提供了 HTML 的详细规范文档，包含最新的功能和实现细节。

- **DOM 规范（WHATWG）**  
  [https://dom.spec.whatwg.org/](https://dom.spec.whatwg.org/)  
  定义了 DOM（Document Object Model）的标准，描述了如何通过编程方式操作 HTML 和 XML 文档。

---


[D3-Format](https://github.com/d3/d3-format) 是一个功能强大且灵活的 JavaScript 库，用于格式化数字。它由 [D3.js](https://d3js.org/) 项目提供，支持多种数字格式化需求，包括货币、百分比、科学计数法、千分位分隔符等。

---

## 主要特点

- **灵活的格式化语法**：基于类似 Python 的格式化字符串（`printf` 风格），易于学习和使用。
- **本地化支持**：支持不同地区的数字格式（如千分位分隔符、小数点符号等）。
- **高性能**：专为大规模数据可视化设计，适合在浏览器端高效运行。
- **广泛的应用场景**：
  - 数据可视化中的轴标签、工具提示等。
  - 财务报表、统计数据展示。
  - 科学计算结果的格式化。

---

## 安装方法

### 使用 npm 安装
如果项目中使用了 npm 或 yarn，可以通过以下命令安装：

```bash
npm install d3-format
```

或者：

```bash
yarn add d3-format
```

### 直接通过 CDN 引入
如果不使用模块化工具，可以直接通过 CDN 引入库：

```html
<script src="https://cdn.jsdelivr.net/npm/d3-format@3"></script>
```

---

## 基本用法

### 格式化函数
`d3.format` 是核心方法，用于创建格式化函数。以下是一些常见用法：

```javascript
// 引入库
import { format } from "d3-format";

// 创建格式化函数
const formatNumber = format(",.2f"); // 千分位分隔符，保留两位小数

// 使用格式化函数
console.log(formatNumber(12345.6789)); // 输出: "12,345.68"
```

---

### 常见格式化示例

| 格式字符串 | 描述                     | 示例输入       | 示例输出      |
|------------|--------------------------|----------------|---------------|
| `",.2f"`   | 千分位分隔符，保留两位小数 | `12345.6789`   | `"12,345.68"` |
| `"$,.2f"`  | 货币格式，带千分位分隔符   | `12345.6789`   | `"$12,345.68"` |
| `".1%"`    | 百分数，保留一位小数       | `0.12345`      | `"12.3%"`     |
| `"e"`      | 科学计数法                | `12345.6789`   | `"1.234568e+4"` |
| `"+,"`     | 带正负号的整数            | `-12345`       | `"-12,345"`   |

---

## 高级用法

### 自定义本地化
可以通过 `d3.formatLocale` 自定义本地化的格式规则。例如：

```javascript
import { formatLocale } from "d3-format";

// 自定义本地化规则
const customLocale = formatLocale({
  decimal: ",", // 小数点符号
  thousands: ".", // 千分位分隔符
  grouping: [3], // 每三位分组
  currency: ["€", ""], // 货币符号
});

const formatEuro = customLocale.format("$,.2f");
console.log(formatEuro(12345.6789)); // 输出: "€12.345,68"
```

---

### 动态格式化
可以根据条件动态选择格式化规则。例如：

```javascript
import { format } from "d3-format";

const value = 12345.6789;

// 根据值大小选择格式
const formatter = value > 10000 ? format(",.0f") : format(",.2f");
console.log(formatter(value)); // 输出: "12,346"
```

---

## 官方文档与资源

- **GitHub 仓库**: [https://github.com/d3/d3-format](https://github.com/d3/d3-format)
- **官方 API 文档**: [https://github.com/d3/d3-format#api-reference](https://github.com/d3/d3-format#api-reference)
- **在线格式化工具**: [https://observablehq.com/@d3/d3-format](https://observablehq.com/@d3/d3-format)

---

## 1. 保存 Chrome 网络日志

### 步骤：
1. 打开 Chrome 浏览器。
2. 在地址栏中输入以下地址并访问：
   ```
   chrome://net-export/
   ```
3. 点击 **"Start Logging to Disk"** 按钮。
4. 选择保存日志文件的位置，并开始记录网络活动。
5. 完成记录后，点击 **"Stop Recording"** 按钮以生成日志文件。

### 注意事项：
- 日志文件将以 `.json` 格式保存，包含详细的网络请求和响应信息。
- 建议在需要调试网络问题时使用此功能。


## 2. 查看 Chrome 网络日志

### 工具：
使用 [NetLog Viewer](https://netlog-viewer.appspot.com/#import) 在线工具查看日志。

### 步骤：
1. 打开 [NetLog Viewer](https://netlog-viewer.appspot.com/#import)。
2. 点击 **"Choose File"** 按钮，上传之前保存的 `.json` 日志文件。
3. 日志文件加载完成后，您可以通过界面查看详细的网络请求、响应时间、错误信息等内容。

---



## 什么是组件？
- **定义**: 组件是一个较小的、独立于较大实体或系统的一部分。它能够执行某些功能，可能需要一些输入或产生一些输出。
- **实现**: 在软件开发中，组件通常通过类来表示。

---

## 什么是 Web 组件？
- **定义**: Web 组件是一组由 Web 平台 API 创建的自定义、可重用、封装的 HTML 标签，用于网页或网络应用。
- **特点**:
  - **自定义**: 可以创建自己的 HTML 标签。
  - **可重用**: 可在多个项目中重复使用。
  - **封装**: 内部实现细节对外部隐藏，避免全局污染。

---

## 组件有哪些分类？

### 1. 大型库
- **示例**: Ant Design (Antd)、Element UI 等。
- **特点**: 提供完整的 UI 和功能解决方案，适合构建大型复杂项目。

### 2. 单组件
- **复用性高**:
  - **特点**: 设计为通用组件，具有较高的复用价值，且后续会持续维护。
  - **示例**: 按钮、输入框等基础组件。
- **业务组件**:
  - **特点**: 针对特定业务场景设计，通常用完即弃。
  - **示例**: 特定表单、数据展示模块等。

### 3. 项目融合型
- **特点**: 耦合其他内容，无法独立使用，通常与特定项目紧密绑定。
- **适用场景**: 项目内部使用的定制化组件。

---

## 服务 SLA (Service-Level Agreement) 标准
服务级别协议（SLA）是服务提供商与客户之间定义的承诺指标，包括质量、可用性、交付周期等。

### 对业务承诺的服务 SLA 标准
- **项目（研发测试 > 30 人天）**:
  - 按时交付率 > 90%。
  - 业务目标达标率 > 80%。
- **日常**:
  - 吞吐率 > 85%。
  - 需求交付时长 < 21 天。
- **工单**:
  - 双高工单当天完结。
  - 单高工单 3 天完结。
  - 整体工单 3 天完结率 > 80%。
- **稳定性**:
  - 无 P1、P2 故障。
  - 故障分收敛 30%。

---
