---
title: "Computer Basement"
date: 2021-08-24
tags:
- Operation System
description: "An understanding of the underlying layers of computers"
images:
- code-computer/code-computer.jpeg
---

## Coding principles

### Numeric encoding

**Why is there a complement code?**
Complement codes are used to facilitate computer operations, so that calculations can be added more easily. For example, 5+(-3) is calculated by using the complement
0101 (5)
0011 (3) -> Inverse 1100 -> Add one 1101 
0101 + 1101 = 100010 truncated 0010 (-2) meets the expected result (original code: first bit is the sign bit inverse code: all bits are inverted except the sign bit, which does not meet the expectation)

Definition of complement: positive number remains the same, negative number is inverted and +1 

**Why is the range [-128,127] represented?**
The 4-bit binary complement code represents. 
0000 (-0) 0000 (0) 
1111 (-1) 0001 (1) 
1110 (-2) 0010 (2) 
...       ...
1011 (-5) 0101 (5) 
1010 (-6) 0110 (6) 
1001 (-7) 0111 (7)

The range is [-7, 7] 1000 is not represented and would just be -8 so it ends up being [-8, 7] The sign bit is involved, but the result is as expected
Complement representation of -8: 1000 (original) -> inverted 0111 -> add one 1000

**Why does the complement code need to be inverted + 1?**
The 4-bit binary complement code represents. 
0000 (-0) 0000 (0) 
1111 (-1) 0001 (1) 
1110 (-2) 0010 (2) 
...       ...
1011 (-5) 0101 (5) 
1010 (-6) 0110 (6) 
1001 (-7) 0111 (7)

After +1, the 0-bit representation is consistent and the sign bit is involved in the operation just as expected

**Why do decimals have precision problems?**
Because binary decimals can only be represented by a fixed combination of digits, e.g. 0.2 cannot be represented precisely in binary combinations

### Text encoding

**Concept**.  

Code list (character set): correspondence between characters and numbers (interface)
Character encoding: concrete implementation
Code points: each number in the table (may consist of one or more code elements)

**track of development**.  
ASCII (English and special characters) : 7 bits in a byte -> EASCII character set : ISO 8859-1 -> GB2312 -> GBK : GBK encoding (Chinese characters) -> GB18030 -> Unicode character set : general unicode encoding means UTF-16 encoding Variable-length encoding, 2-byte code element, byte order problem, UTF-8 is variable-length encoding -8 is variable length encoding single byte code element no byte order problem

Initialisation -> localisation (GB for GB) -> internationalisation -> efficiency

### Multimedia encoding

Audio: representation of a limited number of samples collected in a given time. Sampling rate is related to the frequency of the analogue signal, 40,000 samples per second Encoding method AAC
Image: raster map (resolution: number of pixels per unit area, colour depth: number of pixel bits) / vector map (mathematical formula to calculate pixel distribution)
Video: Frames Composed of pictures, multiple frames form a video stream. Encoding methods MPEG-1, MPEG-2, MPEG-4, H.264, H.265

## Nature of the operation

### Concepts

The logical operations of with, or, non, and iso-or

The above logical operations can be realised by means of logic simulation. The input is a switch and the output is usually an LED (coloured light). The chip generally implements logic operations, such as the 7486 (iso-or gate) chip, which will expose some pins out, such as one to power, one to ground, others to input, indicating output, etc

### Half adder: disregarding the feed, unit

Cout = X * Y
S = X ⊕ Y

### Full adder: taking into account rounding, units

``` 
S = X ⊕ Y ⊕ Cin
// both the X and Y values are true, or if either the X or Y value is true and the Cin is true
Cout = (X*Y) + ((X⊕Y)*Cin)
```

### Two-bit adding machine

### Multi-bit adding machine
### Memory adding machine

Save the result of the last calculation

### Selecting an adding machine

Get a few more memory adders to avoid having to start again if you make a mistake.

### Automatic adding machine

Automatically enters and adds up all the numbers with the press of a switch. 

### Free adding machine

Control to calculate only some of the numbers

### Comparison with modern computers

Current computers are capable of performing a billion addition operations. Computers contain
1 memory (memory box: for storing the numbers entered, the code to be executed, the result of the calculation)
2 an operator (accumulator: to calculate the sum of two numbers)
3 Controller (control panel: switches)
4 Input device (input panel: input switch)
5 Output device (output bulb: bulb reality output data)

The above contains concepts such as: input, output, memory, addressing, decoding, instructions, arithmetic logic units, etc.

Programming is the process of storing a series of instructions into memory and allowing the computer to execute these instructions step by step. Encapsulating some common instructions creates the operating system.

### Virtual Circuit Simulation

https://exp.xiaogd.net/circuitjs1-zh/circuitjs.html

### The difference between an interpreter and a compiler

Before code can be executed it needs to pass through a syntax parser, which converts the input string of code into an AST (abstract syntax tree)

Generally an interpreter will go through the following steps when interpreting a program for execution.  
1 Lexer (lexical parser) reads the code and converts it into a sequence of tokens  
2 Parser converts the read sequence of tokens into an AST (in most cases Lexer is part of Parser)  
3 Lowering (simplifying the AST) or Desugar (converting the AST node from syntactic sugar to the standard equivalent AST node) of the AST  
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

Compiler: translates the AST into the target language, e.g. assembly

``` js
// Assume that the target machine is a stack VM, then execute it via the exec function
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

Separate the traversal and implementation of ast, and encapsulate each step of the operation into a separate function

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

The machine is controlled through code, which is the instruction that a human reads. There are two main elements data and operations (judgments, selections, loops, branches, etc.).

### Memory model

The latch (a huge array composed of 64 bits) of [the nature of operations](## the nature of operations) is, in essence, memory.

Sequential execution: the code is compiled into a single instruction still in memory (the execution area allocated by the operating system), the counter progressively executes the memory execution and returns the result

Branch selection: jumping to the corresponding address to execute the instruction

Nested execution: the execution of a function opens up a contiguous set of memory spaces in memory. Before the execution of the function code, the stack space is allocated according to the number of arguments and their size, and the bottom of the stack is in the direction of the high address of the memory
The active record of the execution process is defined by a frame pointer marking the top position and a stack pointer marking the bottom position. When execution is complete, the frame pointer points to the address of the next instruction
