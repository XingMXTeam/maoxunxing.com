---
title: "[WIP] AIGC 绘图/图片创作"
date: 2023-03-25
description: ""
draft: true
tags:
  - AI
  - Stable Diffision
---

## 一、安装篇

### 1. 安装 Homebrew
- 参考教程：[如何在 Mac 上安装 Homebrew](https://zhuanlan.zhihu.com/p/90508170)

### 2. 安装 Stable Diffusion Web UI
#### 步骤：
1. **安装依赖**  
   使用 Homebrew 安装必要的工具和库：
   ```bash
   brew install cmake protobuf rust python@3.10 git wget
   ```

2. **克隆仓库**  
   克隆 `AUTOMATIC1111` 的 Stable Diffusion Web UI 仓库：
   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
   ```

3. **下载模型**  
   下载并放置模型文件到 `stable-diffusion-webui/models/Stable-diffusion/` 目录。例如：
   - 模型地址：[Anything V4.0](https://huggingface.co/andite/anything-v4.0/tree/main)
   - 文件名：`v4.5.ckpt`

4. **启动服务**  
   启动 Web UI：
   ```bash
   ./webui.sh
   ```
   访问地址：[http://127.0.0.1:7860/](http://127.0.0.1:7860/)

#### 常见问题及解决方法：
- **错误信息**：`RuntimeError: "LayerNormKernelImpl" not implemented for 'Half'`
  - 修改 `webui.sh` 文件，添加以下参数：
    ```bash
    export COMMANDLINE_ARGS="--precision full --no-half --skip-torch-cuda-test"
    ```
  - 重新启动服务。

#### 更多参考：
- [官方文档：Apple Silicon 安装指南](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Installation-on-Apple-Silicon)

---

## 二、理论篇

### 1. LoRA 模型
- **定义**：LoRA（Low-Rank Adaptation）通过冻结预设好的模型权重参数，在每个 Transformer 中注入可训练的层，从而减少计算量。
- **用途**：生成指定风格、面孔、动作等要求的图片。
- **资源**：[CivitAI LoRA 模型集合](https://civitai.com/tag/lora)

### 2. Colab（Google 免费 GPU）
- **平台**：[Google Colab](https://colab.research.google.com/)
- **启动命令**：
  ```bash
  python launch.py --share --xformers --enable-insecure-extension-access
  ```

---

## 三、实战篇

### 1. Checkpoint 模型
- 推荐模型：`chilloutmix_NiPrunedFp32Fix`
  - 下载地址：[Hugging Face - ChilloutMix](https://huggingface.co/naonovn/chilloutmix_NiPrunedFp32Fix/tree/main)
  - CivitAI 页面：[ChilloutMix 模型详情](https://civitai.com/models/6424/chillout)

### 2. 快速出图技巧
#### 2.1 调整参数找到最佳效果
- **基本参数**：
  - **采样器**：`DPM++ 2M Karras`
  - **Seed**：填相同的值可以保持人物一致；若勾选 `Resize seed from width/height`，即使尺寸不同也能保持一致性。
  - **Restore Faces**：脸部修复功能。
  - **HiRes.Fix**：提升画质。
  - **CFG Scale**：控制生成图片与提示词的差异程度，默认值为 7 或 8。

- **参考资料**：[Stable Diffusion Art 参数详解](https://stable-diffusion-art.com/automatic1111/)

#### 2.2 高效出图
- **Batch Count**：同样的配置循环生成多次。
- **Batch Size**：一次生成多张图片，方便挑选。

#### 2.3 图片转高清
- 内置功能通常已足够，但可以通过以下工具进一步提升清晰度：
  - 工具地址：[Face-Real-ESRGAN](https://huggingface.co/spaces/doevent/Face-Real-ESRGAN)

#### 2.4 一键图片转视频
- 功能暂未详细说明。

### 3. 改变图片姿势
- **插件**：[ControlNet](https://github.com/Mikubill/sd-webui-controlnet)  
  ControlNet 是一个强大的扩展，用于控制生成图片的姿态、布局等。

### 4. 提示语生成器
- **工具推荐**：
  - [Krea.ai](https://krea.ai/)
  - [Promptomania](https://promptomania.com/)

### 5. 社区资源
- **Reddit 社区**：[Stable Diffusion Reddit](https://www.reddit.com/r/StableDiffusion/)

---

## 四、补充说明
- **Windows 用户**：可以直接搜索相关教程，安装过程相对简单。
- **Mac 用户**：建议按照上述步骤操作，并根据报错信息调整环境配置。
```