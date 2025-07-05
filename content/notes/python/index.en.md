---
title: "Python Classes and Standard Library"
date: 2019-11-25
tags:
  - Python
---
## Table of Contents
1. [Python Classes](#Python-Classes)
   - [Defining Classes](#Defining-Classes)
   - [Referencing Class Attributes and Methods](#Referencing-Class-Attributes-and-Methods)
   - [Defining the init method, setting default attributes](#Defining-the-init-method-setting-default-attributes)
   - [Class Shared Variables and Instance Variables](#Class-Shared-Variables-and-Instance-Variables)
   - [Note: Avoid reference variables being shared by all instances](#Note-Avoid-reference-variables-being-shared-by-all-instances)
   - [Function definitions can be outside the class](#Function-definitions-can-be-outside-the-class)
   - [Referencing functions via self](#Referencing-functions-via-self)
   - [Inheritance](#Inheritance)9
## Python Classes
### Defining Classes
```
class MyClass:
    """A simple example class"""
    i = 12345
    def f(self):
        return 'hello world'
```
### Referencing Class Attributes and Methods
MyClass.i and MyClass.f
MyClass.__doc__ => "A simple example class"
### Defining the init method, setting default attributes
```
def __init__(self):
    self.data = []
```
Arguments passed to the class are passed to init:
```
>>> class Complex:
...    def __init__(self, realpart, imagpart):
...        self.r = realpart
...        self.i = imagpart
...
>>> x = Complex(3.0, -4.5)
>>> x.r, x.i
(3.0, -4.5)
```
### Class Shared Variables and Instance Variables
```
class Dog:
    kind = 'canine'        # class shared variable
    def __init__(self, name):
        self.name = name    # instance variable
>>> d = Dog('Fido')
>>> e = Dog('Buddy')
>>> d.kind                  # shared by all dogs
'canine'
>>> e.kind                  # shared by all dogs
'canine'
>>> d.name                  # unique to d
'Fido'
>>> e.name                  # unique to e
'Buddy'
```
#### Note: Avoid reference variables being shared by all instances
```
class Dog:
    tricks = []            # mistaken use of a class variable
    def __init__(self, name):
        self.name = name
    def add_trick(self, trick):
        self.tricks.append(trick)
>>> d = Dog('Fido')
>>> e = Dog('Buddy')
>>> d.add_trick('roll over')
>>> e.add_trick('play dead')
>>> d.tricks                # here tricks are shared by all instances
['roll over', 'play dead']
```
The correct way to use it:
```
class Dog:
    def __init__(self, name):
        self.name = name
        self.tricks = []    # creates a new empty list for each dog
    def add_trick(self, trick):
        self.tricks.append(trick)
>>> d = Dog('Fido')
>>> e = Dog('Buddy')
>>> d.add_trick('roll over')
>>> e.add_trick('play dead')
>>> d.tricks
['roll over']
>>> e.tricks
['play dead']
```
#### Function definitions can be outside the class (not recommended)
```
# Function defined outside the class
def f1(self, x, y):
    return min(x, x+y)
class C:
    f = f1
    def g(self):
        return 'hello world'
    h = g
```
#### Referencing functions via self
```
class Bag:
    def __init__(self):
        self.data = []
    def add(self, x):
        self.data.append(x)
    def addtwice(self, x):
        self.add(x)
        self.add(x)
```
Every value is an object, and its class is stored in object.__class__
### Inheritance
Syntax:
```
class DerivedClassName(BaseClassName):
    <statement-1>
    .
    .
    .
    <statement-N>
```
Or (moduleName is the imported module)
```
class DerivedClassName(moduleName.BaseClassName):
```
If a referenced attribute is not found in the current class, it will look for it in its base class. A derived class can override methods of its base class.
Two built-in functions are useful:
To check an instance’s type: isinstance(obj, int) checks if it is an instance of the int class or a class inherited from it (returns true if obj.__class__ is int or a class inherited from int).
issubclass(bool, int): checks if bool is a subclass of int.
### Multiple Inheritance
```
class DerivedClassName(Base1, Base2, Base3):
    <statement-1>
    .
    .
    .
    <statement-N>
```
### Private Variables and Intra-class Referencing
Private variables generally start with an underscore _.
Internal method calls start with a double underscore __:
```
class Mapping:
    def __init__(self, iterable):
        self.items_list = []
        self.__update(iterable)
    def update(self, iterable):
        for item in iterable:
            self.items_list.append(item)
    __update = update  # copy the update method
class MappingSubclass(Mapping):
    def update(self, keys, values): # subclasses can override the update method without affecting the init method
        for item in zip(keys, values):
            self.items_list.append(item)
```
#### Exceptions are also classes
Syntax:
```
raise Class, instance
raise instance  (shorthand for raise instance.__class__, instance)
```
For example:
```
class B:
    pass
class C(B):
    pass
class D(C):
    pass
for c in [B, C, D]:
    try:
        raise c()
    except D:
        print "D"
    except C:
        print "C"
    except B:
        print "B"
```
#### Iteration
Most objects can be iterated over
```
for element in [1, 2, 3]:
    print element
for element in (1, 2, 3):
    print element
for key in {'one':1, 'two':2}:
    print key
for char in "123":
    print char
for line in open("myfile.txt"):
    print line,
```
Internally: the for statement calls the iter() method, then calls the next() method to access the next element. If there are no more elements, it raises a StopIteration exception.
```
>>> s = 'abc'
>>> it = iter(s)
>>> it
<iterator object at 0x00A1DB50>
>>> it.next()
'a'
>>> it.next()
'b'
>>> it.next()
'c'
>>> it.next()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
    it.next()
StopIteration
```
Adding an iterator to a class:
```
class Reverse:
    """Iterator for looping over a sequence backwards."""
    def __init__(self, data):
        self.data = data
        self.index = len(data)
    def __iter__(self):
        return self
    def next(self):
        if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]
```
Usage:
```
>>> rev = Reverse('spam')
>>> iter(rev)
<__main__.Reverse object at 0x00A1DB50>
>>> for char in rev:
...    print char
...
m
a
p
s
```
### Standard Library Related
#### System Interface
```
>>> import os
>>> os.getcwd()      # Returns the current directory
'C:\\Python26'
>>> os.chdir('/server/accesslogs')  # Change the working directory
>>> os.system('mkdir today')  # Run the shell command: mkdir
0
```
```
>>> import os
>>> dir(os)
<returns a list of all module functions>
>>> help(os)
<returns an extensive manual page created from the module's docstrings>
```
File operations:
```
>>> import shutil
>>> shutil.copyfile('data.db', 'archive.db')
>>> shutil.move('/build/executables', 'installdir')
```
#### File Wildcards
```
>>> import glob
>>> glob.glob('*.py')
['primes.py', 'random.py', 'quote.py']
```
#### Command Line Arguments
For example, if we run this command: python demo.py one two three
The code inside demo.py would be:
```
>>> import sys
>>> print sys.argv
['demo.py', 'one', 'two', 'three']
```
The getopt and argparse modules provide more flexible ways to access command-line arguments.
#### Exiting the program and printing errors
sys.exit()
Printing errors:
```
>>> sys.stderr.write('Warning, log file not found starting a new one\n')
Warning, log file not found starting a new one
```
#### String Matching
```
>>> import re
>>> re.findall(r'\bf[a-z]*', 'which foot or hand fell fastest')
['foot', 'fell', 'fastest']
>>> re.sub(r'(\b[a-z]+) \1', r'\1', 'cat in the the hat')
'cat in the hat'
```
```
>>> 'tea for too'.replace('too', 'two')
'tea for two'
```
#### Mathematics
```
>>> import math
>>> math.cos(math.pi / 4.0)
0.70710678118654757
>>> math.log(1024, 2)
10.0
```
```
>>> import random
>>> random.choice(['apple', 'pear', 'banana'])
'apple'
>>> random.sample(xrange(100), 10)  # sampling without replacement
[30, 83, 16, 4, 8, 81, 41, 50, 18, 33]
>>> random.random()    # random float
0.17970987693706186
>>> random.randrange(6)    # random integer chosen from range(6)
4
```
#### Network Access
```
>>> import urllib2
>>> for line in urllib2.urlopen('http://tycho.usno.navy.mil/cgi-bin/timer.pl'):
...    if 'EST' in line or 'EDT' in line:  # look for Eastern Time
...        print line
<BR>Nov. 25, 09:43:32 PM EST
>>> import smtplib
>>> server = smtplib.SMTP('localhost')
>>> server.sendmail('soothsayer@example.org', 'jcaesar@example.org',
... """To: jcaesar@example.org
... From: soothsayer@example.org
...
... Beware the Ides of March.
... """)
>>> server.quit()
```
#### Dates
```
>>> # dates are easily constructed and formatted
>>> from datetime import date
>>> now = date.today()
>>> now
datetime.date(2003, 12, 2)
>>> now.strftime("%m-%d-%y. %d %b %Y is a %A on the %d day of %B.")
'12-02-03. 02 Dec 2003 is a Tuesday on the 02 day of December.'
>>> # dates support calendar arithmetic
>>> birthday = date(1964, 7, 31)
>>> age = now - birthday
>>> age.days
14368
```
#### Data Compression
```
>>> import zlib
>>> s = 'witch which has which witches wrist watch'
>>> len(s)
41
>>> t = zlib.compress(s)
>>> len(t)
37
>>> zlib.decompress(t)
'witch which has which witches wrist watch'
>>> zlib.crc32(s)
226805979
```
#### Performance Testing
```
>>> from timeit import Timer
>>> Timer('t=a; a=b; b=t', 'a=1; b=2').timeit()
0.57535828626024577
>>> Timer('a,b = b,a', 'a=1; b=2').timeit()
0.54962537085770791
```
#### Quality Control
Running test code within the documentation:
```
def average(values):
    """Computes the arithmetic mean of a list of numbers.
    >>> print average([20, 30, 70])
    40.0
    """
    return sum(values, 0.0) / len(values)
import doctest
doctest.testmod()  # automatically validate the embedded tests
```
Running a test suite:
```
import unittest
class TestStatisticalFunctions(unittest.TestCase):
    def test_average(self):
        self.assertEqual(average([20, 30, 70]), 40.0)
        self.assertEqual(round(average([1, 5, 7]), 1), 4.3)
        with self.assertRaises(ZeroDivisionError):
            average([])
        with self.assertRaises(TypeError):
            average(20, 30, 70)
unittest.main()  # Calling from the command line invokes all tests
```
#### Formatted Output
```
>>> import repr
>>> repr.repr(set('supercalifragilisticexpialidocious'))
"set(['a', 'c', 'd', 'e', 'f', 'g', ...])"
```
Automatic line wrapping and formatting:
```
>>> import pprint
>>> t = [[[['black', 'cyan'], 'white', ['green', 'red']], [['magenta',
...    'yellow'], 'blue']]]
...
>>> pprint.pprint(t, width=30)
[[[['black', 'cyan'],
  'white',
  ['green', 'red']],
  [['magenta', 'yellow'],
  'blue']]]
```
Limiting output width:
```
>>> import textwrap
>>> doc = """The wrap() method is just like fill() except that it returns
... a list of strings instead of one big string with newlines to separate
... the wrapped lines."""
...
>>> print textwrap.fill(doc, width=40)
The wrap() method is just like fill()
except that it returns a list of strings
instead of one big string with newlines
to separate the wrapped lines.
```
Localized output:
```
>>> import locale
>>> locale.setlocale(locale.LC_ALL, 'English_United States.1252')
'English_United States.1252'
>>> conv = locale.localeconv()          # get a mapping of conventions
>>> x = 1234567.8
>>> locale.format("%d", x, grouping=True)
'1,234,567'
>>> locale.format_string("%s%.*f", (conv['currency_symbol'],
...                      conv['frac_digits'], x), grouping=True)
'$1,234,567.80'
```
#### Templates
```
>>> from string import Template
>>> t = Template('${village}folk send $$10 to $cause.')
>>> t.substitute(village='Nottingham', cause='the ditch fund')
'Nottinghamfolk send $10 to the ditch fund.'
```
substitute will replace the keywords in the template. If the wrong arguments are passed, it will raise an exception. It is recommended to use safe_substitute:
```
>>> t = Template('Return the $item to $owner.')
>>> d = dict(item='unladen swallow')
>>> t.substitute(d)
Traceback (most recent call last):
  ...
KeyError: 'owner'
>>> t.safe_substitute(d)
'Return the unladen swallow to $owner.'
```
Custom delimiters:
```
>>> import time, os.path
>>> photofiles = ['img_1074.jpg', 'img_1076.jpg', 'img_1077.jpg']
>>> class BatchRename(Template):
...    delimiter = '%'
>>> fmt = raw_input('Enter rename style (%d-date %n-seqnum %f-format):  ')
Enter rename style (%d-date %n-seqnum %f-format):  Ashley_%n%f
>>> t = BatchRename(fmt)
>>> date = time.strftime('%d%b%y')
>>> for i, filename in enumerate(photofiles):
...    base, ext = os.path.splitext(filename)
...    newname = t.substitute(d=date, n=i, f=ext)
...    print '{0} --> {1}'.format(filename, newname)
img_1074.jpg --> Ashley_0.jpg
img_1076.jpg --> Ashley_1.jpg
img_1077.jpg --> Ashley_2.jpg
```
#### Multithreading
```
import threading, zipfile
class AsyncZip(threading.Thread):
    def __init__(self, infile, outfile):
        threading.Thread.__init__(self)
        self.infile = infile
        self.outfile = outfile
    def run(self):
        f = zipfile.ZipFile(self.outfile, 'w', zipfile.ZIP_DEFLATED)
        f.write(self.infile)
        f.close()
        print 'Finished background zip of: ', self.infile
background = AsyncZip('mydata.txt', 'myarchive.zip')
background.start()
print 'The main program continues to run in foreground.'
background.join()    # Wait for the background task to finish
print 'Main program waited until background was done.'
```
It is recommended to use a single thread, and then use the Queue module to implement multithreaded operations, which is easier for trial-and-error and design.
#### Logging
```
import logging
logging.debug('Debugging information')
logging.info('Informational message')
logging.warning('Warning:config file %s not found', 'server.conf')
logging.error('Error occurred')
logging.critical('Critical error -- shutting down')
```
#### Weak References
```
>>> import weakref, gc
>>> class A:
...    def __init__(self, value):
...        self.value = value
...    def __repr__(self):
...        return str(self.value)
...
>>> a = A(10)                  # create a reference
>>> d = weakref.WeakValueDictionary()
>>> d['primary'] = a            # does not create a reference
>>> d['primary']                # 
10
>>> del a                      # delete
>>> gc.collect()                # run garbage collection
0
>>> d['primary']                # accessing at this time will cause an error
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
    d['primary']                
  File "C:/python26/lib/weakref.py", line 46, in __getitem__
    o = self.data[key]()
KeyError: 'primary'
```
#### List-related Toolsets
Queues:
```
>>> from collections import deque
>>> d = deque(["task1", "task2", "task3"])
>>> d.append("task4")
>>> print "Handling", d.popleft()
Handling task1
```
Sorting operations: inserting an element into a sorted list
```
>>> import bisect
>>> scores = [(100, 'perl'), (200, 'tcl'), (400, 'lua'), (500, 'python')]
>>> bisect.insort(scores, (300, 'ruby'))
>>> scores
[(100, 'perl'), (200, 'tcl'), (300, 'ruby'), (400, 'lua'), (500, 'python')]
```
#### Precise Floating-Point Operations:
```
>>> from decimal import *
>>> x = Decimal('0.70') * Decimal('1.05')
>>> x
Decimal('0.7350')
>>> x.quantize(Decimal('0.01'))  # round to nearest cent
Decimal('0.74')
>>> round(.70 * 1.05, 2)        # same calculation with floats
0.73
```
