---
title: "Understanding the Essence of Computers"
date: 2021-08-24
tags:
  - Computer
description: "What is the essence of a computer?"
images:
  - code-computer/code-computer.jpeg
---
## Digital Encoding
### 1. The Essence of a Computer
The essence of a computer is a **world of 0s and 1s**. To **represent this world using 0s and 1s**, the conclusion is: **encoding** is required.
---
### 2. How Numbers Are Represented
#### Why does two's complement exist?
- **Purpose**: Two's complement is designed to facilitate computer operations, especially addition.
- **Example**:  
  Calculating `5 + (-3)` using two's complement (definition: positive numbers remain unchanged, negative numbers are inverted and +1 is added):
  - Step 1: `0101` (5)
  - Step 2: `0011` (3) -> Invert `1100` -> Add one `1101`
  - Step 3: `0101 + 1101 = 100010`, which after truncation is `0010` (result is 2)
  The result of the operation matches human expectations, whereas the results calculated using sign-magnitude (first bit as sign bit) and one's complement (all bits except the sign bit are inverted) do not.
#### Why is the range `[-128, 127]`?
- **Explanation**:  
  Taking 4-bit two's complement as an example:
  ```
  0000 (-0)  0000 (0)
  1111 (-1)  0001 (1)
  1110 (-2)  0010 (2)
  ...
  1011 (-5)  0101 (5)
  1010 (-6)  0110 (6)
  1001 (-7)  0111 (7)
  ```
  The range is `[-7, 7]`, but `1000` is unrepresented and can be used to represent `-8` (the two's complement representation of `-8`: `1000` (original) -> invert `0111` -> add one `1000`).  
  Therefore, the final range is `[-8, 7]`. By the same logic, `[-128, 127]` can also be explained.
#### Why do decimals have precision issues?
- **Reason**: In some languages, `0.1 + 0.2` will never equal `0.3`. This is because binary decimals can only be represented by a fixed combination of digits, and a number like `0.2` cannot be precisely represented in binary.
---
## Text Encoding
### 1. The Concept of Encoding
- **Definition**: After numbers are encoded, text also needs to be represented through encoding.
- **Implementation**: Encoding is primarily achieved through a **code table**, which is a mapping between characters and numbers.
  - **Code Table (Character Set)**: The mapping between characters and numbers (the interface).
  - **Character Encoding**: The specific implementation.
  - **Code Point**: Each number in the table (can be composed of one or more code units).
### 2. Development Trajectory
- **ASCII**: English and special characters, using 7 bits of a byte.
- **EASCII Character Set**: ISO 8859-1.
- **GB2312**: Early Chinese character encoding standard.
- **GBK**: GBK encoding (Chinese characters), an extension of GB2312.
- **GB18030**: A more comprehensive Chinese character encoding standard.
- **Unicode Character Set**: 
  - Generally, Unicode encoding refers to UTF-16 encoding, which is variable-length, uses 2-byte code units, and has byte order issues.
  - **UTF-8**: Variable-length encoding, single-byte code units, no byte order issues.
- **Development Process**: Initialization -> Localization (GB stands for National Standard) -> Internationalization -> Efficiency.
---
## Multimedia Encoding
### 1. Audio
- **Principle**: Represented by collecting a finite number of samples within a certain time frame.
- **Sampling Rate**: Related to the frequency of the analog signal, for example, 40,000 samples per second.
- **Encoding Method**: AAC.
### 2. Images
- **Raster Graphics**: 
  - **Resolution**: Number of pixels per unit area.
  - **Color Depth**: Number of bits per pixel.
- **Vector Graphics**: Pixel distribution is calculated using mathematical formulas.
### 3. Video
- **Frames**: Composed of images; multiple frames form a video stream.
- **Encoding Methods**: MPEG-1, MPEG-2, MPEG-4, H.264, H.265.
---
## The Essence of Computation
### 1. Concept
With encoding in place, how do computers perform calculations? Why are memory sticks and chips so expensive?
#### Logical Operations
- **Basic Operations**: AND, OR, NOT, XOR.
- **Implementation**: Implemented through logic gate circuits. The input is a switch, and the output is typically an LED light (a colored light). Chips generally implement logical operations, for example, a 7486 (XOR gate) chip will expose some pins, such as one for power, one for ground, and others for input and output.
---
### 2. Half Adder
- **Definition**: An adder that does not consider the carry-in.
- **Formulas**:
  - `Cout = X * Y`
  - `S = X ⊕ Y`
---
### 3. Full Adder
- **Definition**: An adder that considers the carry-in.
- **Formulas**:
  ```plaintext
  S = X ⊕ Y ⊕ Cin
  Cout = (X * Y) + ((X ⊕ Y) * Cin)
  ```
---
### 4. Two-bit Adder & Multi-bit Adder
- **Two-bit Adder**: Two full adders connected in series.
- **Multi-bit Adder**: Multiple full adders connected in series.
---
### 5. Adder with Memory
- **Function**: Saves the result of the previous calculation.
---
### 6. Selective Adder
- **Function**: Use several adders with memory to avoid starting over when an input error occurs.
---
### 7. Automatic Adder
- **Function**: Press a switch to automatically input and sum all the numbers.
---
### 8. Programmable Adder
- **Function**: Can be controlled to calculate only a subset of the numbers.
---
### 9. Comparison with Modern Computers
Current computers can perform **1 billion addition operations per second**. A computer consists of the following parts:
1. **Memory**: Storage boxes for storing input numbers, code to be executed, and calculation results.
2. **Arithmetic Unit**: The accumulator, which calculates the sum of two numbers.
3. **Control Unit**: The control panel, for switching toggles.
4. **Input Device**: The input panel, for inputting with switches.
5. **Output Device**: The output light bulbs, which display the output data.
The above includes concepts such as: input, output, memory, addressing, decoding, instructions, arithmetic logic unit, etc.
---
## Virtual Circuit Simulation
- **Tool**: [Virtual Circuit Simulator](https://exp.xiaogd.net/circuitjs1-zh/circuitjs.html)
---
## Difference Between Interpreters and Compilers
### 1. How does a program run?
Before execution, code must be processed by a parser, which converts the input code string into an **AST (Abstract Syntax Tree)**.
#### Interpreter Execution Flow
1. **Lexer**: Reads the code and converts it into a sequence of tokens.
2. **Parser**: Converts the sequence of tokens into an AST (in most cases, the Lexer is part of the Parser).
3. **Lowering/Desugar**: Simplifies the AST or converts syntactic sugar AST nodes into standard equivalent AST nodes.
4. **Interpreter**: Recursively executes the AST.
The interpreter directly interprets and executes the AST, returning the final result:
```js
function interpret(ast) {
  switch (ast.type) {
    case "number":
      return ast.value;
    case "negative":
      return -interpret(ast.value);
    case "op":
      switch (ast.value) {
        case "+":
          return interpret(ast.v1) + interpret(ast.v2);
      }
  }
}
```
#### Compiler Execution Flow
The compiler translates the AST into a target language, such as assembly:
```js
// Assuming the target machine is a stack-based virtual machine, then executed via an exec function
function compile(ast) {
  switch (ast.type) {
    case "number":
      return "ds.push(" + ast.value + ")\n";
    case "negative":
      return "ds.push(-ds.pop())\n";
    case "op":
      return (
        compile(ast.v1) +
        compile(ast.v2) +
        "ds.push(ds.pop() " +
        ast.value +
        " ds.pop())\n"
      );
  }
}
```
---
## The Essence of Code
Code controls the machine; it is instructions for humans to read. It has two main elements: **data** and **operations** (conditionals, selections, loops, branches, etc.).
---
### Memory Model
#### 1. How do computers store data?
The latches (a large array made of 64-bit units) mentioned in [The Essence of Computation](#the-essence-of-computation) are essentially memory.
#### 2. Execution Process
- **Sequential Execution**: Code is compiled into individual instructions and loaded into memory (an execution area allocated by the operating system). A program counter executes the instructions in memory sequentially and returns the result.
- **Branching/Selection**: Jumps to a corresponding address to execute an instruction.
- **Nested Execution**: A function call opens up a contiguous block of memory space. Before the function code executes, stack space is allocated based on the number and size of parameters, with the bottom of the stack at the higher memory address.
#### 3. Activation Record
The activation record of the execution process is defined by a **frame pointer** marking the top and a **stack pointer** marking the bottom. When execution is complete, the frame pointer points to the address of the next instruction.
