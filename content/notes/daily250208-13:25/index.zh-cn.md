---
title: "python入门笔记"
date: 2019-11-25
---

#python #编程语言

https://github.com/jackfrued/Python-100-Days

## 引子
作为一名前端工程师，刷题了。 用Python刷题，代码十分简洁。 

用法和JavaScript类似，比如解构，无。 在
动态语言，不需要编译。

### 数据类型

- Intergers : <class 'int'>
```python
x**2 # x的平方
```
- Float : <class 'float'>
```python
float('-inf')
float('inf')	
```


- Complex Numbers: <class 'complex'>
- String: <class 'str'> -1可访问最后一个元素
```python
int('123') #字符串转数字
```


- 数组：-1访问最后一个元素

```python
nums.pop(0) #pop指定元素
```

- 元组: 直接不可变。 内部元素类型是可变的。
```python
tuple = ()
tuple = ('123', 123)
tuple([123, 456])

```
- Boolean: <class 'bool'> True, False, true	
- Set: 自动去除重复元素
```python

set("test")
set1 = set(['23', '454'])
set2 = set(['34'])
print('234' in set1)
print(set1 - set2) # 交集
print(set1 | set2) # 并集
print(set1 ^ set2) # 补集
```
- Dict: 
```python
dict2 = { 'a': 1231 }
dict1 = dict({1: 'Geeks'}) # 其他方式 dict(aaa=123) dict(('asdf', 123))
dict1[1]
del dict1[1]
dict1.keys()
1 in dict1 # 判断key是否存在

# 数组转字典

list_1 = [('a', 1), ('b',2)]
result = dict(list_1)
print(result)

defaultdict(list) # 声明一个hashmap, 类似userId -> list
defaultdict(set) # 声明一个hashmap, 类似userId -> set

```

初始化多个元素
```python
a, b = 1, 2
```

判断数组是否为空
```python
z = []
if z:
	print(True)
```

### 数据类型基本方法

数字
```python
323 // 3 # 除法取整（向下取整）
```

字典：dict()， dict.keys(), dict.items() 
```python
dict.items() # 返回数组（元素是元组）

dict.get('a', 0) # 第二个参数可以赋予默认值
```


集合：set()
元组：tuple()
#### 字符串
格式化字符串

```python
name = "Alice"
age = 30

# 使用f-string
print(f"My name is {name} and I am {age} years old.")

# 使用format
print("Hello, {}. You are {} years old.".format("Alice", 25))
# 输出: Hello, Alice. You are 25 years old.

print("Hello, {1}. You are {0} years old.".format(25, "Alice"))
# 输出: Hello, Alice. You are 25 years old.

print("Hello, {name}. You are {age} years old.".format(name="Alice", age=25))
# 输出: Hello, Alice. You are 25 years old.
```


format() 
浮点：float()

#### 数组
append() pop() insert(index, value) len() 

访问元素:
``` python
list = [1,2]
list[-1] # 访问最后一个元素

res + intervals[i:] # 数组合并
```

数组切片
``` python
list[:k] #返回前k个元素 
list[k+1:] #返回k+1(包含）后面的元素
```

取出数组（元素是元组）的前n个key:
``` python
list_1 = [('A', 1), ('b',2), ('b',3), ('d', 6)]  
keys = [item[0] for item in list_1[:3]]  
print(keys)
```
初始化数组：
``` python

list = [0] * length # 初始化数组

# 数组内部是对象
rows = [{} for _ in range(9)]  

```
合并数组
``` python
list = [4, 5]
list.extend([2,2,3]) # 会修改原数组
  
list2 = list + [6,8]  #  合并并返回新数组
print(list2)
```

### 二维数组
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

### 内置方法
str() : 转为字符串
ord('a'): 返回字符的ascii码
enumerate()
zip()：返回一个迭代器，内部是一个元祖
sorted()：
``` python

# 对数组进行排序  
list_1 = [('A', 1), ('b',2)]  
print(sorted(list_1, key=lambda x:x[1], reverse=True))  
list_2 = [4,2,6]  
print(sorted(list_2, reverse=True)) 

# 对字典（相当于对象）进行排序，需要先通过
# dict.items()方法转为数组（元素都是元组），然后再排序
dict_1 = { 'a': 5, 'b': 4, 'd': 3 }  
print(sorted(dict_1.items(), key=lambda x:x[1]))

# reverse
sorted(list)[::-1]

```
reversed(): 反转数组

reversed()
type() 确定数据类型的类型

range(): 返回数组
``` python
 range(4) => [0,1,2,3,4] 
 range(0, 10, 3) #递增3  
 range(3, -1, -1) #表示倒着的步长
   
list = "add"  
list2 = "cddf"  
for i in range(3, 5):  
    print(i) # 3 4 不会打印5
```
filter(fn, [])
map(fn, []) map(fn, [], [])
reduce(fn, []) reduce(fn, [], 0) 







### 关键字
in 
not in 
del
not
or: 相当于||
and：相当于&&
pass: pass语句不会做任何事，只是用来占位
None
False
True
true
is
as: 起别名

```python
result = 3 * 4  # Multiplication: result is 12

result = 2 ** 3  # Exponentiation: result is 8 幂次


"ADF" * 123 # ADF重复123次 
```
### 条件语句
- 遍历 for ...in  注意后面有一个冒号. for in 还有其他用法可以参看二维数组 break跳出循环 continue跳过后面的执行
- 遍历 while 大部分的对象都可以遍历

> 内部：for语句调用了iter()方法，然后调用next()方法访问下一个元素，如果没有下一个会抛出StopInteration异常
>  s = 'asdf'
>  it = iter(s)
>  it.next()

给类加迭代器

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

# 复杂例子
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
- 条件 if ：后面也会有一个冒号

### 三元表达式

``` python
val if not self.min else min(val, self.min[-1])

if not self.min # 判断数组为空
if self.min # 判断数组不为空


position = [4,3]
speed[2,3]
[[p,s]] for p, s in zip(position, speed)

list = matrix[lastIndex - 1 if lastIndex > 0 else 0] # 条件判断

selected_elements = [row[0] for row in dict] # 取二维数组的第一个元素

```

### 函数

通过def关键字定义函数，函数可以被赋值

```python

def fib(n): 
	a = 0
	while a < n:
		print(a)

```


参数带默认值，默认值可以是变量。
```python
def ask_ok(prompt, retries=4, complaint='Yes or no, please!'):
	print(prompt)
```

如果默认是引用类型，值会多次改变

```python
def f(a, L = None):
	pass


def f(a, L):
	if L is None:
		L = []
	L.append(a)
```

关键词参数（函数注解）

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

# 打印函数注解
print(greet.__doc__)

```

函数返回类型

``` python

def topK(nums: List[int]) -> List[int]:

```

匿名函数
``` python

sorted(dict().items(), key = lambda x: x[1])


```

函数不可以直接用外部的值变量， 可以用引用类型 
```python
res = 0
def test:
	print(res)
test() # 这样会报错


res = [0]
def test:
	print(res[0]) # 这样ok
test()

#python 或者声明为nonlocal

res = 0
def test:
	nonlocal res
	print(res)


```

### 解构

```python
# ** 字典解构
def parrot(voltage, state='a stiff', action='voom'):
    print(action, voltage, state)
    
dict = { "voltage": 12, "state": 'g', "action": 'Zo' }

parrot(**dict)


# * 解构
a, *rest = [1, 2, 3, 4, 5]  # Unpacks the first element into 'a', and the rest into 'rest'

first, *rest, last = [1, 2, 3, 4, 5]
# 'first' is 1, 'rest' is [2, 3, 4], 'last' is 5


def my_function(*args):
    # 'args' is a tuple containing all positional arguments passed to the function
    print(args)

my_function(1, 2, 3)  # Output: (1, 2, 3)

values = [1, 2, 3]
my_function(*values)  # Equivalent to my_function(1, 2, 3)

# 数组解构
a, b = [1, 5]


```


### 定义类

```python

class MyClass: 
	""" test """
	i = 123123 # 类共享变量
	def __init__(self):
	    self.i = 323; # 实例变量
	def f(self):
		return 'hello'
		
		
a = MyClass.f('asdf')

b = MyClass.i

print(b)

b = MyClass()

print(b.i)

print(MyClass.__doc__)

```


继承
```python

class MyClass2(MyClass):
    j = 123

# 继承多个
class MyClass2(MyClass, MyClassBase):
    j = 123
```


类内引用
```python
class Mapping:
    def __init__(self, iterable):
        self.items_list = []
        self.__update(iterable)
    def update(self, iterable):
        for item in iterable:
            self.items_list.append(item)
    __update = update  # 拷贝一份update方法
class MappingSubclass(Mapping):
    def update(self, keys, values): # 子类可以重写update方法 并且不会影响到init方法
        for item in zip(keys, values):
            self.items_list.append(item)
```


### 异常处理

定义 异常

```python
class CustomExceptionHandler:
    def __enter__(self):
        # 在进入 with 语句块时执行的操作
        pass

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            # 在离开 with 语句块时，如果有异常发生，执行的操作
            print(f"捕获到异常: {exc_type.__name__}, 错误信息: {exc_value}")
            # 这里可以加入自定义的异常处理逻辑

            # 返回 True 表示异常已经被处理，不会再次被抛出；返回 False 表示异常将继续传播
            return True
        # 如果没有异常发生，返回 None

# 示例用法
try:
    with CustomExceptionHandler():
        # 这里放置可能会引发异常的代码
        result = 1 / 0  # 除以零会引发一个 ZeroDivisionError 异常
except Exception as e:
    # 这里可以处理未在 CustomExceptionHandler 中处理的异常
    print(f"未被 CustomExceptionHandler 处理的异常: {type(e).__name__}, 错误信息: {str(e)}")

```

抛出异常
```python
raise StopException
```

### 导入

```python
import module_name as alias_name # 导入模块

from module_name import MyClass as AliasClass # 导入类并起别名

```


### 运行python解释器

```python
python -c command [arg]
```
退出
```python
quit()
```


### 标准库

#### 数学
包名：math

```python
math.isnan()
math.prod() # 相乘

```

#### 字典
``` python
from collections import OrderedDict

# OrderedDict 返回的顺序是你添加的顺序

dict = OrderedDict({"a": 1, "b": 2})
print(dict)

```


#### Liss相关

包名： collections

```python
# Import the 'deque' class from the 'collections' module
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

包：bisect

```python
import bisect
scores = [(100, 'PER1'), (200, 'TCS'), (400, 'dsf')]
bisect.insort(scores, (300, 'sdf'))
print(scores)
```

#### 浮点

```python

from decimal import *

x = Decimal('0.07') * Decimal('0.02')

print(x)


y = x.quantize(Decimal('0.01')) # 四舍五入
print(y)


z = round(0.70 * 1.123, 2) # 浮点计算，保留两位小数

print(z)

```

#### 弱引用

```python
import weakref, gc
class A:
    def __init__(self, value):
        self.value = value
        
    def __repr__(self):
        return str(self.value)
        
        
a = A(10)
d = weakref.WeakValueDictionary()
d['primary'] = a # 不会创建引用
print(d['primary'])

del a
gc.collect()
d['primary']
```




#### IO操作

open() 打开文件

#### 日志

```python
import logging
logging.debug('Debugging')

logging.info('Infomatiiii')

logging.warning('Warning')

logging.error('error')
logging.critical('critical')
```

#### 队列
```python
dq = deque([root]) # 双端队列

node = dq.popleft()
```

####  小顶堆
```python
import heapq # python没有大顶堆。 所以一般把所有的值都弄成负数模拟大顶堆

minheap = [2,2,3]
# 或者
minHeap = [[10,2,3], [8,2,4]]

heapq.heapify(self.minHeap) # 时间复杂度是nlogn
heapq.heappop(self.minHeap)
heapq.heappush(self.minHeap, val)
len(self.minHeap)

```



