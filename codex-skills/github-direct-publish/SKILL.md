---
name: github-direct-publish
description: Publish prepared local files to a GitHub remote branch when local git commit/push is blocked by sandbox permissions, detached worktrees, DNS/network limits, or locked git metadata. Use when the user asks to push, publish, create a remote branch, or continue an automation handoff and normal git cannot write refs, create index.lock, or reach github.com.
---

# GitHub Direct Publish

Use this skill to complete a remote publish through the GitHub connector when normal local git cannot finish the job.

## Core rule

Prefer normal git when it works. Switch to the GitHub connector only after a concrete local blocker appears, such as:

- `index.lock: Operation not permitted`
- cannot create or lock refs
- detached worktree plus no permission to create a branch
- DNS/network failure reaching `github.com`
- local sandbox blocks `.git` writes

Do not treat the connector path as a blind overwrite. Preserve the user's current file contents and verify the remote diff before reporting success.

## Workflow

1. Inspect local state.

   Run `git status --short`, `git status -sb`, `git rev-parse HEAD`, and `git remote -v`. Note whether the worktree is detached and whether unrelated changes exist.

2. Try the normal path if feasible.

   Use `git add`, `git commit`, and `git push` only when local `.git` writes and network access are working. Stop using local git after repeated lock, ref, or DNS failures.

3. Identify the GitHub repository.

   Use the remote URL or repository context to determine `owner/name`. Call the GitHub connector's repo metadata tool to confirm permissions and the default branch.

4. Create a remote branch.

   If no better default-branch SHA tool is available, create the remote branch from local `HEAD`. Use a specific branch name related to the task, such as `codex-publish-<topic>`.

5. Write files through GitHub contents API.

   For each prepared file:

   - Read the exact local file content.
   - If the path does not exist on the remote branch, create it.
   - If the path exists on the remote branch, fetch its SHA and update it.
   - Write files sequentially, not in parallel, so branch head movement is predictable.

6. Compare against the default branch.

   Use the GitHub compare tool with `base=<default-branch>` and `head=<publish-branch>`.

   If the branch is `behind_by > 0` and it was created by this run, force-update the branch to the compare result's `base_commit.sha`, then replay the file writes. If the branch was pre-existing or contains user work, do not force-update; report the divergence and ask before rewriting.

7. Verify final remote state.

   The final compare should show:

   - `behind_by: 0`
   - expected `ahead_by`
   - only the intended files changed

   If the connector wrote multiple commits because of the contents API, that is acceptable. Report the branch name, changed files, and any validation that could not run locally.

8. Update automation memory best effort.

   If the task belongs to an automation and the memory file is writable, append a concise summary with branch name, files, compare result, and blockers. If memory writes are denied, mention that in the final answer without treating it as a publish failure.

## Safety notes

- Never force-update a branch that may contain user work.
- Never delete or revert unrelated local changes to make publishing easier.
- Do not claim local tests or builds ran if local dependencies were missing.
- If normal git and the GitHub connector both fail, leave the files in the workspace and provide the shortest manual command sequence.

## Final response

Keep the final answer short. Include:

- whether the remote branch was created or updated
- the branch link if available
- final compare status
- intended files changed
- any remaining blocker, such as unavailable local build tools or unwritable automation memory
