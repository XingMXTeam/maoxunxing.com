---
title: "Overview of Containerization Technology"
date: 2025-02-06
tags:
  - Docker
images:
  - docker/cover.png
---
## Table of Contents
1. [Problems Solved by Containerization](#problems-solved-by-containerization)
2. [Stages of Containerization Development](#stages-of-containerization-development)
   - [Phase 1: Physical Machines](#phase-1-physical-machines)
   - [Phase 2: Virtualization Technology](#phase-2-virtualization-technology)
     - [Bare-Metal Virtualization Architecture](#bare-metal-virtualization-architecture)
     - [Hosted Virtualization Architecture](#hosted-virtualization-architecture)
   - [Phase 3: Containerization](#phase-3-containerization)
3. [Role and Principles of Docker](#role-and-principles-of-docker)
4. [Docker Container Images](#docker-container-images)
---
## Problems Solved by Containerization
Containerization technology primarily solves the **resource allocation problem of physical machines**. In traditional physical machine deployment methods, issues like low resource utilization, poor environmental isolation, and difficult application migration have long existed. Containerization, through lightweight virtualization technology, allows for more efficient resource utilization while providing good isolation and portability.
---
## Stages of Containerization Development
### Phase 1: Physical Machines
The earliest method of managing computing resources was to run applications directly on physical machines. This method is simple and direct, but it has the following problems:
- Inflexible resource allocation.
- Potential conflicts between applications.
- High costs for migration and scaling.
### Phase 2: Virtualization Technology
Virtualization technology achieves hardware resource abstraction and isolation by introducing a virtual layer (Hypervisor). Virtualization technology is divided into two main architectures:
#### Bare-Metal Virtualization Architecture
- **Definition**: A Hypervisor virtual layer is built directly on top of the hardware, and virtual machines run directly on this virtual layer.
- **Characteristics**:
  - Lower performance overhead.
  - Relatively low resource consumption.
  - Common implementations: VMware ESXi, Microsoft Hyper-V.
#### Hosted Virtualization Architecture
- **Definition**: A virtual layer is built on top of the host machine's operating system, and virtual machines depend on the host's OS and the virtual layer.
- **Characteristics**:
  - Higher performance overhead.
  - Higher resource consumption.
  - Common implementations: VirtualBox, VMware Workstation.
The core of virtualization technology is **hardware-level virtualization**, where each virtual machine has its own independent operating system kernel and relies on the virtual layer to run.
### Phase 3: Containerization
Containerization technology is a form of **software-level virtualization**. Unlike traditional virtualization, containers do not have their own independent operating system kernel but run directly within the host machine's OS. A container is essentially a specific set of processes with the following characteristics:
- **Lightweight**: Fast startup and low resource consumption.
- **Isolation**: Achieves process isolation and resource limits through namespaces and control groups (Cgroups).
- **Portability**: Containers can run seamlessly in different environments.
Containerization technology has become a crucial part of modern cloud computing infrastructure. Nearly all FaaS (Function as a Service) and PaaS (Platform as a Service) are built on top of container orchestration tools like Kubernetes.
---
## Role and Principles of Docker
Docker is a popular containerization technology product that helps developers **package, distribute, and run applications**. The core idea of Docker is to package an application and all its dependencies (including libraries, configuration files, etc.) into a single container, ensuring that the application inside the container works correctly regardless of the machine it runs on.
The advantages of Docker include:
- **Consistency**: Keeps development, testing, and production environments consistent.
- **Efficiency**: Fast startup and shutdown of containers.
- **Flexibility**: Supports multiple programming languages and frameworks.
---
## Docker Container Images
Docker container images are one of the core concepts of containerization technology. An image can be understood as a special file format that serves as the foundation for running a container.
### Image Characteristics
- **Read-only**: Images are read-only templates that contain everything needed to run an application.
- **Layered Structure**: Images are composed of multiple layers, with each layer stacked on top of a base image.
- **Reusability**: Different images can share the same base layers, thus saving storage space.
### Image Creation and Usage
- Developers can define the contents of an image by writing a Dockerfile.
- Use the `docker build` command to build an image from a Dockerfile.
- Use the `docker run` command to start a container from an image.
The design of Docker container images makes the distribution and deployment of applications simpler and more efficient.
---
### Difference Between Docker Image and Container
An image is an executable package that includes everything needed to run an application. A container is the execution environment, an instance of the image.
## Basic Docker Commands
`docker pull image-name` Pulls the `image-name` image
`docker run image-name` Runs the image
`docker ps` Lists all running containers
`docker stop container-id` Stops the container
`docker rm container-id`  Removes the container
`docker build -t your-image-name` Builds an image
Docker is used to build containers, and Kubernetes is used to manage complex systems composed of containers.
