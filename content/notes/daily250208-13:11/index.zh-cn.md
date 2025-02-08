---
title: "Git"
date: 2019-11-25
---

# git
## 提交时自动去掉pre-commit钩子
`git commit -n ` `-n`是`--no-verify`的意思


切到上一个分支：
git checkout -


本地push前，通过这种方式git pull -r 让分支更清晰


git cherry-pick 是另一个分支的一系列变更应用到当前分支
git cherry-pick hasha
git cherry-pick hasha^:hashb

## 什么是cherry pick

## git diff
git diff xxx...yyy 查看git pull提交内容的不同


案例： 
当发布的版本（某个tag) 有问题。 如何快速止血.https://github.com/alibaba-fusion/next/issues/4740

技术： 
将tag指向一个好的版本

---


修复提交记录不符合要求： 
git rebase master --exec="GIT_COMMITTER_EMAIL=你的邮箱 GIT_COMMITTER_NAME=你的花名 git commit --amend --author='你的花名 <你的公司邮箱>'  -C HEAD"











