--- 
title: "Git Common Tips and Cases" 
date: 2019-11-25 
tags:  
  - Git
---

## **1. Automatically remove pre-commit hooks when committing **

- Use the command: 
 ```bash 
 git commit -n 
 ```
  - `-n` is short for `--no-verify`, which is used to skip the pre-commit hooks.

---

## **2. Switching to the previous branch

- Quickly switch to the previous branch: 
 ```bash 
 git checkout - 
 ```

--- -# **3.

## **3. Clearer branch management ## **3.

- Before local `push`, it is recommended to pull remote code using: 
 ```bash 
 git pull -r 
 ```
  - `-r` is an abbreviation for `--rebase`, which makes the branch history clearer and avoids unnecessary merge commits.

---

## **4. Cherry Pick**

### **Function***

- Applies a set of changes from another branch to the current branch.

### **Commonly used commands###

- Apply a single commit: 
 ```bash 
 git cherry-pick <hasha> 
 ```
- Apply a series of commits (from `<hasha>` to `<hashb>`): 
 ```bash 
 git cherry-pick <hasha>^... <hashb> 
 ```

---

## **5. Viewing commit differences

- View the diff between two branches or commits: 
 ```bash 
 git diff xxx.. .yyyy 
 ```
  - This command allows you to see the differences between ``git pull'' commits.

---

## **6. Case Study: Quickly Stemming a Release Issue** **Scenario.

### **Scenario**

- When there is a problem with a release (a tag), how do you fix it quickly?

### **Solution** ### **Solution** ### **Solution

- Point the tag to a good release.
- Example reference:[Alibaba Fusion Next Issue #4740](https://github.com/alibaba-fusion/next/issues/4740)

---

### **7. Fix commit log non-conformance

- Use `git rebase` to change the author information of a commit record: 
 ``bash 
 git rebase master --exec="GIT_COMMITTER_EMAIL=your email GIT_COMMITTER_NAME=your name git commit --amend --author='Your fancy name ' -C HEAD fancy name <your email>' -C HEAD" 
 ```
  - Replaces ``your mailbox``, ``your name``, and ``your filename`` with the actual information.
  - This command will uniformly change the author information for all commit records to the specified values.
