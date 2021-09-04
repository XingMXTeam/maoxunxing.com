---
title: "nodejs手册"
date: 2021-08-27T10:20:36+08:00
draft: true
tags:
- nodejs
- programming
description: ""
---

## 运维

服务重启

``` shell
cd /home/admin/{appname}/bin/
# 仅重启
./nodejsctl stop && ./nodejsctl start  
# 重新解压资源包，然后启动服务
./nodejsctl pubstart  
```

## 多租户hsf服务调用

采用中间件透传租户标的方式

## 多租户环境部署

1 多租户环境部署
2 通过URL做配置化（生成租户标）

## 日志

错误日志 admin/logs/{app}/common-error.log
常规记录日志  admin/logs/{app}/{app}-web.log
应用access日志 admin/{app}/logs/access-123.log
Nginx Access log admin/cai/logs/cronolog/2021/.log



