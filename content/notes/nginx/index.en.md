---
title: "Nginx"
date: 2025-03-03
tags:
  - Nginx
---

## rewrite reverse proxy


```nginx
server {
  listen 80
  server_name example.com

```

location /api/ {
    proxy_pass http://backend-server:8080/
  }
}
```

- proxy-pass: Forwards the request to the specified backend server

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

- rewrite
  - Match the path and replace it with new-api
  - **break** indicates stopping the processing of subsequent rewrite rules