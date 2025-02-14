---
title: "vscode命令"
date: 2019-11-25
---

# 在 VSCode 中添加 `code` 命令以快速打开项目

在使用 Visual Studio Code (VSCode) 时，可以通过安装 `code` 命令到系统的 PATH 环境变量中，从而在终端中直接使用 `code` 命令打开项目或文件。以下是具体操作步骤和说明。

---

## 1. 安装 `code` 命令

### 方法一：通过 VSCode 内置命令安装

1. 打开 **VSCode**。
2. 按下快捷键 `Command + Shift + P`（Mac）或 `Ctrl + Shift + P`（Windows/Linux）打开命令面板。
3. 输入并选择以下命令：
   ```
   Shell Command: Install 'code' command in PATH
   ```
4. 执行后，VSCode 会自动将 `code` 命令添加到系统的 PATH 环境变量中。

---

## 2. 验证安装是否成功

安装完成后，可以通过以下步骤验证 `code` 命令是否可用：

1. 打开终端（Terminal）。
2. 输入以下命令并回车：
   ```bash
   code --version
   ```
3. 如果安装成功，终端会显示当前 VSCode 的版本号。例如：
   ```
   1.80.0
   ```

---

## 3. 使用 `code` 命令

### 打开当前目录作为项目
在终端中导航到目标目录，然后运行以下命令：
```bash
code .
```
这将以当前目录为根目录打开一个 VSCode 项目。

### 打开指定文件
可以直接通过 `code` 命令打开某个文件：
```bash
code 文件路径
```
例如：
```bash
code ~/projects/example.js
```

### 打开新窗口
如果需要在新窗口中打开项目，可以添加 `-n` 参数：
```bash
code -n .
```

---

## 4. 手动配置（可选）

如果自动安装失败，可以手动将 `code` 命令添加到 PATH 中。

### Mac
1. 找到 VSCode 的安装路径，默认路径为：
   ```
   /Applications/Visual Studio Code.app/Contents/Resources/app/bin
   ```
2. 将该路径添加到 `.zshrc` 或 `.bash_profile` 文件中：
   ```bash
   export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
   ```
3. 保存文件并刷新配置：
   ```bash
   source ~/.zshrc
   ```

### Windows
1. 找到 VSCode 的安装路径，默认路径为：
   ```
   C:\Users\<用户名>\AppData\Local\Programs\Microsoft VS Code\bin
   ```
2. 将该路径添加到系统的环境变量 `Path` 中。
3. 重新启动终端。

---

## 5. 总结

通过安装 `code` 命令，可以更方便地在终端中快速打开项目或文件，提升开发效率。无论是通过 VSCode 内置命令还是手动配置，都可以轻松实现这一功能。