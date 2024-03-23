---
title: "Edge Cache"
date: 2021-08-24
draft: true
tags:
  - front-end
  - programming
  - edge-cache
description: "This topic is about how to use edge cache to promote the app or website's performance."
images:
  - edge-cache/edge-cache.png
---

## Situation

- what is edge cache
- what problem it solves?
  - the first visit webpage cannot make advantage of cache, like pwa, connection reuse.The client side cache can also not be used when first visit.
- what is the edge cache node position of request link
- what the difference with ssr、csr/cdn
  - ssr
    - long server time make the page white time long
  - csr/cdn
    - cache all html to the cdn. because every user have different page view, it is not realibility. so we often cache static html to the cdn and use **csr** to request data
    - this solution solves the white page problem, but the meaningful content is showed later than ssr
  - esr(Edge server render)
    - csr/cdn is serial handle way: request html, then download js and css...response first cached bytes, meanwhile cdn to load dynamic content， it is parallel and we can reuse connection between cdn and server side
    - edge server handle request like service worker
    - faster 200ms than no esr
