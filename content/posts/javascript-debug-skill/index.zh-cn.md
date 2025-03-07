---
title: "前端调试技巧"
date: 2021-09-22
tags:
  - Web开发
description: ""
images:
  - debug-skill/debug-skill.jpeg
---

## 1. 保存 Chrome 网络日志

### 步骤：
1. 打开 Chrome 浏览器。
2. 在地址栏中输入以下地址并访问：
   ```
   chrome://net-export/
   ```
3. 点击 **"Start Logging to Disk"** 按钮。
4. 选择保存日志文件的位置，并开始记录网络活动。
5. 完成记录后，点击 **"Stop Recording"** 按钮以生成日志文件。

### 注意事项：
- 日志文件将以 `.json` 格式保存，包含详细的网络请求和响应信息。
- 建议在需要调试网络问题时使用此功能。

---

## 2. 查看 Chrome 网络日志

### 工具：
使用 [NetLog Viewer](https://netlog-viewer.appspot.com/#import) 在线工具查看日志。

### 步骤：
1. 打开 [NetLog Viewer](https://netlog-viewer.appspot.com/#import)。
2. 点击 **"Choose File"** 按钮，上传之前保存的 `.json` 日志文件。
3. 日志文件加载完成后，您可以通过界面查看详细的网络请求、响应时间、错误信息等内容。