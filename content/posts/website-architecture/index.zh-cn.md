---
title: "现代化Web架构的理解"
date: 2021-08-06T15:25:06+08:00
tags:
- 架构
images:
- website-architecture/backend-arch.png
description: "有哪些概念？请求链路是怎么样的？分布式系统是什么，有哪些问题要解决？大数据和高并发的问题解法？"
---
## 基础概念

分类<div style='width:100px'></div> | 名称<div style='width:200px'></div> | 解释
---------|----------|---------
 网络 | VPC |  Virtual Private Cloud 虚拟私有云。为什么是虚拟私有？它是一种运行在公有云上，将一部分公有云资源为某个用户隔离出来，给这个用户私有使用的资源的集合，感觉像是在使用自己的私有云一样。什么是云？构建在物理之上的虚拟化网络。VPC采用隧道技术，隔离虚拟网络。每个VPC有一个独立的隧道号，一个隧道号对应一个虚拟化网络。由私网网段（子网）+一个路由器（总入口）+交换机（进一步切分）组成。
 网络 | DNS | 应用层协议和https一样，端口是53，提供根据域名查IP的服务  
 网络 | Record | 记录和IP的对应关系
 网络 | A记录 | 支持将域名映射到IPV4地址  
 网络 | CNAME | 别名 Canonical Name 支持指向另一个域名   
 网络 | MX | Mail Exchanger 支持将域名指向邮件服务器地址    
 网络 | NS | name server 名称服务器记录。支持将子域名委托给其他DNS服务商解析  
 网络 | CDN | Content Delivery Network 解决网络带宽小、访问量大、网点分布不均导致访问网站慢的问题
 网络 | 节点 | 传统的节点是单体的物理机器 -> 单台虚拟机上的服务 -> 轻量级的容器服务，能提供单位服务的逻辑计算资源的集合
 网络 | 统一接入层 | web server代理，它将请求转发给（proxy_pass）应用服务器。能解决域名管理、证书管理、安全管理（应用接入全站https、私钥落地）
 分布式 | NTP（网络时间协议） | 在数据网络潜伏时间可变的计算机系统之间通过分组交换进行时钟同步的一个网络协议，位于OSI模型的应用层
 分布式 | Lamport逻辑时钟/向量时钟 | 一种在分布式环境中为各种操作或事件产生偏序值的技术，它可以检测操作或事件的并行冲突，用来保持系统的一致性
 云原生 | K8s | Kubernetes 跨主机集群的开源容器调度平台，自动化应用容器的部署、扩展和操作。提供以容器为中心的基础架构，是云原生的基础架构
 云原生 | Docker | 系统级别的一次构建到处运行，测试环境搭建、持续集成、持续交付带来了很大便利。打开视野走向全栈（DevOps)

## 请求链路  

> 一个http请求现代化架构下一般会有哪些链路

1 域名解析IP  
2 统一接入层  
3 负载均衡Key--hash->集群  
4 网关层  
5 应用服务器  

## 分布式服务/架构  

### 发展轨迹

> 现代化的服务器架构是怎么演进的

1 RPC (Remote Process Call)
{{< img src="rpc.png" alt="rpc" maxWidth="600px" >}}

2 SOA（Service-Oriented Architecture, 像hsf, dubbo) 面向服务架构

特点：  

* 分布式部署
* 请求分流
* 数据读写分离

{{< img src="soa.jpg" alt="soa" maxWidth="600px" >}}

3 MSA 微服务架构
{{< img src="msa.jpg" alt="msa" maxWidth="600px" >}}

### 分布式架构理论

> 分布式架构需要了解哪些东西理论

一致性理论

* CAP（强一致性）
* ACID（分布式一致性）
* Base（弱一致性）
  * [Distributed consensus theory](http://thesecretlivesofdata.com/raft/)

一致性算法

CALM->CRDT->高可用事务+ZAB协议分析->Paxos Raft Gossip

### 分布式应用

> 分布式应用有哪些

文件系统： HDFS FastDFS Ceph mooseFS 
[对比](https://en.wikipedia.org/wiki/Comparison_of_distributed_file_systems?spm=ata.21736010.0.0.30f21d02woZ6di)  
数据库： Hbase(列式存储)、Elasticsearch/mongodb(文档存储)、redis(kv类型)、spanner(关系型)  
计算： 离线hadoop 实时spark 流式storm/flink/blink  
缓存：持久化redis 非持久化memcache  
消息：kafka rabbitmq rocketmq activemq  
监控：zookeeper  
应用：hsf dubbo  
日志：采集flum、存储elasticsearch/solr sls、定位zipkin  
账本：比特币 以太坊  
  
**应用场景**：  

* 异步调用
  * improve qps capacity 比如实时直播间
* 应用解耦
  * order system->message system->stock system(push or pull)
* 流量控制
  * spike activity/group buy
* 日志处理
  * client->kafka queue->application 日志同步
* 订阅
  * point to point / pub sub mode 比如IM
* 广播方式cache同步
  
举例：  

* high capability and persistence : Active MQ、Rabbit MQ、Rocket MQ
  * question is consistency questions?
    * use db and message queue to ensure final consistency
* client/zookeeper/kafka/storm clusterf
* JMS
  * EJB J2EE
  * Message mode(p2p/pub sub), Message Consume(async sync )

如何避免消息丢失：  

* TCP cannot ensure application no lost*
* sync
  * wait confirm
  * continue ARQ(slide window)
* async
  * callback function

消息幂等：  

* query/delete: no special handle
* unique index
  * avoid dirty data
* token(token+redis/jvm memory)
  * avoid repeat submit
  * token need to apply, only one time
    * 1 apply token
    * 2 submit and to check token, if delete success that token exsit
* Pessimistic lock
  * query with
* optimistic lock
  * update with
* distributed lock
  * if system is distributed, it is hard to build unique index. userid_suffix as key to get distributed lock(multiple threads concurrent lock)
* select+insert
  * when concurrent not high, we can use this
  * search data, if exsit, not run next
  
保证消息的顺序(queue not in order but the message is in order)

* sender: async send message, if 1 failed, you need to resend, cannot promise order
* saver:
  * you cannt split message to different queue
  * if you have only one queue, how to promise order if a machine unvailable, you can switch to another machine(when message is not consumed)
    * sync copy to promise the order
* receiver
  * sync consume

### 分布式缓存

> 如何解决分布式缓存问题

数据流
{{< img src="data-flow.png" alt="data-flow" maxWidth="600px" >}}

采用中间件 middleware

**Redis**：  

* 为什么快
  * use memory
  * non-blocking multiplexing io
  * single thread
* 应用场景
  * sorted set( top N, range find, delay task, )
  * set(remove duplicated, common and unique things)
  * list(message queue, pagination)
  * hash(single point login)
  * string(count cache)
* 内存策略
  * delete regularly and randomly
  * lazy delete when get key
  * memory elimination
* 渐进式哈希(rehashing)
* 缓存穿透
  * what
  * how to solve
    * bitmap
    * empty value to cache
* 缓存雪崩
  * expire time randomly
  * limit flow
  * distributed lock

### 分布式数据库

读写分离：数据写到主库，读取从备库（数据复制于主库）  
垂直分库：不同业务单元划分到不同的数据库。 ACID被打破；Join操作困难；外键约束受影响
水平分表：单个表拆分（比如ugc表非常大）。自增主键受影响；单表查询变成多表

应用场景：  
1 读写分离  
2 分库分表  
3 动态数据源  
4 主备切换  

### 分布式调度

schedulerX

### 分布式搜索

Open Search

### 分布式事务

TXC(Taobao Transaction Constructor)

### 分布式计算

**blink**: 分布式实时计算  
**odps**（Open Data Processing Service）: 分布式离线计算 结构化数据的存储和计算, 海量数据仓库的解决方案和大数据的分析和建模

* web: 提供服务  
* sdk: 封装 api  
* clt: 客户端工具，提交命令  
* ide: 可视化操作  

## 大数据和高并发

> 大数据和高并发场景的解决方案有哪些？

### bitmap

* 应用场景(data range below int*10)
  * quick sort not repeated array
  * quick remove repeat
  * quick search
  * bloom filter（high Accuracy
    * check url is the same

* advantage
  * 占用内存少

### 限流算法

* count number
* sliding window
* leaky bucket 
* token bucket

### 负载均衡

* dns 
* reverse proxy
* http redirect
* Stratification
 
## 运维和监控

### 概念

DevOps: 持续开发，持续测试，持续集成，持续部署，持续监控

{{< img src="devops.jpg" alt="devops" maxWidth="600px" >}}

<!-- 租户：将资源隔离 -->

<!-- ### 系统

监控体系：  
EagleEye/Dapper(google) 分布式调用跟踪系统
Sunfire（Xflush） 应用可用性监控系统
Alimonitor 应用监控系统

工具体系：  
Arthas java诊断工具
zprofile jvm性能分析工具
switch 开发和动态配置项管理框架
sentinel 资源调度控制（限流 降级 授权 调用统计）
onelog 日志管控系统
log service(sls) 日志服务实时数据一站式服务 -->


<!-- {{< img src="network.jpg" alt="network" maxWidth="600px" >}} -->
<!-- 
售卖区： ecs rds(vpc隔离成多个子网)
OXS: ots oss odps ons ocs -->
<!-- 
网络： 网络工作模式：同步网络（节点同步执行、消息延迟有限、高效全局锁）、半同步网络（锁范围放宽）、异步网络（节点独立执行、消息延迟无上限、无全局锁、部分算法不可行）   -->


<!-- 统一接入层(AServer)： tengine运行的web server代理。 将请求转发给（proxy_pass）应用服务器 -->

<!-- * 解决https证书申请和更换
* 证书泄漏：部署在服务器有泄漏风险
* 应用安全：应用接入全站https、管理私钥
* 安全管控：收敛安全入口
   -->
<!-- 
接入层通过VIP Server发现后端可用机器；
业务层通过VIP Server做服务发现和调用；
中间件通过VIP Server做环境路由；
数据库通过VIP Server解决DNS 解析和上下线问题

1 VIP Server需要添加vip server key（和域名是一对多） + 应用分组
2 Aserver填写vip server key和域名

AServer从请求头获取域名； 根据域名找到vip server key； 根据key找到集群 -->

<!-- ### 开发环境

自动化安装脚本

aone回滚时，用基线版本直接覆盖master当前分支版本（不是操作的git回滚)，也就是说会新生成新的提交。
本地开发 需要重新执行git revert当前回滚版本 -->

<!-- Pouch/Docker: 系统级别的一次构建到处运行，测试环境搭建、持续集成、持续交付带来了很大便利。打开视野走向全栈（DevOps) -->

<!-- K8s：Kubernetes 跨主机集群的开源容器调度平台，自动化应用容器的部署、扩展和操作。提供以容器为中心的基础架构，是云原生的基础架构。 -->

<!-- **MetaQ**:  

消息模型
{{< img src="message-model.png" alt="message-model" maxWidth="600px" >}}

物理模型
{{< img src="physical.png" alt="physical" maxWidth="600px" >}}

name server: 注册服务器，将topic注册到上面  
broker: 存储转发服务器。 和name server建立长连接，从而获得topic信息  
producer: 消息发送方。 和一个name server建立连接，获得路由信息，再和broker建立长连接且定时向master发送心跳，再由master同步到所有brokder  
consumer: 消息接收方，需要和其中一个name sever建立连接，获得路由信息，再向提供服务的master、slaver建立长连接，具体接收消息时刻选择broker   -->


<!-- 
**Tair**:  

物理架构  
{{< img src="tair-physic.png" alt="tair-physic" maxWidth="600px" >}}

config server 管理data server结点，维护data server的状态信息（单点 主备方式保证可靠性）
data server负责数据存储 按照config server的指示完成数据复制和迁移，并给config server发送心跳信息

逻辑架构
{{< img src="tair-logic.png" alt="tair-logic" maxWidth="600px" >}}

数据一致性： 通过version保证
负载均衡：一致性哈希算法

数据访问方式1： Hash(key) % Bucketcount，得到具体的数据存储Bucket， 再检索数据路由表到该Bucket所在的DataServer
数据访问方式2（多级缓存）: DataServer上划分Hotzone存储热点数据的访问，由客户端配置的缓存访问逻辑来处理缓存访问 -->

<!-- TDDL(Taobao Distributed Data Layer) -->

<!-- 
整体架构  
{{< img src="db-arch.png" alt="db-arch" maxWidth="600px" >}}

客户端架构
{{< img src="client-arch.png" alt="client-arch" maxWidth="600px" >}}

服务端架构
{{< img src="db-server-arch.png" alt="db-server-arch" maxWidth="600px" >}}

数据源架构：  
{{< img src="db-matrix.jpg" alt="db-matrix" maxWidth="600px" >}}
Matrix层：SQL的解析、优化，执行; 规则匹配；表名替换；sql转发; 合并atom返回的结果集，返回给client  
Group层： 读写分离和主备切换（镜像备份，通过日志变化，在从库中执行相同动作；或者需要先路由到从库，再执行动作 - 根据权重选择atom; 具有重试策略的调用atom执行sql  
Atom层：物理db组成 - 执行sql; 返回结果到matrix   -->

<!-- {{< img src="odps-arch.jpg" alt="odps-arch" maxWidth="600px" >}} -->

<!-- odps客户端 
<!-- 
接入层：
http服务，用户认证，cache, load balance -->
<!-- {{< img src="request-chain.jpg" alt="request-chain" maxWidth="600px" >}} -->
<!-- {{< img src="soa.png" alt="soa" maxWidth="600px" >}} -->
<!-- 
**dubbo**:
{{< img src="dubbo.png" alt="dubbo" maxWidth="600px" >}} 

* cdn
  * why
* reverse proxy
  * why 
  
### 分流和容灾 

how to do it ? 

Protocol Difference 
* BSD  -->

<!-- 
**hsf**:  
{{< img src="hsf-module.png" alt="hsf-module" maxWidth="600px" >}}

调用方式：

* 同步实时调用
* Future异步调用
* Callback异步调用
* Generic调用
* 服务端Sycn调用
* Http调用

### 分布式消息

> 什么是分布式消息，和分布式应用的区别是？
<!-- 
* RPC Message
* Restful -->
 
<!--   
## design mode

SOLID -->

<!-- ## Top k

* how to solve
  * 1 sort
  * 2 partial elimination
    * save k in container, and other numbers compare with them
  * 3 divide and conque
    * split to n group, find top k in the group
  * 4 hash remove repeat number , then divide and conque
  * 5 minimum heap
  code -->
