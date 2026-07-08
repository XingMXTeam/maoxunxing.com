---
title: "OpenClaw 小龙虾怎么配置模型，我简单整理一下"
description: "记录一次把阿里云百炼模型接入 OpenClaw 的过程，重点是 Provider、Base URL、API Key、模型 ID、reasoning false 和几个容易踩坑的地方。"
date: 2026-06-16
tags:
  - AI
  - OpenClaw
  - 阿里云百炼
  - 大模型
  - 工具
custom_toc:
  - title: "先说核心"
  - title: "OpenClaw 的模型配置怎么理解"
  - title: "先准备百炼 API Key"
  - title: "安装 OpenClaw"
  - title: "用 Dashboard 配置会更方便"
  - title: "参考配置"
  - title: "这几个字段是什么意思"
  - title: "默认模型怎么选"
  - title: "常见问题"
---

最近试了一下 OpenClaw，也就是大家说的“小龙虾”。这个东西挺有意思，它不是单纯的聊天工具，更像是一个可以接各种模型的本地 AI 助手框架。

刚开始用的时候，最关键的一步其实不是研究它有多少功能，而是先把模型配置好。模型没配通，后面的 Dashboard、TUI、Agent、技能这些东西都没法真正跑起来。

这里直接记录把阿里云百炼模型接到 OpenClaw 里的配置方式。过程不复杂，但有几个地方确实容易踩坑。官方文档也可以放在旁边对照看：[OpenClaw 使用阿里云百炼配置模型](https://www.alibabacloud.com/help/zh/model-studio/openclaw)。

## 先说核心

OpenClaw 配模型，主要就是配这几个东西：`baseUrl`、`apiKey`、`model id`，然后还有一个容易忽略的字段：`reasoning: false`。

尤其是 `reasoning: false`，这个建议一定要加上。不然有时候请求看起来是成功的，但模型就是不返回内容，表现出来就像“回复为空”。这个问题挺迷惑的，因为你一开始可能会怀疑 API Key、模型名、网络或者 OpenClaw 本身，最后发现只是少了一个字段。

## OpenClaw 的模型配置怎么理解

一开始看配置文件可能会有点绕，其实它的逻辑很简单。OpenClaw 不是直接写一个模型名就完事，而是先定义一个模型服务商，也就是 Provider，然后在这个 Provider 下面定义具体模型，最后再告诉 OpenClaw 默认用哪个模型。

比如我们接阿里云百炼，可以先定义一个 Provider，名字叫 `bailian`。然后在它下面配置 `qwen3.5-plus`、`qwen3-coder-next` 这些模型。最后默认模型就写成：

```text
bailian/qwen3.5-plus
```

这里要注意，不能只写 `qwen3.5-plus`。前面的 `bailian` 是 Provider 名称，后面的 `qwen3.5-plus` 才是模型 ID。很多“找不到模型”的问题，其实就是这里没对上。

## 先准备百炼 API Key

在配置 OpenClaw 之前，需要先去阿里云百炼开通服务，然后创建 API Key。这里有一个很重要的点：地域要一致。

也就是说，API Key、Base URL、模型所在地域，最好都保持一致。比如你用的是新加坡地域的 API Key，那 Base URL 就用新加坡地域的地址；如果用北京地域，就用北京地域的地址。不要出现北京 API Key 配新加坡 Base URL 这种情况，这种问题排查起来会比较烦。

常见的 Base URL 大概是这样：

```text
北京：
https://dashscope.aliyuncs.com/compatible-mode/v1

新加坡：
https://dashscope-intl.aliyuncs.com/compatible-mode/v1

美国弗吉尼亚：
https://dashscope-us.aliyuncs.com/compatible-mode/v1
```

你根据自己的百炼地域选择对应的地址就行。

## 安装 OpenClaw

OpenClaw 需要 Node.js 22 以上，可以先看一下自己的 Node 版本：

```bash
node --version
```

如果版本没问题，可以直接安装：

```bash
npm install -g openclaw@latest
```

安装完以后检查一下：

```bash
openclaw --version
```

能正常输出版本号，就说明安装好了。

如果你用 macOS 或 Linux，也可以用官方脚本安装：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Windows 可以用 PowerShell：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

## 用 Dashboard 配置会更方便

配置模型有两种方式，一种是直接改配置文件，另一种是用 Dashboard。我个人更建议先用 Dashboard，因为直接改 JSON 文件很容易少逗号或者括号不匹配。

启动 Dashboard：

```bash
openclaw dashboard
```

正常情况下浏览器会自动打开。如果没有打开，可以手动访问：

```text
http://127.0.0.1:18789
```

进去以后找到 `配置 > RAW`，英文界面一般是 `Config > RAW`，然后在这里修改 `openclaw.json`。

## 参考配置

下面是一份可以参考的配置。这里以新加坡地域为例，默认模型用 `qwen3.5-plus`，代码模型用 `qwen3-coder-next`。

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bailian": {
        "baseUrl": "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
        "apiKey": "DASHSCOPE_API_KEY",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3.5-plus",
            "name": "qwen3.5-plus",
            "reasoning": false,
            "input": ["text", "image"],
            "contextWindow": 1000000,
            "maxTokens": 65536
          },
          {
            "id": "qwen3-coder-next",
            "name": "qwen3-coder-next",
            "reasoning": false,
            "input": ["text"],
            "contextWindow": 262144,
            "maxTokens": 65536
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "bailian/qwen3.5-plus"
      },
      "models": {
        "bailian/qwen3.5-plus": {},
        "bailian/qwen3-coder-next": {}
      }
    }
  }
}
```

这里的 `DASHSCOPE_API_KEY` 换成你自己的百炼 API Key 就可以。真实 Key 不要提交到 GitHub，也不要发到公开文章里。

## 这几个字段是什么意思

`bailian` 是我们自己定义的 Provider 名称，你也可以叫 `aliyun` 或者 `dashscope`。不过我觉得叫 `bailian` 比较直观。后面引用模型的时候，就要用 `bailian/qwen3.5-plus` 这种格式。

`baseUrl` 是百炼 OpenAI 兼容接口的地址。这个地址要和你的 API Key 地域对应。比如新加坡就是 `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`。

`apiKey` 就是你的百炼 API Key。

`api: openai-completions` 表示 OpenClaw 会按照 OpenAI 兼容接口的方式去调用模型。百炼支持这种兼容模式，所以可以接进来。

`reasoning: false` 建议明确写上。这个字段很关键，少了之后可能会出现模型回复为空的问题。

## 默认模型怎么选

我个人建议默认用 `qwen3.5-plus`。日常写作、总结、分析、普通对话，用它就可以。代码相关的任务，可以再切到 `qwen3-coder-next`。

配置里默认模型是这一行：

```json
"primary": "bailian/qwen3.5-plus"
```

如果进入 TUI 以后想临时切换模型，可以用：

```bash
/model qwen3-coder-next
```

这样比较灵活。默认模型不用一开始就设成代码模型，除非你主要就是拿它写代码。

## 如果想直接改配置文件

配置文件一般在：

```bash
~/.openclaw/openclaw.json
```

可以用下面的命令打开：

```bash
nano ~/.openclaw/openclaw.json
```

或者：

```bash
vim ~/.openclaw/openclaw.json
```

改完保存，再重新打开 OpenClaw 就行。不过如果不太熟悉 JSON，我还是建议用 Dashboard 的 RAW 配置，出错概率低一点。

## 常见问题

如果提示找不到模型，先检查模型是不是写成了完整路径。应该是 `bailian/qwen3.5-plus`，而不是只写 `qwen3.5-plus`。然后再看 Provider 名称是否一致。比如你配置里叫 `bailian`，后面引用的时候就不能写成 `aliyun/qwen3.5-plus`。

如果模型回复为空，优先检查有没有加 `reasoning: false`。这个问题比较隐蔽，但确实容易遇到。

如果 API Key 明明是对的，但调用还是失败，可以重点看地域是不是一致。API Key、Base URL、模型所在地域最好不要混用。

如果 `openclaw` 命令不存在，可以先执行：

```bash
openclaw --version
```

如果没有结果，就重新安装：

```bash
npm install -g openclaw@latest
```

如果还是不行，再检查 npm 全局路径有没有加入环境变量。

## 最后简单总结

OpenClaw 配模型，核心就是先定义 Provider，再定义模型，最后设置默认模型。接百炼的时候，用 OpenAI 兼容接口，注意 Base URL、API Key、模型地域一致，再把 `reasoning` 设成 `false`。

这一步配通以后，OpenClaw 才算真正能用起来。后面不管是用 TUI、Dashboard，还是继续折腾 Agent 和技能，都是建立在模型能正常调用的基础上。

我觉得 OpenClaw 比较有价值的地方，不是又多了一个聊天入口，而是它更像一个可以接入自己工作流的 AI 助手底座。模型配置只是第一步，但这一步打通以后，后面能玩的空间就比较大了。
