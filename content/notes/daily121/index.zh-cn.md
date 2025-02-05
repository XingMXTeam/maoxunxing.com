---
title: "D2分享总结"
date: 2019-11-25
---
网络越差，优势越明显

next.js
react-server
beidou

pdf用蓝色背景 白色字 重点是其他颜色：

beidou-plugin-react: view plugin
beidou-plugin-webpack: webpack plugin for code build
beidou-plugin-router: auto router plugin
beidou-plugin-isomorphic: isomorphic plugin to support BOM/DOM variables & non-JS source, such as less

<https://github.com/Unitech/pm2>
<http://pm2.keymetrics.io/docs/usage/cluster-mode/>
<https://github.com/xiongwilee/blog/issues/6>

beidou git仓库下：
loadtest <http://127.0.0.1:6001> -n 16
性能优化：
1 use babel performance plugin
transform-react-constant-elements
transform-react-inline-elements
transform-node-env-inline

术语说明：
QPS = req/sec = 请求数/秒

【QPS计算PV和机器的方式】

QPS统计方式 [一般使用 http_load 进行统计]
QPS = 总请求数 / ( 进程总数 * 请求时间 )
QPS: 单个进程每秒请求服务器的成功次数

单台服务器每天PV计算
公式1：每天总PV = QPS *3600* 6
公式2：每天总PV = QPS *3600* 8

服务器计算
服务器数量 = ceil( 每天总PV / 单台服务器每天总PV )

【峰值QPS和机器计算公式】

原理：每天80%的访问集中在20%的时间里，这20%时间叫做峰值时间
公式：( 总PV数 *80% ) / ( 每天秒数* 20% ) = 峰值时间每秒请求数(QPS)
机器：峰值时间每秒QPS / 单台机器的QPS = 需要的机器

问：每天300w PV 的在单台机器上，这台机器需要多少QPS？
答：( 3000000 *0.8 ) / (86400* 0.2 ) = 139 (QPS)

问：如果一台机器的QPS是58，需要几台机器来支持？
答：139 / 58 = 3

>nvm ls

2 用node8
>nvm use node8

3 用产品模式

4 部分模块由服务端执行: 需要seo的决定？
5 缓存模块/组件
6 use react16 or newest

use async function 30%的性能提升
减低组件的嵌套深度
hot cache (热点缓存)

怎么找到性能瓶颈？
<https://github.com/alibaba/beidou/blob/master/packages/beidou-docs/articles/node-performance-optimization.md>

<http://johnhax.net/2017/benchmark/>

payload到底是什么鬼？

fastify.io
从第一次的commit 看作者的思想是什么？

测试一小段代码的性能：microbenchmark

有try..catch 无法优化？

console.time/data.now():  精度=>误差  跑久一点->误差更小
问题：
结果不稳定

just in time:jit

解析器
baseline compiler

预热

performance.now() => 支持从哪里来 文档!?
process.hrtime();

PPT展示你的逻辑思维？脑子储备论据。。

听别人讲可能不够深入 要看书。。

置信区间

最小值应该收敛的

<https://www.villainhr.com/>
跨端的中文加粗用 bold或者700

安卓 小米(垂直居中有点偏上)： font-familly：PingFang SC,  miui, system-ui..

chrome animations 精细化看动画效果

```
let timer = setTimeout(function() {
    timer = null;
    Loading.getInstance().show();
}, 100);


Promise.all([this.getModule(), this.getData()]).then(function(res) {
 let Module = res[0];
 let data = res[1];
 new Module(data);

 if(timer) {
    clearTimeout(timer);
 }else {
    Loading.getInstance().hide();
 }
});
```

1
一般情况下是点击的时候才去加载模块，然后再去加载数据，最后渲染。
优化点是：
Promise.all({[
    loadResources(),
    loadData()
]}).then(..)

2 只有当大于100ms时 才显示loading..

```
let timer = setTimeout(function() {
    timer = null;
    Loading.getInstance().show();
}, 100);


Promise.all([this.getModule(), this.getData()]).then(function(res) {
 let Module = res[0];
 let data = res[1];
 new Module(data);

 if(timer) {
    clearTimeout(timer);
 }else {
    Loading.getInstance().hide();
 }
});
```

3

通过组合Promise实现精确的预加载
Promise.all([
    renderFirstScreen(),
    rederOtherImportantMods(),
   ...
]).then()

用脚本采集用户信息，当一个用户的点击响应时间大于100ms的异常就上报（可视化的展示）

操作体验：
动画：只使用Transform 3D\Opacity
动画：will-change
滚动： Passive event listeners（滚动不跟手）
手势：配合使用touchmove和scroll事件 ： ios下第一次触发scroll时存在延迟 有时高度达100px+(搜索框收起不及时)

研究各种问题。总结沉淀方案

预加载：
页面预放到客户端下面（保证页面肯定能打开）
基于Service Worker的跨端预加载方案（支持离线访问，必须用户有访问的）
1 页面一定能打开
2 基于Push消息保证用户看到最新页面
Service Worker 用户第二次进来才能看到最新的页面

模块级别的加载异常处理 点击事件的异常处理 整个页面的异常处理

跨页交互 抽屉式的全局导航 无闪烁的Tabbar  开机动画

hybrid应用超50%
hpm debug..

敲一个命令行搞定
联动DNS 注册调试域名：
去除host绑定 支持https

IOS模拟器 safari 调试+模拟器包

不插线调试hybrid应用

hybrid inspector
hilo

iot

技术人员的价值：
前端的核心竞争力：拆解并输出解决方案并落地
思考->做
思考->发声
有输入<=>更要有输出  形成闭环 才能更有动力持续

和老大建立信任感。 告诉他这种方式能帮助团队成长 有效果

weex 做客户端

Ardunino
ruff
raspberry-pi

树莓派
pwm

nodejs 串口通信
RFID读卡器

感谢各位老师的到来。

马斯洛金字塔

自我实现_成长
尊重_成长
情感&归属_归属
安全_生存
胜利_生存

第一阶段：质量&效率-生存阶段

react vue webpack=> 环境因素 技术视野
组件体系 校验&卡口 监控体系=》进一步加强效率和质量
工程体系 数据体系 =》接近业务环境

gulp webpack

第二阶段：团队价值->赋能和系统化

 赋能： 平台能力
 反哺：
商业模式的推导（虽然好 但是你想好怎么做了吗 和你有关系吗）
产品策略这么做的话？运营策略有吗？
与现有业务的关系：是重构还是拓展？

了解：数据流链路 虽然我不知道你这个数据怎么处理的 但是我要知道你这个数据是从哪里来的
怎么来的？中间处理的环节？

竞品分析

最重要的要和自己建立连接：这个东西对你有什么用？

第三阶段：整合 重塑
整合一套解决方案
业务模型自己构建

面向数据编程 其实前端主要是数据 数据流 数据处理
数据模型？？
<https://rap.ruff.io/>

每次群里回复线上或者运营问题 是不是很烦啊？？
优秀的设计和交互

酷炫的H5技术要点：
reate-router
html5流媒体API:
Transition/svg 和视频一起用
keyframs/reactmotion ：完成复杂的酷炫效果

canvas

GalGame

强推。

pixi.js(基于Shader)

编程是一方面 另外一方面是对其他领域知识的领悟 结合起来-》产出一点东西

音频和画面不同步

css/webgl
sensors/webrtc
gpu
webworker

Three.js
PIXI Egret
Babylonjs
WebVR/AR
deeplearn.js

webvr-poly
二进制分帧
多路复用
头部压缩
请求优先级

webpagetest可以模拟丢包率

丢包率越高导致http2表现越不好 因为是传输层的队首阻塞

qiuc udp

protocol为h2  标识是http2

客户端---(1.0/2.0)---- proxy---(1.0)------- server

一个页面判断当前浏览器是否支持http2  一般都用二维码

spdy

pc上浏览器支持率已经很高了

chrome://net-intern  可以看一些请求的底层数据

多域名不同处理：如果是1.0 就指向多域名 否则还是指向单域名

请求分离
预建连接

nodejs是后台 根据请求方式 去对js做处理

304状态码
