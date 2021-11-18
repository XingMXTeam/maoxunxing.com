---
title: "Basic Knowledge"
date: 2021-11-18T20:56:09+08:00
draft: true
---

### iframe deny 

``` shell
Content-Security-Policy: frame-ancestors self https://xxxx 
```

通过增加这个，允许iframe被嵌入