---
title: "Web Architecture concept understanding"
date: 2021-08-06T15:25:06+08:00
images:
- website-architecture/backend-arch.png
description: "Web Architecture concept understanding"
---
## Basic Concepts

**VPC**: Virtual Private Cloud. Why is it virtual private? It is a collection of resources that run on a public cloud, isolating a portion of the public cloud resources for a particular user, and giving that user private use of the resources, feeling like they are using their own private cloud. What is a cloud? A virtualized network built on top of a physical one, VPCs use tunneling technology to isolate the virtual network. Each VPC has an individual tunnel number, and one tunnel number corresponds to one virtualized network. It consists of a private network segment (subnet) + a router (general entry) + a switch (further cut).

**DNS**: Application layer protocol like https, port 53, provides IP lookup based on domain name  
**Record**: The correspondence between record and IP  
  
  + **A Record**: Supports mapping domain names to IPV4 addresses  
  + **AAAA record**: support mapping domain name to IPV6 address  
  + **CNAME**: Alias Canonical Name: Supports pointing to another domain name  
  + **MX**: Mail Exchanger Support to point the domain name to a mail server address  
  + **NS**: name server Name server record. Supports delegating subdomains to other DNS providers for resolution  
  
**DNS server**: A computer with a DNS service installed (e.g., BIND), such as Google's public server address of 8.8.8.8  

**CDN**: Content Delivery Network solves the problem of slow access to websites due to small network bandwidth, high access volume and uneven network distribution

**Node**: Traditional node is a single physical machine -> service on a single virtual machine -> lightweight container service that can provide a unit service collection of logical computing resources

**Network**: Network working modes: synchronous network (synchronous execution of nodes, limited message latency, efficient global locking), semi-synchronous network (relaxed lock range), asynchronous network (independent execution of nodes, uncapped message latency, no global locking, some algorithms are not feasible)  

**NTP** (Network Time Protocol): a network protocol for clock synchronization via packet switching between computer systems with variable latency in data networks, located at the application layer of the OSI model  
**Lamport logical clock/vector clock**: a technique for generating off-sequence values for various operations or events in a distributed environment, which detects parallel conflicts of operations or events and is used to maintain the consistency of the system

**Unified access layer**: web server proxy, which forwards requests to (proxy_pass) application servers. Can solve the domain name management, certificate management, security management (application access to the whole site https, private key landing)

**K8s**: Kubernetes cross-host cluster open source container scheduling platform that automates the deployment, scaling and operation of application containers. Provides a container-centric infrastructure that is cloud-native

**Docker**: system-level once built to run everywhere, test environment building, continuous integration, continuous delivery brings great convenience. Open vision towards full stack (DevOps)

## Request Link

Domain name resolution -> ip -> load balancing cluster -> unified access cluster (web server) -> decentralized cluster -> gateway layer -> application server

## Distributed Micro Service  

### Development trajectory

1 RPC (Remote Process Call)
{{< img src="rpc.png" alt="rpc" maxWidth="600px" >}}

2 SOA (Service Oriented Architecture)
{{< img src="soa.png" alt="soa" maxWidth="600px" >}}
{{< img src="soa.jpg" alt="soa" maxWidth="600px" >}}

* Distributed deployment
* Request triage
* Data read/write separation

3 MSA (Microservices Architecture)
{{< img src="msa.jpg" alt="msa" maxWidth="600px" >}}


### Distributed Architecture

Consistency Theory

* CAP (Strong Consistency)
* ACID (Distributed Consistency)
* Base (Weak Consistency)
  * [Distributed consensus theory](http://thesecretlivesofdata.com/raft/)

Consistency Algorithm

CALM->CRDT->Highly Available Transactions + ZAB Protocol Analysis->Paxos Raft Gossip

### Distributed Applications

File System: HDFS FastDFS Ceph mooseFS 
[diff](https://en.wikipedia.org/wiki/Comparison_of_distributed_file_systems?spm=ata.21736010.0.0.30f21d02woZ6di)  
database： Hbase(Columnar Storage)、Elasticsearch/mongodb(Document Storage)、redis(kv)、spanner(Relational)  
Compute: offline hadoop, realtime spark, streaming storm/flink/blink  
Cache: persistent redis, non-persistent memcache  
Messaging: kafka rabbitmq rocketmq activemq  
Monitoring: zookeeper  
Applications: hsf dubbo  
logs: collect flum, store elasticsearch/solr sls, locate zipkin  
Ledger: bitcoin ethereum  

### distributed message

* RPC Message
* Restful

**Application Scenarios**.  

* Asynchronous calls
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
  
Example.  

* high capability and persistence : Active MQ、Rabbit MQ、Rocket MQ
  * question is consistency questions?
    * use db and message queue to ensure final consistency
* client/zookeeper/kafka/storm clusterf
* JMS
  * EJB J2EE
  * Message mode(p2p/pub sub), Message Consume(async sync )

How to avoid message loss:  

* TCP cannot ensure application no lost*
* sync
  * wait confirm
  * continue ARQ(slide window)
* async
  * callback function

Message always the same :  

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
  
Ensuring the order of messages(queue not in order but the message is in order)

* sender: async send message, if 1 failed, you need to resend, cannot promise order
* saver:
  * you cannt split message to different queue
  * if you have only one queue, how to promise order if a machine unvailable, you can switch to another machine(when message is not consumed)
    * sync copy to promise the order
* receiver
  * sync consume
  
### Distributed caching

Data flow {{< img src="data-flow.png" alt="data-flow" maxWidth="600px" >}}

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
* rehashing
* cache penetration
  * what
  * how to solve
    * bitmap
    * empty value to cache
* cache avalanche
  * expire time randomly
  * limit flow
  * distributed lock

### Distributed database

Read-write separation: data is written to the master and read from the standby (data is replicated to the master)  
Vertical splitting: different business units are divided into different databases. ACIDs are broken; Join operations are difficult; foreign key constraints are affected
Horizontal table splitting: individual table splits (e.g. ugc table is very large) Self-incrementing primary keys are affected; single table queries become multiple tables

Application scenarios.  
1 Read-write separation  
2 Library splitting and table splitting  
3 Dynamic data sources  
4 Master-standby switching  

### Distributed scheduling

schedulerX

### Distributed search

Open Search

### Distributed transactions

TXC(Taobao Transaction Constructor)

### Distributed Computing

**blink**: Distributed real-time computing  
**odps** (Open Data Processing Service): Distributed offline computing Storage and computation of structured data, solutions for massive data warehouses and analysis and modelling of big data

## Big data and high concurrency

### bitmap

* Application scenarios (data range below int*10)
  * quick sort not repeated array
  * quick remove repeat
  * quick search
  * bloom filter (high Accuracy)
    * check url is the same

* advantage
  * low memory usage
  
### Flow limitation algorithm

* count number
* sliding window
* leaky bucket 
* token bucket

### Load balancing

* dns 
* reverse proxy
* http redirect
* Stratification

## Operations and monitoring

### Concepts

DevOps: Continuous Development, Continuous Testing, Continuous Integration, Continuous Deployment, Continuous Monitoring

{{< img src="devops.jpg" alt="devops" maxWidth="600px" >}}
