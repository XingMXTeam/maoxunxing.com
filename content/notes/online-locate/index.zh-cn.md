---
title: "线上问题排查方案"
date: 2022-05-05T20:53:17+08:00
---

一般用户反馈一个报错信息定位是接口报错、时间
-> 【监控系统】从监控中根据时间过滤出日志
-> 【监控系统】从路径回放日志中找到单次访问唯一id
-> 【监控系统】查看调用链路找到链路code
-> 【后端日志】根据链路code捞出响应+结合mock 复现