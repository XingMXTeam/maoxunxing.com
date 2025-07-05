--- 
title: "[Translation] How to fork a project and do subsequent development" 
date: 2019-11-25 
tags:
  - Git
---

One of the great things about github is that you can easily fork a project and then you can modify it yourself. The worst bit is that you no longer get future updates to that project.

Then you have a local modification pull request to a project that has frequent commits and then inevitably have to merge patches. Here's what I wrote based on my own experience on how to simply handle this situation.

Step 1: Setting up a remote repository

If you run git remote -v, you can see information about the address of your remote repository, usually named orgin, and that's the address you push to when you perform a git push. To make it easier to deal with this address, we can give it a name:

git remote add upstream <https://github.com/ORIGINAL_OWNER/ORIGINNAL_REPOSITORY.git>

Then you can reference the remote repository via upstream.

Step 2: Synchronize Your Remote Repository Often

When you want to start writing some new code, you can first synchronize the remote repository first, and then you can get the latest commits to avoid conflicts later on in your commits.

git fetch upstream

git checkout master

git merge upstream/master

git push

Then your code should easily merge over as a "fast-forward" rather than actually doing a merge commit. Of course, you'll want to follow my advice below to the letter.

Step 3: Make sure you don't commit to the master branch

If you want a simple and clean workflow, then you must not commit to your local master branch. Your local master branch should only be used to keep track of your remote branch, so that you can always work on your current version simply and cleanly and simply merge pull requests.

When you push your branch to the far end, you can PR; when your PR is accepted, you can pull down the latest update and delete your branch. master is only meant to be used as a remote code tracker, don't pollute it.

Step 4: Rebase Your Branch Often

Let's say you're working on a new feature on your branch, and you notice some new changes on the far end, upstream, that are in the same place as the code you're changing. So, you want to merge the code from the far end so that it doesn't conflict later. So, how do you do it?

First, synchronize your code as per step 2, then rebase your current branch:

git checkout MY_COOL_BRANCH

git rebase master

This will undo your commit, then fetch the code from the remote and apply your commit to the new code. This way, when you PR, the remote code maintainer can easily merge because your code is on top of the latest code.

Step 5: Force commits to fix a lot of fix xx commit logs

When you finally get around to PRing, the code reviewe, you will most likely need to fix a bug. You can change the code and submit it to the PR branch, but when you merge it, there will be a lot of "fix xx" commits. Instead of doing this, you can modify your commit with git commit --amend and then force the commit to the remote repository with git push --force. Forcing a push isn't a good idea, but it's usually a good idea to avoid rejecting commits with merge errors. But here we're just changing the commit history, which won't be a big problem, and instead makes the commit record cleaner.