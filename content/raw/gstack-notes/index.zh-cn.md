---
title: "gstack: Garry Tan 的开源 AI 软件工厂"
date: 2026-04-13
draft: true
tags: [AI, Agent, 工具, Claude Code, 自动化]
source: "https://github.com/garrytan/gstack"
---

gstack 是 Y Combinator 总裁 Garry Tan 开源的 AI 工程工作流工具集，基于 Claude Code 构建。核心理念：**一个人 + 正确的工具 > 传统团队**。它把 Claude Code 变成一支虚拟工程团队 -- CEO、架构师、设计师、QA、发布工程师各司其职。

## 核心数据

- **23 个专家角色**（Specialists）
- **8 个增强工具**（Power Tools）
- 完整冲刺流程：Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect
- 技术栈：TypeScript, Bun, Playwright, Go Template, Shell
- 依赖：Claude Code, Git, Bun v1.0+
- 许可：MIT
- 版本：0.16.x

## 专家角色（Slash Commands）

### 产品与策略

| 命令 | 角色 | 职责 |
|------|------|------|
| `/office-hours` | 产品顾问 | 头脑风暴产品想法，验证是否值得做 |
| `/plan-ceo-review` | CEO | 战略、范围、野心审查 |
| `/plan-eng-review` | 架构师 | 技术架构审查，锁定技术方案 |
| `/plan-design-review` | 设计总监 | 审查方案的设计层面 |
| `/plan-devex-review` | DevEx 审查 | 开发者体验审查 |
| `/autoplan` | 自动审查 | 自动运行所有审查流程 |

### 设计

| 命令 | 职责 |
|------|------|
| `/design-consultation` | 设计系统、品牌、视觉识别 |
| `/design-review` | 视觉打磨、对线上站点进行设计审计 |
| `/design-html` | HTML 设计稿生成 |
| `/design-shotgun` | 批量设计迭代 |

### 开发与调试

| 命令 | 职责 |
|------|------|
| `/investigate` | 调试 bug、错误、异常行为 |
| `/careful` / `/guard` | 安全模式，谨慎操作 |
| `/freeze` / `/unfreeze` | 限制编辑到指定目录 |
| `/pair-agent` | 结对编程 Agent |

### 质量与发布

| 命令 | 职责 |
|------|------|
| `/qa` | 测试站点、发现 bug、QA 测试 |
| `/review` | 代码审查、diff 检查、合并前审查 |
| `/ship` | 发布、部署、推送、创建 PR |
| `/document-release` | 发布后更新文档 |
| `/retro` | 周回顾，复盘已发布的工作 |

### 辅助

| 命令 | 职责 |
|------|------|
| `/codex` | 第二意见，独立审查（接入 OpenAI Codex CLI）|
| `/learn` | 学习新知识 |
| `/gstack-upgrade` | 升级 gstack 自身 |

## 浏览器自动化（$B 命令）

gstack 内置了基于 Playwright 的无头浏览器工具，通过 `$B` 前缀调用：

- **导航**：`goto <url>`, `back`, `forward`, `reload`
- **读取**：`text`, `html [selector]`, `links`, `forms`, `data`, `accessibility`
- **提取**：`archive`, `download`, `scrape`
- **交互**：`click`, `fill`, `type`, `hover`, `scroll`, `select`, `upload`
- **检查**：`console`, `network`, `cookies`, `storage`, `perf`, `eval`
- **截图**：`screenshot`, `prettyscreenshot`, `pdf`, `diff`, `responsive`
- **标签页**：`newtab`, `closetab`, `tab`, `tabs`

### Snapshot 快照标志

- `-i` 仅交互元素
- `-c` 紧凑输出
- `-d N` 深度限制
- `-s sel` 限定 CSS 选择器范围
- `-D` 与上次快照对比
- `-a` 带标注截图

## 架构设计

### 守护进程模型

浏览器运行为持久化后台守护进程，首次使用时自动启动，30 分钟不活动后自动关闭。会话状态通过本地 JSON 文件追踪，服务仅绑定 localhost，所有请求需 Bearer Token 认证。

### 元素定位（Ref 系统）

使用 ARIA 树快照映射到 Playwright Locator，绕过 CSP 和框架 hydration 问题，不依赖 DOM 注入。

### 设计原则

- 所有失败信息重写为 AI Agent 可理解的指令
- 崩溃时立即退出并清理重启
- 不使用 WebSocket、MCP 协议、多租户
- 仅支持 macOS 凭证解密

## 工程实践

### 代码质量

- 使用 slop-scan 检测 AI 生成代码中的低质量模式
- SKILL.md 从 .tmpl 模板生成，禁止手动编辑
- 通过 `bun run gen:skill-docs` 重新生成文档
- `dist/` 目录下的编译产物禁止提交到 git

### Git 规范

- 每个 commit 只包含一个逻辑变更（bisect-friendly）
- 版本说明按分支划分，发布时写用户可感知的能力
- 调试时禁止在未验证基准分支前声称"与我们的改动无关"

### 测试

- `bun test` 快速本地验证
- `bun run test:evals` 基于 diff 的付费评估测试
- 评估测试通过独立 `claude -p` 子进程运行

## Conductor（并行冲刺）

通过 `conductor.json` 配置，支持多个 AI Agent 并行执行冲刺流程。配置结构：

```json
{
  "scripts": {
    "setup": "bin/dev-setup",
    "archive": "bin/dev-teardown"
  }
}
```

## 关键洞察

1. **角色分离**：每个 slash command 对应一个专家角色，各有明确职责边界，避免"万能 Agent"的混乱
2. **完整工作流**：覆盖从产品构思到发布回顾的完整软件开发生命周期
3. **浏览器即工具**：内置浏览器自动化能力，让 AI Agent 能直接进行视觉 QA、截图对比、表单测试
4. **防御性工程**：slop-scan 检测 AI 代码质量，freeze/guard 机制防止误操作
5. **评估驱动**：通过 diff-based 评估测试持续验证 AI Agent 的输出质量
