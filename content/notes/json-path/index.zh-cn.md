---
title: "JSONPath 实现字段裁剪和提取"
description: ""
date: 2025-02-15
tags:
  - JSONPath
  - Web开发
images:
  - json-path/cover.png
---

使用 JSONPath 可以方便地实现字段裁剪和提取。

### JSON提取

1. 提取 `countDown` 字段。
2. 提取 `products` 列表中的前 5 个元素。
3. 提取每个 `product` 的 `id`。

```json
{
  "data": "data",
  "data": {
    "countDown": "countDown",
    "products": "products[0:5]",
    "products": {
      "id": "id"
    }
  }
}
```

### 使用 JSONPath 实现字段裁剪

1. **提取 `countDown` 字段：**
   ```jsonpath
   $.data.countDown
   ```

2. **提取 `products` 列表中的前 5 个元素：**
   ```jsonpath
   $.data.products[0:5]
   ```

3. **提取每个 `product` 的 `id`：**
   ```jsonpath
   $.data.products[0:5].id
   ```

### 示例代码

以下是使用 Python 和 `jsonpath-ng` 库实现字段裁剪的代码示例：

#### 安装依赖
```bash
pip install jsonpath-ng
```

#### Python 实现
```python
from jsonpath_ng import jsonpath, parse

# 原始 JSON 数据
data = {
    "data": {
        "countDown": "2023-10-01T00:00:00Z",
        "products": [
            {"id": 1, "name": "Product A", "price": 100},
            {"id": 2, "name": "Product B", "price": 200},
            {"id": 3, "name": "Product C", "price": 300},
            {"id": 4, "name": "Product D", "price": 400},
            {"id": 5, "name": "Product E", "price": 500},
            {"id": 6, "name": "Product F", "price": 600}
        ]
    }
}

# 提取 countDown
countdown_expr = parse("$.data.countDown")
countdown_result = [match.value for match in countdown_expr.find(data)]
print("CountDown:", countdown_result)

# 提取 products 列表中的前 5 个元素
products_expr = parse("$.data.products[0:5]")
products_result = [match.value for match in products_expr.find(data)]
print("Products (Top 5):", products_result)

# 提取每个 product 的 id
product_ids_expr = parse("$.data.products[0:5].id")
product_ids_result = [match.value for match in product_ids_expr.find(data)]
print("Product IDs (Top 5):", product_ids_result)
```

---

### 输出结果

运行上述代码后，输出如下：

```plaintext
CountDown: ['2023-10-01T00:00:00Z']
Products (Top 5): [
    {'id': 1, 'name': 'Product A', 'price': 100},
    {'id': 2, 'name': 'Product B', 'price': 200},
    {'id': 3, 'name': 'Product C', 'price': 300},
    {'id': 4, 'name': 'Product D', 'price': 400},
    {'id': 5, 'name': 'Product E', 'price': 500}
]
Product IDs (Top 5): [1, 2, 3, 4, 5]
```

---

### 总结

通过 JSONPath，可以轻松实现对 JSON 数据的字段裁剪和提取。以下是关键点总结：
1. 使用 `$` 表示根节点。
2. 使用 `[start:end]` 实现数组切片。
3. 使用 `.key` 或 `['key']` 提取对象属性。
4. 结合工具库（如 `jsonpath-ng`）可以在代码中高效处理 JSON 数据。

### 文档

https://goessner.net/articles/JsonPath/
https://jsonpath.com