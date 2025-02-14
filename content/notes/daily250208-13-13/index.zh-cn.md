---
title: "Linux"
date: 2019-11-25
---

# 常用技巧与工具指南

---

## 目录

1. [Terminal 翻页快捷键](#terminal-翻页快捷键)
2. [Linux 命令行帮助工具](#linux-命令行帮助工具)
3. [将 Web 应用打包成客户端](#将-web-应用打包成客户端)

---

## Terminal 翻页快捷键

在终端中查看长输出内容时，可以使用以下快捷键进行翻页：

- **向上翻页**：`Ctrl + b`
- **向下翻页**：`空格键`

> **补充说明**：
> - 这些快捷键通常用于 `less` 或 `more` 命令的分页查看模式。
> - 如果需要退出分页模式，可以按 `q` 键。

---

## Linux 命令行帮助工具

### TLDR Pages

TLDR 是一个简化版的命令行帮助工具，提供常用命令的简洁示例和说明，适合快速查阅。

- **项目地址**：[https://github.com/tldr-pages/tldr](https://github.com/tldr-pages/tldr)
- **安装方法**：
  ```bash
  # 使用 npm 安装
  npm install -g tldr

  # 或者使用包管理器（例如 Homebrew）
  brew install tldr
  ```
- **使用示例**：
  ```bash
  tldr tar
  ```
  输出示例：
  ```plaintext
  tar

  Archiving utility.
  Often combined with a compression method, such as gzip or bzip2.

  - Create an archive from files:
    tar cf target.tar file1 file2 file3

  - Extract an archive in a specific directory:
    tar xf source.tar -C directory
  ```

> **特点**：
> - 提供简明扼要的命令示例，避免冗长的官方文档。
> - 支持多种操作系统和语言。

---

## 将 Web 应用打包成客户端

### Pake 工具

Pake 是一个开源工具，可以将 Web 应用快速打包为桌面客户端，支持跨平台运行。

- **项目地址**：[https://github.com/tw93/Pake](https://github.com/tw93/Pake)
- **功能特点**：
  - 支持将任意网页封装为桌面应用。
  - 提供自定义窗口、图标等功能。
  - 支持 Windows、macOS 和 Linux 平台。
- **安装与使用**：
  ```bash
  # 克隆项目
  git clone https://github.com/tw93/Pake.git

  # 安装依赖
  cd Pake
  npm install

  # 打包 Web 应用
  npm run build --url=https://example.com --name=MyApp
  ```
- **参数说明**：
  - `--url`：指定要打包的网页地址。
  - `--name`：指定生成的应用名称。

> **应用场景**：
> - 将常用的在线工具（如 Notion、Trello）封装为桌面客户端。
> - 快速构建轻量级桌面应用原型。