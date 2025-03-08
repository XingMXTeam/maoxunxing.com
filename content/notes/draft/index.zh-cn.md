---
title: "[WIP] 碎片知识"
date: 2025-03-08
tags:
  - Draft
---

## 页面允许以iframe方式嵌入

```shell
Content-Security-Policy: frame-ancestors self https://xxxx
```

通过增加这个，允许 iframe 被嵌入


## 百度站长文件验证失败 301问题分析及解决方法

尝试把网站加到百度搜索引擎，出现问题：

出现了验证失败，失败未知原因：301

问题原因是：
填写网站的时候，百度会让让我填www开头的网址：比如www.xx.com 实际上DNS配置的时候，www会301到https://xx.com 

所以验证的时候会301。

解决办法就是去掉网址的www

## 代码实践

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
