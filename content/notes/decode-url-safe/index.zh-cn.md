---
title: "Decode Url Safe"
date: 2021-12-10T10:12:21+08:00
---

decodeUrlComponent 可能会抛出异常

```js
decodeURIComponent("%C4%97%");
// VM158:1 Uncaught URIError: URI malformed
//     at decodeURIComponent (<anonymous>)
//    at <anonymous>:1:1
```

解决方法：

```ts
try {
  decodeURIComponent('%C4%97%')
}
catch(){

}
```
