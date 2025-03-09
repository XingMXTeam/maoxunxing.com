---
title: "应用自动部署和发布"
description: "pm2如何脚本自动化启动和部署应用"
date: 2024-09-14
tags:
  - nodejs
images:
  - nodejs-1/node-js.jpeg
---

## **前言**

本文主要总结了在使用 PM2 工具时遇到的一些常见问题及解决方案，帮助开发者快速上手 PM2 的自动部署功能。

---

## **准备**

### **实验环境**
- **虚拟机**：VMware 虚拟机安装 Ubuntu 16.04。
- **本地环境**：Windows 7 平台，安装 Xshell。

---

### **步骤**

#### **1. 安装 VMware 和配置窗口**
- 在 VMware 上安装 Ubuntu 16.04（教程可参考网上资料）。
- 安装完成后，调整虚拟机窗口大小以便操作：
  ![调整窗口](a.jpg)

#### **2. 安装 Xshell**
- 在本地 Windows 7 系统中安装 Xshell，用于远程连接虚拟机。

---

## **开始**

### **虚拟机环境配置**

#### **1. 升级包**
```bash
sudo apt-get update
```

#### **2. 安装必备工具**
```bash
sudo apt-get install git vim openssl openssh-server build-essential libssh-dev wget curl
```
- **openssh-server**：用于通过 SSH 连接到虚拟机。
- **curl**：Linux 下的传输工具。
- **git**：用于管理 Node.js 源码版本。

#### **3. 安装 NVM**
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

#### **4. 安装 Node.js**
```bash
nvm install v8.1.2
nvm use v8.1.2
```

#### **5. 关闭防火墙**
为了确保后续可以通过 SSH 连接到虚拟机，建议关闭防火墙：
```bash
sudo ufw stop
```

#### **6. 安装 Yarn、Vue CLI 和 PM2**
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
npm install vue-cli pm2 -g
```
- **Yarn**：包管理工具，类似于 npm。
- **Vue CLI**：Vue 的命令行工具。
- **PM2**：Node.js 服务管理工具。

---

### **测试虚拟机上的 Node.js 环境**

1. 创建一个 `server.js` 文件：
   ```bash
   vi server.js
   ```
   将以下代码粘贴到文件中：
   ![server.js 示例](b.jpg)

2. 保存并退出：
   ```bash
   :wq!
   ```

3. 使用 PM2 启动服务：
   ```bash
   pm2 start server.js
   ```
   如果看到如下状态，说明启动成功：
   ![PM2 启动成功](c.png)

---

## **本地 Windows 连接到虚拟机**

### **1. 修改 SSH 配置**
编辑 `/etc/ssh/sshd_config` 文件：
```bash
vim /etc/ssh/sshd_config
```
找到以下内容：
```text
Authentication:
LoginGraceTime 120
PermitRootLogin prohibit-password
StrictModes yes
```
修改为：
```text
Authentication:
LoginGraceTime 120
PermitRootLogin yes
StrictModes yes
```

### **2. 启动 SSH 服务**
```bash
sudo service ssh start
```

### **3. 查看虚拟机 IP 地址**
```bash
ifconfig
```
记录下虚拟机的 IP 地址：
![虚拟机 IP 地址](d.png)

### **4. 使用 Xshell 连接**
在 Xshell 中输入以下命令：
```bash
ssh ubuntu@192.168.150.129
```
- **用户名**：`ubuntu`。
- **IP 地址**：虚拟机的 IP 地址。
- **网络模式**：NAT 模式即可，无需改为桥接模式。

如果配置正确，应该可以成功连接。

---

## **创建私有仓库**

### **1. 创建 Bitbucket 仓库**
在 Bitbucket 上创建一个名为 `push2Server` 的仓库：
![Bitbucket 仓库](e.png)

### **2. 克隆仓库**
将仓库克隆到本地，并创建以下文件：
- `server.js`：与之前测试用的代码相同。
- `ecosystem.json`：PM2 自动部署配置文件。

目录结构如下：
![目录结构](f.png)

### **3. 配置 `ecosystem.json`**
```json
{
  "apps": [
    {
      "name": "Test",
      "script": "server.js",
      "env": {
        "COMMON_VARIABLE": "true"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ],
  "deploy": {
    "production": {
      "user": "ubuntu", // 注意点1：用户名必须是虚拟机的用户名
      "host": "192.168.150.129", // 注意点2：IP 地址必须正确
      "port": "22", // 注意点3：端口号必须正确
      "ref": "origin/master",
      "repo": "git@bitbucket.org:YellMan/push2server.git", // 注意点4：必须使用 git@ 开头，不能使用 HTTPS
      "path": "/home/ubuntu/www/testproject/production", // 注意点5：路径必须是绝对路径
      "ssh_options": "StrictHostKeyChecking=no",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### **4. 配置 Git SSH Key**
在虚拟机上生成 SSH Key 并添加到 Bitbucket：
```bash
ssh-keygen
cat ~/.ssh/id_rsa.pub
pbcopy < ~/.ssh/id_rsa.pub
```
将公钥粘贴到 Bitbucket 的 SSH Key 设置页面：
![Bitbucket SSH Key](g.png)

验证 SSH 配置是否成功：
```bash
ssh -T git@bitbucket.org
```

### **5. 设置目录权限**
在虚拟机上创建目标目录并赋予权限：
```bash
mkdir -p /home/ubuntu/www/testproject/production
sudo chmod 777 /home/ubuntu/www
sudo chmod 777 /home/ubuntu/www/testproject
```

---

## **发布前配置**

### **1. 初始化部署**
在本地运行以下命令：
```bash
pm2 deploy ecosystem.json production setup
```

#### **常见问题及解决方法**
1. **错误提示：无法找到 PM2 或 Node**
   - 检查 PM2 和 Node 的路径：
     ```bash
     whereis pm2
     whereis node
     ```
   - 创建软链接：
     ```bash
     sudo ln -s /opt/nodejs/bin/pm2 /usr/bin/pm2
     sudo ln -s /home/ubuntu/.nvm/versions/node/v8.1.2/bin/node /usr/bin/node
     ```

2. **错误提示：SSH Key 配置失败**
   - 确保虚拟机的 SSH Key 已正确添加到 Bitbucket。

3. **其他错误**
   - 根据错误信息逐步排查，例如检查路径、权限等。

---

## **发布项目**

执行以下命令完成项目发布：
```bash
pm2 deploy ecosystem.json production
```

在虚拟机上查看是否自动部署成功：
![部署成功](z.png)

---

## **总结**

通过以上步骤，我们完成了 PM2 的自动部署配置。以下是关键点总结：
1. **虚拟机环境配置**：包括 Node.js、PM2、SSH 等基础工具的安装。
2. **私有仓库配置**：确保 `ecosystem.json` 文件的配置正确。
3. **权限管理**：确保目标目录和文件具有正确的权限。
4. **常见问题排查**：针对常见错误提供了解决方案。

希望本文能帮助你快速掌握 PM2 的使用！
