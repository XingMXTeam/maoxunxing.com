---
title: "[WIP] 操作系统知识"
date: 2022-04-02T13:05:50+08:00
tags: 
  - Operation System
---

## 常用工具与操作

### 查看用户操作记录
- **`history` 工具**  
  - 用于查看用户在电脑上的操作记录。  
  - 示例：`history` 命令会列出当前用户的命令历史。

### 检查端口是否有服务
- 使用 `telnet` 检查目标 IP 和端口是否开放：
  ```bash
  telnet 1.1.1.1 1232
  ```
  - 如果连接成功，说明目标端口有服务运行。
  - 如果连接失败，可能是端口未开放或服务未启动。

---

## 经典面试题：`ping` 回车发生了什么？

当我们在终端输入 `ping <目标IP>` 并按下回车时，以下是完整的流程：

### 1. 查看路由表
- 使用 `route -n` 查看路由表：
  ```bash
  route -n
  ```
  - 路由表帮助定位数据包需要通过哪个网卡发送。

### 2. 查看网卡信息
- 使用 `ifconfig` 查看网卡信息：
  ```bash
  ifconfig
  ```
  - 确定当前网卡的子网掩码和 IP 地址范围。
  - 判断目标 IP 是否在当前子网内：
    - 如果目标 IP 在子网内，则直接通过 ARP 协议获取目标设备的 MAC 地址。
    - 如果目标 IP 不在子网内，则需要通过网关转发。

### 3. 获取目标 IP 的 MAC 地址
- 使用 `arp -a` 查看 ARP 缓存表：
  ```bash
  arp -a
  ```
  - ARP 协议负责将目标 IP 地址解析为对应的 MAC 地址。
  - 数据包的发送是基于 MAC 地址，而不是直接基于 IP 地址。

### 4. 抓包分析 ARP 请求
- 使用 `tcpdump` 抓取 ARP 请求：
  ```bash
  tcpdump -i eth0 arp
  ```
  - 分析 ARP 请求和响应过程，确认目标设备的 MAC 地址。

---

### 5. 域名解析（如果目标是域名）
- 如果目标是一个域名（如 `www.example.com`），需要先进行域名解析：
  - **`gethostbyname` 函数**  
    - 通过 glibc 的 `gethostbyname` 函数解析域名。
    - 解析顺序由 `/etc/nsswitch.conf` 文件决定：
      - 先检查 `/etc/hosts` 文件。
      - 再查询 DNS 服务器。
  - **`nslookup` 工具**  
    - 直接从 `/etc/resolv.conf` 中读取 `nameserver` 配置。
    - 不调用 `gethostbyname`，也不检查 `/etc/hosts` 或 `/etc/nsswitch.conf`。

---

### 6. 发送 ICMP 包
- `ping` 使用 ICMP 协议发送请求包：
  - 构造一个 ICMP Echo Request 数据包。
  - 数据包通过网卡发送到目标设备。
- 目标设备收到后返回 ICMP Echo Reply 数据包。

---

## UDP 应用：DNS 协议
- DNS 查询通常使用 UDP 协议（端口 53）。
- 流程：
  1. 客户端向 DNS 服务器发送查询请求。
  2. DNS 服务器返回解析结果。

---

## 调试工具：`strace` 和抓包
- **`strace` 命令**  
  - 用于跟踪系统调用和信号。
  - 示例：跟踪 `ping` 命令的系统调用：
    ```bash
    strace ping www.example.com
    ```
- **抓包工具**  
  - 使用 `tcpdump` 或 `Wireshark` 抓取网络流量，分析数据包内容。
  - 示例：抓取 ICMP 数据包：
    ```bash
    tcpdump -i eth0 icmp
    ```

---