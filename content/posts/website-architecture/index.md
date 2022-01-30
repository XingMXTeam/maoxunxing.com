---
title: "How Web Works"
date: 2021-08-06T15:25:06+08:00
tags:
- Architecture
images:
- website-architecture/test.png
description: "What are the concepts? What does the request link look like? What are distributed systems and what are the problems to be solved? Problem solving for big data and high concurrency?"
---
## Basic Concepts

Category<div style='width:100px'></div> | Name<div style='width:200px'></div> | Explanation
---------|----------|---------
 Network | VPC | Virtual Private Cloud Virtual Private Cloud. Why Virtual Private? It is a collection of resources that run on a public cloud, isolating a portion of the public cloud resources for a particular user, and giving that user private access to resources that feel like they are using their own private cloud. What is a cloud? A virtualized network built on top of a physical one, VPCs use tunneling technology to isolate the virtual network. Each VPC has an individual tunnel number, and one tunnel number corresponds to one virtualized network. It consists of a private network segment (subnet) + a router (total entry) + a switch (further cut).
 Network | DNS | Application layer protocol is the same as https, port is 53, providing IP lookup based on domain name  
 Network | Record | Correspondence between records and IPs
 Network | A Record | Supports mapping domain names to IPV4 addresses  
 Network | CNAME | Alias Canonical Name supports pointing to another domain name   
 Network | MX | Mail Exchanger Support for pointing a domain name to a mail server address    
 Network | NS | name server Name server records. Support for delegating sub-domains to other DNS providers for resolution  
 Network | CDN | Content Delivery Network Solve the problem of slow access to websites due to small network bandwidth, large access volume and uneven distribution of networks
 Network | Node | Traditional node is a single physical machine -> a service on a single virtual machine -> a lightweight container service that provides a collection of logical computing resources per unit of service
 Network | Unified Access Layer | web server proxy, which forwards requests to (proxy_pass) application servers. Can solve the domain name management, certificate management, security management (application access site-wide https, private key landing)
 Distributed | NTP (Network Time Protocol) | A network protocol for clock synchronization via packet switching between computer systems with variable latency on data networks, located at the application layer of the OSI model
 Distributed | Lamport Logical/Vector Clock | A technique for generating off-sequence values for various operations or events in a distributed environment that detects parallel conflicts of operations or events and is used to maintain system consistency
 Cloud Native | K8s | Kubernetes An open source container scheduling platform for cross-host clusters that automates the deployment, scaling and operation of application containers. Provides a container-centric infrastructure that is cloud-native
 Cloud-native | Docker | System-level once build run everywhere, test environment building, continuous integration, continuous delivery brings a lot of convenience. Open vision towards full stack (DevOps)

## Request Link  

> What are the general links under an http request modernization architecture

1 Domain name resolution IP  
2 Unified Access Layer  
3 Load balancing Key-hash->cluster  
4 Gateway layer  
5 Application server  

## Distributed services/architecture  

### Development trajectory

> How modern server architectures have evolved

1 RPC (Remote Process Call)
{{< img src="rpc.png" alt="rpc" maxWidth="600px" >}}

2 SOA (Service-Oriented Architecture, like hsf, dubbo) Service-Oriented Architecture

Features.  

* Distributed deployment
* Request triage
* Separation of data reading and writing

{{< img src="soa.jpg" alt="soa" maxWidth="600px">}}

3 MSA Microservice Architecture
{{< img src="msa.jpg" alt="msa" maxWidth="600px" >}}

### Distributed architecture theory

> What you need to know about distributed architecture Theory

Consistency theory

* CAP (Strong Consistency)
* ACID (Distributed Consistency)
* Base (Weak Consistency)
  * [Distributed consensus theory](http://thesecretlivesofdata.com/raft/)

Consistency algorithm

CALM->CRDT->Highly Available Transactions + ZAB Protocol Analysis->Paxos Raft Gossip

### Distributed Applications

> What are the distributed applications

File system: HDFS FastDFS Ceph mooseFS 
[compare](https://en.wikipedia.org/wiki/Comparison_of_distributed_file_systems?spm=ata.21736010.0.0.30f21d02woZ6di)  
Database: Hbase (columnar storage), Elasticsearch/mongodb (document storage), redis (kv type), spanner (relational)  
Compute: offline hadoop real-time spark streaming storm/flink/blink  
cache: persistent redis non-persistent memcache  
messaging: kafka rabbitmq rocketmq activemq  
Monitoring: zookeeper  
Applications: hsf dubbo  
logs: collect flum, store elasticsearch/solr sls, locate zipkin  
Ledger: bitcoin ethereum  
  
**Application Scenarios**.  

* asynchronous calls
  * improve qps capacity e.g. real time live room
* Application decoupling
  * order system->message system->stock system(push or pull)
* Traffic control
  * spike activity/group buy
* Log processing
  * client->kafka queue->application log synchronization
* subscription
  * point to point / pub sub mode like IM
* Broadcast mode cache synchronization
  
Examples.  

* high capability and persistence : Active MQ, Rabbit MQ, Rocket MQ
  * question is consistency questions?
    * use db and message queue to ensure final consistency
* client/zookeeper/kafka/storm clusterf
* JMS
  * EJB J2EE
  * Message mode(p2p/pub sub), Message Consume(async sync )

How to avoid message loss.  

* TCP cannot ensure application no lost * sync
* sync
  * wait confirm
  * continue ARQ(slide window)
* async
  * callback function

Message idempotency.  

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
  
ensure that the message is in order (queue not in order but the message is in order)

* sender: async send message, if 1 failed, you need to resend, cannot promise order
* You cannt split the message to different messages:
  * you cannt split message to different queue
  * if you have only one queue, how to promise order if a machine unavailable, you can switch to another machine(when message is not consumed)
    * sync copy to promise the order
sync copy to promise the order * receiver
  * sync consume

### Distributed caching

> How to solve distributed caching problems

Data flow
{{< img src="data-flow.png" alt="data-flow" maxWidth="600px" >}}

Using middleware middleware

**Redis**.  

* why is it fast
  * use memory
  * non-blocking multiplexing io
  * single thread
* Application Scenarios
  * sorted set( top N, range find, delay task, )
  * set(remove duplicated, common and unique things)
  * list(message queue, pagination)
  * hash(single point login)
  * string(count cache)
* memory policy
  * delete regularly and randomly
  * lazy delete when get key
  * memory elimination
* progressive hashing (rehashing)
* cache penetration
  * How to solve
  * how to solve
    * bitmap
    * empty value to cache
* cache avalanche
  * expire time randomly
  * limit flow
  * distributed lock

### Distributed database

Read-write separation: data is written to the master and read from the standby (data is replicated to the master)  
Vertical splitting: different business units are divided into different databases. ACID is broken; Join operation is difficult; foreign key constraints are affected
Horizontal table splitting: single table split (e.g. ugc table is very large) Self-incrementing primary key is affected; single table query becomes multi-table

Application scenarios.  
1 Read-write separation  
2 library splitting and table splitting  
3 Dynamic data source  
4 Master-standby switching  

### Distributed Scheduling

schedulerX

### Distributed search

Open Search

### Distributed transactions

TXC(Taobao Transaction Constructor)

### Distributed Computing

**blink**: Distributed real-time computing  
**odps** (Open Data Processing Service): Distributed offline computing Storage and computation of structured data, massive data warehouse solutions and big data analysis and modeling

* web: service provisioning  
* sdk: packaging api  
* clt: client-side tools, submit commands  
* ide: visualization operations  

## Big Data and High Concurrency

> What are the solutions for big data and high concurrency scenarios?

### bitmap

* Application scenario (data range below int*10)
  * quick sort not repeated array
  * quick remove repeat
  * quick search
  * bloom filter (high Accuracy)
    * check url is the same

* advantage
  * less memory usage

### Flow limiting algorithm

* count number
* sliding window
* leaky bucket 
* token bucket

### Load balancing

* dns 
* reverse proxy
* http redirect
* Stratification
 
### Operations and Monitoring

### Concepts

DevOps: Continuous Development, Continuous Testing, Continuous Integration, Continuous Deployment, Continuous Monitoring

{{< img src="devops.jpg" alt="devops" maxWidth="600px" >}}
