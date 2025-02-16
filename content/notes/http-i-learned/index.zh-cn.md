---
title: "http参数是数组"
date: 2021-12-22T20:10:28+08:00
tags:
  - HTTP
  - AJAX
  - JavaScript
---

请求参数可以是数组吗？

## **1. 答案**

请求参数可以是数组。  
以前我误以为 JSON 的请求参数只能是对象，或者以 `key=value` 的形式传递。

---

## **2. 示例代码**

以下是一个通过 AJAX 发送 JSON 数据的示例：

```ts
$.ajax({
  type: "POST",
  url: "index.php",
  dataType: "json",
  data: JSON.stringify({ paramName: info }),
  success: function (msg) {
    $(".answer").html(msg);
  },
});
```

---

## **3. 参考资料**

- [Pass array to AJAX request in AJAX - Stack Overflow](https://stackoverflow.com/questions/8890524/pass-array-to-ajax-request-in-ajax)

---

## **4. 补充说明**

### **4.1 请求参数的形式**

- **JSON 对象**：可以通过 `JSON.stringify` 将 JavaScript 对象序列化为 JSON 字符串。
- **数组**：同样可以作为请求参数传递，例如：
  ```ts
  $.ajax({
    type: "POST",
    url: "index.php",
    dataType: "json",
    data: JSON.stringify([1, 2, 3, 4]),
    success: function (msg) {
      console.log(msg);
    },
  });
  ```

### **4.2 注意事项**

- 确保服务器端能够正确解析 JSON 数据。
- 如果需要传递数组，确保后端接口支持数组格式的解析。
- 在调试时，可以使用浏览器开发者工具查看请求的 `Payload` 或 `Request Body`，验证数据是否正确发送。

---
