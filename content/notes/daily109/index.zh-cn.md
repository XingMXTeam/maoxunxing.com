---
title: "Hash表"
date: 2019-11-25
---

是字典：一种抽象数据类型，它维护一个存在key的元素集合
-insert(item) : 如果已存在则覆盖
-delete(item)
-search(key): 返回是该key的元素或者告知不存在

用数组实现Hash表：
不好的地方：
1 keys可能不是整数
2 因为直接把key作为数组索引，数组空间占用可能很大

可以通过散列函数计算key（如果key相同，那么他们的hash值一定相同:hash(x)=hash(y)<==> x = y）

实现方案：
链表实现： 最差情况是θ(n)
n个keys, m个插槽-> 链表的预期长度是：n/m
运行时间：O（1+α）

散列函数：m个插槽
1：hash(key) = key mode m

2 multiplication method
h(k) = [(a*k) mode 2^w] >> (w-r)

3 universal hashing