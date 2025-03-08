---
title: "[WIP] 碎片知识"
date: 2025-03-08
draft: true
tags:
  - Draft
---

## 页面允许以iframe方式嵌入

```shell
Content-Security-Policy: frame-ancestors self https://xxxx
```

通过增加这个，允许 iframe 被嵌入

---

## 百度站长文件验证失败 301问题分析及解决方法

尝试把网站加到百度搜索引擎，出现问题：

出现了验证失败，失败未知原因：301

问题原因是：
填写网站的时候，百度会让让我填www开头的网址：比如www.xx.com 实际上DNS配置的时候，www会301到https://xx.com 

所以验证的时候会301。

解决办法就是去掉网址的www

---

## 代码实践

1. 优化 if-else 嵌套
2. 校验逻辑集中到 DTO
3. 异步处理非阻塞性任务
4. 主链路失败与系统告警
5. 鉴权提前避免无效查询

### 优化 if-else 嵌套

在业务逻辑复杂的情况下，过多的 `if-else` 嵌套会让代码难以阅读和维护。通过改写为 `return` 语句，可以让代码更加简洁清晰。

**示例：**

```typescript
// 改写前
function checkStatus(status) {
  if (status === 'success') {
    if (someCondition()) {
      return 'valid';
    } else {
      return 'invalid';
    }
  } else {
    return 'error';
  }
}

// 改写后
function checkStatus(status) {
  if (status !== 'success') return 'error';
  if (!someCondition()) return 'invalid';
  return 'valid';
}

---

## java

### 设置 java_home

```shell
export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_361`
``` 

```shell
# .bash-profile
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_291.jdk/Contents/Home

export PATH=$JAVA_HOME/bin:$PATH

export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

### 查看版本

```shell
/usr/libexec/java_home -V
```
![alt text](image.png) 
高亮的是默认版本


### jdk 下载

https://www.oracle.com/java/technologies/downloads/#java8


### maven 下载

https://archive.apache.org/dist/maven/maven-3/3.5.4/binaries/

.zshrc: 添加source ~/.bash_profile 解决bash中有但是zsh没有的命令


### 环境变量管理工具

1. 下载安装`[jenv](https://github.com/linux-china/jenv)` [- jenv: the Java enVironment Manager](https://github.com/linux-china/jenv) ![](https://img.shields.io/github/stars/linux-china/jenv.svg?style=social&label=Starr&#alt=)，

2. `JDK`安装，在终端输入`jenv install java 1.8.0_91`，然后再设置环境`jenv use java 1.8.0_91`（推荐使用最新版本`jdk1.8`，和线上环境保持一致）
3. `maven` 安装，在终端输入`jenv install maven 3.5.0`，然后再设置环境`jenv use maven 3.5.0`。安装完后把`settings.xml`下载到指定位置，例如`~/.m2`

java调试： https://blog.csdn.net/qq_27093465/article/details/64124330

### Java 8 的 Stream API

```java
gopModuleCmps.stream().parallel().forEach(...)
```

### 代码阅读
command+option+b快速定位到实现

### mybatis 数据库写法

mapper是interface, 实现在xml文件

### 如何定义一个泛型类

```java
public class Test<T> {
	private T model;
}
```

### Optional

optional是Java 8引入的一个类，它属于java.util包。Optional类的主要目的是减少NullPointerException，这是Java程序中最常见的运行时异常。  
  
Optional是一个容器类，它可以保存类型T的值，或者什么都不保存（即Optional.empty()）。Optional提供了多种方法，如isPresent()，get()，orElse()等，以方便对内部值的访问和操作。  
  
例如，你可以使用Optional来避免空指针异常，如下所示：  
```java
Optional<String> optional = Optional.ofNullable(getStringMayReturnNull());

if (optional.isPresent()) {

    String value = optional.get();

    // do something with value

} else {

    // do something when value is null

}
```

  
在这个例子中，如果getStringMayReturnNull()方法返回null，Optional.ofNullable()会返回一个空的Optional对象，而不是null。然后，你可以使用isPresent()方法来检查Optional是否包含值，而不是直接检查值是否为null。

### 线上调试

`Arthas` java线上调试idea插件 

---

