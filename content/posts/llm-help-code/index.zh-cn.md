---
title: "如何写好提示词？"
description: "如何写好提示词"
date: 2024-07-07
images:
  - llm-help-code/a.jpg
---

以下是关于信息分类、信息提取、个性化回复以及总结的Prompt范例

## **信息分类**

### **任务描述**
您是一个银行客户服务机器人，需要根据客户提问的内容将其分类到预定义的类别中。如果提问无法归类到以下类别，则归为 `customer service`。

### **预定义类别**
- `card arrival`
- `change pin`
- `exchange rate`
- `country support`
- `cancel transfer`
- `charge dispute`

### **规则**
- 只需返回分类结果，无需解释或备注。
- 示例格式如下：

```shell
Inquiry: How do I know if I will get my card, or if it is lost?
Category: card arrival

Inquiry: I am planning an international trip to Paris and would like to know the exchange rate.
Category: exchange rate

Inquiry: What countries are getting support? I will be traveling soon.
Category: country support

Inquiry: Can I get help starting my computer? I am having difficulty.
Category: customer service
```

---

## **信息提取**

### **任务描述**
从提供的医疗记录中提取相关信息，并以 JSON 格式返回。

### **JSON Schema**
```json
{
    "age": {
        "type": "integer"
    },
    "gender": {
        "type": "string",
        "enum": ["male", "female", "other"]
    },
    "diagnosis": {
        "type": "string",
        "enum": ["migraine", "diabetes", "arthritis", "acne"]
    },
    "weight": {
        "type": "integer"
    }
}
```

### **示例输入**
```text
medical_notes: A 60-year-old woman diagnosed with arthritis weighs 150 pounds.
```

### **示例输出**
```json
{
    "age": 60,
    "gender": "female",
    "diagnosis": "arthritis",
    "weight": 150
}
```

---

## **个性化回复**

### **任务描述**
作为抵押贷款客户服务机器人，您的任务是根据提供的事实为客户问题创建个性化的电子邮件回复。确保回复清晰、简洁且直接解决问题，并以友好的专业语气结束邮件。

### **已知事实**
```text
30-year fixed-rate: interest rate 6.403%, APR 6.484%
20-year fixed-rate: interest rate 6.329%, APR 6.429%
15-year fixed-rate: interest rate 5.705%, APR 5.848%
10-year fixed-rate: interest rate 5.500%, APR 5.720%
7-year ARM: interest rate 7.011%, APR 7.660%
5-year ARM: interest rate 6.880%, APR 7.754%
3-year ARM: interest rate 6.125%, APR 7.204%
30-year fixed-rate FHA: interest rate 5.527%, APR 6.316%
30-year fixed-rate VA: interest rate 5.684%, APR 6.062%
```

### **示例输入**
```text
email:
Dear mortgage lender,
What's your 30-year fixed-rate APR, and how does it compare to the 15-year fixed rate?
Regards,
Anna
```

### **示例输出**
```text
Dear Anna,

Thank you for reaching out! Our 30-year fixed-rate APR is 6.484%. In comparison, the 15-year fixed-rate APR is 5.848%. While the 15-year option has a lower APR, it typically requires higher monthly payments due to the shorter loan term.

If you have any further questions or need assistance in choosing the best option for your needs, feel free to reach out!

Best regards,  
Lender Customer Support
```

---

## **总结**

### **任务描述**
作为评论员，您的任务是对一份新闻通讯进行分析并撰写报告。

### **步骤**
1. **总结**：用清晰简洁的语言总结新闻通讯的关键点和主题。
2. **提出有趣的问题**：生成三个独特且发人深省的问题，并对每个问题提供详细解答。
3. **撰写分析报告**：结合总结和问题的答案，创建一份综合报告。

---

### **示例模板**

#### **新闻通讯内容**
```text
newsletter:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Donec nec nisi euismod, vestibulum sapien vel, bibendum nisl. Sed auctor, nunc id aliquet tincidunt, justo felis ultricies lorem, vel feugiat velit eros vel lectus.
```

#### **总结**
```text
The newsletter discusses key trends in technology adoption, highlighting the rise of AI-driven solutions and their impact on various industries. It also touches upon challenges such as data privacy and workforce adaptation.
```

#### **有趣的问题**
1. **Q**: What are the main benefits of AI-driven solutions mentioned in the newsletter?  
   **A**: The newsletter highlights that AI-driven solutions improve efficiency, reduce costs, and enable better decision-making through data analysis.  
   **<Answer>**: Efficiency improvement, cost reduction, and enhanced decision-making.

2. **Q**: What challenges are associated with adopting AI technologies?  
   **A**: The newsletter mentions data privacy concerns and the need for workforce adaptation as significant challenges in adopting AI technologies.  
   **<Answer>**: Data privacy concerns and workforce adaptation.

3. **Q**: Which industries are most impacted by AI-driven solutions?  
   **A**: The newsletter suggests that healthcare, finance, and manufacturing are among the industries most impacted by AI-driven solutions.  
   **<Answer>**: Healthcare, finance, and manufacturing.

#### **分析报告**
```markdown
# 分析报告

## 总结
本期新闻通讯探讨了技术采用的主要趋势，重点介绍了人工智能（AI）驱动解决方案的兴起及其对各行业的影响。同时，提到了数据隐私和劳动力适应等挑战。

## 有趣的问题与解答

1. **AI 驱动解决方案的主要优势是什么？**  
   - **解答**：新闻通讯指出，AI 驱动解决方案可以提高效率、降低成本，并通过数据分析改善决策能力。  
   - **结论**：效率提升、成本降低、决策优化。

2. **采用 AI 技术面临哪些挑战？**  
   - **解答**：新闻通讯提到，数据隐私问题和劳动力适应需求是采用 AI 技术的主要挑战。  
   - **结论**：数据隐私问题和劳动力适应。

3. **哪些行业受 AI 驱动解决方案影响最大？**  
   - **解答**：新闻通讯认为，医疗保健、金融和制造业是受 AI 影响最大的行业。  
   - **结论**：医疗保健、金融、制造业。
