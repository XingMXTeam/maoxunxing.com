---
title: "react-lazyload代码阅读总结"
date: 2019-11-25
tags:
  - React
  - JavaScript
  - Performance
  - Code Analysis
---

函数节流：
resize, mousemove 正常操作下，会短时间内触发多次绑定事件，而如果事件中操作DOM节点，会引发大量计算。导致页面响应慢或者卡顿，甚至崩溃（比如IE）

参考：
<http://www.alloyteam.com/2012/11/javascript-throttle/>
<https://css-tricks.com/the-difference-between-throttling-and-debouncing/>
<https://github.com/lishengzxc/bblog/issues/7>

offsetWidth和width的区别：
前者返回盒模型的宽度

参考：
<https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetWidth>

getClientRects的用法：
返回模型元素的矩形区域集合，这个元素如果是inline box模型且换行了，会返回两个，三行就三个偏移数组，而块状元素就只算一个。

参考：
<http://www.zhangxinxu.com/wordpress/2011/09/cssom%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%BC%8Fcssom-view-module%E7%9B%B8%E5%85%B3%E6%95%B4%E7%90%86%E4%B8%8E%E4%BB%8B%E7%BB%8D/>

用npm的prop-types包替代React.PropTypes

getBoundingClientRect 在IE10下可能会报错（用try catch处理）
参考：
<https://github.com/c3js/c3/issues/1056>

document.documentElement和node.ownerDocument和document ：
document.documentElement只读属性，html元素
document是文档对象，属于window，比如window.document
ownerDocument 返回当前节点的顶层文档，可能是document也可能是iframe.contentWindow.document（还有xml的情况）

参考：
<https://developer.mozilla.org/zh-CN/docs/Web/API/Document/documentElement>
<https://stackoverflow.com/questions/9845043/when-node-ownerdocument-is-not-window-document>
