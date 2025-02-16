---
title: "m1 踩坑"
date: 2019-11-25
---

## 目录

- [macOS 问题排查](#macos-问题排查)
- [切换到 x86\_64 架构的终端](#切换到-x86_64-架构的终端)
  - [方法](#方法)
  - [使用场景](#使用场景)

---

## macOS 问题排查

在 macOS 上使用 NVM 时，可能会遇到一些问题。以下是一些常见的解决方案和注意事项：

- **官方文档**：  
  更多详细信息可以参考 NVM 官方文档中的 [macOS Troubleshooting](https://github.com/nvm-sh/nvm#macos-troubleshooting) 部分。

- **常见问题**：
  - **Zsh 配置问题**：确保 `~/.zshrc` 文件中正确加载了 NVM 的初始化脚本。
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载 nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载 bash_completion (可选)
    ```
  - **权限问题**：如果安装 Node.js 时遇到权限错误，可以尝试重新设置目录权限：
    ```bash
    sudo chown -R $(whoami) ~/.nvm
    ```

- **解决方法**：
  - 如果问题仍未解决，请查看终端输出的错误日志，并根据提示进行修复。
  - 可以尝试重新安装 NVM：
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    ```

---

## 切换到 x86_64 架构的终端

在 Apple Silicon（M1/M2 芯片）设备上，默认终端运行的是 ARM 架构。如果需要运行 x86_64 架构的命令或工具，可以通过以下方式切换：

### 方法

1. 打开终端并运行以下命令：
   ```bash
   arch -x86_64 zsh
   ```
   - **说明**：
     - `arch -x86_64`：指定使用 x86_64 架构。
     - `zsh`：启动 Zsh 终端。

2. 验证当前架构：
   ```bash
   uname -m
   ```
   - 输出应为 `x86_64`，表示已成功切换到 x86_64 架构。

### 使用场景

- **兼容性需求**：某些工具或软件可能尚未完全支持 ARM 架构，需要在 x86_64 环境下运行。
- **开发环境隔离**：在不同架构之间快速切换，避免冲突。
