---
title: "What You Need to Know About Node.js"
date: 2021-08-27T10:20:36+08:00
tags:
  - nodejs
description: ""
---
## **Service Restart**
During operations and maintenance, restarting services is a common task. Here are the relevant commands:
### **Enter Service Directory**
```shell
cd /home/admin/{appname}/bin/
```
### **Restart Service Only**
```shell
./nodejsctl stop && ./nodejsctl start
```
### **Re-extract Resource Package and Start Service**
```shell
./nodejsctl pubstart
```
---
## **Multi-tenant HSF Service Calls**
In a multi-tenant scenario, service calls are implemented by passing tenant identifiers through middleware.
---
## **Multi-tenant Environment Deployment**
1. **Multi-tenant Environment Deployment**  
   During deployment, ensure that each tenant's environment is isolated to avoid resource conflicts.
2. **Generate Tenant Identifiers via URL Configuration**  
   - Tenant identifiers can be dynamically generated through URL parameters.
   - Example: `https://example.com/api?tenantId=12345`
---
## **Log Management**
Logs are crucial for troubleshooting. Here are common log paths and their purposes:
- **Error Log**  
  Path: `admin/logs/{app}/common-error.log`  
  Purpose: Records error messages during application runtime.
- **Standard Log**  
  Path: `admin/logs/{app}/{app}-web.log`  
  Purpose: Records the application's standard operational logs.
- **Application Access Log**  
  Path: `admin/{app}/logs/access-123.log`  
  Purpose: Records the application's access logs.
  Output Format: `ip request_processing_time - [log_timestamp]`
- **Nginx Access Log**  
  Path: `admin/cai/logs/cronolog/2021/.log`  
  Purpose: Records Nginx access logs, stored in daily shards.
---
## **Docker Optimization**
To improve the speed and efficiency of image builds, the following strategies can be adopted:
1. **Base Image Optimization**  
   - Package infrequently changing content (like base RPM packages, startup scripts, etc.) into a base image.
   - In the application's release Dockerfile, use the `FROM` instruction to reference the base image, avoiding redundant builds of the same content.
2. **Image Distribution**  
   - Push the application's base image to all build machines to reduce time spent on repeated pulls.
   - Improve build efficiency and avoid long waiting times.
---
## **Common Tools**
### **nodemon**
- Function: Monitors file changes and automatically restarts the service.
- Use Case: Real-time code debugging in a development environment.
Example:
```shell
nodemon app.js
```
## Midway Framework
`this.ctx.time vs Date.now()` The former includes the framework's initialization time, so it should be used for actual tracking and time statistics.
