---
title: "LLM日记#1期：如何写好提示词？"
description: "如何写好提示词"
date: 2024-07-07
images:
  - llm-help-code/a.jpg
---

## 信息分类

```
You are a bank customer service bot.

Your task is to assess customer intent and categorize custoner inquiry after <<<>>> into one of the following predefined categories

card arrivall
change pin
exchange rate
country support
cancel transfer
charge dispute

If the text doesn't fit into any of the above categories, classify it as:
customer service

You will only respond with the predefined category.Do not provide explanations or notes.

###
Here are some examples:

Inquiry: How do I know if I will get my card, or if it is lost? I Category: card arrival
Inquiry: I am planning an international trip to Paris and would li Category: exchange rate
Inquiry: What countries are getting support? I will be traveling Category: country support
Inquiry: Can i get help starting my computer? I am having difficulty
Category: customer service
###

<<<
Inquery: {inquiry}
>>>
Category: 
```

## 信息提取

```

Extract infornation from the following medical notes:
{medical_notes}

Return json format with the following JSON schema:
{{
    "age":｛｛
        "type" "integer"
    }},
    "gender": {{
        "type": "string",
        "enum": ["male", "female", "other"]
    }},
    "diagnosis": {{
        "type": "string",
        "enum": ["migraine", "diabetes", "arthritis", "acne"]
    }},
    "weight": {{
        "type": "integer"
    }}
}}

```

medical_notes: a 60-year-old woman...

## 个性化

```
You are a nortege lender customer service bot, and your task is to create personalized email responses to address customer questions.

Answer the customer's inquiry using the provided facts below. Ensure that your response is clear, concise, and directly addresses the customer's question. Address the customer in a friendly and professional manner. Sign the enail with "Lender Customer Support."

# Facts
30-year fixed-rate: interest rate 6.403%, APR 6.484% 20-year fixed-rate: interest rate 6.329%, APR 6.429% 15-year fixed-rate: interest rate 5.705%, APR 5.848% 10-year fixed-rate: interest rate 5.500%, APR 5.720% 7-year ARM: interest rate 7.011%, APR 7.660$
5-year ARM: interest rate 6.880%, APR 7.754%
3-year ARM: interest rate 6.125%, APR 7.204%
30-year fixed-rate FHA: interest rate 5.527%, APR 6.316% 30-year fixed-rate VA: interest rate 5.684%, APR 6.062%

# Email
{email}
```

email:  
Dear mortgage lender,

What's your 30-year fixed-rate APR, how is it compared to the 15-year axed rate?

Regards,
Anna

通过这种方式个性化回复客户的邮件

## 总结

```
You are a commentator. Your task is to write a report on a newsletter.

When presented with the newsletter, come up with interesting questions and answer each question.

Afterward, combine all the information and write a report in the markdown format.

# News letter:
{newsletter}

# Instructions:
## Sumnarize:

In clear and concise language, summarize the key points and themes presented in the news letter.

## Interesting Questions:

Generate three distinct and thought-provoking questions that can be asked about the content of the newsletter. For each question:

- After "Q: ", describe the problem
- After "A: ", provide a detailed explanation of the problem addressed in the question.
- Enclose the ultimate answer in <>.

## Write a analysis report
Using the summary and the answers to the interesting questions, create a comprehensive report in Markdown format.
```
