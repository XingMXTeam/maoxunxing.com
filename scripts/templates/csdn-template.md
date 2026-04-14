# CSDN 发布模板
# CSDN 不支持 frontmatter,直接写 markdown 正文
# 在 CSDN 编辑器中手动设置: 标题、摘要、标签、分类

# ============ 文章开头 (第二层回链) ============

> **本文首发于 [maoxunxing.com](https://maoxunxing.com/node-event-loop-cpu-spike/)**,转载请注明出处。
> 更多 Node.js、AI 和前端工程深度文章,欢迎访问我的博客。

---

# Node.js CPU 飙高分析：请求挂起时事件循环如何被饿死

[正文从这里开始,粘贴你的中文 markdown 内容]

[注意事项:]
[1. Hugo shortcode 替换: {{< img >}} 改为标准 markdown ![alt](url)]
[2. {{< youtube ID >}} 改为完整 YouTube 链接: https://youtube.com/watch?v=ID]
[3. 图片路径改为绝对路径: https://maoxunxing.com/posts/xxx/image.png]
[4. CSDN 可能不支持某些 HTML 标签 (iframe 等),需要替换为链接]
[5. 去掉所有 Hugo 特有的 frontmatter]

# ============ 第三层回链: 正文中的自然内链 ============

# 在正文中自然位置插入对你其他文章的引用:

如果你对 AI 辅助开发感兴趣,可以看我的另一篇文章
[AI Coding 实战手册：工具选型、工作流与提示词模板](https://maoxunxing.com/zh-cn/ai-coding-practice/)。

我还写了一篇关于
[用 Karpathy 的方法构建个人知识库](https://maoxunxing.com/zh-cn/karpathy-knowledge-base-practice/)
的实践文章,介绍如何把技术学习组织成发布流水线。

# ============ 文章结尾 (作者信息 + 回链) ============

---

**作者**: Felix Mao (毛毛星)
**博客**: [maoxunxing.com](https://maoxunxing.com)
**GitHub**: [github.com/XingMXTeam](https://github.com/XingMXTeam/)
**Twitter**: [@maoxunxing](https://twitter.com/maoxunxing)

---

# ============ CSDN 编辑器设置备忘 ============
# 标题: Node.js CPU 飙高分析：请求挂起时事件循环如何被饿死
# 摘要: 生产环境中为什么 CPU 会在请求挂起时飙到 100%？两个真实案例分析超时和限流
# 标签: Node.js, JavaScript, 性能优化, 事件循环
# 分类: 后端开发 / Node.js
# 原文链接: https://maoxunxing.com/zh-cn/node-event-loop-cpu-spike/

# ============ 验证 canonical 标签 ============
# 发布后:
# 1. 打开文章页面
# 2. 右键 -> 查看页面源代码
# 3. Ctrl+F 搜索 "canonical"
# 4. 如果 <link rel="canonical" href="..."> 指向 CSDN 而非你的博客,
#    说明 CSDN 没有尊重你的 canonical 设置
# 5. 这种情况下,文章顶部的 "本文首发于" 链接就是你的主要回链
