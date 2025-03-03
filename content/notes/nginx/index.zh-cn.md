---
title: "Ngnix"
date: 2025-03-03
tags:
  - Ngnix
---

## rewrite 反向代理


```nginx
server {
  listen 80
  server_name example.com

  location /api/ {
    proxy_pass http://backend-server:8080/
  }
}
```

- proxy-pass: 将请求转发到指定的后端服务器

```nginx
server {
    listen 80;
    server_name example.com;

    location /old-api/ {
        rewrite ^/old-api/(.*)$ /new-api/$1 break;
        proxy_pass http://backend-server:8080;
    }
}
```

- rewite
  - 匹配路径，并且替换为new-api
  - **break** 表示停止后续的 rewrite 规则处理