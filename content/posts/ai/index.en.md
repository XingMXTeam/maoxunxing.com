---
title: "What You Need to Know About AI"
description: ""
date: 2024-07-07
tags:
  - AI
images:
  - ai/a.jpg
custom_toc:
  - title: "AI Cognition"
  - title: "How to Write Good Prompts"
  - title: "How to Use AI Well"
  - title: "Build Your Own Cursor"
  - title: "AI Tools and Resources"
---
## AI Cognition
Machine Learning > Artificial Neural Networks > Deep Learning > Large Models is an inclusive relationship.
### Machine Learning
Let's assume a case of calculating a score, where w is the final score, x is 1 for a hit feature, and 0 for a missed feature.
f(x) = wx, where w is the **parameter**. Training the model is to get this parameter, which is how to reasonably allocate weights. **Feature Engineering**: Convert feature x into a number, because some features are not necessarily numbers.
In machine learning, a **sample** is an example given to the machine (code) for training. The **label** is the result of the example. Learning with labels is **supervised learning**, and without labels is **unsupervised learning**.
Model pre-training:
1. Prepare samples -> Collect data
2. Feature engineering: Get x
3. Design the model: f(x) = wx -> Learning plan
4. Train the model: Get y -> Learning process
5. Evaluate
Text feature extraction:
**Vector**: Something like [1 0 0 0 0 0]. A vector with only one 1 is called one-hot. If the vocabulary has 50,000 words and "apple" is the 3rd word → the vector is [0,0,1,0,...,0] (length 50,000, only the 3rd position is 1).
**Embedding**: Essentially also a vector, it's an optimization of the one-hot vector: it no longer uses only 0 and 1 to represent data, but has a semantic representation for words in the text; it compresses the dimension of the vector.
Model tasks: **Regression** represents non-enumerable tasks, with continuous numerical output; enumerable tasks are **classification**, with discrete label output.
Model selection: LR model
Model training: **Fitting** is the phenomenon of infinitely approaching, meaning the computer's **calculated** result must be consistent with the labeled result. A good model should have **generalization** ability, rather than **overfitting** or **underfitting**.
**Hyperparameters** are parameters not learned by the model, but adjusted manually. They can control the model's learning speed and performance, such as learning epochs/batch size/learning rate/optimization algorithm/loss function.
A typical learning process:
Divide the data/problems into batches, learn them, then test and validate (loss) to see what went wrong. Then the optimization algorithm tells you where you went wrong and how to adjust your learning approach (parameters), and you continue learning. Until all problems are learned (1 epoch).
If it's not enough, repeat for another round.
Dataset classification: Training set, Validation set, Test set
Training effect validation: k-fold validation
Testing: Use a **confusion matrix** to determine if the model passes the test. Core metrics are acc, f1, auc.
LR Model: A classic classification model. Simply put, it determines which category the input data belongs to by calculating probabilities (e.g., determining if an email is "spam" or "not spam"). It has strong interpretability; the weight w and its sign directly reflect the impact on the result.
### Deep Learning
relu: Rectified Linear Unit activation function
**Activation functions are like "smart switches"**
It determines whether a neuron (a small computing unit in a neural network) should pass on the signal it receives. For example:
- If the signal is strong, the switch turns on, letting the signal pass;
- If the signal is weak, the switch turns off, blocking the signal.
**Why is it needed?**
1.  **Adding "non-linearity"**: Without activation functions, a neural network can only handle simple problems like linear separation (e.g., drawing a straight line to distinguish red and blue dots). With it, it can handle complex problems like curves, images, and language.
2.  **Controlling the output range**: For example, some activation functions limit the output to between 0 and 1 (like a switch), while others allow negative numbers (like a two-way switch).
**Common Activation Functions**
1.  **Sigmoid**: Compresses the input to 0~1, similar to "probability" (but can easily lead to vanishing gradients, so it's used less now).
    → For example, to determine "is it a cat?", an output of 0.8 means there's an 80% chance it's a cat. The sigmoid tool turns Linear Regression into Logistic Regression.
2.  **ReLU**: Simple and direct—outputs the input as is if it's greater than 0, and outputs 0 if it's less than 0 (most commonly used, alleviates vanishing gradients).
    → For example, input 10, output 10; input -5, output 0.
3.  **Tanh**: Similar to Sigmoid, but the output range is -1~1 (suitable for scenarios requiring negative values).
**Analogy**:
Imagine you are a plumber, and the neural network is a bunch of pipes. The activation function is the valve at each connection—some valves only allow water to flow in one direction (ReLU), others can adjust the flow rate (Sigmoid), so the entire pipe system can flexibly adapt to different terrains (complex data).
MLP: Multi-layer Perceptron, a feedforward neural network (the opposite is a recurrent neural network, RNN).
Input a picture of a cat → The hidden layer analyzes features like ear shape, whiskers, etc. → The output layer determines "it's a cat".
MLP adds **hidden layers and activation functions**, breaking through linear limitations and enabling it to fit more complex functions.
Representation Learning:
Image representation -> CNN. A sentence is essentially N * 1 data, with a sliding window to extract tokens. An image is N * M.
Text representation -> word2vec
- Window size: Assume 2N+1 (e.g., if N=2, the window size is 5 words).
- **CBOW mode (Continuous Bag-of-Words)**:
  - **Input**: The context words within the window, excluding the center word (2N words in total).
  - **Output (Target)**: Predict the center word.
  - **Processing method**: The vectors of all input context words are averaged to serve as the overall input feature.
  - **Example**:
    Sentence: "Today/the weather/is sunny/and suitable/for a walk"
    Window slides to "the weather/is sunny/and suitable" → Input "the weather" and "and suitable", output target "is sunny".
- **Skip-gram mode**:
  - **Input**: The center word.
  - **Output (Target)**: Predict all context words within the window (2N words).
  - **Example**:
    In the same sentence, input "is sunny", output predictions "the weather" and "and suitable".
The model automatically adjusts **word vectors**. Imagine you are teaching a robot to shoot a basketball.
The robot initially shoots randomly (word vectors are randomly initialized).
After each shot, you tell it how far it missed the target (calculate the loss function).
The robot automatically adjusts its arm angle based on the deviation (backpropagation updates parameters).
After repeated practice, the shooting becomes more and more accurate (word vectors are gradually optimized).
This also explains why a large amount of computation and many chips are needed.
Graph representation: deepwalk and gcn
MLP alone cannot handle time-series data: each input sample is processed independently, unable to retain previous context information.
- Inputting the sentence "I like to eat apples", if MLP inputs each word separately, it cannot know that "eat" comes before "apples", and might misinterpret it as the electronics company "Apple Inc.".
RNN/LSTM and Transformer are excellent in their ability to handle time-series data.
RNN: encoder-decoder, understands first then outputs, not understanding while outputting.
Transformer (from seq2seq) uses a self-attention mechanism and Multi-head Attention: A Transformer is a component; multiple components are like multiple friends giving advice.
Encoder-Decoder:
The Encoder reads the entire sentence and generates a summary vector.
When translating, the Decoder might confuse the positional relationship between "capybara" and "animal".
Attention Mechanism:
When translating "capybara", the model automatically pays attention to "水豚" (capybara) in the input;
When translating "is an animal", it pays attention to "动物" (animal).
Transformer creation:
one-shot, then input the feature data into self-attention for representation learning, then output to MLP for learning, and finally use a linear layer to compress and softmax to determine the probability of words.
1.  **"One-Shot Input"**
    -   Input the entire sequence at once (rather than word by word).
    -   **Actual Mechanism**:
        -   ✅ **Parallelism**: The Transformer processes all words at all positions in parallel (e.g., the entire input sentence is processed simultaneously), which is correct.
        -   ❌ **"One-Shot" Terminology**: Technically, a more accurate term is **"Non-Autoregressive"** or **"Parallel Input"**, but the core idea is the same.
2.  **"Input to Self-Attention for Representation Learning"**
    -   Use the self-attention mechanism to learn contextual features.
    -   **Actual Mechanism**:
        -   ✅ **Self-Attention**: The core component, which dynamically aggregates global information by calculating the association weights between words (e.g., "cat" pays attention to "eat" and "fish").
        -   🔄 **Multi-Head Attention**: In practice, it is split into multiple "heads" (e.g., 8), each learning different attention patterns, and the results are concatenated.
        -   ❗ **Positional Encoding**: Positional encoding (e.g., sine waves) must be added before input, otherwise the model cannot perceive word order (e.g., "cat chases dog" and "dog chases cat" would be treated as the same).
3.  **"Output to MLP for Learning"**
    -   Use a multi-layer perceptron (MLP) to further learn features.
    -   **Actual Mechanism**:
        -   ✅ **Feed-Forward Network (FFN)**: Each attention layer is followed by an FFN (i.e., MLP), which usually contains two linear layers and an activation function (e.g., ReLU) for non-linear transformation.
        -   🔄 **Residual Connection & Layer Normalization**: The output of each sub-layer (attention or FFN) is added to its input (residual connection), and then passed through layer normalization (LayerNorm) to prevent gradient vanishing and accelerate convergence.
4.  **"Linear Compression + Softmax to Determine Word Probability"**
    -   Use a linear layer to map to the vocabulary size, and Softmax to generate a probability distribution.
    -   **Actual Mechanism**:
        -   ✅ **Linear Projection**: The hidden state output from the last layer is compressed to the vocabulary dimension through a linear layer (e.g., `d_model → vocab_size`).
        -   ✅ **Softmax**: Outputs the probability of each word, used for predicting the next word.
Related concepts:
**Residual Connection and Layer Normalization**
-   **Problem Background**: The deeper the network, the more likely gradients are to vanish (during backpropagation, the gradient approaches zero, preventing parameter updates).
-   **Residual Connection**: Adds the input directly to the output of the attention layer (i.e., `output = input + attention_result`).
    -   **Function**: It's like creating a "green channel" for the gradient, preventing it from vanishing in deep networks.
-   **Layer Normalization**: Normalizes the output of each layer (mean 0, variance 1) to stabilize the training process.
    -   **Analogy**: It's like a teacher standardizing scores before an exam to make the distribution of different students' scores more stable.
**Positional Encoding**
-   **Problem Background**: The Transformer lacks the recurrent structure of an RNN and cannot naturally perceive word order (e.g., "cat chases dog" and "dog chases cat" have different meanings).
-   **Solution**: Number the position of each word (e.g., 1st, 2nd, 3rd word), generate a position vector, and add it to the word embedding.
    -   **Intuitive Understanding**: It's like putting a "coordinate sticker" on each word to tell the model where it appears in the sequence.
    -   **Formula**: Uses sine/cosine functions to generate positional encodings, ensuring the model can handle sequences of any length.
**Masked Multi-Head Attention**
-   **Problem Background**: In generation tasks (like translation, text generation), when predicting the `t`-th word, the decoder cannot see the subsequent words (otherwise it's cheating).
-   **Solution**: When calculating attention weights, a "mask" (set to negative infinity) is applied to subsequent positions, making their weights 0 after Softmax.
    -   **Example**: When generating "I love cats", to predict "cats", it can only see "I" and "love", not "cats" itself.
**transformer** is an algorithm, but in practical applications, the Transformer needs to be combined with hardware (like GPU/TPU), distributed training frameworks, efficient computing libraries (like CUDA), and other engineering optimizations to run efficiently. And its actual implementation (like GPT, BERT) requires engineering effort.
The Encoder is responsible for understanding the input, the Decoder is responsible for generating the output, and the two collaborate to complete complex tasks (like translation).
### Pre-trained Models
Unsupervised learning models.
The problem with NLP: lack of generalization ability.
Generative Pre-training is where the name GPT comes from.
GPT-2: zero-shot, directly appends the task description to the input text via a prompt to guide the model to generate output that meets the task requirements.
GPT-3: few-shot
ChatGPT: InstructGPT, a model aligned with instructions, with added safety. Introduced RLHF (Reinforcement Learning from Human Feedback).
  - SFT (Supervised Fine-Tuning) -> Fine-tune the pre-trained large model with high-quality, manually annotated question-answer data, similar to "teacher-led instruction".
  - RM (Reward Model) -> Train a scoring model that can judge the quality of answers (e.g., using human preference ranking data for answers), which is equivalent to establishing "scoring criteria".
  - PPO (Reinforcement Learning) -> Let the SFT model generate multiple answers, use the RM model's score as a feedback signal, and continuously optimize through reinforcement learning algorithms, similar to a "student constantly improving based on feedback".
GPT-o1: CoT (Chain of Thought), the model generates the chain of thought itself without human guidance. This is a reasoning large model.
**Scaling law**: The larger the scale, the better the effect, but there are limits.
**test-time scaling law**: The larger the amount of inference computation, the better the effect.
DeepSeek R1: Underneath are multiple models.
## Feasibility + Roadmap
The data processing architecture + system engineering + application paradigm is uncertain, which is an opportunity for small entrepreneurs to supplement what models can't do. At the bottom are many models. But the paradigm of models and algorithms is determined, which is what large enterprises do. The effect of small models distilled from large models is not as good as training small models from scratch.
Data crawling - cleaning - then making an application (Cursor has an integrated agent, not just model knowledge and reasoning, but capabilities).
Don't be limited by paradigms: instead, consider what it can do, experience it. For example, identify intent through a model, then use an image matting tool to achieve image matting, and then use xx to achieve something else. This is a pipeline. Full-stack data + engineering + algorithm can be done. The capability doesn't have to be 100%; 50% is OK. My bottom line is low, I can improve it regardless of others. It doesn't have to be a large language model.
FaaS is a service, or serverless is a service, so text can also become a service: push 5 AI messages to me every day, only in English and... finally execute the task, then publish to a public account, it can become a service. You can implement the code yourself and make it a service. Code is productivity.
Choose a vertical scenario, not a single-point solution.
## agent vs copilot
An agent has environmental awareness, makes plans, executes tasks, and then achieves goals (driver). A copilot is an assistant; you give instructions, and it helps you complete tasks. This requires prompt ability, exploration, and business scenario ability.
The model cannot answer all questions, for example, what was the time during training, there are knowledge gaps, it definitely can't answer. ->
So it usually needs to be combined with an API to answer (compound AI sys / agentic system) -> a fixed pipeline.
## Paradigm
- Agents -> LLM makes decisions dynamically based on task goals and environmental information, the process is uncertain.
- Single agent
- Multi-agent: master-slave mode (master plans and assigns tasks) / equal collaboration mode (all can make decisions, decide who does what).
- computer use / web agent: automated test instructions are automatically generated. The difference is that the instructions are dynamically generated by the agent.
## 1. **Statistics + Data ≠ True Intelligence**
### 1.1 Limitations of Being Data-Driven
- **Reliance on statistical models**: Many current artificial intelligence systems are primarily based on statistics and big data analysis, training models with massive amounts of data to complete specific tasks.
- **Lack of true understanding**: Although these systems can handle complex problems, they do not possess human-like "understanding." They merely generate output based on input data, without being able to explain "why they do it."
### 1.2 The Black Box Problem
- **Lack of interpretability**: With the development of technologies like deep learning, the decision-making process of artificial intelligence has become increasingly complex, to the point where even human developers cannot fully understand its internal mechanisms.
- **Crisis of trust**: This "black box" characteristic poses challenges for the application of artificial intelligence in certain critical fields (such as medicine and law).
## 2. **Levels of Artificial Intelligence**
To better understand the composition and application of artificial intelligence, it can be divided into the following five levels:
### 2.1 Infrastructure
- **Hardware support**: Includes high-performance computing devices (such as GPUs, TPUs), cloud computing platforms, and sensors.
- **Data resources**: Massive data is the foundation of artificial intelligence, and the quality and diversity of data directly affect the model's performance.
### 2.2 Algorithms
- **Core logic**: Algorithms are the core of artificial intelligence, determining how the system operates. Common algorithms include machine learning, deep learning, and reinforcement learning.
- **Optimization and innovation**: Continuously optimizing existing algorithms and developing new ones is key to advancing artificial intelligence.
### 2.3 Technology
- **General capabilities**: This level focuses on the specific technical implementations of artificial intelligence, such as natural language processing (NLP), computer vision, and speech recognition.
- **Cross-domain integration**: These technologies can be applied to multiple industries and provide technical support for subsequent solutions.
### 2.4 Technical Points
- **Subdivided functions**: Technical points are a further refinement of technology, such as sentiment analysis, image segmentation, and recommendation systems.
- **Modular design**: Decomposing complex technologies into independent functional modules facilitates development and integration.
### 2.5 Industry Solutions
- **Scenario implementation**: The ultimate goal is to apply artificial intelligence technology to specific industry scenarios, such as smart healthcare, autonomous driving, and fintech.
- **Customized services**: Provide targeted solutions based on the needs of different industries to solve practical problems.
## What GPT Can Do
### Core Capabilities
- **Teaching and clarifying doubts**
  - Selfless, patient, and able to provide clear and easy-to-understand answers.
  - Capable of analogy, prediction, and step-by-step output, suitable for teaching and guidance scenarios.
### Advanced Capabilities
- **Understanding complex ideas**
  - Language translation, translation of tone and style, cross-domain translation.
  - Understanding complex concepts (like human jokes) and generating related content.
- **Spatial and Visual Abilities**
  - Can generate images that meet expectations when combined with tools (like Stable Diffusion).
  - Can generate stick figures or simple visual content from text descriptions.
- **3D Modeling Capabilities**
  - Supports generating or describing basic information about 3D models.
- **Code Understanding Capabilities**
  - Able to combine tools in multiple steps to realize user intent and provide solutions.
- **Mathematical Abilities**
  - Solves problems correctly, supporting basic to medium-difficulty math problems.
- **Interacting with the World**
  - Can call APIs, send emails, browse the web, etc., possessing certain task execution capabilities.
- **Physical Interaction**
  - Although unable to see or perform actions directly, it can understand the environment, tasks, actions, and feedback through a language interface.
- **Interacting with Humans**
  - Strong ability to infer the mental states of others, able to generate content that meets human expectations based on context.
## GPT's Flaws
Despite its powerful functions, GPT still has some limitations:
- **Lack of Planning**
  - Lacks global planning ability in text generation, especially weak in tasks requiring mental calculation or multi-step reasoning (an inherent limitation of autoregressive models).
- **Fixed Model**
  - Once a model is trained, it cannot quickly learn or generalize from experience, lacking dynamic adjustment capabilities.
- **Insufficient Causal Reasoning**
  - For problems requiring abductive reasoning, the model may not be able to provide accurate answers.
## How to Interact with GPT
1.  **Structuring Unstructured Data**
    -   Transform complex, vague requirements into clear, structured input to improve the model's understanding and output quality.
2.  **One-shot Learning**
    -   Provide background knowledge and known conditions, clearly state the solution goal, to help the model quickly generate a solution.
3.  **Combining with External Tools**
    -   Use API calls, plugins, or other tools to extend GPT's functionality and solve complex problems in specific domains.
## Where Are the Future Opportunities
### AI Opportunities
- **Rapid Digitization**
  - Reduce the cost of physical modeling, transforming unstructured data into structured data.
- **Assistant Revolution**
  - Everything can be approached from an "assistant" perspective, focusing on solving problems rather than purely pursuing cheapness or efficiency.
### Douyin vs. Kuaishou Case
- Douyin's success lies in allowing ordinary users to quickly publish content with video + audio, rather than relying on algorithm optimization. This illustrates the huge potential of simple, easy-to-use tools in high-frequency scenarios.
## Scenario Characteristics
- **Broadness**
  - Application scenarios cover multiple fields, including education, healthcare, entertainment, etc.
- **High-frequency Use**
  - User needs are frequent, allowing for rapid feedback.
- **Rapid Feedback**
  - Output results are immediately visible, facilitating iterative optimization.
- **Clear Objective Function**
  - Each interaction has a clear goal, reducing ambiguity.
- **Low to Medium Decision-making Dimensions**
  - Most tasks do not require complex multi-dimensional decision-making, which is suitable for the current capabilities of AI.
## Why is GPT so Powerful
### Language Model Based on Probability and Features
- GPT models based on probability and features, rather than traditional tokenization methods. For example, its ability to recognize patterns like "我在北京天(安门)天(气)" (I am in Beijing, Tian(anmen) / Tian(qi)-weather) reflects its deep understanding of language structure.
### Language Carries Wisdom
- Language is the carrier of human wisdom. GPT compresses and learns this information through a multi-layer structure, thus possessing cross-domain understanding and generation capabilities.
### Two Current Main Modes
1.  **Fine-tune**
    -   No labeling, adapts to specific tasks through fine-tuning.
2.  **Hypertext Model**
    -   The knowledge base does not require fine-tuning; it directly uses the pre-trained model to generate content.
### Possibility of Long-chain
- Long-chain (long-chain reasoning) may be a future development direction, further enhancing the model's performance in complex tasks.
---
## How to Write Good Prompts
The following are prompt examples for information classification, information extraction, personalized replies, and summarization.
## **Information Classification**
### **Task Description**
You are a bank customer service bot that needs to classify customer inquiries into predefined categories. If an inquiry cannot be classified into the following categories, classify it as `customer service`.
### **Predefined Categories**
- `card arrival`
- `change pin`
- `exchange rate`
- `country support`
- `cancel transfer`
- `charge dispute`
### **Rules**
- Only return the classification result, without explanation or notes.
- The example format is as follows:
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
## **Information Extraction**
### **Task Description**
Extract relevant information from the provided medical records and return it in JSON format.
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
### **Example Input**
```text
medical_notes: A 60-year-old woman diagnosed with arthritis weighs 150 pounds.
```
### **Example Output**
```json
{
  "age": 60,
  "gender": "female",
  "diagnosis": "arthritis",
  "weight": 150
}
```
## **Personalized Reply**
### **Task Description**
As a mortgage customer service bot, your task is to create a personalized email reply to a customer's question based on the provided facts. Ensure the reply is clear, concise, directly addresses the question, and ends with a friendly, professional tone.
### **Known Facts**
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
### **Example Input**
```text
email:
Dear mortgage lender,
What's your 30-year fixed-rate APR, and how does it compare to the 15-year fixed rate?
Regards,
Anna
```
### **Example Output**
```text
Dear Anna,
Thank you for reaching out! Our 30-year fixed-rate APR is 6.484%. In comparison, the 15-year fixed-rate APR is 5.848%. While the 15-year option has a lower APR, it typically requires higher monthly payments due to the shorter loan term.
If you have any further questions or need assistance in choosing the best option for your needs, feel free to reach out!
Best regards,
Lender Customer Support
```
## **Summarization**
### **Task Description**
As a commentator, your task is to analyze a newsletter and write a report.
### **Steps**
1.  **Summarize**: Summarize the key points and themes of the newsletter in clear and concise language.
2.  **Ask Interesting Questions**: Generate three unique and thought-provoking questions, and provide a detailed answer for each.
3.  **Write an Analysis Report**: Create a comprehensive report by combining the summary and the answers to the questions.
### **Example Template**
#### **Newsletter Content**
```text
newsletter:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Donec nec nisi euismod, vestibulum sapien vel, bibendum nisl. Sed auctor, nunc id aliquet tincidunt, justo felis ultricies lorem, vel feugiat velit eros vel lectus.
```
#### **Summary**
```text
The newsletter discusses key trends in technology adoption, highlighting the rise of AI-driven solutions and their impact on various industries. It also touches upon challenges such as data privacy and workforce adaptation.
```
#### **Interesting Questions**
1.  **Q**: What are the main benefits of AI-driven solutions mentioned in the newsletter?
    **A**: The newsletter highlights that AI-driven solutions improve efficiency, reduce costs, and enable better decision-making through data analysis.
    **<Answer>**: Efficiency improvement, cost reduction, and enhanced decision-making.
2.  **Q**: What challenges are associated with adopting AI technologies?
    **A**: The newsletter mentions data privacy concerns and the need for workforce adaptation as significant challenges in adopting AI technologies.
    **<Answer>**: Data privacy concerns and workforce adaptation.
3.  **Q**: Which industries are most impacted by AI-driven solutions?
    **A**: The newsletter suggests that healthcare, finance, and manufacturing are among the industries most impacted by AI-driven solutions.
    **<Answer>**: Healthcare, finance, and manufacturing.
#### **Analysis Report**
````markdown
# Analysis Report
## Summary
This newsletter discusses the main trends in technology adoption, focusing on the rise of Artificial Intelligence (AI)-driven solutions and their impact on various industries. It also mentions challenges such as data privacy and workforce adaptation.
## Interesting Questions and Answers
1.  **What are the main advantages of AI-driven solutions?**
    -   **Answer**: The newsletter points out that AI-driven solutions can improve efficiency, reduce costs, and enhance decision-making capabilities through data analysis.
    -   **Conclusion**: Efficiency improvement, cost reduction, decision optimization.
2.  **What are the challenges in adopting AI technologies?**
    -   **Answer**: The newsletter mentions that data privacy issues and the need for workforce adaptation are major challenges in adopting AI technologies.
    -   **Conclusion**: Data privacy issues and workforce adaptation.
3.  **Which industries are most affected by AI-driven solutions?**
    -   **Answer**: The newsletter suggests that healthcare, finance, and manufacturing are the industries most affected by AI.
    -   **Conclusion**: Healthcare, finance, manufacturing.
## Article Summary
> Model selection: https://chat.qwenlm.ai/c/e4fd1d21-0e7f-47e7-be50-875099f35f3e
```text
Help me organize this into a better markdown format (add a table of contents if the content is long). Please ensure no content is lost, and you can make small additions. Organize all content in Markdown format so I can copy and use it directly. Please answer in Chinese.
```
````
## Book Report Summary
> Model selection: https://chat.qwenlm.ai/c/e4fd1d21-0e7f-47e7-be50-875099f35f3e
```text
Help me organize this into a better markdown format. Please ensure no content is lost, and you can make small additions. Organize all content in Markdown format so I can copy and use it directly. Please answer in Chinese.
Format requirements:
A 50-word summary
<!--more-->
---
## What I Liked
## What I Disliked
## Key Takeaways
```
## Code Reading
What function does this code implement? Please provide a detailed introduction, draw a colored table or generate a visualization to aid understanding. And output a minimal runnable code snippet, without error handling, boundary case handling, or logging.
---
## How to Use AI Well
A recent popular video on YouTube, <how i use llm>, is by Andrej Karpathy, a great mind. Here is ChatGPT's introduction to him:
> Andrej Karpathy is a Slovak-Canadian computer scientist specializing in artificial intelligence, deep learning, and computer vision. He was born on October 23, 1986, in Bratislava, Czechoslovakia, and moved with his family to Toronto, Canada, at the age of 15. He earned his bachelor's degree in computer science and physics from the University of Toronto and his master's degree from the University of British Columbia. He then studied under Professor Fei-Fei Li at Stanford University, specializing in the intersection of computer vision and natural language processing, and received his Ph.D. in 2015.
> In his career, Karpathy was a founding member of OpenAI, focusing on deep learning and computer vision research. In 2017, he joined Tesla as the Director of AI and Autopilot Vision, leading the Autopilot computer vision team and reporting directly to Elon Musk. He left Tesla in July 2022 and announced his return to OpenAI in February 2023.
> Additionally, Karpathy is actively involved in education. He created and taught the deep learning course CS231n: Convolutional Neural Networks for Visual Recognition at Stanford University, which was very popular among students. He also shares educational content about artificial intelligence and deep learning on his personal YouTube channel, dedicated to promoting the development and popularization of the AI field.
The video, over 2 hours long, introduces how to use LLMs. Here is the sketch he used:
{{< img src="image-1.png" alt="what is llm" align="center" >}}
Original video address:
{{< video src="https://youtu.be/EWvNQjAaOHw" caption="How I Use LLM">}}
## How to choose the right model, major model APPs and comparisons
{{< img src="image.png" alt="LLM APP" maxWidth="350px" align="center" >}}
Two popular websites for large model arenas and comparisons
- [leaderboard1](https://lmarena.ai/?leaderboard) : Chatbot Arena LLM Leaderboard: Community-driven Evaluation for Best LLM and AI chatbots
- [leaderboard2](http://scale.com/leaderboard)
## The Essence of ChatGPT
Large Language Model (LLM) ~ 1TB lossy, probabilistic "zip file of the internet" (parameters store world knowledge, though usually out of date by a few months)
"Hi I am Chat6PT.
I am a 1 terabyte zip file.
My knowledge comes from the internet, which I read 6 months ago and remember only vaguely.
My winning personality was programmed, by example, by human labelers at OpenAI:)"
"Hello, I am ChatGPT. I am a 1TB compressed file. My knowledge comes from information on the internet, which I read 6 months ago and only remember vaguely. My charming personality was programmed by human labelers at OpenAI through Label annotation :)"
pre-training: -$10M, 3 months of training on internet documents
post-training: much much cheaper finetuning with SFT, RLHF, RL on Conversations
Pre-training: costs $10 million, 3 months of training on internet documents
Post-training: much cheaper fine-tuning, including SFT (Supervised Fine-Tuning), RLHF (Reinforcement Learning from Human Feedback), and Reinforcement Learning on Conversations
Tool for checking tokens:
[tiktokenizer](http://tiktokenizer.vercel.app/)
## How to Use ChatGPT
ChatGPT is essentially Knowledge-Based Query, based on very common knowledge from the web, not guaranteed to be correct:
1. Keep conversations as short as possible. If it's a new topic, it's recommended to start a new chat. Because `tokens` are expensive, and the longer the topic, the more likely errors are to occur.
2. Choose different models to handle different tasks, such as Creation, Traveling. At the same time, talk to different models to see how the results differ.
## Model Differences
1. Thinking model vs. General model: Thinking models are good at programming and math, and usually take more time <think>. For common sense knowledge, there is no need to use this type of model.
2. sonnet 3.5 is not a thinking model.
## Tool Use
1.  Web search: Search for the release date of the latest season of "The White Lotus".
    -   what are the bigheadline news today ?
    -   Useful info: a good privacy browser, Brave.
2.  DeepSearch: thinking + web search.
3.  PDF document reading: Give a document to an LLM and ask it to summarize.
4.  Book reading: "The Wealth of Nations", paste chapters to the LLM, then ask it to summarize and ask some questions, especially in unfamiliar areas.
5.  Computer programs: For questions that cannot be answered by mental calculation, LLMs will use external tools. Different LLMs have different external tools.
    -   For example, for a complex multiplication, ChatGPT will get the result through a Python interpreter and then return the result.
6.  Data analysis: ChatGPT function
    -   For example, research the valuation of OpenAI over a period of time (using a search tool), then create a table and enter the valuation for each year.
    -   Now plot this. Use log scale for y axis.
    -   dive deep: data analysis with chatgpt
7.  Artifacts: A feature of the Claude model, claudiartifacts.com
    -   Flashcards on Adam Smith's Life and Economic Theories, then copy Adam Smith's content from Wikipedia.
    -   Now use the Artifacts feature to write a flashcards app to test me on these. It will generate an APP.
8.  Mind maps: I prefer visual things. For book chapters, code, etc., this method allows for better understanding and memory.
    -   We are reading The Wealth of Nations by Adam Smith, I am attaching Chapter 3 of Book 1. Please create a conceptual diagram of this chapter.
9.  Cursor Composer: vibe programming
    -   setup a new React14 starter project
    -   when either x or o win, i want confetti or something.
    -   cmd + k: inline chat
    -   cmd + i: composer
    -   cmd + l: chat
## modalities
Daily conversations are quickly input via voice, in 60% of scenarios.
Communicating by converting speech to text:
-   Voice input: superwhisper, wisperflow, macwisper
-   Voice output: built-in app feature
Another is a true voice mode: the LLM does not convert voice to text, but processes it in voice form. Just enable voice mode in ChatGPT.
ChatGPT's voice mode often refuses, for example, to imitate the tone of a fox, but the Grok APP's voice mode will usually talk to you as you request, for example:
-   which mode you recommend we try out ?
-   romantic mode
-   let's flip to unhinged mode
-   i am going to try the conspiracy mode
-   let's try the sexy mode
## podcast generation & interactive
-   http://notebooklm.google.com/: Give it some resources, and it will automatically generate audio. And you can interrupt and ask questions interactively.
    -   Suitable for non-reading scenarios like driving, where you can listen to topics you are interested in.
-   https://open.spotify.com/show/3K4LRyMCP44kBbiOziwJjb: histories of mysteries podcast, some generated audio uploaded to Spotify.
## Images
see, ocr, ask about
-   Upload an image, let the model output what it sees, ensure the output content is consistent with the image; ask questions, for example: a nutrition chart of Longevity Mix Bryan Johnson, ctr + command + shift + 4: mac screenshot
-   Upload an image, let the model output specified content in a specific format, for example, `latex format`
-   Upload an image, for nutritional analysis
-   Explain a `meme` image. The Chinese for meme is 迷因, which means "internet phenomenon".
## Generating Images
-   `Dall - e`
-   ChatGTP: what are the bigheadline news today ? generate an image summarizes today.
-   https://ideogram.ai/: generate some video covers
## Video
-   video input: advanced voice + video, you can turn on the video and talk directly to the model, ask some questions
-   video output: sora ...
## LLM's memory feature
Generally, after a conversation, if you start a new chat, the LLM's memory of the previous conversation will be erased (of course, sometimes memory is triggered automatically). We can actively ask the LLM to remember, and we can manage the memory.
-   can you please remember this ? This will make it remember your conversation.
## custom instructions
{{< img src="image-2.png" alt="ChatGPT instructions" caption="ChatGPT instructions" maxWidth="450px" align="center" >}}
## custom chatgpt
ChatGPT's translation is better than general translators, for example, https://papago.naver.com/.
We can customize the translation ability, for example, by splitting sentences and explaining them word by word.
{{< img src="image-3.png" alt="custom ChatGPT " caption="custom ChatGPT" maxWidth="450px" align="center" >}}
Explaining movie subtitles:
{{< img src="image-4.png" alt="ChatGPT OCR" caption="ChatGPT OCR" maxWidth="450px" align="center" >}}
Here is another solution, using Google smart glasses to OCR text, and then feeding it to ChatGPT.
![alt text](image-5.png)
---
## Build Your Own Cursor
Install the vscode plugin:
![alt text](image-6.png)
Cline plugin
---
## AI Tools and Resources
## **1. Image & Prompt Tools**
### **Image Upscaling**
- [BigJPG](https://bigjpg.com/)
  - Provides high-quality image upscaling services.
### **Prompt Tools**
- **MidJourney Web Editor**
  - Edit and optimize MidJourney prompts online.
- **Prompt Guides**:
  - [Prompting Guide](https://www.promptingguide.ai/zh)
  - [OpenAI Prompt Best Practices](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
### **Prompt Framework**
- **Overview**: Role/Background
- **Process**: Skills/Rules/Flow (Context)
- **Dependencies**: Tools/Knowledge/Materials (Examples)
- **Control**: Positive/Negative Requirements (Requirements)
## **2. Agent Tools**
### **Multi-Agent Collaboration**
- **Task Decomposition & Optimization**:
  - [ChatGPT GPTs](https://chatgpt.com/gpts)
  - [Coze](https://www.coze.cn/sign?redirect=%2Fhome%3Fspm%3Data.21736010.0.0.5fe37536IoR9I8)
  - [Dify Docs](https://docs.dify.ai/)
  - **Two-Way Feynman Assistant**: For efficient learning and knowledge transfer.
### **Document Chat & Knowledge Base**
- [Txyz.ai](https://txyz.ai/)
- [AskYourPDF](https://askyourpdf.com/)
- [ChatPDF](https://chatpdf.com/)
- [Iki.ai](https://iki.ai/)
## **3. Drawing Tools & Workflow**
### **IP Character Design**
1.  **Material Classification**:
    -   IP + Scene / IP / IP + Plain Background
2.  **Tagging Tool**:
    -   [BooruDatasetTagManager]
        -   **Character Format**: Trigger word + Subject + Emotion + Action + Clothing + Perspective
        -   **Scene Format**: Trigger word + Theme + Emotion + Action + Clothing + Environment description + Lighting + Perspective + Shot type
3.  **Model Recommendation (Liblib)**:
    -   NOVA SDXL 1.0
    -   NOVA 3D Stereo
    -   NOVA Realistic HYPER
4.  **Parameter Adjustment**:
    -   Overfitting / Underfitting / Generalization / Regularization
5.  **Workflow**:
    -   Static Output: SD + PS + KR
    -   Dynamic Performance: RW + CC
    -   Sound Effect Processing: AE
    -   Pose Adjustment: ControlNet + OpenPose
    -   Flux Workflow
## **4. AI Programming Tools**
- [CopyCoder.ai](https://copycoder.ai/)
  - AI-assisted programming tool.
### **Git Copilot Capabilities**
1.  Teaching, clarifying doubts (selfless, patient).
2.  Providing solutions (environment setup, etc.).
3.  Understanding semantics.
4.  Calling functions.
5.  Image understanding.
### **Scenario Characteristics**
-   Broad, high-frequency, rapid feedback, clear objective function, low to medium decision-making dimensions.
## **5. AI Collaboration Methods**
1.  **Structuring Unstructured Data**
2.  **One Shot**: Knowledge + Known; Solve
3.  **Fine-Tune**: Tuning (without labeling)
    -   Example: 我在北京天(安门)天(气) -> Pattern recognition or compression
    -   Multi-layer structure: Human language contains all human wisdom.
4.  **Text Model**: Long-Chain?
## **6. AI Application Cases**
### **Hema SKU Recommendation**
-   **Algorithm is not important**: 4000 SKUs, the pool of fast-moving items is not large.
-   **AI's opportunity**: Rapid digitization, reducing the cost of physical world modeling (unstructured -> structured).
-   **Douyin vs. Kuaishou**: Let young ladies quickly post videos with video + audio, from an assistant's perspective, solving user problems, not just being cheap (beware of high-dimension attacking low-dimension).
## **7. AIGC Inspiration**
-   **High-quality input**: Requires high-quality data input.
-   **Output dependency**: Relies on human abstraction and generalization ability, first-principles reasoning ability (the biggest difference between people).
-   **Seed Science AI**: [SeedScienceAI](https://www.seedscienceai.com/)
## **8. Speech Recognition & Short Courses**
-   **Moonshine Web**: Speech recognition tool.
-   **DeepLearning.AI Short Courses**:
    -   [Reasoning with o1](https://www.deeplearning.ai/short-courses/reasoning-with-o1/)
-   **Ideogram**: [Ideogram](https://ideogram.ai/)
## **9. Short Video AI Tools**
-   **Stable Diffusion + Ebsynth Utility + Huishi**: A combination of tools for AI short video production.
## **10. Reference Videos**
-   [Bilibili Video](https://www.bilibili.com/video/BV1Tc411L7UA/?spm_id_from=333.337.search-card.all.click)
### fastrtc
https://fastrtc.org/cookbook/
---
## AI Tools
chatwise
Alibaba Cloud deepseek r1
Gemini 2 Flash Thinking
repomix package code
Don't rush to answer my question yet. What additional information do I need to provide for a higher quality answer?
## Books
"The History of Venture Capital"
"The Pattern of the World"
"A Brief History of Intelligence"
"The First Eye"
