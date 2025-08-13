---
title: "whistle代理问题"
date: 2025-08-13
description: ""
draft: true
---

```
https://assets.aaa.com/g/code/lib/react/18.3.1/umd/react.production.min.js https://assets.aaa.com/g/code/lib/react/18.3.1/umd/react.development.js
https://assets.aaa.com/g/code/lib/react-dom/18.3.1/umd/react-dom.production.min.js https://assets.aaa.com/g/code/lib/react-dom/18.3.1/umd/react-dom.development.js
/(?:.+\.bbb\.com|.+\.ccc\.com):3000/ws/ ws://localhost:3000/ws
/dev.g.alicdn.com/aeop-project/live-rights-management/(\\d|\\.)+/(.+?)\\.html$/ http://localhost:3000/live-rights-management/$2.html
/(?:.+\.bbb\.com|.+\.ccc\.com)/live-rights-management/(.+?)\\.(.+?)\\.hot-update.json$/ http://localhost:3000/live-rights-management/$1.$2.hot-update.json
/(?:.+\.bbb\.com|.+\.ccc\.com)/live-rights-management/(.+?)\\.(.+?)\\.hot-update.js$/ http://localhost:3000/live-rights-management/$1.$2.hot-update.js
/\\/live-rights-management/css/(.+)/ http://localhost:3000/live-rights-management/css/$1
/\\/live-rights-management/js/(.+)/ http://localhost:3000/live-rights-management/js/$1
/\\/live-rights-management/(.+)\\.js(.*)/ http://localhost:3000/live-rights-management/$1.js$2
```

上面的**\\** 改为**\** 才能正确代理成功

```
https://assets.aaa.com/g/code/lib/react/18.3.1/umd/react.production.min.js https://assets.aaa.com/g/code/lib/react/18.3.1/umd/react.development.js
https://assets.aaa.com/g/code/lib/react-dom/18.3.1/umd/react-dom.production.min.js https://assets.aaa.com/g/code/lib/react-dom/18.3.1/umd/react-dom.development.js
/(?:.+\.bbb\.com|.+\.ccc\.com):3000/ws/ ws://localhost:3000/ws
/dev.g.alicdn.com/aeop-project/live-rights-management/(\d|\.)+/(.+?)\.html$/ http://localhost:3000/live-rights-management/$2.html
/(?:.+\.bbb\.com|.+\.ccc\.com)/live-rights-management/(.+?)\.(.+?)\.hot-update.json$/ http://localhost:3000/live-rights-management/$1.$2.hot-update.json
/(?:.+\.bbb\.com|.+\.ccc\.com)/live-rights-management/(.+?)\.(.+?)\.hot-update.js$/ http://localhost:3000/live-rights-management/$1.$2.hot-update.js
/\/live-rights-management/css/(.+)/ http://localhost:3000/live-rights-management/css/$1
/\/live-rights-management/js/(.+)/ http://localhost:3000/live-rights-management/js/$1
/\/live-rights-management/(.+)\.js(.*)/ http://localhost:3000/live-rights-management/$1.js$2

```