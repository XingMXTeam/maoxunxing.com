---
title: "Http I Learned"
date: 2021-12-22T20:10:28+08:00
draft: true
---


请求参数可以是数组么？答案是可以。 我以前一直以为json的就是对象， 或者key=value的形式

``` ts
$.ajax({
    type: "POST",
    url: "index.php",
    dataType: "json",
    data: JSON.stringify({ paramName: info }),
    success: function(msg){
        $('.answer').html(msg);
    }
});
```

> https://stackoverflow.com/questions/8890524/pass-array-to-ajax-request-in-ajax
