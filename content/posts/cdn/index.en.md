---
title: "Detailed Explanation and Problem Analysis of CDN Technology"
date: 2025-02-06
tags:
  - Web Development
images:
  - cdn/cover.png
---
## Table of Contents
- [Table of Contents](#目录)
- [Different Usages of CDN](#cdn-的不同用法)
  - [Multiple Caches for the Same Resource](#同资源多份缓存)
  - [Auto Polyfill](#auto-polyfill)
  - [Auto WebP/AVIF](#auto-webpavif)
  - [Dynamic Acceleration](#动态加速)
  - [Prefetch Acceleration](#prefetch-加速)
- [CDN Scenario Problems](#cdn-场景问题)
- [Dispatching Methods](#调度方式)
- [Specifying Cache Time](#指定缓存时间)
- [IVS Architecture](#ivs-架构)
- [CDN Issues](#cdn-的问题)
- [Professional Technology](#专业技术)
- [Case Study](#案例)
- [Vercel CNAME Optimization](#vercel-cname-优化)
- [The Role of CDN](#cdn-的作用)
- [The Role of the Origin Server](#源站的角色)
- [The Essence of OSS](#oss-的本质)
- [Collaboration Workflow](#协作流程)
---
## Different Usages of CDN
### Multiple Caches for the Same Resource
- **Description**: Implements multiple caches for the same resource via `Vary: Accept-Encoding`.
- **Implementation Principle**:
  - The origin server returns the `Vary: Accept-Encoding` response header, which the CDN recognizes.
  - When a client makes a request, if it includes `Accept-Encoding: gzip`, the CDN returns the Gzip compressed version; if the client does not support Gzip, the regular version is returned.
### Auto Polyfill
- **Description**: Provides different Polyfills for different browser versions.
- **Implementation Principle**:
  - Uses custom headers (like a `User-Agent` set) to differentiate browser versions.
  - The origin server returns a `Vary` header, and the CDN provides the corresponding Polyfill file based on the client's `User-Agent`.
### Auto WebP/AVIF
- **Description**: Dynamically returns WebP or AVIF format based on the client's supported image formats.
- **Implementation Principle**:
  - The client request header includes `Accept: image/avif`, and the CDN automatically returns the AVIF image format.
  - If the client does not support AVIF, the default format (like JPEG or PNG) is returned.
### Dynamic Acceleration
- **Description**: Improves dynamic request performance through dedicated network lines or CDN route optimization.
- **Implementation Principle**:
  - **Route Optimization**: By changing the BGP routing path and combining multi-path detection technology, the optimal link is selected (based on metrics like packet loss rate, RTT, and overall download time).
  - **IP Acquisition**:
    - HTTP Request: The CDN marks the user's IP using `X-Forwarded-For` or `ORIG_CLIENT_IP`.
    - HTTPS Request: Since the encrypted message cannot be decrypted, the CDN places the user's IP in the TCP Option to avoid decrypting the HTTPS message.
Here's a specific example: If a user requests an HTML page and the CDN is configured for dynamic acceleration for origin-pull, it won't go through the public internet but through the CDN's optimized dedicated line, making the transmission time faster.
### Prefetch Acceleration
- **Description**: Pre-loads static resources from the origin server to the CDN edge nodes.
- **Implementation Principle**:
  - During DNS resolution, the authoritative DNS returns a CNAME record pointing to the CDN's global scheduler.
  - The CDN fetches the HTML file from the origin server, parses the image URLs, and caches them on the edge nodes in advance.
---
## CDN Scenario Problems
1.  **HTML request timeout due to CDN node failure**:
    -   Possible cause: Node is down or network anomaly.
    -   Solution: Switch to another available node or pull from the origin.
2.  **Newly added node has 100% packet loss**:
    -   Possible cause: Incorrect network configuration or hardware failure.
    -   Solution: Check network equipment and configuration to ensure the link is normal.
---
## Dispatching Methods
1.  **Cost-based**:
    -   Description: In situations where some countries have few nodes but high traffic, to reduce costs, traffic can be dispatched to nodes in other countries.
2.  **Priority-based**:
    -   Description: High-priority users have higher dispatching accuracy to ensure a quality user experience.
---
## Specifying Cache Time
- **Implementation**: Specify the CDN cache time via the `s-maxage` in the response header.
- **Purpose**: To prevent HTML from being cached in the browser, which can lead to inaccurate PV calculations.
---
## IVS Architecture
- **LVS (Linux Virtual Server)**:
  - A Linux-based load balancing solution that can distribute user requests to multiple backend servers, improving system availability and scalability.
- **Full NAT (Full Network Address Translation)**:
  - Translates the source IP and port number of requests entering the LVS to the LVS's own IP and port number, then forwards them to the backend real servers.
- **Layer 4 Forwarding (L4 Forwarding)**:
  - Performs load balancing based on the transport layer (TCP/UDP), offering high efficiency but lower flexibility.
- **RealServer**:
  - The server that handles the specific business logic.
- **Linux Kernel TCP Kernel**:
  - Handles the TCP protocol stack, parsing TCP packets and extracting relevant information.
---
## CDN Issues
1.  **Overwrite deployment causes cache to not take effect**:
    -   Cause: The cache for the new version of the file was not refreshed in time.
    -   Solution: Actively purge the CDN cache.
2.  **Using timestamps may lead to cache penetration**:
    -   Cause: The timestamp is different for each request, causing the cache to be invalidated.
    -   Solution: Remove the timestamp or use a fixed version number.
---
## Professional Technology
- **CDN is for network acceleration**:
  - Generally, resources are pushed to OSS, and then the CDN cache is refreshed.
---
## Case Study
- **Use CDN or OSS**:
  - CDN is more suitable for dynamic acceleration and global distribution, while OSS is better for storing static resources.
---
## Vercel CNAME Optimization
- **CNAME Value**: `cname-china.vercel-dns.com`
- **Features**: Vercel has specifically optimized for the Chinese network, improving access speed and stability.
---
## The Role of CDN
- **Definition**: A CDN (Content Delivery Network) is a distributed network used to cache and distribute static resources.
- **Functions**:
  - Caches static resources on edge nodes closest to the user to reduce latency.
  - Improves resource loading speed and enhances user experience.
  - Reduces the load pressure on the origin server.
- **Applicable Scenarios**: Suitable for frequently accessed static resources (such as images, CSS, JavaScript files, etc.).
---
## The Role of the Origin Server
- **Definition**: The origin server is the original storage location of resources, typically a server or a cluster of services.
- **Functions**:
  - When there is a CDN cache miss, the request will be sent back to the origin server to fetch the resource.
  - The origin server is responsible for providing the latest version of the resources.
- **Characteristics**:
  - The origin server is usually the processing center for dynamic content.
  - In static resource distribution, the origin server plays more of a backup role.
---
## The Essence of OSS
- **Definition**: OSS (Object Storage Service) is a highly available and reliable cloud storage service.
- **Functions**:
  - Stores massive amounts of static resources (such as images, videos, documents, etc.).
  - Provides high-concurrency access capabilities and supports global acceleration.
- **Essence**: OSS is essentially a storage service, focusing on data persistence and management.
- **Advantages**:
  - High Scalability: Supports storage of massive files.
  - Low Cost: Pay-as-you-go, suitable for large-scale storage needs.
  - High Reliability: Multiple replicas for storage, ensuring data security.
---
## Collaboration Workflow
1.  **Prioritize CDN**:
    -   When a user requests a resource, the system first tries to fetch it from the CDN.
    -   If there is a CDN cache hit, the resource is returned directly without accessing the origin server.
2.  **Origin-pull to the Origin Server**:
    -   If there is a CDN cache miss, the request is sent back to the origin server.
3.  **Origin Server uses OSS**:
    -   After receiving the request, the origin server fetches the resource from OSS.
    -   OSS acts as the underlying storage service, providing the final storage and management of resources.
4.  **Update Cache**:
    -   After the origin server returns the resource, the CDN will cache it so that subsequent requests can be fetched directly from the CDN.
