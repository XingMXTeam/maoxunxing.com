---
title: "DNS 系统概述：Local DNS 与 权威 DNS"
date: 2024-09-13
---

## 目录
1. [什么是DNS](#什么是dns)
2. [Local DNS](#local-dns)
   - [功能](#功能)
   - [工作原理](#工作原理)
3. [权威 DNS](#权威-dns)
   - [功能](#功能-1)
   - [工作原理](#工作原理-1)
4. [总结](#总结)

---

## 什么是DNS

DNS（Domain Name System，域名系统）是互联网的一项核心服务，负责将人类可读的域名（如 `www.example.com`）转换为机器可识别的IP地址（如 `192.168.1.1`）。DNS 系统通过分层结构实现域名解析，主要包括 **Local DNS** 和 **权威 DNS**。

---

## Local DNS

### 功能

Local DNS（本地DNS）是用户设备与权威DNS之间的中间层，主要负责以下任务：
1. **接受和处理用户的DNS请求**  
   当用户在浏览器中输入一个域名时，Local DNS会接收并处理该请求。
   
2. **缓存DNS结果**  
   为了提高解析速度和减少网络流量，Local DNS会缓存之前查询到的DNS记录。如果缓存中存在对应的记录，则直接返回结果，无需向权威DNS查询。

3. **必要时向权威DNS查询**  
   如果缓存中没有对应的DNS记录，Local DNS会向权威DNS发起查询请求，获取最新的解析结果。

### 工作原理

1. 用户设备发起DNS请求，首先会发送到配置的Local DNS服务器（通常由ISP提供或自定义设置）。
2. Local DNS检查缓存中是否存在对应的DNS记录：
   - 如果存在且未过期，则直接返回缓存结果。
   - 如果不存在或已过期，则向根DNS服务器、顶级域DNS服务器（TLD）以及权威DNS服务器逐级查询，最终获取解析结果。
3. 将解析结果返回给用户设备，并将其缓存以备后续使用。

---

## 权威 DNS

### 功能

权威DNS（Authoritative DNS）是域名解析的最终来源，存储和提供特定域名的DNS记录。它的主要功能包括：
1. **存储域名的DNS记录**  
   权威DNS服务器保存了特定域名的所有DNS记录，包括A记录（IPv4地址）、AAAA记录（IPv6地址）、CNAME记录（别名）、MX记录（邮件服务器）等。

2. **作为域名解析的最终来源**  
   当Local DNS无法从缓存中获取解析结果时，会向权威DNS查询，权威DNS返回的记录是域名解析的权威答案。

### 工作原理

1. 权威DNS服务器由域名所有者或其托管服务商管理，负责维护域名的DNS记录。
2. 当Local DNS向权威DNS发起查询时，权威DNS会根据请求的域名返回对应的DNS记录。
3. 权威DNS不会缓存其他域名的记录，仅负责提供自身管理的域名解析信息。

---

## 总结

DNS 系统通过分层架构实现了高效、可靠的域名解析服务。其中：
- **Local DNS** 负责接收和处理用户的DNS请求，可能缓存结果以提高效率，并在必要时向权威DNS查询。
- **权威 DNS** 是域名解析的最终来源，存储和提供特定域名的DNS记录。

两者协同工作，确保用户能够快速、准确地访问目标网站。理解它们的功能和工作原理有助于更好地优化网络性能和排查DNS相关问题。
