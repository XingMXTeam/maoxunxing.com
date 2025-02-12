---
title: "Git"
date: 2019-11-25
---

# Git 常用技巧与案例

---

## **1. 提交时自动去掉 pre-commit 钩子**

- 使用命令：
  ```bash
  git commit -n
  ```
  - `-n` 是 `--no-verify` 的缩写，用于跳过 pre-commit 钩子。

---

## **2. 切换到上一个分支**

- 快速切换到上一个分支：
  ```bash
  git checkout -
  ```

---

## **3. 更清晰的分支管理**

- 在本地 `push` 前，建议使用以下方式拉取远程代码：
  ```bash
  git pull -r
  ```
  - `-r` 是 `--rebase` 的缩写，可以让分支历史更清晰，避免不必要的合并提交。

---

## **4. Cherry Pick**

### **功能**
- 将另一个分支的一系列变更应用到当前分支。

### **常用命令**
- 应用单个提交：
  ```bash
  git cherry-pick <hasha>
  ```
- 应用一系列提交（从 `<hasha>` 到 `<hashb>`）：
  ```bash
  git cherry-pick <hasha>^..<hashb>
  ```

---

## **5. 查看提交差异**

- 查看两个分支或提交之间的差异：
  ```bash
  git diff xxx...yyy
  ```
  - 该命令可以查看 `git pull` 提交内容的不同。

---

## **6. 案例：快速止血发布版本问题**

### **场景**
- 当发布的版本（某个 tag）有问题时，如何快速修复？

### **解决方案**
- 将 tag 指向一个好的版本。
- 示例参考：[Alibaba Fusion Next Issue #4740](https://github.com/alibaba-fusion/next/issues/4740)

---

## **7. 修复提交记录不符合要求**

- 使用 `git rebase` 修改提交记录的作者信息：
  ```bash
  git rebase master --exec="GIT_COMMITTER_EMAIL=你的邮箱 GIT_COMMITTER_NAME=你的名字 git commit --amend --author='你的花名 <你的邮箱>' -C HEAD"
  ```
  - 替换 `你的邮箱`、`你的名字` 和 `你的花名` 为实际信息。
  - 该命令会将所有提交记录的作者信息统一修改为指定值。

---

