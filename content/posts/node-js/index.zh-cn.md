---
title: "nodejs你需要知道的"
date: 2021-08-27T10:20:36+08:00
draft: true
tags:
  - nodejs
  - programming
description: ""
images:
  - node-js/node-js.jpeg
---

## 运维

服务重启

```shell
cd /home/admin/{appname}/bin/
# 仅重启
./nodejsctl stop && ./nodejsctl start
# 重新解压资源包，然后启动服务
./nodejsctl pubstart
```

## 多租户 hsf 服务调用

采用中间件透传租户标的方式

## 多租户环境部署

1 多租户环境部署
2 通过 URL 做配置化（生成租户标）

## 日志

错误日志 admin/logs/{app}/common-error.log
常规记录日志 admin/logs/{app}/{app}-web.log
应用 access 日志 admin/{app}/logs/access-123.log
Nginx Access log admin/cai/logs/cronolog/2021/.log

## docker

把不常变化的内容(如基础 RPM、启动脚本等)做成基础镜像，在应用发布的指定 Dockerfile 中 FROM 基础镜像，重复的内容不再执行，应用基础镜像被
推送到全部的构建机器，提高镜像构建速度，再也不用坐在那里干等构建了

## 工具

nodemon : watch file change
