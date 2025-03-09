---
title: "灰度"
date: 2025-02-06
tags:
  - 工程
  - Web开发
---

在现代分布式系统中，CDN 的分桶机制和网关侧的灰度发布是实现流量控制和功能迭代的重要手段。本文将详细说明 CDN 如何通过 Cookie 实现分桶，并结合网关侧的灰度策略进行流量分配。

这种一般是业务灰度。业务逻辑灰度是指在代码中新增或修改的功能逻辑，通过条件判断或开关控制，仅对部分用户或请求生效，而不是直接对所有用户开放。业务灰度可以有很多种，比如分国家、分设备、分渠道、分设备等等，要从业务实际需求出发。


---

## 目录

1. [背景介绍](#背景介绍)
2. [CDN 分桶机制](#cdn-分桶机制)
3. [网关侧灰度发布](#网关侧灰度发布)
4. [总结](#总结)

---

## 背景介绍

在大型分布式系统中，为了保证新功能的稳定上线和用户体验的平滑过渡，通常会采用 **灰度发布** 策略。CDN 和网关作为流量入口的关键节点，可以通过分桶机制和灰度规则对用户请求进行分流，从而实现精细化的流量控制。

---

## CDN 分桶机制

### 核心原理
CDN 会根据用户的请求信息（如 IP 地址、User-Agent 等）或预设规则，将用户分配到不同的 **分桶** 中。每个分桶可以对应一组特定的资源或服务版本。

### 实现方式
1. **Cookie 带入分桶信息**：
   - CDN 在响应用户请求时，会在返回的 HTTP 响应头中设置一个特殊的 Cookie。
   - 该 Cookie 包含了用户的分桶信息（如 `bucket_id`），用于标识用户所属的分桶。
   ```http
   Set-Cookie: bucket_id=1; Path=/; HttpOnly
   ```

2. **自动分桶逻辑**：
   - CDN 根据预设规则（如哈希算法、随机分配等）为每个用户生成唯一的分桶 ID。
   - 用户后续的请求会携带该 Cookie，CDN 根据分桶 ID 决定返回哪个版本的资源。

### 示例场景
假设我们有三个分桶（Bucket A、Bucket B、Bucket C），分别对应不同的静态资源版本：
- Bucket A：旧版本资源。
- Bucket B：新版本资源（灰度测试）。
- Bucket C：备用资源。

当用户首次访问时，CDN 会为其分配一个分桶，并通过 Cookie 持久化分桶信息。后续请求中，CDN 根据 Cookie 中的分桶 ID 返回对应的资源。

---

## 网关侧灰度发布

### 核心原理
网关作为系统的流量入口，可以根据 CDN 带入的分桶信息或其他请求特征（如 Header、Query 参数等），进一步对流量进行精细化控制，实现灰度发布。

### 实现方式
1. **读取分桶信息**：
   - 网关从请求的 Cookie 或其他字段中提取分桶 ID。
   - 根据分桶 ID 将流量路由到不同的后端服务或功能版本。
   ```javascript
   const bucketId = request.cookies.bucket_id || 'default';
   if (bucketId === '1') {
     // 路由到灰度版本
     proxyToGrayService(request);
   } else {
     // 路由到默认版本
     proxyToDefaultService(request);
   }
   ```

2. **动态调整灰度比例**：
   - 网关支持动态配置灰度比例，例如将 10% 的流量分配到新版本。
   - 可以通过管理后台或配置文件实时调整灰度策略。

3. **监控与回滚**：
   - 网关侧记录灰度流量的日志和指标，便于监控新版本的表现。
   - 如果发现问题，可以快速回滚到旧版本。

### 示例场景
假设我们需要对某个新功能进行灰度测试：
- 配置网关将 5% 的流量分配到新版本服务。
- 其余 95% 的流量继续使用旧版本服务。
- 通过分析日志和用户反馈，逐步扩大新版本的流量比例，直到全量上线。

---

下面介绍一下文件灰度。文件灰度是指在部署过程中，将新版本的代码、配置文件或其他静态资源（如HTML、CSS、JavaScript文件等）逐步推送到部分服务器或节点上，而不是一次性全量更新。

FaaS应用的代码都存储在机器本地，比如源站模版。如果希望实现文件灰度发布，并让前端Web页面能够强制命中灰度版本，可以结合本地部署特点和灰度策略进行设计。以下是几种可行的解决方案：

---

### 1. **通过负载均衡器定向流量**
#### 实现方式：
- 在你的FaaS环境中，使用负载均衡器（如Nginx、HAProxy）将流量分配到不同的机器。
- 每台机器上部署不同版本的代码（如灰度版本和稳定版本）。
- 前端通过特定的请求头、Cookie或URL参数，强制命中灰度机器。

#### 示例：
假设你的负载均衡器配置如下：
```nginx
upstream faas_backend {
    server 192.168.1.10; # 稳定版本
    server 192.168.1.11; # 灰度版本
}

server {
    listen 80;

    location /api/ {
        if ($arg_gray = "true") {
            proxy_pass http://192.168.1.11; # 强制命中灰度机器
            break;
        }
        proxy_pass http://faas_backend; # 默认负载均衡
    }
}
```

前端代码：
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 利用负载均衡器实现灰度分流，简单高效。
- 可以根据URL参数灵活控制灰度命中。

#### 缺点：
- 需要手动维护不同机器上的代码版本。
- 如果灰度机器数量较多，管理成本较高。

---

### 2. **通过文件路径区分灰度版本**
#### 实现方式：
- 在每台机器上部署不同版本的代码，并通过文件路径区分灰度版本。
- 前端通过URL参数动态加载对应的代码路径。

#### 示例：
假设你的FaaS应用代码目录结构如下：
```
/faas/
  /stable/  # 稳定版本代码
  /gray/    # 灰度版本代码
```

后端伪代码（Node.js示例）：
```javascript
app.get('/api/function', (req, res) => {
  const isGray = req.query.gray === 'true';
  const codePath = isGray ? '/faas/gray/' : '/faas/stable/';
  
  // 动态加载对应版本的代码
  const handler = require(codePath + 'functionHandler');
  handler(req, res);
});
```

前端代码：
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 不需要额外的负载均衡器配置。
- 文件路径清晰，便于管理和回滚。

#### 缺点：
- 需要在每台机器上维护多个代码版本。
- 如果代码更新频繁，可能会增加部署复杂度。

---

### 3. **通过功能开关（Feature Toggle）实现灰度**
#### 实现方式：
- 在代码中引入功能开关，用于控制是否启用灰度逻辑。
- 前端通过请求头或URL参数传递灰度标识，后端根据标识决定执行哪个版本的逻辑。

#### 示例：
后端伪代码（Node.js示例）：
```javascript
app.get('/api/function', (req, res) => {
  const isGray = req.query.gray === 'true';

  if (isGray) {
    // 执行灰度逻辑
    res.send({ message: 'This is the gray version' });
  } else {
    // 执行稳定逻辑
    res.send({ message: 'This is the stable version' });
  }
});
```

前端代码：
```javascript
const isGray = new URLSearchParams(window.location.search).get('gray') === 'true';
fetch(`/api/function?gray=${isGray}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 无需维护多个代码版本，所有逻辑集中在一个代码库中。
- 灰度逻辑可以通过开关动态调整，灵活性高。

#### 缺点：
- 功能开关的管理需要额外的工具或框架支持。
- 如果灰度逻辑过于复杂，可能导致代码可读性下降。

---

### 4. **通过本地缓存或文件哈希区分灰度**
#### 实现方式：
- 在每台机器上部署不同版本的代码，并为每个版本生成唯一的文件哈希值。
- 前端通过指定哈希值加载对应的代码版本。

#### 示例：
假设你的代码目录结构如下：
```
/faas/
  /v1/  # 版本1代码
  /v2/  # 版本2代码
```

后端伪代码（Node.js示例）：
```javascript
app.get('/api/function', (req, res) => {
  const version = req.query.version || 'v1'; // 默认加载v1版本
  const codePath = `/faas/${version}/`;

  // 动态加载对应版本的代码
  const handler = require(codePath + 'functionHandler');
  handler(req, res);
});
```

前端代码：
```javascript
const version = 'v2'; // 强制加载灰度版本
fetch(`/api/function?version=${version}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

#### 优点：
- 文件版本化管理，便于追踪和回滚。
- 可以通过哈希值精确控制灰度范围。

#### 缺点：
- 需要维护多个版本的代码文件。
- 如果版本过多，可能导致磁盘空间占用增加。

---

### 总结

| **方法**                     | **适用场景**                                   | **优点**                                      | **缺点**                                      |
|------------------------------|-----------------------------------------------|---------------------------------------------|---------------------------------------------|
| **负载均衡器定向流量**       | 多台机器部署不同版本                          | 简单高效，适合大规模灰度                     | 需要手动维护不同机器上的代码版本             |
| **文件路径区分灰度版本**     | 单机多版本部署                                | 文件路径清晰，便于管理                       | 部署复杂度较高                               |
| **功能开关**                 | 单一代码库，逻辑分离                          | 灵活性高，无需维护多个版本                   | 功能开关管理复杂，代码可读性可能下降         |
| **本地缓存或文件哈希区分**   | 精确控制灰度范围                              | 文件版本化管理，便于追踪和回滚               | 需要维护多个版本文件，磁盘占用可能增加       |

在你的场景中，由于代码存储在本地机器上，建议优先考虑**功能开关**或**文件路径区分灰度版本**的方式。这两种方法既能满足灰度发布的需求，又不会显著增加部署和管理的复杂度。如果未来扩展到多台机器，则可以引入负载均衡器来进一步优化灰度策略。

## 灰度放量

方案 1: 写一个 ID 值，当用户 ID 大于该值时启用功能（类似白名单机制）。