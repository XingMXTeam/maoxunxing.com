---
title: "D3-Format：强大的数字格式化库"
date: 2021-12-22T21:04:53+08:00
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

## 总结

`D3-Format` 是一个简单易用但功能强大的数字格式化工具，特别适合需要处理大量数据或进行复杂格式化操作的场景。无论是简单的千分位分隔符还是复杂的本地化需求，`D3-Format` 都能轻松应对。如果你正在开发数据可视化项目或需要格式化数字的工具，不妨试试这个库！
