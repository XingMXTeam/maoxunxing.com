---
title: "Website Architecture"
date: 2021-08-06T15:25:06+08:00
draft: true
---

## 分布式服务 Distributed Micro Service  
what is distributed micro service?

### 发展轨迹
1 RPC (Remote Process Call)
{{< img src="rpc.png" alt="rpc" maxWidth="900px" >}}

2 SOA（Service-Oriented Architecture, 像hsf, dubbo)
{{< img src="soa.png" alt="soa" maxWidth="900px" >}}

* 分布式部署
* 请求分流
* 数据读写分离

### 分布式架构

**hsf**:  
{{< img src="hsf-module.png" alt="hsf-module" maxWidth="900px" >}}

调用方式：

* 同步实时调用
* Future异步调用
* Callback异步调用
* Generic调用
* 服务端Sycn调用
* Http调用

**dubbo**:
{{< img src="dubbo.png" alt="dubbo" maxWidth="900px" >}}

* cdn
  * why
* reverse proxy
  * why

* CAP
  * what is CAP
* ACID
  * what is ACID
* Base
* [Distributed consensus theory](http://thesecretlivesofdata.com/raft/)

### Communication

* RPC Message
  * what is this? And how to use it?
* Restful
  * what is this? And how to use it?

### Diversion and Disaster tolerance

how to do it ? 

Protocol Difference

* BSD

## middleware

* Redis
  * why fast
    * use memory
    * non-blocking multiplexing io
    * single thread
  * how to use it(very important
    * sorted set( top N, range find, delay task, )
    * set(remove duplicated, common and unique things)
    * list(message queue, pagination)
    * hash(single point login)
    * string(count cache)
  * memory strategy
    * delete regularly and randomly
    * lazy delete when get key
    * memory elimination
  * progressive rehash
    * how
  * cache penetration
    * what
    * how to solve
      * bitmap
      * empty value to cache
  * cache avalanche
    * expire time randomly
    * limit flow
    * distributed lock

## 分布式消息 distributed message

### 中间件 middleware

### 应用场景

* async handle
  * improve qps capacity 比如实时直播间
* application decoupling
  * order system->message system->stock system(push or pull)
* flow control
  * spike activity/group buy
* log handle
  * client->kafka queue->application 日志同步
* newsletter
  * point to point / pub sub mode 比如IM
* 广播方式cache同步

* examples
  * high capability and persistence : Active MQ、Rabbit MQ、Rocket MQ
    * question is consistency questions?
      * use db and message queue to ensure final consistency
  * client/zookeeper/kafka/storm clusterf
* JMS
  * EJB J2EE
  * Message mode(p2p/pub sub), Message Consume(async sync )
* avoid message lost
  *TCP cannot ensure application no lost*
  * sync
    * wait confirm
    * continue ARQ(slide window)
  * async
    * callback function
* message idempotent
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
* message processed in order(queue not in order but the message is in order)
  * sender: async send message, if 1 failed, you need to resend, cannot promise order
  * saver: 
    * you cannt split message to different queue
    * if you have only one queue, how to promise order if a machine unvailable, you can switch to another machine(when message is not consumed)
      * sync copy to promise the order
  * receiver
    * sync consume

**MetaQ**:  

消息模型
{{< img src="message-model.png" alt="message-model" maxWidth="900px" >}}

物理模型
{{< img src="physical.png" alt="physical" maxWidth="900px" >}}

name server: 注册服务器，将topic注册到上面  
broker: 存储转发服务器。 和name server建立长连接，从而获得topic信息  
producer: 消息发送方。 和一个name server建立连接，获得路由信息，再和broker建立长连接且定时向master发送心跳，再由master同步到所有brokder  
consumer: 消息接收方，需要和其中一个name sever建立连接，获得路由信息，再向提供服务的master、slaver建立长连接，具体接收消息时刻选择broker  

### 分布式缓存

数据流
{{< img src="data-flow.png" alt="data-flow" maxWidth="900px" >}}

**Tair**:  

物理架构  
{{< img src="tair-physic.png" alt="tair-physic" maxWidth="900px" >}}

config server 管理data server结点，维护data server的状态信息（单点 主备方式保证可靠性）
data server负责数据存储 按照config server的指示完成数据复制和迁移，并给config server发送心跳信息

逻辑架构
{{< img src="tair-logic.png" alt="tair-logic" maxWidth="900px" >}}

数据一致性： 通过version保证
负载均衡：一致性哈希算法

数据访问方式1： Hash(key) % Bucketcount，得到具体的数据存储Bucket， 再检索数据路由表到该Bucket所在的DataServer
数据访问方式2（多级缓存）: DataServer上划分Hotzone存储热点数据的访问，由客户端配置的缓存访问逻辑来处理缓存访问

## 分布式数据库

TDDL(Taobao Distributed Data Layer)

读写分离：数据写到主库，读取从备库（数据复制于主库）  
垂直分库：不同业务单元划分到不同的数据库。 ACID被打破；Join操作困难；外键约束受影响
水平分表：单个表拆分（比如ugc表非常大）。自增主键受影响；单表查询变成多表

应用场景：
1 读写分离
2 分库分表
3 动态数据源
4 主备切换

整体架构  
{{< img src="db-arch.png" alt="db-arch" maxWidth="900px" >}}

客户端架构
{{< img src="client-arch.png" alt="client-arch" maxWidth="900px" >}}

服务端架构
{{< img src="db-server-arch.png" alt="db-server-arch" maxWidth="900px" >}}

Matrix层：SQL的解析、优化，执行
Group层： 读写分离和主备切换（镜像备份，通过日志变化，在从库中执行相同动作；或者需要先路由到从库，再执行动作
Atom层：物理db组成


## big data and high concurrent
### bitmap

* how to use?(data range below int*10)
  * quick sort not repeated array
  * quick remove repeat
  * quick search
  * bloom filter（high Accuracy
    * check url is the same

* advantage
  * less memory

### limit flow algorithm

* count number
* sliding window
* leaky bucket 
* token bucket

### load balance

* dns 
* reverse proxy
* http redirect
* Stratification
  
## design mode

SOLID

## Top k

* how to solve
  * 1 sort
  * 2 partial elimination
    * save k in container, and other numbers compare with them
  * 3 divide and conque
    * split to n group, find top k in the group
  * 4 hash remove repeat number , then divide and conque
  * 5 minimum heap
  code

## 统一接入

应用接入全站https、私钥落地
