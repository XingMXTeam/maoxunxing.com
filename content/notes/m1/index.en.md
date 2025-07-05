---
title: "M1 Pitfalls"
date: 2019-11-25
tags:
  - Computer Science
---
## Table of Contents
- [macOS Troubleshooting](#macos-troubleshooting)
- [Switching to an x86_64 Architecture Terminal](#switching-to-an-x86_64-architecture-terminal)
  - [Method](#method)
  - [Use Cases](#use-cases)
---
## macOS Troubleshooting
When using NVM on macOS, you might encounter some issues. Here are some common solutions and notes:
- **Official Documentation**:  
  For more details, refer to the [macOS Troubleshooting](https://github.com/nvm-sh/nvm#macos-troubleshooting) section in the official NVM documentation.
- **Common Issues**:
  - **Zsh Configuration Issues**: Ensure that the NVM initialization script is correctly loaded in your `~/.zshrc` file.
    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Load nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Load bash_completion (optional)
    ```
  - **Permission Issues**: If you encounter permission errors when installing Node.js, try resetting the directory permissions:
    ```bash
    sudo chown -R $(whoami) ~/.nvm
    ```
- **Solutions**:
  - If the problem persists, check the error logs in your terminal output and fix it according to the prompts.
  - You can try reinstalling NVM:
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    ```
---
## Switching to an x86_64 Architecture Terminal
On Apple Silicon (M1/M2 chip) devices, the default terminal runs on the ARM architecture. If you need to run x86_64 architecture commands or tools, you can switch using the following method:
### Method
1. Open the terminal and run the following command:
   ```bash
   arch -x86_64 zsh
   ```
   - **Explanation**:
     - `arch -x86_64`: Specifies the use of the x86_64 architecture.
     - `zsh`: Starts the Zsh terminal.
2. Verify the current architecture:
   ```bash
   uname -m
   ```
   - The output should be `x86_64`, indicating a successful switch to the x86_64 architecture.
### Use Cases
- **Compatibility Needs**: Some tools or software may not yet fully support the ARM architecture and need to be run in an x86_64 environment.
- **Development Environment Isolation**: Quickly switch between different architectures to avoid conflicts.
