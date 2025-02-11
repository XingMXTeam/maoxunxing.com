---
title: "[WIP] 操作系统知识"
date: 2022-04-02T13:05:50+08:00
---

# OP

- history工具 查看用户在电脑的操作记录
- 检查端口是否有服务 telnet 1.1.1.11232

## 经典面试题

### ping回车发生了什么？

- 查看路由表 route -n
  - 定位网卡
- 查看网卡 ifconfig
  - 定位子网掩码
    - 目标ip是否在这个子网内
- 查看ip的mac地址： arp -a
  - 发送包的时候是根据mac地址发送的 而不是根据ip
- 抓包： 查看arp请求 tcpdump -i eth0 arp
- 通过glibc的gethostbyname函数对域名解析，也就是按照etc/nsswitch.conf指示来

- udp应用
  - dns协议

- nsloopup
  - [https://access.redhat.com/solutions/1426263?spm=ata.21736010.0.0.284f1deelrZp9j](https://access.redhat.com/solutions/1426263?spm=ata.21736010.0.0.284f1deelrZp9j)
  - 不调用glibc的gethostbyname函数； 不检查/etc/hosts, /etc/nsswitch.config
  - 直接从/etc/resolv.conf 读取nameserver

- strace命令/抓包
