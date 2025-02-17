---
title: "Midway 服务端编程技巧总结"
date: 2023-07-22
---

在 Midway 框架中进行服务端开发时，掌握一些高效的编程技巧能够显著提升代码的可读性、性能和可靠性。以下是我在实践中总结的一些技巧，希望对大家有所帮助。

---

## 目录

1. [优化 if-else 嵌套](#优化-if-else-嵌套)
2. [校验逻辑集中到 DTO](#校验逻辑集中到-dto)
3. [异步处理非阻塞性任务](#异步处理非阻塞性任务)
4. [主链路失败与系统告警](#主链路失败与系统告警)
5. [鉴权提前避免无效查询](#鉴权提前避免无效查询)

---

## 优化 if-else 嵌套

在业务逻辑复杂的情况下，过多的 `if-else` 嵌套会让代码难以阅读和维护。通过改写为 `return` 语句，可以让代码更加简洁清晰。

**示例：**

```typescript
// 改写前
function checkStatus(status) {
  if (status === 'success') {
    if (someCondition()) {
      return 'valid';
    } else {
      return 'invalid';
    }
  } else {
    return 'error';
  }
}

// 改写后
function checkStatus(status) {
  if (status !== 'success') return 'error';
  if (!someCondition()) return 'invalid';
  return 'valid';
}
