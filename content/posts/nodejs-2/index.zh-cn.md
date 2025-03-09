---
title: "nodejs你需要知道的"
date: 2021-08-27T10:20:36+08:00
tags:
  - nodejs
description: ""
---

## **服务重启**

在运维过程中，服务的重启是常见的操作。以下是相关命令：

### **进入服务目录**
```shell
cd /home/admin/{appname}/bin/
```

### **仅重启服务**
```shell
./nodejsctl stop && ./nodejsctl start
```

### **重新解压资源包并启动服务**
```shell
./nodejsctl pubstart
```

---

## **多租户 HSF 服务调用**

在多租户场景下，采用中间件透传租户标识的方式实现服务调用。

---

## **多租户环境部署**

1. **多租户环境部署**  
   部署时需确保每个租户的环境隔离，避免资源冲突。

2. **通过 URL 配置化生成租户标识**  
   - 租户标识可以通过 URL 参数动态生成。
   - 示例：`https://example.com/api?tenantId=12345`

---

## **日志管理**

日志是排查问题的重要依据，以下是常见日志路径及用途：

- **错误日志**  
  路径：`admin/logs/{app}/common-error.log`  
  用途：记录应用运行中的错误信息。

- **常规记录日志**  
  路径：`admin/logs/{app}/{app}-web.log`  
  用途：记录应用的常规运行日志。

- **应用 Access 日志**  
  路径：`admin/{app}/logs/access-123.log`  
  用途：记录应用的访问日志。

- **Nginx Access 日志**  
  路径：`admin/cai/logs/cronolog/2021/.log`  
  用途：记录 Nginx 的访问日志，按日期分片存储。

---

## **Docker 优化**

为了提高镜像构建速度和效率，可以采用以下策略：

1. **基础镜像优化**  
   - 将不常变化的内容（如基础 RPM 包、启动脚本等）打包成基础镜像。
   - 在应用发布的 Dockerfile 中使用 `FROM` 指令引用基础镜像，避免重复构建相同内容。

2. **镜像分发**  
   - 将应用基础镜像推送到所有构建机器，减少重复拉取的时间。
   - 提高构建效率，避免长时间等待。

---

## **常用工具**

### **nodemon**
- 功能：监控文件变化并自动重启服务。
- 使用场景：开发环境中实时调试代码。

示例：
```shell
nodemon app.js
```

## midway框架

`this.ctx.time vs Date.now()` 前面会包含框架初始化时间，所以在实际的埋点统计时间要用前者。

