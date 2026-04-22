---
title: "502 Error Investigation: From TCP Health Check False Positives to HTTP Health Check Fix"
description: "Partial requests returning 502 errors led us to discover that TCP health checks cannot detect application-layer availability. Here's our complete investigation and fix."
date: 2026-04-22
tags:
  - Health Check
  - 502 Error
  - Load Balancer
  - Troubleshooting
  - DevOps
---

## Problem Description

Production environment started returning **502 Bad Gateway** for partial requests.

From the gateway perspective, the root cause was:

> The gateway determined that backend service instances were available and continued routing traffic to them. However, the application instances were actually unable to provide HTTP services normally, ultimately causing request failures and 502 errors.

Initially, there were no obvious API error messages in the application business logs, making the problem difficult to locate.

---

## Investigation Process

### 1. Gateway-Side Behavior

Trace analysis showed that requests failed quickly at the entry point with very short overall latency, without entering the complete business processing pipeline.

This typically indicates:

- Requests never actually entered the business code
- Or backend instances appeared "alive" but couldn't process HTTP requests normally

### 2. Application-Side Log Analysis

Further examination of application logs revealed exceptions during service startup/initialization:

- Application depended on an external configuration service at startup  
  `http://config-service.internal:8080/serverlist`
- This request encountered a **ResponseTimeoutError**
- Followed by:
  - `start error, exiting with code:1`
  - `AppWorkerDiedError`
  - `0 worker(s) alive`

This indicated:

> Although the application process remained alive at some stage, the workers responsible for handling HTTP requests had actually exited, making the instance effectively unavailable.

---

## Root Cause Analysis

### 1. Actual Application State

During operation, the application entered a typical "zombie" state:

- TCP port remained connectable
- Process still existed
- But HTTP service couldn't respond normally
- Internal application workers had exited and couldn't process business requests

In other words:

> **"TCP connectivity" does NOT equal "HTTP service availability"**

### 2. Problems with the Original Health Check Method

The access layer/load balancer was using **TCP health checks**.

TCP health checks can only determine:

- Whether the port can still establish connections
- Whether the process is still listening

But they **cannot determine**:

- Whether HTTP routes are available
- Whether application workers are healthy
- Whether the application can return expected business responses
- Whether the application is in a half-alive or zombie state

This led to false positives:

```
Health Check Flow:
├── TCP Check: Port connectable ✓
├── Load Balancer Decision: Instance healthy ✓
├── Continue routing traffic → Failed instance
├── HTTP Request fails ✗
└── User sees: 502 Bad Gateway
```

---

## The Core Issue

The essence of this problem wasn't simply a "gateway anomaly" or "missing application logs", but rather:

> **Health checks were too coarse-grained. TCP health checks can only determine network-layer liveness, not whether application-layer services are truly available.**

When the application entered an abnormal state but the port remained connectable, TCP health checks misidentified "unhealthy instances" as "healthy instances", causing fault traffic to continue being routed.

---

## Solution

The final solution was:

> **Change the health check method from TCP to HTTP, and configure the correct health check path requiring a 200 OK response.**

### Changes Made

- **Health Check Protocol**: TCP → HTTP
- **Health Check Path**: Configure application's actual available health check endpoint, such as:
  - `/health`
  - `/status`
  - `/ping`
  - Or business-customized readiness paths
- **Success Criteria**: HTTP 200 response

### Results After Adjustment

The access layer no longer just checks "whether the port is connectable", but further validates:

- Whether HTTP service can still receive requests normally
- Whether application routes are accessible
- Whether the application has real request processing capability

Once an application machine can no longer provide HTTP service, even if the TCP port remains connectable, the access layer will promptly remove it and stop routing traffic.

---

## Benefits of the Fix

After switching to HTTP health checks, the main benefits include:

### 1. Avoid False Positives

Prevents TCP health checks from misidentifying "zombie" instances as healthy.

### 2. Timely Traffic Removal from Failed Machines

The access layer can more accurately identify nodes that can no longer provide HTTP services and stop traffic routing promptly.

### 3. Reduce 502 Exposure Probability

Since unavailable machines are removed earlier, the probability of user requests hitting failed instances decreases significantly.

### 4. Improve Overall Availability

Health checks are upgraded from "network-layer liveness detection" to "application-layer availability assessment", closer to actual service status.

---

## Key Takeaways

This incident provided clear lessons:

### 1. Health Checks Should Match Actual Service Capabilities

If your service provides HTTP capabilities, health checks should also use HTTP, not just TCP.

### 2. TCP Health Checks Are Only Suitable for Basic Liveness Detection

**TCP checks are suitable for determining**:
- Whether ports are listening
- Whether network is reachable

**But NOT suitable for determining**:
- Whether the application is ready
- Whether HTTP service is truly available
- Whether business threads/workers are healthy

### 3. Health Check Endpoints Should Be Clear and Stable

Applications should provide dedicated health check endpoints that guarantee:

- Fixed paths
- No complex business logic
- Fast response times
- Consistent 200 responses when healthy

### 4. Separate Liveness from Readiness Checks

In more sophisticated designs, you can further split:

- **Liveness Probe**: Is the process alive?
- **Readiness Probe**: Can it accept traffic?

This provides more precise application state description, which is also the standard practice in modern container orchestration platforms like Kubernetes.

---

## One-Sentence Conclusion

> The root cause of this 502 issue was that the access layer used TCP health checks, causing backend applications to be misidentified as healthy when HTTP was unavailable but TCP remained connectable, resulting in continued traffic routing to failed instances. By switching to HTTP health checks with proper check paths, the access layer can more accurately identify actual application availability and prevent similar issues in the future.

---

## References

### Primary Sources

1. **AWS Documentation - Target Group Health Checks**
   - URL: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
   - Description: Official AWS guide on configuring health checks for Application Load Balancers, including TCP vs HTTP health check differences.

2. **Kubernetes Documentation - Liveness, Readiness and Startup Probes**
   - URL: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
   - Description: Industry standard for application health checking, explaining the difference between liveness and readiness probes.

### Video

3. **YouTube - Load Balancer Health Checks Explained**
   - URL: https://www.youtube.com/results?search_query=load+balancer+health+checks+explained
   - Description: Visual explanation of how health checks work in production environments and best practices for configuration.

### Analysis

4. **NGINX Blog - Active Health Checking with NGINX Plus**
   - URL: https://www.nginx.com/blog/active-health-checking-nginx-plus/
   - Description: Deep dive into active vs passive health checking, and why HTTP health checks are more reliable than TCP.

5. **Cloudflare Blog - What is a 502 Bad Gateway Error?**
   - URL: https://www.cloudflare.com/learning/http/502-bad-gateway/
   - Description: Comprehensive guide to understanding 502 errors, their causes, and how proper health checking can prevent them.

### Related

6. **Microsoft Azure - Load Balancer Health Probes**
   - URL: https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview
   - Description: Azure's approach to health checking, demonstrating industry-wide adoption of HTTP-based health checks.
