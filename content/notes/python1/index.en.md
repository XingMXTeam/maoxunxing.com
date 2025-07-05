---
title: "Python Beginner Notes"
date: 2019-11-25
tags:
- Python
---

#python #programming_language

https://github.com/jackfrued/Python-100-Days

## Prelude
As a front-end engineer, I've been doing some coding problems. Using Python for coding problems results in very concise code.

It's usage is similar to JavaScript, for example, destructuring, none. In
a dynamic language, there's no need for compilation.

### Data Types

- Integers : <class 'int'>
```python
x**2 # x squared
```
```
- Float : <class 'float'>
```python
float('-inf')
float('inf')	
```


- Complex Numbers: <class 'complex'>
- String: <class 'str'> -1 accessible to the last element
```python
int('123') # Convert string to number
```


- Array: Access the last element with -1

```python
nums.pop(0) # pop specified element
```

- Tuple: Directly immutable. The types of elements inside are mutable.
```python
tuple = ()
tuple = ('123', 123)
tuple([123, 456])
```

```
- Boolean: <class 'bool'> True, False, true
- Set: Automatically removes duplicate elements
```python

set("test")
set1 = set(['23', '454'])
set2 = set(['34'])
print('234' in set1)
print(set1 - set2) # Difference
print(set1 | set2) # Union
print(set1 ^ set2) # Symmetric Difference
```
- Dict: 
```python
dict2 = { 'a': 1231 }
dict1 = dict({1: 'Geeks'}) # Other way dict(aaa=123) dict(('asdf', 123))
dict1[1]
del dict1[1]
dict1.keys()
1 in dict1 # Check if key exists

# Array to Dictionary

list_1 = [('a', 1), ('b',2)]
result = dict(list_1)
print(result)

defaultdict(list) # Declare a hashmap, similar to userId -> list
defaultdict(set) # Declare a hashmap, similar to userId -> set

```

Initialize multiple elements
```python
a, b = 1, 2
```

Check if the array is empty
```python
z = []
if z:
	print(True)
```
```

### Basic Methods of Data Types

Number
```python
323 // 3 # Integer division (truncates towards zero)
```

Dictionary: dict(), dict.keys(), dict.items() 
```python
dict.items() # Returns an array (elements are tuples)

dict.get('a', 0) # The second parameter can be used to assign a default value
```


Sets: set()
Tuple: tuple()
#### String
Formatted string

```python
name = "Alice"
age = 30

# Using f-string
print(f"My name is {name} and I am {age} years old.")

# Using format
print("Hello, {}. You are {} years old.".format("Alice", 25))
# Output: Hello, Alice. You are 25 years old.

print("Hello, {1}. You are {0} years old.".format(25, "Alice"))
# Output: Hello, Alice. You are 25 years old.

print("Hello, {name}. You are {age} years old.".format(name="Alice", age=25))
# Output: Hello, Alice. You are 25 years old.
```


format() 
Float: float()

#### Array
append() pop() insert(index, value) len()

Access elements:
``` python
list = [1,2]
list[-1] # Access the last element
```

res + intervals[i:] # Array concatenation
```

Array slicing
``` python
list[:k] # Returns the first k elements 
list[k+1:] # Returns elements from k+1 (inclusive) onwards
```

Extract the first n keys from an array (whose elements are tuples):
``` python
list_1 = [('A', 1), ('b',2), ('b',3), ('d', 6)]  
keys = [item[0] for item in list_1[:3]]  
print(keys)
```
```
Initialize the array:
``` python

list = [0] * length # Initialize the array
```

# Array contains objects
rows = [{} for _ in range(9)]  

```
Merge array
``` python
list = [4, 5]
list.extend([2,2,3]) # Will modify the original array
  
list2 = list + [6,8]  # Merges and returns a new array
```
print(list2)
```

### Two-dimensional array
```python
# Define a list of lists called 'dict'
dict = [
    [123, 1],
    [4, 5455]
]

# Iterate over the range from 0 to 2 (exclusive)
for i in range(2):
    # Create a new list using list comprehension
# For each 'row' in 'dict', select the element at index 'i'
    selected_elements = [row[i] for row in dict]

    # Print the resulting list
    print(selected_elements)


```

### Built-in Methods
str() : Convert to string
ord('a'): Returns the ASCII code of the character
enumerate()
zip()：Returns an iterator whose internal elements are tuples
sorted()：
``` python

# Sort the array  
list_1 = [('A', 1), ('b',2)]  
print(sorted(list_1, key=lambda x:x[1], reverse=True))  
list_2 = [4,2,6]
print(sorted(list_2, reverse=True)) 

# To sort a dictionary (which is like an object), you need to first convert it into an array (with elements being tuples) using the
# dict.items() method, and then sort it
dict_1 = { 'a': 5, 'b': 4, 'd': 3 }
print(sorted(dict_1.items(), key=lambda x:x[1]))

# reverse
sorted(list)[::-1]

```
reversed(): Reverses the array

reversed()
type() Determines the type of data

range(): Returns an array
``` python
 range(4) => [0,1,2,3,4] 
 range(0, 10, 3) # increments by 3  
 range(3, -1, -1) # represents step size in reverse order
```
   
list = "add"  
list2 = "cddf"  
for i in range(3, 5):  
    print(i) # 3 4 will not print 5
```
filter(fn, [])
map(fn, []) map(fn, [], [])
reduce(fn, []) reduce(fn, [], 0)







### Keywords
in 
not in 
del
not
or: Equivalent to ||
and: equivalent to &&
pass statement does nothing, it's just used for placeholders
None
False
True
true
is
as: alias

```python
result = 3 * 4  # Multiplication: result is 12

result = 2 ** 3  # Exponentiation: result is 8


"ADF" * 123 # ADF repeated 123 times
```
### Conditional Statements
- Iterate with for ...in Note that there is a colon after it. for in also has other uses which can be referred to in two-dimensional arrays break to exit the loop continue to skip the execution after it
- Iterate with while Most objects can be iterated

> Internally: the for statement calls the iter() method, then calls next() to access the next element, and if there is no next one, it throws a StopIteration exception
> s = 'asdf'
> it = iter(s)
> it.next()

Adding iterator to a class

```python
class Reverse:
    """Iterator for looping over a sequence backwards."""
    def __init__(self, data):
        self.data = data
self.index = len(data)
        
    def __iter__(self):
        return self
    
    def __next__(self):
if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]

# Example usage
rev = Reverse('spam')

# Using iter() explicitly is not necessary, as the __iter__ method is defined in the class
# iter(rev)

for char in rev:
    print(char)

```

```python
set1 = set(['Geeks', 'For'])
for i in set1:
	print(i, end=" ")
print("Geeks" in set1)


for i, v in enumerate(['tic','ggg']):
print(i, v)

questions = ['name', 'quest']
answers = ['asdfa', 'ggg']
for q, a in zip(questions, answers):
	print('what is your {0} ? It is {1}'.format(q, a))

# Complex example
a = [(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
print(a)


for element in [1, 2, 3]:
    print(element)
for element in (1, 2, 3):
print(element)
for key in {'one':1, 'two':2}:
    print(key)
for char in "123":
print(char)


```
- Condition if: There will also be a colon after it

### Ternary Expression

``` python
val if not self.min else min(val, self.min[-1])

if not self.min # Check if array is empty
if self.min # Check if array is not empty
```


position = [4,3]
speed[2,3]
[[p,s]] for p, s in zip(position, speed)

list = matrix[lastIndex - 1 if lastIndex > 0 else 0] # conditional check

selected_elements = [row[0] for row in dict] # Extract the first element from each row in a 2D array

```

### Functions

Functions are defined using the def keyword, and they can be assigned values

```python

def fib(n): 
	a = 0
	while a < n:
print(a)

```


Parameters can have default values, and the default value can be a variable.
```python
def ask_ok(prompt, retries=4, complaint='Yes or no, please!'):
	print(prompt)
```

If it is a reference type by default, the value will change multiple times

```python
def f(a, L = None):
	pass


def f(a, L):
```
if L is None:
	L = []
L.append(a)
```

Keyword parameters (function annotations)

```python
def greet(name, *, greeting="Hello", punctuation="!"):
    """
Greets a person with a customizable message.

    Parameters:
    - name: The name of the person.
    - greeting: The greeting message (default is "Hello").
- punctuation: The punctuation to add to the message (default is "!").
    """
    print(f"{greeting}, {name}{punctuation}")

# Calling the function with both positional and keyword arguments
greet("Alice", greeting="Hi")  # Output: "Hi, Alice!"

# This would raise a TypeError because 'greeting' is specified as a keyword-only argument
# greet("Bob", "Hi")

# Print function annotations
print(greet.__doc__)

```

Return type of the function

``` python

def topK(nums: List[int]) -> List[int]:

```

Lambda function
``` python

sorted(dict().items(), key = lambda x: x[1])


```

Functions cannot directly use external value variables; they can use reference types 
```python
res = 0
def test:
	print(res)
test() # This will cause an error


res = [0]
def test:
	print(res[0]) # This is ok
test()

#python or declare as nonlocal

res = 0
def test:
	nonlocal res
print(res)


```

### Deconstruction

```python
# ** Dictionary Destructuring
def parrot(voltage, state='a stiff', action='voom'):
    print(action, voltage, state)
    
dict = { "voltage": 12, "state": 'g', "action": 'Zo' }

parrot(**dict)


# * Deconstruction
a, *rest = [1, 2, 3, 4, 5]  # Unpacks the first element into 'a', and the rest into 'rest'

first, *rest, last = [1, 2, 3, 4, 5]
# 'first' is 1, 'rest' is [2, 3, 4], 'last' is 5


def my_function(*args):
    # 'args' is a tuple containing all positional arguments passed to the function
    print(args)

my_function(1, 2, 3)  # Output: (1, 2, 3)

values = [1, 2, 3]
my_function(*values)  # Equivalent to my_function(1, 2, 3)

# Array destructuring
a, b = [1, 5]


```


### Define class

```python

class MyClass: 
	""" test """
	i = 123123 # Class shared variable
	def __init__(self):
self.i = 323; # instance variable
def f(self):
	return 'hello'
		
		
a = MyClass.f('asdf')

b = MyClass.i

print(b)

b = MyClass()

print(b.i)

print(MyClass.__doc__)

```


Inheritance
```python

class MyClass2(MyClass):
    j = 123

# Multiple inheritance
class MyClass2(MyClass, MyClassBase):
j = 123
```


Reference within class
```python
class Mapping:
    def __init__(self, iterable):
        self.items_list = []
        self.__update(iterable)
def update(self, iterable):
        for item in iterable:
            self.items_list.append(item)
    __update = update  # Copy one update method
class MappingSubclass(Mapping):
    def update(self, keys, values): # Subclasses can override the update method without affecting the init method
        for item in zip(keys, values):
            self.items_list.append(item)
```


### Exception Handling

Definition of exception

```python
class CustomExceptionHandler:
    def __enter__(self):
        # The operations to be performed when entering the with statement block
        pass

def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            # When exiting the with statement block, if an exception occurs, the actions to be performed
            print(f"Caught exception: {exc_type.__name__}, Error message: {exc_value}")
# Here you can add custom exception handling logic

            # Return True to indicate the exception has been handled and will not be thrown again; return False to indicate the exception will continue to propagate
            return True
        # If no exception occurs, return None

# Example Usage
try:
    with CustomExceptionHandler():
    # Place code that may raise exceptions here
result = 1 / 0  # Division by zero will raise a ZeroDivisionError exception
except Exception as e:
    # Here you can handle exceptions not processed by CustomExceptionHandler
    print(f"Exception not handled by CustomExceptionHandler: {type(e).__name__}, Error message: {str(e)}")

```

Throw exception
```python
raise StopException
```

### Import

```python
import module_name as alias_name # Import module
```

from module_name import MyClass as AliasClass # Importing class and aliasing

```


### Running the Python interpreter

```python
python -c command [arg]
```
Exit
```python
quit()
```


### Standard Library

#### Mathematics
Package name: math

```python
math.isnan()
math.prod() # multiplication

```

#### Dictionary
``` python
from collections import OrderedDict
```

# The order returned by OrderedDict is the order you added

dict = OrderedDict({"a": 1, "b": 2})
print(dict)

```


#### Related to Liss

Package name: collections

```python
# Import the 'deque' class from the 'collections' module
```
from collections import deque #"double-ended queue"（双端队列）

# Create a deque named 'queue' with an initial element 'aaa'
queue = deque(['aaa'])

# Append the string 'ccc' to the right end of the deque
queue.append('ccc')

# Print and remove the leftmost element from the deque using 'popleft'
print(queue.popleft())


# Print the remaining elements in the deque
print(queue)

```

Package: bisect

```python
import bisect
scores = [(100, 'PER1'), (200, 'TCS'), (400, 'dsf')]
bisect.insort(scores, (300, 'sdf'))
print(scores)
```

#### Floating Point

```python

from decimal import *
```

x = Decimal('0.07') * Decimal('0.02')

print(x)


y = x.quantize(Decimal('0.01')) # Round to nearest 0.01
print(y)


z = round(0.70 * 1.123, 2) # Floating-point calculation,保留 two decimal places

print(z)

```

#### Weak references

```python
import weakref, gc
class A:
    def __init__(self, value):
```
self.value = value
        
    def __repr__(self):
        return str(self.value)
        
        
a = A(10)
d = weakref.WeakValueDictionary()
d['primary'] = a # Will not create a reference
print(d['primary'])

del a
gc.collect()
d['primary']
```




#### IO operations

open() Open a file

#### Log

```python
import logging
logging.debug('Debugging')

logging.info('Infomatiiii')

logging.warning('Warning')

logging.error('error')
logging.critical('critical')
```

#### Queue
```python
dq = deque([root]) # Deque

node = dq.popleft()
```

####  Min-heap
```python
import heapq # Python does not have a max heap. So generally, all values are made negative to simulate a max heap

minheap = [2,2,3]
# Or
```
minHeap = [[10,2,3], [8,2,4]]

heapq.heapify(self.minHeap) # Time complexity is O(nlogn)
heapq.heappop(self.minHeap)
heapq.heappush(self.minHeap, val)
len(self.minHeap)

```



---

Python is a relatively popular language, for personal interest refer to the official documentation: <https://docs.python.org/2/tutorial/index.html>
I translated it while reading (it will be continuously updated), those interested can take a look.

Python has advanced data structures and can efficiently support object-oriented programming. Its elegant syntax, dynamic typing, and interpreted nature allow it to quickly develop applications on most platforms. Its third-party packages, tools, and libraries can all be found here: <https://www.python.org/。>

Python is easy to extend through C/C++ functions or data types. For writing extensions, see: [Extending Python](https://docs.python.org/2/extending/index.html#extending-index), [Python C/C++ API](https://docs.python.org/2/c-api/index.html#c-api-index)

For more documentation, see [Python Standard Library](https://docs.python.org/2/library/index.html#library-index), [Python API](https://docs.python.org/2/reference/index.html#reference-index)

Through this introductory tutorial, you will learn some common features of Python and methods or modules of the standard library.

### Preface

For those who work in front of the computer every day, you might need to do some automated tasks, such as batch replacement, search and replace, or you might want to write some interface programs, games, etc.

While for professional software developers, developing through C/C++/Java libraries
、Testing, compiling, etc., are too cumbersome.

At this point, Python is the best choice.

You can write some shell scripts or bat scripts to move files or modify data, but they are not very suitable for writing interface programs or games. C/C++/Java are too cumbersome. Python is more suitable for quickly completing the work you want on various platforms (Windows, Mac, Unix).

Python is a true programming language, it has advanced data structures, such as flexible arrays and dictionaries that can be manipulated.

Python is modular, and its standard library contains some modules that you can use, which provide functions such as file I/O, sockets, etc.

Python can write more concise programs than C/C++/Java, for three reasons:
1 It has advanced data structures
2 It uses indentation to distinguish blocks of code rather than parentheses
3 No need for variable or parameter declarations

Python is extensible. You can embed the Python interpreter into a C program.

### Using the Python Interpreter

Run the python interpreter

Method 1:
The Python interpreter is generally installed in the /usr/local/bin/python directory under Linux. Switch to this directory and enter the following command to run the Python interpreter

```
python
```

Generally, on Windows, it is installed in the C:\Python27 directory. Press the Win+R shortcut, then type cmd to open the DOS interface. Enter the following command to set the environment variable:

```
set path=%path%;C:\python27

```
```

Then in any directory, input the command python to open the python interpreter
Method 2:

```
python -c command [arg] ..
```

Because the command line may contain some special characters or spaces, it's best to enclose them in single quotes.
Exit the Python interpreter:
Enter the shortcut: Control-D in Unix, Control-Z in Windows.
Or enter:

```
quit()
```

Calling a Python module (the module is also the Python source file):

```
python -m module [arg] ...
```
```

Enter interactive command mode:

```
python -i ...
```
```

Parameter Passing

Command-line arguments are assigned to the sys module's argv variable. Parameters can be accessed by importing sys. The length of argv is at least 1. When there are no parameters, sys.argv[0] is an empty string. When the script name is "-", sys.argv[0] is "-". When the -c command is used, the value of sys.argv[0] is "-c". When -m is used, the value of sys.argv[0] is the name of the module. Parameters following -c and -m are not processed by the Python interpreter.

Interactive Mode
```

Multi-line mode is... Single line is>>>

```
>>> the_world_is_flat = 1
>>> if the_world_is_flat:
...     print "Be careful not to fall off!"
...
```

Interpreter and environment

Set code encoding

Generally, it doesn't need to be set. The default is utf-8

```
#!/usr/bin/env python
# -*- coding: cp-1252 -*-
```

Introduction to Python

The beginning marks comments, >>> and ... mark Python statements

```
>>
>>> #This is a comment
... a = 1;#This is a comment
>>> print a
1
```

Treat Python as a calculator

#### Number

```
>>> 2 + 2
4
>>> 50 - 5*6
20
>>> (50 - 5.0*6) / 4
5.0
>>> 8 / 5.0
1.6
```

Here 2 is int and 5.0 is float. The type of the result of / is determined by the two numbers involved in the calculation. If one of the numbers is float, the result will be of float type.
// The operator is floor division, with the decimal part set to 0.

```
>>> 12//7.0
1.0
>>>
```

% is the remainder
** is exponentiation

```
>>> 5**2
25
>>>
```

Declare variable n=12
If you use an undeclared variable, it will cause an error

```
>>> n
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'n' is not defined
>>>
```

Polynomial calculations will automatically perform data type conversion: when calculating with int and float together, int will be automatically converted to float

In interactive mode, the last printed variable is assigned to _

```
>>> tax = 12.5 / 100
>>> price = 100.50
>>> price * tax
12.5625
>>> price + _
113.0625
>>> round(_, 2)
113.06
```

_is read-only and cannot be assigned.

#### String

Strings are enclosed in single or double quotes, and \ is used for escaping
If you don't want to escape: add an r before the string

```
>>> print 'C:\some\name'  # here \n means newline!
C:\some
ame
>>> print r'C:\some\name'  # note the r before the quote
C:\some\name
```

Multi-line string: Three """ or '''

```
print """\
Usage: thingy [OPTIONS]
     -h                        Display this usage message
     -H hostname               Hostname to connect to
"""
```

\identifier remove line break, no \ output is like this:

```
>>> print """
... aef
... asdf
... """

aef
asdf
```

String concatenation: + String repetition:*

```
>>> "un"*2 +" awef"
'unun awef'
>>>
```

Automatic concatenation:

```
>>> 'Py' 'thon'
'Python'
```

Get a single character from a string

```
>>> a = "python"
>>> a[0]
'p'
```

Negative indicators read from the end: -0 is equal to 0 The last character is -1

```
>>> a = "python"
>>> a[-1]
'n'
>>>
```

Select range:

```
>>> a = "python"
>>> a[0:2]
'py'
>>> a[2:]
'thon'
>>> a[:4]
'pyth'
>>> a[-2:]
'on'
>>>
```

Array bounds violation error:

```

```
>>> word[42]  # the word only has 6 characters
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
```
IndexError: string index out of range
```

But accessing a non-existent range does not cause an error:

```
>>> a[-2:45]
'on'
>>>
```

Strings cannot be modified:

```
>>> word[0] = 'J'
  ...
TypeError: 'str' object does not support item assignment
>>> word[2:] = 'py'
  ...
TypeError: 'str' object does not support item assignment
Unicode string
```

Supports Unicode strings: Add 'u' before the string

```
>>> Hello World !
u'Hello World !'
>>> Hello World !
u'Hello World !'
```

0x0020 indicates a space
Supports raw mode: Add "ur" before the string
Python's default encoding is ASCII. If a Unicode string is printed or written to a file, or converted using the str() method, it will default to ASCII. If the string is not in the range of 0-127, an error will occur

```
>>> u"abc"
u'abc'
>>> str(u"abc")
'abc'
>>> u"äöü"
u'\xe4\xf6\xfc'
>>> str(u"äöü")
Traceback (most recent call last):
  File "<stdin>", line 1, in ?
UnicodeEncodeError: 'ascii' codec can't encode characters in position 0-2: ordinal not in range(128)
```

Convert to specific encoding: The method parameter is lowercase

```
>>> u"äöü".encode('utf-8')
'\xc3\xa4\xc3\xb6\xc3\xbc'
```

### Array

Define an array

```
>>> squares = [1, 4, 9, 16, 25]
>>> squares
[1, 4, 9, 16, 25]
```

Access elements within an array

```
>>> squares[0]  # indexing returns the item
1
>>> squares[-1]
25
>>> squares[-3:]  # slicing returns a new list example three
[9, 16, 25]
```

Retrieve segments within an array, for example in the third example above, it will return a new array copy, the original array will not be changed
Array merging:

```
>>> squares + [36, 49, 64, 81, 100]
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

The content of a string cannot be changed, while an array can be changed:

```
>>> cubes = [1, 8, 27, 65, 125]  # something's wrong here
>>> 4 ** 3  # the cube of 4 is 64, not 65!
64
>>> cubes[3] = 64  # replace the wrong value
>>> cubes
[1, 8, 27, 64, 125]
```

Adding elements to an array:

```
>>> cubes.append(216)  # add the cube of 6
>>> cubes.append(7 ** 3)  # and the cube of 7
>>> cubes
[1, 8, 27, 64, 125, 216, 343]
```

can be assigned to a sliced array:

```
>>> letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
>>> letters
['a', 'b', 'c', 'd', 'e', 'f', 'g']
>>> # replace some values
>>> letters[2:5] = ['C', 'D', 'E']
>>> letters
['a', 'b', 'C', 'D', 'E', 'f', 'g']
>>> # now remove them
>>> letters[2:5] = []
>>> letters
['a', 'b', 'f', 'g']
>>> # clear the list by replacing all the elements with an empty list
>>> letters[:] = []
>>> letters
[]
```

Get the length of the array:

```
>>> letters = ['a', 'b', 'c', 'd']
>>> len(letters)
4
```

Elements of an array can also be an array:

```
>>> a = ['a', 'b', 'c']
>>> n = [1, 2, 3]
>>> x = [a, n]
>>> x
[['a', 'b', 'c'], [1, 2, 3]]
>>> x[0]
['a', 'b', 'c']
>>> x[0][1]
'b'
```

Finally starting to program!

How to implement a Fibonacci:

```
>>> # This is a comment
... a, b = 0, 1  # Assign 0 to a and 1 to b
>>> while b < 10: # This is a loop
...     print b  # Print the value of b (and the code here is indented with spaces)
...     a, b = b, a+b # Assign a to b, and b to the sum of a+b
...
1
1
2
3
5
8
```

As mentioned before, the indentation indicates the start of a code block.
The print method can control formatting, such as adding spaces:

```
>>> i = 256*256
>>> print 'The value of i is', i
The value of i is 65536
```

Add a comma at the end of the print statement to avoid the printed result from being on a new line:

```
>>> a, b = 0, 1
>>> while b < 1000:
...     print b,
...     a, b = b, a+b
...
1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

Control flow

if statement

```
>>> x = int(raw_input("Please enter an integer: "))
Please enter an integer: 42
>>> if x < 0: # Colon can enable multi-line mode
...     x = 0
...     print 'Negative changed to zero'
... elif x == 0:
...     print 'Zero'
... elif x == 1:
...     print 'Single'
... else:
...     print 'More'
...
```

if…elif..else(不是必须的)…

for

Python's for can iterate over arrays and strings (this is slightly different from the for statement in C)

```
>>> # Measure some strings:
... words = ['cat', 'window', 'defenestrate']
>>> for w in words:
...     print(w, len(w))
...
cat 3
window 6
defenestrate 12
```

Modifying an array inside a loop: First, copy the original array by slicing it (this concept was mentioned before)

```
>>> for w in words[:]:  # words[:] can copy the original array
...     if len(w) > 6:
...         words.insert(0, w)
...
>>> words
['defenestrate', 'cat', 'window', 'defenestrate']
range() function
```

The range function can create an array based on an algorithm

```
>>> range(5, 10) # Create an array with elements from 5 to 10 increasing by 1
[5, 6, 7, 8, 9]
>>> range(0, 10, 3) # Increasing by 3
[0, 3, 6, 9]
>>> range(-10, -100, -30) # Decrease by 30
[-10, -40, -70]
```

Iterate over the array indices:

```
>>> a = ['Mary', 'had', 'a', 'little', 'lamb']
>>> for i in range(len(a)):
...     print i, a[i]
...
0 Mary
1 had
2 a
3 little
4 lamb
```

Exit loop

The break statement will exit the inner for loop; continue will skip the execution of the following statements (same as in C language).

```
>>> for n in range(2, 10):
...     for x in range(2, n):
...         if n % x == 0:
...             print n, 'equals', x, '*', n/x
...             break
...     else:
...         # loop fell through without finding a factor
...         print n, 'is a prime number'
...
2 is a prime number
3 is a prime number
4 equals 2 * 2
5 is a prime number
6 equals 2 * 3
7 is a prime number
8 equals 2 * 4
9 equals 3 * 3
```

pass statement

The pass statement does nothing, it's just used as a placeholder

```
>>> class MyEmptyClass:
...     pass
...
>>> def initlog(*args):
...     pass   # Remember to implement this!
...
```

Define a function and call a function

```
>>> def fib(n):    # The 'def' keyword indicates the definition of a function, where the function name is fib
...     """Print a Fibonacci series up to n.""" #
...     a, b = 0, 1
...     while a < n:
...         print a,
...         a, b = b, a+b
...
>>> # Now call the function we just defined:
... fib(2000)
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597
```

Note that the function body and code should be indented
Functions can be assigned (fib will be added to the symbol table):

```
>>> fib
<function fib at 10042ed0>
>>> f = fib # f will also be added to the symbol table
>>> f(100)
0 1 1 2 3 5 8 13 21 34 55 89
```

Even if the function does not have a return, it will return a None

```
>>> fib(0)
>>> print fib(0)
None
```

return without anything following it also returns None

```
>>> def fib2(n):  # return Fibonacci series up to n
...     result = []
...     a, b = 0, 1
...     while a < n:
...         result.append(a)    # Here is the call to the array's append method
...         a, b = b, a+b
...     return result
...
>>> f100 = fib2(100)    # call it
>>> f100                # write the result
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```

Define a function with parameters

Parameters with default values: The default value of retries is 4

```
def ask_ok(prompt, retries=4, complaint='Yes or no, please!'):
while True: # True is a keyword
        ok = raw_input(prompt) # raw_input is a built-in function, used for IO input
        if ok in ('y', 'ye', 'yes'):
            return True
if ok in ('n', 'no', 'nop', 'nope'):
            return False
        retries = retries - 1
        if retries < 0:
raise IOError('refusenik user') # raise is a keyword, raises an exception
        print complaint
```

Default values can be variables: i is a variable

```

```
i = 5

def f(arg=i):
    print arg

```

i = 6
f()
```

If the default argument is a mutable object, it will be assigned multiple times:

```

```
def f(a, L=[]):
    L.append(a)
    return L

```

print f(1)
print f(2)
print f(3)
It will print out:

[1]
[1, 2]
[1, 2, 3]
```

If you don't want L to be changed, you can do this:

```
def f(a, L=None):
    if L is None:
L = []
    L.append(a)
    return L
```

If only one parameter is accepted, but two parameters are passed, an error will occur:

```
>>> def function(a):
...     pass
...
>>> function(0, a=0)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: function() got multiple values for keyword argument 'a'
**keywords accept dictionary arguments:

def cheeseshop(kind, *arguments, **keywords):
    print "-- Do you have any", kind, "?"
print "-- I'm sorry, we're all out of", kind
    for arg in arguments:
        print arg
    print "-" * 40
keys = sorted(keywords.keys()) # sorted by dictionary order
    for kw in keys:
        print kw, ":", keywords[kw]
```

*arg accepts an 不确定 number of parameters:

```
def write_multiple_items(file, separator, *args):
    file.write(separator.join(args))
```

Auto-parse parameters:

```
>>> range(3, 6)             # Normal call method
[3, 4, 5]
>>> args = [3, 6]
>>> range(*args)            # Unpacks an array into arguments
[3, 4, 5]
>>> def parrot(voltage, state='a stiff', action='voom'):
...     print "-- This parrot wouldn't", action,
...     print "if you put", voltage, "volts through it.",
...     print "E's", state, "!"
...
>>> d = {"voltage": "four million", "state": "bleedin' demised", "action": "VOOM"}
>>> parrot(**d)
-- This parrot wouldn't VOOM if you put four million volts through it. E's bleedin' demised !
```

Docstring:

```
>>> def my_function():
...     """Do nothing, but document it.
...
...     No, really, it doesn't do anything.
...     """
...     pass
...
>>> print my_function.__doc__
Do nothing, but document it.

No, really, it doesn't do anything.
```

A lambda expression is an anonymous function, lambda a, b: a+b. a and b are two parameters, and the result returns the sum of a and b:

```
>>> def make_incrementor(n):
...     return lambda x: x + n
...
>>> f = make_incrementor(42)
>>> f(0)
42
>>> f(1)
43
```

lambda can also be passed as a parameter:

```
>>> pairs = [(1, 'one'), (2, 'two'), (3, 'three'), (4, 'four')]

```
>>> pairs.sort(key=lambda pair: pair[1])
>>> pairs
[(4, 'four'), (1, 'one'), (3, 'three'), (2, 'two')]
```

### Suggested Encoding Format

Do not use tabs for indentation, use 4 spaces for indentation
Line breaks when necessary (avoid single lines exceeding 79 characters)
Use spaces to distinguish between functions or classes or long blocks of code inside functions
Add necessary comments before the code
Use docstrings
Spaces must be on both sides of operators or after commas
Functions should be named in lower_case_width_underscore style, classes should be named in CamelCase; always use self as the first parameter of class methods
Do not use special encoding formats (ASCII is compatible with all)

### Data Structure

#### Array

Python data has some commonly used methods by default: such as append, extend, insert, etc

#### Used as a stack

```javascript
>>> stack = [3, 4, 5]
>>> stack.append(6)
```
>>> stack.append(7)
>>> stack
[3, 4, 5, 6, 7]
>>> stack.pop()
7
>>> stack
[3, 4, 5]
>>> stack.pop()
6
>>> stack.pop()
5
>>> stack
[3, 4]
```

#### Using as a Queue

```
>>> from collections import deque
>>> queue = deque(["Eric", "John", "Michael"])
>>> queue.append("Terry")          # Terry arrives
>>> queue.append("Graham")          # Graham arrives
>>> queue.popleft()                # The first to arrive now leaves
'Eric'
>>> queue.popleft()                # The second to arrive now leaves
'John'
>>> queue                          # Remaining queue in order of arrival
deque(['Michael', 'Terry', 'Graham'])
```

#### Some common methods

filter(function, sequence): Returns all values for which function returns true

```
>>> def f(x): return x % 3 == 0 or x % 5 == 0
...
>>> filter(f, range(2, 25))
[3, 5, 6, 9, 10, 12, 15, 18, 20, 21, 24]
```

map(function, sequence): Returns the processed values

```
>>> def cube(x): return x*x*x
...
>>> map(cube, range(1, 11))
[1, 8, 27, 64, 125, 216, 343, 512, 729, 1000]
```

Pass two arrays: take one number from each array and return the sum

```
>>> seq = range(8)
>>> def add(x, y): return x+y
...
>>> map(add, seq, seq)
[0, 2, 4, 6, 8, 10, 12, 14]
```

reduce(function, sequence) : Adds the sum of the first two parameters of the array to the third parameter, and so on. If the array is empty, it returns an exception

```
>>> def add(x,y): return x+y
...
>>> reduce(add, range(1, 11))
55
```

reduce can specify the index of the first number to start:

```
>>> def sum(seq):
```
...    def add(x,y): return x+y
...    return reduce(add, seq, 0)
...
>>> sum(range(1, 11))
55
>>> sum([])
0
```

Several forms of creating arrays:

```
>>> squares = []
>>> for x in range(10):
...    squares.append(x**2)
...
>>> squares
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

```
squares = [x**2 for x in range(10)]
```

```
squares = map(lambda x: x**2, range(10))
```

More complex examples: x, y as a whole must be enclosed in parentheses

```
>>> [(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
[(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]
```

More examples:

```
>>> freshfruit = ['  banana', '  loganberry ', 'passion fruit  ']
>>> [weapon.strip() for weapon in freshfruit]
['banana', 'loganberry', 'passion fruit']
>>> [x, x**2 for x in range(6)]
  File "<stdin>", line 1, in <module>
    [x, x**2 for x in range(6)]
^
SyntaxError: invalid syntax
>>> # flatten a list using a list comprehension with two 'for' loops
>>> vec = [[1,2,3], [4,5,6], [7,8,9]]
>>> [num for elem in vec for num in elem]
[1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> from math import pi
>>> [str(round(pi, i)) for i in range(1, 6)]
['3.1', '3.14', '3.142', '3.1416', '3.14159']
```

#### Two-dimensional array

```
>>> matrix = [
...    [1, 2, 3, 4],
...    [5, 6, 7, 8],
...    [9, 10, 11, 12],
... ]
```

More complex examples:

```
>>> [[row[i] for row in matrix] for i in range(4)]
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

is equivalent to:

```

```
>>> transposed = []
>>> for i in range(4):
...    transposed.append([row[i] for row in matrix])

```
...
>>> transposed
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

Remove elements from array: del

```
>>> a = [-1, 1, 66.25, 333, 333, 1234.5]
>>> del a[0]
>>> a
[1, 66.25, 333, 333, 1234.5]
>>> del a[2:4]
>>> a
[1, 66.25, 1234.5]
>>> del a[:]
>>> a
[]
```

Delete the entire array:

```
>>> del a
```

#### New type: Tuple.

Input can have parentheses or not. Output is always with parentheses.

```
>>> t = 12345, 54321, 'hello!'  # Input without parentheses
>>> t[0]
12345
>>> t
(12345, 54321, 'hello!')  # Output with parentheses
>>> # Tuples may be nested:
... u = t, (1, 2, 3, 4, 5)
>>> u
((12345, 54321, 'hello!'), (1, 2, 3, 4, 5))
>>> # Cannot be modified
... t[0] = 88888
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
TypeError: 'tuple' object does not support item assignment
>>> # The internal elements can be mutable types such as arrays, etc.
... v = ([1, 2, 3], [3, 2, 1])
>>> v
([1, 2, 3], [3, 2, 1])
```

Empty tuples and tuples with a single element:

```

```
>>> empty = ()
>>> singleton = 'hello',    # <-- note trailing comma
>>> len(empty)

```
0
>>> len(singleton)
1
>>> singleton
('hello',)
```

Reverse elements:

```
>>> t = (12345, 54321, 'hello!')
>>> x, y, z = t
```

#### New type: Set

Create an empty set: set()

```
>>> basket = ['apple', 'orange', 'apple', 'pear', 'orange', 'banana']
>>> fruit = set(basket)              # Create a set
>>> fruit
set(['orange', 'pear', 'apple', 'banana'])
>>> 'orange' in fruit                # Test if 'orange' is in the set fruit
True
>>> 'crabgrass' in fruit
False
```

Intersection of set a, b and union of set a, b

```
>>> a = set('abracadabra')
>>> b = set('alacazam')
>>> a                                  # unique letters in a
set(['a', 'r', 'b', 'c', 'd'])
>>> a - b                              # letters in a but not in b
set(['r', 'd', 'b'])
>>> a | b                              # letters in either a or b
set(['a', 'c', 'r', 'd', 'b', 'm', 'z', 'l'])
>>> a & b                              # letters in both a and b
set(['a', 'c'])
>>> a ^ b                              # letters in a or b but not both
set(['r', 'd', 'b', 'm', 'z', 'l'])
```

```
>>> a = {x for x in 'abracadabra' if x not in 'abc'}
>>> a
set(['r', 'd'])
```

#### New type: Dictionary

Dictionaries are indexed by keys, and the key data type can be a number or a string. Tuple elements are immutable and can also be used as keys. Arrays cannot be used as keys because arrays can be modified

```
>>> tel = {'jack': 4098, 'sape': 4139}
>>> tel['guido'] = 4127
>>> tel
{'sape': 4139, 'guido': 4127, 'jack': 4098}
>>> tel['jack']
4098
>>> del tel['sape']
>>> tel['irv'] = 4127
>>> tel
{'guido': 4127, 'irv': 4127, 'jack': 4098}
>>> tel.keys()
['guido', 'irv', 'jack']
>>> 'guido' in tel
True
```

Create a dictionary directly using the dict method:

```
>>> {'sape': 4139, 'guido': 4127, 'jack': 4098}
{'sape': 4139, 'jack': 4098, 'guido': 4127}
```

```
>>> {x: x**2 for x in (2, 4, 6)}
{2: 4, 4: 16, 6: 36}
```

```
>>> dict(sape=4139, guido=4127, jack=4098)
{'sape': 4139, 'jack': 4098, 'guido': 4127}
```

#### Traversal

Using the enumerate method

```
>>> for i, v in enumerate(['tic', 'tac', 'toe']):
...    print i, v
...
0 tick
1 tack
2 toe
```

Single traversal of multiple (this feature is good..

```
>>> questions = ['name', 'quest', 'favorite color']
>>> answers = ['lancelot', 'the holy grail', 'blue']
>>> for q, a in zip(questions, answers):
...    print 'What is your {0}?  It is {1}.'.format(q, a)
...
What is your name?  It is lancelot.
What is your quest?  It is the holy grail.
What is your favorite color?  It is blue
```

Reverse traversal: reversed

```
>>> for i in reversed(range(1, 10, 2)):
...    print(i)
...
9
7
5
3
1
```

Sort the array (sorted method), then iterate:

```
>>> basket = ['apple', 'orange', 'apple', 'pear', 'orange', 'banana']
>>> for f in sorted(set(basket)):
...    print f
...
apple
banana
orange
pear
```

When traversing the dictionary, obtain the key and value:

```
>>> knights = {'gallahad': 'the pure', 'robin': 'the brave'}

```
>>> for k, v in knights.iteritems():
...    print k, v
...
gallahad the pure
robin the brave
```

Change an array when traversing:

```
>>> import math
>>> raw_data = [56.2, float('NaN'), 51.7, 55.3, 52.5, float('NaN'), 47.8]
>>> filtered_data = []
>>> for value in raw_data:
...    if not math.isnan(value):
...        filtered_data.append(value)
...
>>> filtered_data
[56.2, 51.7, 55.3, 52.5, 47.8]
```

#### More conditional statements

Comparison operators:
in and not in determine whether something is in a sequence; is and is not are used to compare whether two objects are the same object;
Comparisons can be chained: a < b == c checks if a is less than b, and b is equal to c
Boolean operators: and and or have lower precedence than comparison operators; not has the highest precedence and or has the lowest

With boolean operators, if one condition is met, the calculation will not continue to the next one

Comparison results can be assigned:

```
>>> string1, string2, string3 = '', 'Trondheim', 'Hammer Dance'
>>> non_null = string1 or string2 or string3
>>> non_null
'Trondheim'
```

### Module

After exiting the interpreter, all declared functions or variables no longer exist. So we need to create a Python script that can run sustainably. Each script file is called a module.
For example, we create a file: fibo.py

```
# This is a module

def fib(n):    # Define function fib
    a, b = 0, 1
    while b < n:
        print b,
a, b = b, a+b

def fib2(n):  # Define function fib2
    result = []
    a, b = 0, 1
while b < n:
        result.append(b)
        a, b = b, a+b
    return result
```

Import this module in the interpreter:

```
>>> import fibo
```
```

Functions of the access module:

```
>>> fibo.fib(1000)

```
1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
>>> fibo.fib2(100)
[1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
>>> fibo.__name__
'fibo'
```

A function is assigned to a variable

```
>>> fib = fibo.fib
>>> fib(500)
1 1 2 3 5 8 13 21 34 55 89
```

### Execute module script

To run a module like this

```
python fibo.py <arguments>
```

It's the same as importing a module and setting __name__ to __main__: equivalent to putting the following code at the bottom of the module

```
if __name__ == "__main__":
import sys
    fib(int(sys.argv[1]))
```

Importing it alone will not run this script:

```
>>> import fibo
>>>
```

### Module Search Path

1 Built-in modules
2 Search all directories in sys.path

Initialization content of sys.path:
Current directory
PYTHONPATH (directory path, with the same syntax as the environment variable PATH)
Python installation path

sys.path will be modified, the current directory takes precedence over the standard library path.

### Compiled Python Files

If spam.pyc (the compiled Python file) and spam.py coexist, the compiled file will be used first. If the compilation time saved in spam.pyc does not match the modification time of spam.py, the compiled file will be ignored (i.e., the spam.py file will be used). The spam.pyc file is platform-independent, meaning it can be shared across different platforms.

### Standard Modules

Python has its own standard library. To access lower-level functionality, some modules are built into the parser. Additionally, some built-in modules depend on the environment; for example, the winreg module is only provided in the Windows environment. A notable module is sys, which is built into every Python interpreter. sys.ps1 and sys.ps2 represent Python's prompt.

```
>>>import sys
>>>sys.ps1
'>>> '
>>> sys.ps2
'... '
>>> sys.ps1 = 'C> '
C> print 'Yuck!'
Yuck!
C>
```

The value of sys.path is the interpreter's module search path. We can add to the path:

```
>>> import sys
>>> sys.path.append('/ufs/guido/lib/python')
```

#### dir() function

The dir() function returns an array of strings, which is used to indicate what names a module defines

```
>>> import fibo, sys
>>> dir(fibo)
['__name__', 'fib', 'fib2']
>>> dir(sys)  
['__displayhook__', '__doc__', '__excepthook__', '__name__', '__package__']
'__stderr__', '__stdin__', '__stdout__', '_clear_type_cache',
'_current_frames', '_getframe', '_mercurial', 'api_version', 'argv',
'builtin_module_names', 'byteorder', 'call_tracing', 'callstats',
'copyright', 'displayhook', 'dont_write_bytecode', 'exc_clear', 'exc_info'
'exc_traceback', 'exc_type', 'exc_value', 'excepthook', 'exec_prefix',
'executable', 'exit', 'flags', 'float_info', 'float_repr_style',
'getcheckinterval', 'getdefaultencoding', 'getdlopenflags',
'getfilesystemencoding', 'getobjects', 'getprofile', 'getrecursionlimit',
'getrefcount', 'getsizeof', 'gettotalrefcount', 'gettrace', 'hexversion',
'long_info', 'maxint', 'maxsize', 'maxunicode', 'meta_path', 'modules',
'path', 'path_hooks', 'path_importer_cache', 'platform', 'prefix', 'ps1',
'py3kwarning', 'setcheckinterval', 'setdlopenflags', 'setprofile'
'setrecursionlimit', 'settrace', 'stderr', 'stdin', 'stdout', 'subversion',
'version', 'version_info', 'warnoptions']
```

Returns the currently defined module\function\variable names without parameters

```
>>> a = [1, 2, 3, 4, 5]
>>> import fibo
>>> fib = fibo.fib
>>> dir()
['__builtins__', '__name__', '__package__', 'a', 'fib', 'fibo', 'sys']
```

dir() does not return built-in functions and variables. To print built-ins, you need to pass __builtin__

```
>>> import __builtin__
>>> dir(__builtin__)  
['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException',
'BufferError', 'BytesWarning', 'DeprecationWarning', 'EOFError',
'Ellipsis', 'EnvironmentError', 'Exception', 'False', 'FloatingPointError',
'FutureWarning', 'GeneratorExit', 'IOError', 'ImportError', 'ImportWarning',
'IndentationError', 'IndexError', 'KeyError', 'KeyboardInterrupt',
'LookupError', 'MemoryError', 'NameError', 'None', 'NotImplemented',
'NotImplementedError', 'OSError', 'OverflowError',
'PendingDeprecationWarning', 'ReferenceError', 'RuntimeError',
'RuntimeWarning', 'StandardError', 'StopIteration', 'SyntaxError',
'SyntaxWarning', 'SystemError', 'SystemExit', 'TabError', 'True',
'TypeError', 'UnboundLocalError', 'UnicodeDecodeError',
'UnicodeEncodeError', 'UnicodeError', 'UnicodeTranslateError',
'UnicodeWarning', 'UserWarning', 'ValueError', 'Warning'
'ZeroDivisionError', '_', '__debug__', '__doc__', '__import__',
'__name__', '__package__', 'abs', 'all', 'any', 'apply', 'basestring',
'bin', 'bool', 'buffer', 'bytearray', 'bytes', 'callable', 'chr',
'classmethod', 'cmp', 'coerce', 'compile', 'complex', 'copyright',
'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval',
'execfile', 'exit', 'file', 'filter', 'float', 'format', 'frozenset',
'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input',
'int', 'intern', 'isinstance', 'issubclass', 'iter', 'len', 'license',
'list', 'locals', 'long', 'map', 'max', 'memoryview', 'min', 'next',
'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit',
'range', 'raw_input', 'reduce', 'reload', 'repr', 'reversed', 'round',
'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super',
'tuple', 'type', 'unichr', 'unicode', 'vars', 'xrange', 'zip']
```

#### Package

Packages are a way to organize Python modules, for example, A.B indicates that there is a sub-module B under package A.
A package structure is similar to the following:

```
sound/                          Top-level package
      __init__.py              Initialize the sound package

```
formats/                  Subpackage for file format conversions
              __init__.py
              wavread.py
              wavwrite.py
aiffread.py
              aiffwrite.py
              auread.py
              auwrite.py
...
      effects/                  Subpackage for sound effects
              __init__.py
              echo.py
surround.py
              reverse.py
              ...
      filters/                  Subpackage for filters
__init__.py
              equalizer.py
              vocoder.py
              karaoke.py
...
```

So how do we import it:

```
import sound.effects.echo
```

Then how to reference: Must use the full name to reference

```
sound.effects.echo.echofilter(input, output, delay=0.7, atten=4)
```

Another way to reference is:

```
from sound.effects import echo
```

This way of importing can avoid fully qualified names

```
echo.echofilter(input, output, delay=0.7, atten=4)
```

Of course, you can also introduce functions or variables:

```
from sound.effects.echo import echofilter
```

Calling the function directly:

```
echofilter(input, output, delay=0.7, atten=4)
```

Note: When importing in the following way, the last one (subsubitem) must be a package

```
import item.subitem.subsubitem
```

#### Importing Packages

Defined in sound/effects/__init__.py:

```
__all__ = ["echo", "surround", "reverse"]
```

So: Modules specified by the above __all__ will be imported in the following way

```
from sound.effects import *
```

If 'all' is not defined, the behavior of the import statement is not guaranteed.

```
import sound.effects.echo
import sound.effects.surround
from sound.effects import *
```

For example, this kind of syntax will import echo and surround

Not recommended to use *.

#### Internal package reference

You can use relative imports:

```
from . import echo
from .. import formats
from ..filters import equalizer
```

### Input and Output

#### Output Format

Output methods: sys.stdout standard output, print, write() method, etc
Formatted output: str.format()
Convert to string using repr() and str() functions:

```
>>> s = 'Hello, world.'
>>> str(s)
'Hello, world.'
>>> repr(s)
"'Hello, world.'"
>>> str(1.0/7.0)
'0.142857142857'
>>> repr(1.0/7.0)
'0.14285714285714285'
>>> x = 10 * 3.25
>>> y = 200 * 200
>>> s = 'The value of x is ' + repr(x) + ', and y is ' + repr(y) + '...'
>>> print s
The value of x is 32.5, and y is 40000...
>>> # The repr() of a string adds string quotes and backslashes:
... hello = 'hello, world\n'
>>> hellos = repr(hello)
>>> print hellos
'hello, world\n'
>>> # The argument to repr() may be any Python object:
... repr((x, y, ('spam', 'eggs')))
"(32.5, 40000, ('spam', 'eggs'))"
```

Print in table form:

```

```
>>> for x in range(1, 11):
...    print repr(x).rjust(2), repr(x*x).rjust(3),
...    # Note trailing comma on previous line

```
...    print repr(x*x*x).rjust(4)
...
1  1    1
2  4    8
3  9  27
4  16  64
5  25  125
6  36  216
7  49  343
8  64  512
9  81  729
10 100 1000

>>> for x in range(1,11):
...    print '{0:2d} {1:3d} {2:4d}'.format(x, x*x, x*x*x)
...
1  1    1
2  4    8
3  9  27
4  16  64
5  25  125
6  36  216
7  49  343
8  64  512
9  81  729
10 100 1000
```

str.rjust() aligns the string to the right
str.zfill() ensures the string has a certain number of digits

```
>>> '12'.zfill(5)
'00012'
>>> '-3.14'.zfill(7)
'-003.14'
>>> '3.14159265359'.zfill(5)
'3.14159265359'
```

Basic usage of str.format():

```
>>> print 'We are the {} who say "{}!"'.format('knights', 'Ni')
We are the knights who say "Ni!"
```

Swap positions:

```
>>> print '{0} and {1}'.format('spam', 'eggs')
Spam and eggs
>>> print '{1} and {0}'.format('spam', 'eggs')
Eggs and spam
```

Access via key:

```
>>> print 'This {food} is {adjective}.'.format(
...      food='spam', adjective='absolutely horrible')
This spam is absolutely horrible.
```

Mixed use:

```
>>> print 'The story of {0}, {1}, and {other}.'.format('Bill', 'Manfred')
...                                                    other='Georg')
The story of Bill, Manfred, and Georg.
```

'!s' (calls str()) and '!r' (calls repr()) perform format conversion before printing:

```
>>> import math
>>> print 'The value of PI is approximately {}.'.format(math.pi)
The value of PI is approximately 3.14159265359.
>>> print 'The value of PI is approximately {!r}.'.format(math.pi)
The value of PI is approximately 3.141592653589793.
```

':' Can control the decimal point:

```
>>> import math
>>> print 'The value of PI is approximately {0:.3f}.'.format(math.pi)
The value of PI is approximately 3.142.
```

Control table:

```
>>> table = {'Sjoerd': 4127, 'Jack': 4098, 'Dcab': 7678}
>>> for name, phone in table.items():
...    print '{0:10} ==> {1:10d}'.format(name, phone)
...
Jack      ==>      4098
Dcab      ==>      7678
Sjoerd    ==>      4127
```

Access key through []

```
>>> table = {'Sjoerd': 4127, 'Jack': 4098, 'Dcab': 8637678}
>>> print ('Jack: {0[Jack]:d}; Sjoerd: {0[Sjoerd]:d}; ')
...        'Dcab: {0[Dcab]:d}'.format(table))
Jack: 4098; Sjoerd: 4127; Dcab: 8637678
```

#### % Operator can also format (old-style)

```
>>> import math
>>> print 'The value of PI is approximately %5.3f.' % math.pi
The value of PI is approximately 3.142.
```

#### Reading and writing files

open() to open a file: open(filename, mode)

```
>>> f = open('workfile', 'w')
>>> print f
<open file 'workfile', mode 'w' at 80a0960
```

'b' indicates binary format, cross-platform

#### Methods of file objects

Read file: f.read(size)

```
>>> f.read()
'This is the entire file.\n'
>>> f.read()
''
```

With line break:

```
>>> f.readline()
'This is the first line of the file.\n'
>>> f.readline()
'Second line of the file\n'
>>> f.readline()
''
```

Read all lines of a file:

```
>> for line in f:
        print line,

This is the first line of the file.
Second line of the file
```

or list(f) or f.readlines()
String writing to file:

```
>>> f.write('This is a test\n')
```

To write other types to a file, they must be converted to strings first:

```
>>> value = ('the answer', 42)
>>> s = str(value)
>>> f.write(s)
```

f.tell() returns an integer representing the current position in the file (in bytes). For example: 

```
>>> f = open('workfile', 'r+')
>>> f.write('0123456789abcdef')
>>> f.seek(5)      # To the 6th byte
>>> f.read(1)
'5'
>>> f.seek(-3, 2)  # Position of the 3rd byte from the end (2 indicates from the end)
>>> f.read(1)
'd'
```

Release file resources:

```
>>> f.close()
>>> f.read()
Traceback (most recent call last):
File "<stdin>", line 1, in <module>
ValueError: I/O operation on closed file
```

The best practice is to use with: even if an exception is thrown, the file resource can be released

```
>>> with open('workfile', 'r') as f:
...    read_data = f.read()
>>> f.closed
True
```

#### Save JSON data

Serialization: Convert JSON to string Deserialization: Convert string to JSON

```
>>> import json
>>> json.dumps([1, 'simple', 'list'])
'[1, "simple", "list"]'
```

Serializing an object to a file: f is a file object

```
json.dump(x, f)

```
```

Reading from a file:

```
x = json.load(f)

```
```

### Errors and Exceptions

#### Grammar error

```
>>> while True print 'Hello world'
  File "<stdin>", line 1
    while True print 'Hello world'
                  ^
SyntaxError: invalid syntax
```

#### Execution Exception

```
>>> 10 * (1/0)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ZeroDivisionError: integer division or modulo by zero
>>> 4 + spam*3
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'spam' is not defined
>>> '2' + 2
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: cannot concatenate 'str' and 'int' objects
```

#### Handling Exceptions

```
>>> while True:
```
...    try:
...        x = int(input("Please enter a number: "))
...        break
...    except ValueError:
...        print "Oops!  That was no valid number.  Try again..."
...
```

Only ValueError is caught here; if more exceptions are caught:

```
... except (RuntimeError, TypeError, NameError):
...    pass
```

```
import sys

try:
    f = open('myfile.txt')
s = f.readline()
    i = int(s.strip())
except IOError as e:
    print "I/O error({0}): {1}".format(e.errno, e.strerror)
except ValueError:
    print("Could not convert data to an integer.")
except:
    print("Unexpected error:", sys.exc_info()[0])
raise
```

The code after try...except...else..else will always execute

```