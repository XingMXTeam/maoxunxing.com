---
title: "Website Architecture"
date: 2021-08-06T15:25:06+08:00
draft: true
---

## Distributed Micro Service
what is distributed micro service?

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

## message

* how to use it
  * async handle
    * improve qps capacity
  * application decoupling
    * order system->message system->stock system(push or pull)
  * flow control
    * spike activity/group buy
  * log handle
    * client->kafka queue->application
  * newsletter
    * point to point / pub sub mode
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
