---
title: "<How I Use LLM> 总结笔记"
date: 2025-03-04
tags:
  - AI
---

最近在 Youtube 上很火的一个视频<how i use llm>，作者是Andrej Karpathy，他是一位大神，摘录一下ChatGPT对他的介绍：

> Andrej Karpathy（安德烈·卡帕斯）是一位斯洛伐克裔加拿大计算机科学家，专长于人工智能、深度学习和计算机视觉领域。他于1986年10月23日出生在捷克斯洛伐克布拉提斯拉瓦，15岁时随家人移居加拿大多伦多。他在多伦多大学获得计算机科学和物理学学士学位，在英属哥伦比亚大学取得硕士学位，随后在斯坦福大学师从李飞飞教授，专攻计算机视觉与自然语言处理交叉领域，并于2015年获得博士学位。

> 职业生涯中，Karpathy曾是OpenAI的创始成员之一，专注于深度学习和计算机视觉研究。2017年，他加入特斯拉，担任人工智能和自动驾驶视觉总监，领导Autopilot计算机视觉团队，直接向埃隆·马斯克汇报。2022年7月，他离开特斯拉，并于2023年2月宣布重返OpenAI。

> 此外，Karpathy还积极从事教育工作，曾在斯坦福大学开设并主讲深度学习课程CS231n：卷积神经网络与视觉识别，深受学生欢迎。他也在个人YouTube频道上分享关于人工智能和深度学习的教育内容，致力于推动人工智能领域的发展和普及。

2个多小时的时长，介绍了如何使用LLM，以下是他用的草图:
{{< img src="image-1.png" alt="what is llm" align="center" >}}


原视频地址：
{{< video src="https://youtu.be/EWvNQjAaOHw" caption="How I Use LLM">}}

## 如何选择合适的模型，各大模型APP和对比

{{< img src="image.png" alt="LLM APP" maxWidth="350px" align="center" >}}

大模型竞技场和比较的两个常用网站
- [leaderboard1](https://lmarena.ai/?leaderboard) : Chatbot Arena LLM Leaderboard: Community-driven Evaluation for Best LLM and AI chatbots

- [leaderboard2](http://scale.com/leaderboard)

## ChatGPT 本质

Large Language Model (LLM) ~ 1TB lossy, probabilistic "zip file of the internet" (parameters store world knowledge, though usually out of date by few months)

大规模语言模型（LLM）~ 1TB有损、概率性的“互联网压缩文件”（参数存储了世界知识，但通常会滞后几个月）。

"Hi I am Chat6PT.
I am a 1 terabyte zip file.
My knowledge comes from the internet, which I read 6 months ago and remember only vaguely.
My winning personality was programmed, by example, by human labelers at OpenAI:)"

"你好，我是 ChatGPT。我是一个 1TB 的压缩文件。我的知识来源于互联网上的信息，这些信息是我 6 个月前阅读并只模糊记住的。我的迷人个性是由 OpenAI 的人类标注者通过Label标注编程的 :)"

pre-training: -$10M, 3 months of training on internet documents
post-training: much much cheaper finetuning with SFT, RLHF, RL on Conversations


预训练：耗资 1000 万美元，使用互联网上的文档进行 3 个月的训练

后训练：更便宜得多的微调，包括 SFT（监督微调）、RLHF（基于人类反馈的强化学习）以及对话强化学习

查看token的工具: 
[tiktokenizer](http://tiktokenizer.vercel.app/) 

## ChatGPT 的用法

ChatGPT本质上是Knowledge Based Query， 基于网络的很普遍的知识，不保证一定正确：

1、尽量简短的对话，如果是新话题建议新开聊天。因为`tokens`很贵，而且话题越长越容易出现错误  
2、选择不同的模型去处理不同的任务，比如Creation、Traveling这种，同时和不同的模型对话，看结果有何不同


## 模型的差异

1、思维模型 vs 通用模型： 思维模型擅长编程和数学，一般会比较耗时<think>，普通的常识性知识，没必要用这种模型  
2、sonnet 3.5 不是思维模型

## Tool Use

1. 网络搜索：搜索《白蓮花大飯店》最新季出来的时间
   -  what are the bigheadline news today ?  
   - 有用信息： 一个好用的隐私浏览器 brave隐私浏览器
2. DeepSearch：thinking + 网络搜索  
3. pdf 文档阅读：丢一个文档给llm让他总结  
4. 书籍阅读：《the wealth of nations》，把章节贴给llm， 然后让它总结一下和问一些问题，特别是那些不熟悉的领域  
5. 电脑程序：LLM 针对那些无法通过大脑计算回答的问题，会通过借助外部工具，不同llm有不同的外部工具  
   - 比如一个复杂的乘法，ChatGPT会通过python解释器得到结果，然后返回结果  
6. 数据分析：ChatGPT功能  
   - 比如研究 OpenAl 在一段时间内的估值（使用搜索工具），然后创建一个表格，输入每一年的估值。  
   - Now plot this. Use log scale for y axis 制作一张图  
   - dive deep: data analaysis with chatgpt  
7. Artifacts： Claude模型的功能 claudiartifacts.com  
   - Flashcards on Adam Smith's Life and Economic Theories ，然后从维基百科复制Adam Smith的内容  
   - Now use Artifacts feature to write a flashcards app to test me on these. 会生成一个APP  
8. 思维导图： 比较喜欢可视化的东西，对书的章节、代码等，通过这种方式能好的理解和memory  
   - We are reading The Wealth of Nations by Adam Smith, I am attaching Chapter 3 of Book 1. Please create a conceptual diagram of this chapter.  
9. Cursor Composer: vibe programming  
   - setup a new React14 starter project  
   - when either x or o win, i want confetti or something  制作一个撒花🎉的效果  
   - cmd + k: 内嵌聊天  
   - cmd + i：composer  
   - cmd + l: chat  

## modalities 模式

日常对话通过语音快速输入，60%场景  
语音转换为文本的方式沟通：

- 语音输入： superwhisper, wisperflow, macwisper
- 语音输出： app自带

另外是一种真语音模式： llm不会转换语音成文本，而是通过语音形式处理。只需要ChatGPT开启语音模式即可。

ChatGPT的语音模式经常会拒绝，比如模仿狐狸的音调，但是Grok APP的语音模式通常会直接按照你的要求跟你对话，比如

- which mode you remmend we try out ?
- romantic mode  浪漫模式
- let's flip to unhinged 发神经模式
- i am going to try the conspiracy mode 串谋模式
- let's try the sexy mode 

## podcast generation & interactive

- http://notebooklm.google.com/: 丢一些资源给他，自动生成音频。并且可打断和交互问问题。
  - 适合不适合阅读的场景比如途中开车，可以听一些自己感兴趣的领域。
- https://open.spotify.com/show/3K4LRyMCP44kBbiOziwJjb: histories of mysteries podcast 一些生成的音频上传到spotify

## 图片
see, ocr, ask about

- 上传图，让模型输出看到的东西，确保输出内容和图一致；问问题， 比如：Longevity Mix Bryan Johnson的一张营养图， ctr + command + shift + 4: mac截图
- 上传图，让模型对指定内容，输出特定格式，比如`latex格式`
- 上传图，对营养成分进行分析
- 解释`meme`图。meme中文是迷因，指「网络爆红事物」的意思

## 生成图

- `Dall - e` 
- ChatGTP: what are the bigheadline news today ? generate an image summarizes today.
- https://ideogram.ai/:  生成一些视频的封面

## 视频
 
- video input: advanced voice + video 可以通过开启视频，然后直接和模型对话，问一些问题
- video output: sora ...

## 大模型的memory feature

一般对话后，重新开chat，大模型对于之前的记忆会抹去（当然有时会自动触发记忆）。我们可以主动要求大模型记住，并且可以管理记忆。

- can you please remember this ? 这样会记住你们的对话

## custom instructions

{{< img src="image-2.png" alt="ChatGPT instructions" caption="ChatGPT instructions" maxWidth="450px" align="center" >}}

## custom chatgpt

chatgpt翻译比一般的翻译更好，比如https://papago.naver.com/ 。
我们可以自定义翻译能力，比如对句子拆分，逐字解释

{{< img src="image-3.png" alt="custom ChatGPT " caption="custom ChatGPT" maxWidth="450px" align="center" >}}

对电影的字幕进行解释:

{{< img src="image-4.png" alt="ChatGPT OCR" caption="ChatGPT OCR" maxWidth="450px" align="center" >}}

这里还有一个方案，就是用谷歌智能眼镜对文字ocr，然后丢给chatgpt

![alt text](image-5.png)