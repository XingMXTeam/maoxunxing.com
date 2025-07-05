---
title: "AIGC Drawing/Image Creation"
date: 2023-03-25
description: ""
tags:
  - AI
---
## I. Installation
### 1. Install Homebrew
- Reference tutorial: [How to Install Homebrew on Mac](https://zhuanlan.zhihu.com/p/90508170)
### 2. Install Stable Diffusion Web UI
#### Steps:
1. **Install Dependencies**  
   Use Homebrew to install necessary tools and libraries:
   ```bash
   brew install cmake protobuf rust python@3.10 git wget
   ```
2. **Clone the Repository**  
   Clone the `AUTOMATIC1111` Stable Diffusion Web UI repository:
   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
   ```
3. **Download Models**  
   Download and place the model file into the `stable-diffusion-webui/models/Stable-diffusion/` directory. For example:
   - Model URL: [Anything V4.0](https://huggingface.co/andite/anything-v4.0/tree/main)
   - Filename: `v4.5.ckpt`
4. **Start the Service**  
   Start the Web UI:
   ```bash
   ./webui.sh
   ```
   Access URL: [http://127.0.0.1:7860/](http://127.0.0.1:7860/)
#### Common Issues and Solutions:
- **Error Message**: `RuntimeError: "LayerNormKernelImpl" not implemented for 'Half'`
  - Modify the `webui.sh` file and add the following arguments:
    ```bash
    export COMMANDLINE_ARGS="--precision full --no-half --skip-torch-cuda-test"
    ```
  - Restart the service.
#### More References:
- [Official Documentation: Installation on Apple Silicon](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Installation-on-Apple-Silicon)
---
## II. Theory
### 1. LoRA Models
- **Definition**: LoRA (Low-Rank Adaptation) reduces computational load by freezing pre-trained model weights and injecting trainable layers into each Transformer block.
- **Usage**: Generate images with specific styles, faces, actions, etc.
- **Resources**: [CivitAI LoRA Model Collection](https://civitai.com/tag/lora)
### 2. Colab (Google's Free GPU)
- **Platform**: [Google Colab](https://colab.research.google.com/)
- **Launch Command**:
  ```bash
  python launch.py --share --xformers --enable-insecure-extension-access
  ```
---
## III. Practice
### 1. Checkpoint Models
- Recommended Model: `chilloutmix_NiPrunedFp32Fix`
  - Download URL: [Hugging Face - ChilloutMix](https://huggingface.co/naonovn/chilloutmix_NiPrunedFp32Fix/tree/main)
  - CivitAI Page: [ChilloutMix Model Details](https://civitai.com/models/6424/chillout)
### 2. Quick Image Generation Tips
#### 2.1 Adjust Parameters to Find the Best Results
- **Basic Parameters**:
  - **Sampler**: `DPM++ 2M Karras`
  - **Seed**: Using the same value keeps the character consistent; if `Resize seed from width/height` is checked, consistency can be maintained even with different dimensions.
  - **Restore Faces**: Face restoration feature.
  - **HiRes.Fix**: Enhances image quality.
  - **CFG Scale**: Controls how much the generated image conforms to the prompt. The default value is 7 or 8.
- **Reference**: [Stable Diffusion Art Parameter Guide](https://stable-diffusion-art.com/automatic1111/)
#### 2.2 Efficient Image Generation
- **Batch Count**: Generates multiple times in a loop with the same configuration.
- **Batch Size**: Generates multiple images at once, making it easier to select the best ones.
#### 2.3 Upscaling Images to HD
- The built-in features are usually sufficient, but you can use the following tools to further improve clarity:
  - Tool URL: [Face-Real-ESRGAN](https://huggingface.co/spaces/doevent/Face-Real-ESRGAN)
#### 2.4 One-Click Image-to-Video
- Functionality not yet detailed.
### 3. Changing Image Poses
- **Plugin**: [ControlNet](https://github.com/Mikubill/sd-webui-controlnet)  
  ControlNet is a powerful extension for controlling the pose, layout, etc., of generated images.
### 4. Prompt Generators
- **Recommended Tools**:
  - [Krea.ai](https://krea.ai/)
  - [Promptomania](https://promptomania.com/)
### 5. Community Resources
- **Reddit Community**: [Stable Diffusion Reddit](https://www.reddit.com/r/StableDiffusion/)
---
## IV. Additional Notes
- **For Windows Users**: You can directly search for relevant tutorials; the installation process is relatively simple.
- **For Mac Users**: It is recommended to follow the steps above and adjust the environment configuration based on any error messages.
