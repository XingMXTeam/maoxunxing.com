---
title: "AIGC 绘图/图片创作，还能这么玩！"
date: 2023-03-25
description: "以下是我积累的基本CSS编写原则，希望对你有帮助"
draft: true
tags:
- AI
- Stable Diffision
---

## 一、安装篇
mac安装stable diffusion web ui, 比较麻烦(见以下安装过程），windows直接网上搜就行


### 1、安装Homebrew

https://zhuanlan.zhihu.com/p/90508170

### 2、安装stable diffusion web ui

+ brew install cmake protobuf rust python@3.10 git wget  
+ git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui  
+ 安装模型 比如https://huggingface.co/andite/anything-v4.0/tree/main 选择 v4.5.ckpt  
+ 启动./webui.sh 访问http://127.0.0.1:7860/就行了  
  + --use-cpu 改用cpu算力 一般是GPU
  
MAC启动后generate生成图片时报错RuntimeError: "LayerNormKernelImpl" not implemented for 'Half' ：

+ 修改webui.sh: export COMMANDLINE_ARGS="--precision full --no-half --skip-torch-cuda-test"
+ 重新启动

更多：https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Installation-on-Apple-Silicon

## 二、理论篇

### lora模型
LORA能冻结预设好的模型权重参数，在每个Transformer注入可训练的层，建少了计算量。 可以帮助我们生成指定风格、面孔、动作等要求的图片

https://civitai.com/tag/lora



### colab（还未实践）
免费GPU：

https://colab.research.google.com/

启动：

python launch.py --share --xformers --enable-insecure-extension-access

## 三、实战篇
### 1、Checkpoint
chilloutmix_NiPrunedFp32Fix

https://huggingface.co/naonovn/chilloutmix_NiPrunedFp32Fix/tree/main

### 2、选好的模型
选这个：https://civitai.com/models/6424/chilloutmix
 
复制参数：


### 3、快速出图
3.1、调参数找到最佳：  
基本参数：  
DPM++ 2M Karras（采样器）  
seed: 填一样的值，能保持人物一样 但是图片尺寸不一样会导致出的图不一样。可以选择extra，勾选Resize seed from width/height保持一致。 骰子是随机seed的意思，绿色是复制seed  
restore faces：脸部问题修复  
hires.fix提升画质  
cfg scale:和你的图片的差别大不大 一般默认7、8  

更多资料：https://stable-diffusion-art.com/automatic1111/  

### 3.2、高效出图：
视电脑GPU配置:  
batch count: 同样的配置 循环跑几次  
batch size：一次出多少张，挑选出几张  

### 3.3、图片转高清：
一般内置有，可以通过以下工具进一步提高清晰度  
https://huggingface.co/spaces/doevent/Face-Real-ESRGAN

### 3.4、一键图片转视频


## 4、改变图片姿势
安装插件:  
GitHub - Mikubill/sd-webui-controlnet: WebUI extension for ControlNet

## 5、提示语生成器
krea.ai  

https://promptomania.com/

##  6、社区
https://www.reddit.com/r/StableDiffusion/

