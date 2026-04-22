---
title: "502 故障排查实录：从 TCP 健康检查误判到 HTTP 健康检查修复"
description: "线上出现部分请求返回 502，排查发现是 TCP 健康检查无法检测应用层可用性导致的误判。本文将分享完整的排查过程和修复方案。"
date: 2026-04-22
tags:
  - 健康检查
  - 502错误
  - 负载均衡
  - 故障排查
  - DevOps
---

## 问题现象

线上出现部分请求返回 **502 Bad Gateway**。

从网关侧看，根本原因是：

> 网关判断后端服务实例可用，并持续转发流量；但应用实例实际上已经无法正常提供 HTTP 服务，最终导致请求失败并返回 502。

初看时，应用业务日志里并没有明显的接口报错信息，因此问题一度比较难定位。

---

## 排查过程

### 1. 网关侧表现

链路追踪显示请求在入口侧快速失败，整体耗时很短，没有明显进入完整业务处理链路。

这类现象通常意味着：

- 请求没有真正进入业务代码
- 或者后端实例虽然"看起来还活着"，但实际上已经无法正常处理 HTTP 请求

### 2. 应用侧日志分析

进一步查看应用日志，发现服务在启动/初始化阶段出现如下异常：

- 应用启动时依赖外部配置服务  
  `http://config-service.internal:8080/serverlist`
- 该请求发生 **ResponseTimeoutError**
- 随后出现：
  - `start error, exiting with code:1`
  - `AppWorkerDiedError`
  - `0 worker(s) alive`

这说明：

> 应用进程虽然在某个阶段仍然存活，但真正提供 HTTP 请求处理能力的 worker 已经退出，实例实际上已不可用。

---

## 根因分析

### 1. 应用真实状态

应用在运行过程中，出现了典型的"假死"状态：

- TCP 端口仍然可连接
- 进程仍然存在
- 但 HTTP 服务已经无法正常响应
- 应用内部 worker 已经退出，无法继续处理业务请求

也就是说：

> **"TCP 可连通" 不等于 "HTTP 服务可用"**

### 2. 原有健康检查方式的问题

接入层/负载均衡使用的是 **TCP 健康检查**。

TCP 健康检查只能判断：

- 端口是否还能建立连接
- 进程是否还在监听

但它**无法判断**：

- HTTP 路由是否可用
- 应用 worker 是否正常
- 应用是否还能返回符合预期的业务响应
- 应用是否已经处于半存活、假存活状态

因此就出现了误判：

```
健康检查流程：
├── TCP 检查：端口可连接 ✓
├── 负载均衡判断：实例健康 ✓
├── 继续转发流量 → 故障实例
├── HTTP 请求失败 ✗
└── 用户看到：502 Bad Gateway
```

---

## 问题本质

这次问题的本质不是单纯的"网关异常"，也不是"应用日志缺失"，而是：

> **健康检查粒度过粗，TCP 健康检查只能判断网络层存活，不能判断应用层服务是否真正可用。**

在应用进入异常状态但端口仍可连接时，TCP 健康检查会把"不健康实例"误判为"健康实例"，从而导致故障流量持续被转发。

---

## 解决方案

最终采取的解决方案是：

> **将健康检查方式从 TCP 改为 HTTP，并配置正确的健康检查路径，要求返回 200 OK。**

### 调整内容

- **健康检查协议**：TCP → HTTP
- **健康检查路径**：配置应用实际可用的健康检查接口，例如：
  - `/health`
  - `/status`
  - `/ping`
  - 或业务自定义的 readiness 路径
- **成功判定条件**：返回 HTTP 200

### 调整后的效果

这样接入层不再只看"端口是否可连"，而是进一步验证：

- HTTP 服务是否还能正常接收请求
- 应用路由是否可访问
- 应用是否具备真实的请求处理能力

一旦应用机器已经无法提供 HTTP 服务，即使 TCP 端口仍可连接，接入层也会及时将其摘除，不再继续转发流量。

---

## 修复收益

将健康检查改为 HTTP 后，带来的收益主要有：

### 1. 避免误判

避免 TCP 健康检查把"假活着"的实例误判为健康实例。

### 2. 故障机器及时摘流

接入层可以更准确识别已经无法提供 HTTP 服务的节点，及时停止流量转发。

### 3. 降低 502 暴露概率

因为不可用机器会被更早摘除，所以用户请求命中故障实例的概率显著下降。

### 4. 提升整体可用性

健康检查从"网络层存活判断"升级为"应用层可用性判断"，更贴近真实服务状态。

---

## 经验总结

这次问题给出的经验很明确：

### 1. 健康检查要尽量贴近真实服务能力

如果服务对外提供的是 HTTP 能力，那么健康检查最好也使用 HTTP，而不是仅用 TCP。

### 2. TCP 健康检查只适合非常基础的存活探测

**TCP 检查适合判断**：
- 端口是否监听
- 网络是否可达

**但不适合判断**：
- 应用是否 ready
- HTTP 服务是否真正可用
- 业务线程/worker 是否健康

### 3. 健康检查接口要明确且稳定

建议应用提供专门的健康检查接口，并保证：

- 路径固定
- 无复杂业务逻辑
- 响应快
- 正常时稳定返回 200

### 4. 区分存活检查与可用性检查

在更完善的设计中，可以进一步拆分：

- **Liveness（存活探针）**：进程是否活着
- **Readiness（就绪探针）**：是否可以接流量

这样可以更精准地描述应用状态，这也是 Kubernetes 等现代容器编排平台的标准实践。

---

## 一句话结论

> 本次 502 问题的根因是接入层使用 TCP 健康检查，导致后端应用在 HTTP 已不可用但 TCP 仍可连接时被误判为健康，流量持续转发到故障实例。通过将健康检查改为 HTTP 并配置正确的检查路径，接入层可以更准确识别应用真实可用性，避免类似问题再次发生。

---

## References

### Primary Sources

1. **AWS Documentation - Target Group Health Checks**
   - URL: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
   - Description: Official AWS guide on configuring health checks for Application Load Balancers, including TCP vs HTTP health check differences.

2. **Kubernetes Documentation - Liveness, Readiness and Startup Probes**
   - URL: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
   - Description: Industry standard for application health checking, explaining the difference between liveness and readiness probes.

### Video

3. **YouTube - Load Balancer Health Checks Explained**
   - URL: https://www.youtube.com/results?search_query=load+balancer+health+checks+explained
   - Description: Visual explanation of how health checks work in production environments and best practices for configuration.

### Analysis

4. **NGINX Blog - Active Health Checking with NGINX Plus**
   - URL: https://www.nginx.com/blog/active-health-checking-nginx-plus/
   - Description: Deep dive into active vs passive health checking, and why HTTP health checks are more reliable than TCP.

5. **Cloudflare Blog - What is a 502 Bad Gateway Error?**
   - URL: https://www.cloudflare.com/learning/http/502-bad-gateway/
   - Description: Comprehensive guide to understanding 502 errors, their causes, and how proper health checking can prevent them.

### Related

6. **Microsoft Azure - Load Balancer Health Probes**
   - URL: https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview
   - Description: Azure's approach to health checking, demonstrating industry-wide adoption of HTTP-based health checks.
