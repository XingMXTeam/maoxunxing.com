---
title: "The Nature of Computers"
date: 2021-08-24
draft: true
tags:
- Operation System
description: "What is the nature of computers?"
images:
- code-computer/code-computer.jpeg
---
## Coding principles

> Computers are by nature a world of 0/1, and if expressing this world in 0/1. The conclusion is: it needs to be encoded by.

### Number encoding

> First how to express numbers

** Why is there a complement code? **

> Complement is to facilitate computer operations, it is easier for computers to do addition  

**For example**: 5+(-3) is calculated by complement (definition: positive number remains the same, negative number is inverted and +1)  
Step 1: 0101 (5)  
Step 2: 0011 (3) -> inverse 1100 -> add one 1101  
Step 3: 0101+1101=100010 after truncation 0010 (-2)  
The result of the operation meets human expectation, while the result of the original code (the first bit is the sign bit) and the inverse code (all bits are inverted except the sign bit) do not meet human expectation.

Why does ** indicate the range [-128, 127]? **

> This question has bothered me before

As an example to illustrate.
The 4-bit binary complement representation is.  
0000 (-0) 0000 (0)  
1111 (-1) 0001 (1)  
1110 (-2) 0010 (2)  
...       ...  
1011 (-5) 0101 (5)  
1010 (-6) 0110 (6)  
1001(-7) 0111(7)  

The range is [-7, 7] 1000 is not represented, it is just used to represent -8 (the complement of -8 is represented as: 1000 (original) -> inverted 0111 -> plus one 1000)   
So the final result is [-8, 7].  Similarly [-128,127] makes sense. 

**Why do decimals have precision problems? **

> In some languages, 0.1 + 0.2 will never equal 0.3 Why?

As a simple example.  
Because binary decimals can only be represented precisely with fixed combinations of numbers, such as 0.2, and cannot be represented precisely with binary combinations

### Text encoding

> After encoding numbers, does the text have to be encoded as well?

Encoding is mainly achieved through, for example, code tables, that is, the correspondence between characters and numbers.

Code table (character set): Correspondence between characters and numbers (interface)
Character encoding: specific implementation
Code point: each number in the table (may consist of one or more code elements)

**Development track**.  
ASCII (English and special characters) : 7 bits in a byte -> EASCII character set : ISO 8859-1 -> GB2312 -> GBK : GBK code (Chinese characters) -> GB18030 -> Unicode character set : general unicode encoding refers to UTF-16 encoding Variable-length encoding, 2-byte code element, with byte order problems, UTF -8 is variable length encoding single byte code element no byte order problem

Initialization -> localization (GB means national standard) -> internationalization -> efficiency

### Multimedia encoding

Audio: A limited number of samples are collected in a given time. Sampling rate is related to the analog signal frequency, 40,000 samples per second Encoding method AAC
Image: raster map (resolution: number of pixels per unit area, color depth: number of pixel bits) / vector map (mathematical formula for pixel distribution)
Video: frames Composed of pictures, multiple frames constitute the video stream. Encoding methods MPEG-1, MPEG-2, MPEG-4, H.264, H.265

## The nature of operations

> With encoding, how does a computer implement computation? Why are memory sticks and chips expensive?

### Concepts

With, or, non, and iso-or in logical operations

The above logical operations can be realized by logic simulation. The input is a switch, and the output is usually an LED (a light with color). The chip is generally to achieve the logic operation, such as 7486 (heterogeneous or gate) chip, will expose some pins out, such as a connection to power, a ground, other connection to the input, said the output, etc

### half adder: do not consider the input, the unit

Cout = X * Y
S = X ⊕ Y

### Full adder: takes into account rounding, units

``` 
S = X ⊕ Y ⊕ Cin
// both the X and Y values are true, or if either the X or Y value is true and the Cin is true
Cout = (X*Y) + ((X⊕Y)*Cin)
```

### Two-bit adder

### Multi-bit adder
### Memory adder

Save the result of the last calculation

### Select adder

Get a few more memory adders to avoid starting over when you make a mistake.

### Automatic adding machine

Automatically enter and add up all numbers with the press of a switch. 

### Free adding machine

Control to calculate only some of the numbers

### Compare to modern computers

Current computers are capable of performing a billion additions. Computers contain
1 memory (memory box: for storing the numbers entered, the code to be executed, the result of the calculation)
2 operator (accumulator: calculates the sum of two numbers)
3 controller (control panel: toggle switch)
4 input device (input panel: input switch)
5 output device (output bulb: bulb reality output data)

The above contains: input, output, memory, addressing, decoding, instructions, arithmetic logic unit and other concepts

Programming is the process of storing a series of instructions into memory and letting the computer execute them step by step. Wrapping some common instructions together forms the operating system.

### Virtual Circuit Simulation

https://exp.xiaogd.net/circuitjs1-zh/circuitjs.html

### The difference between an interpreter and a compiler

> How does our program run?

The code needs to be converted into an AST (abstract syntax tree) by a syntax parser before it can be executed.

A general interpreter will go through the following steps when interpreting and executing a program.  
1 Lexer (lexical parser) reads the code and converts it into a sequence of tokens  
2 Parser (syntax parser) to read the sequence of tokens into AST (in most cases Lexer is part of Parser)  
3 Lowering (simplifying AST) or Desugar (converting AST nodes from syntactic sugar to standard equivalent AST nodes) of the AST  
4 Interpreter recursively executes the AST  

The interpreter interprets the execution of the AST directly and returns the final result as follows.

``` js
function interpret(ast) {
  switch(ast.type) {
    case 'number': return ast.value;
    case 'negative': return -interpret(ast.value);
    case 'op': 
      switch(ast.value) {
        case '+': interpret(ast.v1) + interpret(ast.v2);
      }
  }
}
```

Compiler: translate AST to target language, e.g. assembly

``` js
// Assume that the target machine is a stack VM, and then execute it via the exec function
function compile(ast) {
  switch(ast.type) {
    case 'number': return "ds.push("+ast.value+")\n";
    case 'negative':
      return "ds.push(-ds.pop())\n";
    case 'op':
      return compile(ast.v1) + compile(ast.v2) + "ds.push(ds.pop() " + ast.value + " ds.pop())\n";
  }
}

```

Separate the traversal and implementation of ast, and encapsulate each step of the operation as a separate function

``` js
function interpret(ast) {
  switch(ast.type) {
    case 'number': return ast.value;
    case 'negative': return -interpret(ast.value);
    case 'op': 
      switch(ast.value) {
        case '+': interpret(ast.v1) + interpret(ast.v2);
      }
  }
}
```

## The nature of code

The machine is controlled by code, which is the instruction read by a human. There are two main elements data and operations (judgments, selections, loops, branches, etc.).

### Memory model

> How does a computer store?

The latch (a huge array composed of 64 bits) of [the nature of operations](# the nature of operations) is, in essence, memory.

Sequential execution: The code is compiled into a single instruction still in to memory (the execution area allocated by the operating system), the counter progressively executes the memory execution and returns the result

Branch selection: jump to the corresponding address to execute the instruction

Nested execution: The function execution opens a set of consecutive memory spaces in memory. Before the execution of the function code according to the number of parameters, the size of the parameters, the calculation of the allocation of stack space, the bottom of the stack is the direction of the high address of memory
The activity record of the execution process is defined by a frame pointer marking the top position and a stack pointer marking the bottom position. When the execution is finished, the frame pointer points to the address of the next instruction
