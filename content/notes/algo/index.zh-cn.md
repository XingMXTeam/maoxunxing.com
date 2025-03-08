---
title: "搞定算法"
date: 2025-03-03
tags:
  - 算法
---

## 概述

常见的算法思想： 二分法、动态规划： 找极值 找零钱 重点、回溯

动态规划：
1 暴力
2 缓存
3 递推公式（整个50个题目练习）


*树* 前端最重要： 递归和迭代的思想  
层级遍历（虚拟dom) ： 最长递增子序列（vue的renderer.ts getSequence keepAlive(LRU Cache 基于链表的缓存结构)

拿公式（框架）套题目

环形链表： 套环了（跑圈） ； 重复访问了
双指针（链表、数组）


大整数（数组存

快排没有保证顺序， 冒泡有保证顺序



## 复杂度分析

时间复杂度一般是用大O表示法，简单理解就是常量的就是1，线性的就是n，二次方的就是n^2，指数型的就是logn。这里的1，n, n^2, logn可以简单理解为执行的代码行数之和，n是输入的规模。举个例子，比如一个对n执行for循环，它的时间复杂度是n，相当于console.log执行n次。这里的n是不确定的变量，如果这里的n是常量，比如n改为100，则时间复杂度是1。

```js
for(let i = 0; i < n; i++) {
	console.log(i)
}
```

所以时间复杂度是拉长来看的，而不是某个确定的值，是估计值，并且这个估计是上界。表示的是一个需要执行的代码行数随着n（输入的规模）变化的趋势图，比如时间复杂度f(n)=n，画出来的是一个线性图。
![[Pasted image 20230809113502.png]]

如果是两层循环，则时间复杂度是n * n, 也就是f(n)=n^2，这里用了相乘法。
![[Pasted image 20230809113339.png]]

空间复杂度：也是用大O表示法，和时间复杂度的理解一致，区别是时间换成空间，也就是说占用空间和输入规模的关系，比如占用空间固定就是1， 和n相关就是O(n)等等。需要注意的部分：我以前一直理解成代码占用的所有空间，其实不是。注意是看额外的空间消耗，比如判断是否回文，用快慢指针，空间复杂度是O(1) 而不是O(n)。

均摊复杂度： 一般都等于最好的时间复杂度，用得少。

时间复杂度一般就是相加法，复杂点的就是相乘法，还有更难得需要通过代数计算：
1、二分查找的时间复杂度分析，需要代数计算（比如这里是等比数列求和）
2、二叉树的时间复杂度分析： 方法是画递归树，通过简单的代数
运算（比如这里是等比数列求和）计算出来。




## 算法思想

### 排序

1、冒泡排序、插入排序、选择排序

如果数据存储在链表中，这三种排序算法还能工作吗？如果能，那相应的时间、空间复杂度又是多少呢？
对于老师所提课后题，觉得应该有个前提，是否允许修改链表的节点value值，还是只能改变节点的位置。一般而言，考虑只能改变节点位置，冒泡排序相比于数组实现，比较次数一致，但交换时操作更复杂；插入排序，比较次数一致，不需要再有后移操作，找到位置后可以直接插入，但排序完毕后可能需要倒置链表；选择排序比较次数一致，交换操作同样比较麻烦。综上，时间复杂度和空间复杂度并无明显变化，若追求极致性能，冒泡排序的时间复杂度系数会变大，插入排序系数会减小，选择排序无明显变化。

如果我们现在有 10 万条订单数据，我们希望按照金额从小到大对订单数据排序。对于金额相同的订单，我们希望按照下单时间从早到晚有序。对于这样一个排序需求，我们怎么来做呢？
比较差的做法是先按照金额排序，然后对金额一致的小区间按照下单时间排序。这种做法实际很复杂。 
比较好的做法是： 先按照下单时间排序（用稳定排序的算法），然后按照金额排序。


插入排序优于冒泡排序：
冒泡排序的数据交换要比插入排序的数据移动要复杂，冒泡排序需要 3 个赋值操作，而插入排序只需要 1 个。


2、快速排序、归并排序

场景： 
O(n)内查找第K大元素？
O(n) 时间复杂度内求无序数组中的第 K 大元素。比如，4， 2， 5， 12， 3 这样一组数据，第 3 大元素就是 4。我们选择数组区间 A[0...n-1]的最后一个元素 A[n-1]作为 pivot，对数组 A[0...n-1]原地分区，这样数组就分成了三部分，A[0...p-1]、A[p]、A[p+1...n-1]。如果 p+1=K，那 A[p]就是要求解的元素；如果 K>p+1, 说明第 K 大元素出现在 A[p+1...n-1]区间，我们再按照上面的思路递归地在 A[p+1...n-1]这个区间内查找。同理，如果 K<p+1，那我们就在 A[0...p-1]区间查找。


你有 10 个接口访问日志文件，每个日志文件大小约 300MB，每个文件里的日志都是按照时间戳从小到大排序的。你希望将这 10 个较小的日志文件，合并为 1 个日志文件，合并之后的日志仍然按照时间戳从小到大排列。如果处理上述排序任务的机器内存只有 1GB，你有什么好的解决思路，能“快速”地将这 10 个日志文件合并吗？

先构建十条io流，分别指向十个文件，每条io流读取对应文件的第一条数据，然后比较时间戳，选择出时间戳最小的那条数据，将其写入一个新的文件，然后指向该时间戳的io流读取下一行数据，然后继续刚才的操作，比较选出最小的时间戳数据，写入新文件，io流读取下一行数据，以此类推，完成文件的合并， 这种处理方式，日志文件有n个数据就要比较n次，每次比较选出一条数据来写入，时间复杂度是O（n），空间复杂度是O（1）,几乎不占用内存。

每次从各个文件中取一条数据，在内存中根据数据时间戳构建一个最小堆，然后每次把最小值给写入新文件，同时将最小值来自的那个文件再出来一个数据，加入到最小堆中。这个空间复杂度为常数，但没能很好利用1g内存，而且磁盘单个读取比较慢，所以考虑每次读取一批数据，没了再从磁盘中取，时间复杂度还是一样O(n)。


3、桶排序、基数排序、计数排序
非基于比较的排序、而且是线性时间完成排序

给100万用户年龄数据排序🤔？
最小1岁，最大120岁，分为120个桶。

桶排序时间复杂度分析：
如果要排序的数据有 n 个，我们把它们均匀地划分到 m 个桶内，每个桶里就有 k=n/m 个元素。每个桶内部使用快速排序，时间复杂度为 O(k  *  logk)。m 个桶排序的时间复杂度就是 O(m * k * logk)，因为 k=n/m，所以整个桶排序的时间复杂度就是 O(n*log(n/m))。当桶的个数 m 接近数据个数 n 时，log(n/m) 就是一个非常小的常量，这个时候桶排序的时间复杂度接近 O(n)。

桶排序场景：
<mark style="background: #FFB8EBA6;">**桶比较适合用在外部排序中**</mark>：外部排序就是数据存储在磁盘中，数据量比较大，内存有限，无法全部加载到内存中。比如10G的订单数据，希望按订单金额，在几百M的内存下完成排序。

第一步： 先扫描一遍文件，看订单金额所处的数据范围。假设经过扫描之后我们得到，订单金额最小是 1 元，最大是 10 万元。我们将所有订单根据金额划分到 100 个桶里，第一个桶我们存储金额在 1 元到 1000 元之内的订单，第二桶存储金额在 1001 元到 2000 元之内的订单，以此类推。每一个桶对应一个文件，并且按照金额范围的大小顺序编号命名（00，01，02...99）。
第二步：如果订单金额在 1 到 10 万之间均匀分布，那订单会被均匀划分到 100 个文件中，每个小文件中存储大约 100MB 的订单数据，我们就可以将这 100 个小文件依次放到内存中，用快排来排序。
第三步：等所有文件都排好序之后，我们只需要按照文件编号，从小到大依次读取每个小文件中的订单数据，并将其写入到一个文件中，那这个文件中存储的就是按照金额从小到大排序的订单数据了。

<mark style="background: #BBFABBA6;">如果金额不是均匀分布的话</mark>：可以继续划分，比如，订单金额在 1 元到 1000 元之间的比较多，我们就将这个区间继续划分为 10 个小区间，1 元到 100 元，101 元到 200 元，201 元到 300 元....901 元到 1000 元。如果划分之后，101 元到 200 元之间的订单还是太多，无法一次性读入内存，那就继续再划分，直到所有的文件都能读入内存为止。

这里可以看到桶排序限制：
1. 数据要比较容易分桶
2. 数据在各个桶的分布要比较均匀

计数排序：

50万学子，高考分数排序，最高900，最低0分。这个数据的范围很小，所以我们可以分成 901 个桶，对应分数从 0 分到 900 分。根据考生的成绩，我们将这 50 万考生划分到这 901 个桶里。桶内的数据都是分数相同的考生，所以并不需要再进行排序。我们只需要依次扫描每个桶，将桶内的考生依次输出到一个数组中，就实现了 50 万考生的排序。因为只涉及扫描遍历操作，所以时间复杂度是 O(n)。

这个就是计数排序。是桶排序的一种特殊情况。但是我们看不到计数啊。 为什么叫计数？这里就要讨论下计数排序的要点：

```java

// 计数排序，a是数组，n是数组大小。假设数组中存储的都是非负整数。
public void countingSort(int[] a, int n) {
  if (n <= 1) return;

  //1 查找数组中数据的范围
  int max = a[0];
  for (int i = 1; i < n; ++i) {
    if (max < a[i]) {
      max = a[i];
    }
  }

  //2 计数
  int[] c = new int[max + 1]; // 申请一个计数数组c，下标大小[0,max]
  for (int i = 0; i <= max; ++i) {
    c[i] = 0;
  }

  // 计算每个元素的个数，放入c中
  for (int i = 0; i < n; ++i) {
    c[a[i]]++;
  }

  // 3 依次累加
  for (int i = 1; i <= max; ++i) {
    c[i] = c[i-1] + c[i];
  }

  // 临时数组r，存储排序之后的结果
  int[] r = new int[n];
  // 4 计算排序的关键步骤，有点难理解：记得从后往前遍历原数组（保证是稳定算法）
  for (int i = n - 1; i >= 0; --i) {
    int index = c[a[i]]-1;
    r[index] = a[i];
    c[a[i]]--;
  }

  // 将结果拷贝给a数组
  for (int i = 0; i < n; ++i) {
    a[i] = r[i];
  }
}
```


计数排序的场景：
1. 数据范围不大。如果数据范围k比要排序的数据n大很多，就不适用。
2. 只能给非负整数排序。如果是负数的，要将其加上某个数/或者取余，但是不能改变原来相对大小。

基数排序：

给10个手机号码排序🤔?
数据范围太大，不适用计数排序。如果前面几位中，a手机号码已经比b手机号码大了，后面几位就不用看了。稳定排序算法从低位开始排序，然后结束后就是有序了（参看订单按金额排序，金额相同，按时间顺序的例子）。

排序牛津字典中的 20 万个英文单词？
因为单词长短不一。 在单词后面补“0”。比如ab a0。因为所有的字母都大于0，所以不会影响原有的排序结果。

场景：
1. 可以分割出来独立的位比较
2. 位之间有递进关系。
3. 每一位的数据范围不能太大，可以用计数排序时间复杂度控制为O(n)


时间复杂度：
根据每一位来排序，我们可以用刚讲过的桶排序或者计数排序，它们的时间复杂度可以做到 O(n)。如果要排序的数据有 k 位，那我们就需要 k 次桶排序或者计数排序，总的时间复杂度是 O(k*n)。当 k 不大的时候，比如手机号码排序的例子，k 最大就是 11，所以基数排序的时间复杂度就近似于 O(n)。

看似是排序，但是实际不需要排序的例子：
需要对 D，a，F，B，c，A，z 这个字符串进行排序，要求将其中所有小写字母都排在大写字母的前面，但小写字母内部和大写字母内部不要求有序。比如经过排序之后为 a，c，z，D，F，B，A，这个如何来实现呢？如果字符串中存储的不仅有大小写字母，还有数字。要将小写字母的放到前面，大写字母放在最后，数字放在中间，不用排序算法，又该怎么解决呢？

用两个指针a、b：a指针从头开始往后遍历，遇到大写字母就停下，b从后往前遍历，遇到小写字母就停下，交换a、b指针对应的元素；重复如上过程，直到a、b指针相交。 对于小写字母放前面，数字放中间，大写字母放后面，可以先将数据分为小写字母和非小写字母两大类，进行如上交换后再在非小写字母区间内分为数字和大写字母做同样处理

如何设计一个通用的排序算法：
总结： 选择排序、快速排序不稳定。 归并和线性排序算法都不是原地排序。
从数据量、场景来说首选快速排序、归并排序、堆排序。但是快排的平均复杂度不是nlogn， 归并的平均复杂度是nlogn，但是空间复杂度是n。所以对快速排序，可以通过三数取中、随机法取分区，然后通过手动在堆上模拟出栈、入栈解除系统栈的限制（Glibc的qsort()方法实现：三数取中、模拟栈）

### 二分查找

二分查找的场景限制： 
1 适用于数组
2 有序数组
3 数据量不能太小，比较操作比较耗时： 数组中存储的都是长度超过 300 的字符串，如此长的两个字符串之间比对大小，就会非常耗时。我们需要尽可能地减少比较次数，而比较次数的减少会大大提高性能，这个时候二分查找就比顺序遍历更有优势
4 多次查找。如果一次查找，排序就可以
5 一般是静态数据：删除、插入不频繁（动态数据用二叉树）


时间复杂度是： 0(logn)

题目：
1如何编程实现“求一个数的平方根”？要求精确到小数点后 6 位。二分查找或牛顿迭代法;
牛顿迭代法：
```c++
double number = 15; //待求平方根的数
double xini = 10;//初始点 
while(xini*xini - number > 1e-6) { 
  xini = (number + xini*xini)/2/xini; 
}
```

2我刚才说了，如果数据使用链表存储，二分查找的时间复杂就会变得很高，那查找的时间复杂度究竟是多少呢？如果你自己推导一下，你就会深刻地认识到，为何我们会选择用数组而不是链表来实现二分查找了。

假设链表长度为n，二分查找每次都要找到中间点(计算中忽略奇偶数差异): 第一次查找中间点，需要移动指针n/2次； 第二次，需要移动指针n/4次； 第三次需要移动指针n/8次； ...... 以此类推，一直到1次为值 总共指针移动次数(查找次数) = n/2 + n/4 + n/8 + ...+ 1，这显然是个等比数列，根据等比数列求和公式：Sum = n - 1. 最后算法时间复杂度是：O(n-1)，忽略常数，记为O(n)，时间复杂度和顺序查找时间复杂度相同

3 关于1000万数中快速查找某个整数
- 二分查找
- 考虑用数组下标来存储数据，一个bit位来存储标记。第一次排序的时候能得到这组数的最大值和最小值。 假如最小是5，最大是2000万。那我们定义一个字节数组Byte arr[2000万]，因为我只需要打标记，所以一个bit能存下标记，一个byte能存8个数。只需要2MB多一点就能存2000万个数的状态（存在还是不存在） 先把这1000万个数存进去，用数x/8得到下标。用数x%8得到余数，因为每8个数一组得到的数组下标相同，所以还需要通过余数来确定具体是哪一个数。之后开始设置状态，从低位到高位，每一位代表一个数的状态，case0到7，每一次设置当下号码的状态时，先用按位于计算把其他不相关位置为1，当前位置为0，然后按位或对当前位置设置状态。存在就设置位1 ，不存在就设置位0 上述操作执行完之后，就支持任意查找了。只需要输入一个数x，我就能立刻通过x/8和x%8得到当前这个数的位置，然后把这个位置的状态位数字取出来。如果是1表示存在，如果是0表示不存在。

案例： 
查找ip所在省份：102.102.133.13 这个 IP 地址的归属地时，我们就在地址库中搜索，发现这个 IP 地址落在[202.102.133.0, 202.102.133.255]这个地址范围内，那我们就可以将这个 IP 地址范围对应的归属地“山东东营市”显示给用户了。

是二分查找的变体问题

思考题： 有序数组是一个循环有序数组，比如 4，5，6，1，2，3。针对这种情况，如何实现一个求“值等于给定值”的二分查找算法呢？

有三种方法查找循环有序数组 一、 1. 找到分界下标，分成两个有序数组 2. 判断目标值在哪个有序数据范围内，做二分查找 二、 1. 找到最大值的下标 x; 2. 所有元素下标 +x 偏移，超过数组范围值的取模; 3. 利用偏移后的下标做二分查找； 4. 如果找到目标下标，再作 -x 偏移，就是目标值实际下标。 两种情况最高时耗都在查找分界点上，所以时间复杂度是 O(N）。 复杂度有点高，能否优化呢？ 三、 我们发现循环数组存在一个性质：以数组中间点为分区，会将数组分成一个有序数组和一个循环有序数组。 如果首元素小于 mid，说明前半部分是有序的，后半部分是循环有序数组； 如果首元素大于 mid，说明后半部分是有序的，前半部分是循环有序的数组； 如果目标元素在有序数组范围中，使用二分查找； 如果目标元素在循环有序数组中，设定数组边界后，使用以上方法继续查找。 时间复杂度为 O(logN)。


基本用法：

在查找给定值用的不多，一般用散列表和二叉查找树：<mark style="background: #FFB86CA6;">假定不存在重复元素</mark>

<mark style="background: #FF5582A6;">1 递归法： </mark>

```c++
int binarySearchInternal(int arr[], int low, int high, int value) {
   if(low > high) return -1; // 注意点1
   int mid = low + ((high - low) >> 1); // 注意点2： 将mid = lo + (hi - lo) /2，将除法优化成移位运算时，得注意运算符的优先级，千万不能写成这样：mid = lo + (hi - lo) >> 1
   if(arr[mid] == value) {
       return mid;
   }
   else if(arr[mid] < value) {
	  // 注意点3
       return binarySearchInternal(arr, mid + 1, high, value); 
   }
   else {
       return binarySearchInternal(arr, low, mid - 1, value);
   }
}

int binarySearch2(int arr[], int n, int value) {
   return binarySearchInternal(arr,0,n-1,value);
}
```


<mark style="background: #FF5582A6;">2 循环法：</mark>
```c++
int binarySearch(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   // 注意点1 是<=
   while(low <= high) { 
       // 注意点2 否则可能溢出
       int mid = low + (high-low) >> 1); 
       if(arr[mid] == value) {
           return mid;
       }
       else if(arr[mid] < value) {
           low = mid + 1;// 注意点3 需要+1/-1 否则可能死循环
       }
       else {
           high = mid - 1;
       }
   }
   return -1;
}

```

一般用于"近似"查找

注意点： 
1 循环退出条件
2 mid的取值
3 low和high的更新



假定数据从小到大排列：
变体1: 查找第一个值等于给定值的元素

```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + (high - low) >> 1;
       if(arr[mid] > value) {
           high = mid - 1;
       }
       else if(arr[mid] < value) {
           low = mid + 1;
       }
       else {
       // arr[mid]是第一个元素，或者前一个不等于value，则找到元素
       // 否则，肯定还在左边
           if(mid == 0 || (arr[mid -1 ] != value)) return mid;
           else high = mid - 1;
       }
   }
   return -1;
}
```

变体2: 查找最后一个值等于给定值的元素
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + (high - low) >> 1;
       if(arr[mid] > value) {
           high = mid - 1;
       }
       else if(arr[mid] < value) {
           low = mid + 1;
       }
       else {
          // arr[mid]是最后一个元素或者后一个不等于value，则找到元素
          // 否则，肯定还在右边
           if(mid == n - 1 || (arr[mid + 1 ] != value)) return mid;
           else high = mid + 1;
       }
   }
   return -1;
}

```

变体3: 查找第一个大于等于给定值的元素
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + (high - low) >> 1;
       if(arr[mid] >= value) {
           // mid前面已经没有元素或者前面一个元素小于要查找的值value
           if((mid == 0) || (arr[mid - 1] < value)) return mid;
           else high = mid - 1;
       }
       else {
           low = mid + 1;
       }
   }
   return -1;
}
```
变体4: 查找最后一个小于等于给定值的元素
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + (high - low) >> 1;
       if(arr[mid] > value) {
           high = mid - 1;
       }
       else {
           // mid后面已经没有元素或者后面一个元素大于要查找的值value
           if((mid == n - 1) || (arr[mid + 1] > value)) return mid;
           else low = mid + 1;
       }
   }
   return -1;
}

```

### 贪心算法

特性（信息），模型（模型），思路&模版（行动）

![[Pasted image 20230811173017.png]]  

是动态规划的一种特殊情况， 

特征： 最优子结构（也就是子问题最优推导出问题最优），贪心选择性（也就是局部最优能达到全局最优）


经典问题：假设有n个区间，从这n个区间中选出某些区间，要求这些区间满足两两不相交，最多能选出多少个区间

```js
// 假设有n个区间，从这n个区间中选出某些区间，要求这些区间满足两两不相交，最多能选出多少个区间
function greedyMaxIntervals(intervals) {
  intervals = intervals.sort((a, b) => a[1] - b[1]); // 按结束时间排序
  let result = []; // 记录选择的区间数量
  let endTime = 0; // 记录当前已选择区间的最晚结束时间
  for (const [start, end] of intervals) {
    if (start >= endTime) {
      // 如果该区间的开始时间晚于等于当前已选择区间的最晚结束时间，说明可以选择该区间
      result.push([start, end]);
      endTime = end;
    }
  }
  return result;
}

export function TestFunction() {
  const intervals = [
    [1, 4],
    [3, 5],
    [0, 6],
    [5, 7],
    [3, 8],
    [5, 9]
  ];
  const res = greedyMaxIntervals(intervals);
  console.log(res);

  return true;
}

```

[在线测试](https://codesandbox.io/s/jolly-tess-qs52l6?file=/src/index.ts)

### 分治算法
机器内存有限的情况下，用归并排序算法对大数据进行排序

![[Pasted image 20230811173039.png]]

![[Pasted image 20230811173107.png]]
```js
const mergeSort = (data, p, r) => {
    // 如果只剩一个元素，结束循环
    if(p >= r) return;
    // 暂且以中间为分割
    let q = Math.floor((p + r) / 2);
    // 分解
    mergeSort(data, p, q)
    mergeSort(data, q + 1, r)
    // 合并
    merge(data, p, q, r)
}

const merge = (data, p, q, r) => {
    const temp = new Array(r-p+1);
    let i = p;
    let j = q+1;
    let k = 0;
    while(i<=q &&  j <= r) {
        if(data[i] <= data[j]) {
            temp[k++] = data[i++]
        }
        else {
            temp[k++] =data[j++]
        }
    }

    // 判断哪个数组中有剩余数据
    let start = i;
    let end = r;
    if(j>r) {
        end = q
    }
    else {
        start = j
    }

    while(start <= end) {
        temp[k++] = data[start++]
    }

    // 将temp复制回去
    for(let i=0;i<r-p+1; i++) {
        data[p+i] = temp[i]
    }
    return data;
}

export const ms_test_function = () => {
    const data = [11,8,3,9,7,1,2,3]
    mergeSort(data, 0, data.length - 1)
    return true;
}
```

```js
const fs = require('fs');
const path = require('path')

// Step 1: Divide the file into smaller partitions based on order amounts
function partitionFile(inputFilePath, outputDirPath, callback) {
    const partitions = {};

    // Read the input file sequentially
    const readStream = fs.createReadStream(inputFilePath, { encoding: 'utf8' });

    readStream.on('data', (chunk) => {
        const orders = chunk.split('\n');
        orders.forEach((order) => {
            // Extract the order amount from the order entry
            const amount = parseFloat(order.split(',')[1]);

            // Determine the partition for the order based on its amount
            const partition = Math.floor(amount / 100);

            // Create a writable stream for the partition file if it doesn't exist
            if (!partitions.hasOwnProperty(partition)) {
                const partitionFilePath = `${outputDirPath}/partition_${partition}.txt`;
                partitions[partition] = fs.createWriteStream(partitionFilePath, { flags: 'a' });
            }

            // Write the order to the appropriate partition file
            partitions[partition].write(`${order}\n`);
        });
    });

    readStream.on('end', () => {
        // Close all partition files
        for (const partition in partitions) {
            partitions[partition].end();
        }

        callback();
    });
}

// Step 2: Sort each partition individually
function sortPartitions(inputDirPath, outputDirPath, callback) {
    fs.readdir(inputDirPath, (err, files) => {
        if (err) {
            throw err;
        }

        files.forEach((file) => {
            const filePath = `${inputDirPath}/${file}`;
            const sortedFilePath = `${outputDirPath}/sorted_${file}`;
            // Read the orders from the partition file
            const orders = fs.readFileSync(filePath, { encoding: 'utf8' }).split('\n');

            // Sort the orders using an efficient algorithm (e.g., merge sort)
            const sortedOrders = orders.sort((a, b) => {
                const amountA = parseFloat(a.split(',')[1]);
                const amountB = parseFloat(b.split(',')[1]);
                return amountA - amountB;
            });

            // Write the sorted orders to the sorted partition file
            fs.writeFileSync(sortedFilePath, sortedOrders.join('\n'), { encoding: 'utf8' });
        });

        callback();
    });
}

// Step 3: Merge the sorted partitions
function mergePartitions(inputDirPath, outputFilePath) {


    // Step 1: Perform merge sort on an array of numbers
    function mergeSort(arr) {
        if (arr.length <= 1) {
            return arr;
        }

        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);

        return merge(mergeSort(left), mergeSort(right));
    }

    // Step 2: Merge two sorted arrays
    function merge(left, right) {
        let merged = [];
        let i = 0;
        let j = 0;

        while (i < left.length && j < right.length) {
            // 读取文件标题后面的数字
            if (parseFloat(left[i].split(',')[1]) <= parseFloat(right[j].split(',')[1])) {
                merged.push(left[i]);
                i++;
            } else {
                merged.push(right[j]);
                j++;
            }
        }

        while (i < left.length) {
            merged.push(left[i]);
            i++;
        }

        while (j < right.length) {
            merged.push(right[j]);
            j++;
        }

        return merged;
    }

    const filePointers = [];
    let mergedOutput = '';

    fs.readdir(inputDirPath, (err, files) => {
        if (err) {
            throw err;
        }

        // Open all sorted partition files and initialize file pointers
        files.forEach((file) => {
            const filePath = path.join(inputDirPath, file);
            const fileData = fs.readFileSync(filePath, 'utf8').trim();
            const partitionData = fileData.split('\n');
            filePointers.push(partitionData);
        });

        // Merge the sorted partitions
        const sortedOutput = mergeSort(filePointers.flat());

        // Format the sorted output
        mergedOutput = sortedOutput.join('\n') + '\n';

        // Write the merged output to the final sorted file
        fs.writeFileSync(outputFilePath, mergedOutput, { encoding: 'utf8' });

        // Delete the temporary partition files
        // files.forEach((file) => {
        //     const filePath = path.join(inputDirPath, file);
        //     fs.unlinkSync(filePath);
        // });
    });
}


// Entry point
function sortLargeOrderFile(inputFilePath, outputFilePath) {
    const inputDirPath = './temp/input';
    const outputDirPath = './temp/output';

    // Create temporary directories if they don't exist
    if (!fs.existsSync('./temp')) {
        fs.mkdirSync('./temp');
    }
    if (!fs.existsSync(inputDirPath)) {
        fs.mkdirSync(inputDirPath);
    }
    if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath);
    }

    partitionFile(inputFilePath, inputDirPath, () => {
        sortPartitions(inputDirPath, outputDirPath, () => {
            mergePartitions(outputDirPath, outputFilePath);
        });
    });
}

// Usage
const inputFilePath = './input_file.txt';
const outputFilePath = './sorted_file.txt';

sortLargeOrderFile(inputFilePath, outputFilePath);
```

### 回溯算法

```js
let minDist: number = Number.MAX_VALUE;
/**
 * 回溯法 计算最小距离. Backtracking
 * @param i x坐标位置
 * @param j y坐标位置
 * @param dist 当前距离
 * @param w 表格数组
 * @param n 数组长度
 */
const minDistBT = (
  i: number,
  j: number,
  dist: number,
  w: Array<Array<number>>,
  n: number
) => {
  dist += w[i][j];
  // 到达终点
  if (i === n - 1 && j === n - 1) {
    if (dist < minDist) {
      minDist = dist;
      return;
    }
  }
  // 向右移动一位
  if (i < n - 1) {
    minDistBT(i + 1, j, dist, w, n);
  }
  // 向下移动一位
  if (j < n - 1) {
    minDistBT(i, j + 1, dist, w, n);
  }
};

export function TestFunction() {
  let dist: number = 0;
  let w: Array<Array<number>> = [
    [1, 2, 5],
    [3, 2, 1],
    [9, 2, 11]
  ];
  minDistBT(0, 0, dist, w, 3);
  console.log(minDist);
  return true;
}

```

**[回溯代码](https://codesandbox.io/s/hui-su-suan-fa-ww9ien?file=/src/index.ts)在线测试**


### 动态规划

问题域：最值问题
经典题目： 背包问题、斐波那契数列、凑零钱问题、爬楼梯问题、最长公共子序列、解码方法

本质上此类问题机器都是需要穷举，穷举一般都需要递归实现，动态规划告诉大家怎么聪明地穷举，能优化直接穷举递归导致的性能问题，反过来说，动态规划本质上都是可以通过递归实现的

动态规划的思路： 先写递归方程(直接代码也可以)，然后画出递归树，通过分析递归树，可以发现重复计算的状态， 我们可以通过自底向上或者自顶向下（通常是需要深度优先搜索）建立备忘录、DP Table来优化，也就是通过空间换时间的方式，降低时间复杂度

递归树一般都是通过子问题解决问题

经典问题：棋子最短路径

假设我们有一个 n 乘以 n 的矩阵 w[n][n]。矩阵存储的都是正整数。棋子起始位置在左上角，终止位置在右下角。我们将棋子从左上角移到右下角。每次只能向右或者向下移动一位。整个过程，会有多种不同的路径可以选择。我们把每条路径经过的数字加起来看作路径的长度。那从左上角到右下角的最短路径长度是多少呢

![[Pasted image 20240225215056.png]]
```js
[
   [1, 2, 5],
   [3, 2, 1],
   [9, 2, 11]
 ];

```
  

对于【[回溯代码](https://codesandbox.io/s/hui-su-suan-fa-ww9ien?file=/src/index.ts)案例1】，我们可以通过画出递归树，发现f(i,j) 重复的节点，可以通过状态表，避免二次计算, [代码2](https://codesandbox.io/s/little-hill-u4v8wy?file=/src/index.ts)。通过状态转移方程。min_dist[i, j] = w[i][j] + min(min_dist[i-1][j], min_dist[i][j-1])。[代码](https://codesandbox.io/s/adoring-bhaskara-5vskoh?file=/src/index.ts)3

```js
let mem: Array<Array<number>> = new Array(3)
  .fill(0)
  .map(() => new Array(3).fill(0));

function minDistDP(
  maxtrix: Array<Array<number>>,
  i: number,
  j: number
): number {
  if (i === 0 && j === 0) {
    return maxtrix[0][0];
  }
  if (mem[i][j] > 0) return mem[i][j];
  let minLeft = Number.MAX_VALUE;
  if (j - 1 >= 0) {
    minLeft = minDistDP(maxtrix, i, j - 1);
  }
  let minTop = Number.MAX_VALUE;
  if (i - 1 >= 0) {
    minTop = minDistDP(maxtrix, i - 1, j);
  }
  let currentMinDist = maxtrix[i][j] + Math.min(minLeft, minTop);
  mem[i][j] = currentMinDist;
  return currentMinDist;
}

```
  

通过多阶段决策最优解模型，也就是最优解问题适合动态规划解决（一个模型）

一般回溯法都可以做，然后通过递归树，发现重复子问题（动态规划特征1），另外通过子问题的最优解推导出问题的最优解，子问题还能分解成子问题（特征2）。通过状态表是通过自顶向下，写代码就是填表的过程。或者通过状态转移方程，自底向上，写代码的过程。


模型： 贪心、回溯、动态规划分为一类，分治为一类（也是解决最优，但不是子问题最优推导出全局最优）

特征： 特征2是分治算法相反，分治算法子问题不能再分解为子问题。

解法：

状态转移表法：回溯实现-》定义状态（递归树的节点）-》画递归树-》找重复子问题-》画状态转移表-》根据递推关系填表-》填表过程“翻译”成代码

状态转移方程法：找最优子结构-》写状态转移方程-》将状态转移方程“翻译”成代码（自底向上）

熟记： 8个动态规划案例

经典问题：双11凑单 

```js
/**
 * 双11凑单问题
 * @param items  商品价格
 * @param n 商品个数
 * @param w 凑单金额
 */
function double11advance(items, n, w) {
    let states = new Array(n); // 初始化状态表
    for (let i = 0; i < n; i++) {
        states[i] = new Array(3 * w + 1).fill(false);
    }

    states[0][0] = true; // 首先第一次决策
    if (items[0] <= 3 * w) {
        states[0][items[0]] = true;
    }

    for (let i = 1; i < n; i++) {
        for (let j = 0; j <= 3 * w; j++) { // 不选择
            if (states[i - 1][j] === true) {
                states[i][j] = states[i - 1][j]; // 状态保持不变和上一次一样
            }
        }
        for (let j = 0; j <= 3 * w - items[i]; j++) { // 选择
            if (states[i - 1][j] === true) {
                states[i][j + items[i]] = true; // 标记该点位为已决策
            }
        }
    }

    let j;
    for (j = w; j < 3 * w + 1; j++) { // 找到最接近200的决策价格
        if (states[n - 1][j] === true) {
            break;
        }
    }

    if (j === 3 * w + 1) { // 找不到这样的组合
        return;
    }

    for (let i = n - 1; i >= 1; i--) { // 从第一个商品开始
        // 从n个商品中检测，如果上一个标记点位[i-1, j-items[i]]标记是1表示是选择了该商品
        if (j - items[i] > 0 && states[i - 1][j - items[i]] === true) {
            console.log(items[i] + " ");// 打印已选商品
            j = j - items[i];
        }
    }

    if (j !== 0) { // 如果还有钱剩余，表示第0个商品也选了（因为我们状态表是从上一个状态推导到下一个）如果没有买第0个，到这里j == 0了，如果j不为0，说明买了第0个
        console.log(items[0]);
    }
}

export const dy_test_function = () => {
    // 从这些商品里面选择，金额刚好能凑到10元来满减
    const items = [2,2,4,6,3]

    double11advance(items, items.length, 10)
    return true
}
```

### 字符串匹配算法
1、BM算法

坏字符规则：
![[Pasted image 20230810120918.png]]
好后缀规则：
![[Pasted image 20230810120757.png]]

![[Pasted image 20230810120825.png]]

![[Pasted image 20230810120834.png]]

```js
const SIZE = 256;

// 保存模式串的字符下标
function generateBC(bc: Array<number>, b: string) {
  for (let i = 0; i < b.length; i++) {
    const ascii = b[i].charCodeAt(0); // 转成b[i]的ASCII值
    bc[ascii] = i;
  }
}

/**
 * 坏字符匹配算法实现
 * @param a 主串
 * @param b 模式串
 */
function bm_bc(a: string, b: string) {
  // 用于存储模式串中每个字符对应的下标
  const bc: number[] = new Array(SIZE).fill(-1);
  generateBC(bc, b); //生成256位的ascii码数组来存储字符的下标，避免通过遍历来查找
  let n = a.length;//主串的长度
  let m = b.length;//模式串的长度
  // 表示主串和模式串上下对齐的第一个字符
  let i = 0;
  while (i <= n - m) {
    // 当第一个字符比主串和模式串的长度差还小，表示不用再向后移动
    let j;
    // 模式串从后往前匹配
    for (j = m - 1; j >= 0; j--) {
      // 不匹配。 下标j是坏字符在模式串的位置
      if (a[i + j] !== b[j]) {
        break;
      }
    }
    // 匹配成功。返回模式串和主串第一个匹配的位置
    if (j <= 0) {
      return i;
    }
    // 模式串往后移动：根据坏字符规则, si - xi
    // xi: a[i+j] 这个坏字符在模式串的位置
    // si: j
    i = i + (j - bc[a[i + j].charCodeAt(0)]);
  }
  return -1; // 没找到匹配的
}


// 通过以上三个图， 我们要计算右移的位数，需要知道
// 好后缀字符串{u} 和 另一个字串{u*} 匹配的下标，也就是x
// 我们构建一个数组suffix[子串的长度] = x
/**
 * @param b 模式串
 * @param suffix
 * @param prefix
 * @param m
 */
function generateSuffix(b: string, suffix: number[], prefix: boolean[], m) {
  for(let i = 0; i < m - 1; i++) { // 遍历b
    let j = i;
    let k = 0; // 公共后缀子串的长度
    // 头尾元素比较，如果相等，则头元素往前移动，继续比较两位，三位长度
    while(j >= 0 && b[j] == b[m - 1 - k]) {
      --j;
      ++k;
      suffix[k] = j + 1;
    }
    if(j === -1) {
      prefix[k] = true; // 是最长子串。 因为我们要找的就是最长子串
    }
  }
}

function moveByGS(j: number, m: number, suffix: number[], prefix: boolean[]) {
  let k = m - 1 - j;// 好后缀的长度
  // 1、完全匹配
  if(suffix[k] !== -1) {// 表示存在最长公共后缀子串，先找bc, 再找c
    return j - suffix[k] + 1;
  }
  // 2、部分匹配
  for(let r = j + 2; r <= m -1; ++r) {
    if(prefix[m-1-r+1]) { // 这个是我们的最长公共子串
      return r
    }
  }
  // 3、不匹配
  return m;
}

/**
 * @param a 主串
 * @param b 模式串
 */
function bm(a: string, b: string) {
  // 用于存储模式串中每个字符对应的下标
  const bc: number[] = new Array(SIZE).fill(-1);
  generateBC(bc, b); //生成256位的ascii码数组来存储字符的下标，避免通过遍历来查找
  let suffix = new Array(b.length).fill(-1);
  let prefix = new Array(b.length).fill(false);
  let n = a.length;
  let m = b.length;
  generateSuffix(b, suffix, prefix, m);
  // 表示主串和模式串上下对齐的第一个字符
  let i = 0;
  while (i <= n - m) {
    // 当第一个字符比主串和模式串的长度差还小，表示不用再向后移动
    let j;
    // 模式串从后往前匹配
    for (j = m - 1; j >= 0; j--) {
      // 不匹配。 下标j是坏字符在模式串的位置
      if (a[i + j] !== b[j]) {
        break;
      }
    }
    // 匹配成功。返回模式串和主串第一个匹配的位置
    if (j <= 0) {
      return i;
    }
    // 模式串往后移动：根据坏字符规则, si - xi
    // si: a[i+j] 这个坏字符在模式串的位置
    // xi: j
    let x = j - bc[a[i + j].charCodeAt(0)]; // 坏字符移动的长度
    let y = 0;
    if(j < m - 1) {// 有好后缀
      y = moveByGS(j, m, suffix, prefix); // 好字符移动的长度
    }
    i = i + Math.max(x, y);
  }
  return -1; // 没找到匹配的
}


export function BMTestFunction() {
  const a = "abcacabdc";
  const b = "abd";
  const result = bm(a, b);
  console.log(result);
  return result;
}
export function BM_BC_TestFunction() {
  const a = "abcacabdc";
  const b = "abd";
  const result = bm_bc(a, b);
  console.log(result);
  return result;
}
```

2、KMP算法
![[Pasted image 20230811172611.png]]
```js

function genNexts(b) {
    let m = b.length;
    let next = new Array(m);
    next[0] = -1;
    let k = -1; // 好前缀的前缀子串
    for(let i =1; i< m;i++) {
        // case 2: 循环找
        while(k !== -1 && b[k+1] != b[i]) {
            k = next[k]
        }
        // case 1
        if(b[k+1] === b[i]) {
            ++k;
        }
        // 记录下来
        next[i] = k;
    }
    return next;    
}

function kmp(a, b) {
    let n = a.length; 
    let m = b.length; // 模式串长度
    let next = genNexts(b, m); // 只跟模式串有关
    let j = 0;// 模式串下标
    for(let i=0; i<n; i++) {
        while(j > 0 && a[i] !== b[j]) { // 找到坏字符
            j = next[j-1] + 1; // j 更新为k。 
        }
        if(a[i] === b[j]) { // 相等的情况
            ++j;// 移动模式串下标
        }  
        if(j == m) { // 找到匹配字符，返回i的位置
            return  i - m + 1;
        }
    }
    return -1; //没有找到匹配
}

export function kmp_TestFunction() {
  const a = "abcacabdc";
  const b = "abd";
  const result = kmp(a, b);
  console.log(result);
  return result;
}
```
3、TRIE算法
![[Pasted image 20230811172831.png]]

5、RK算法
![[Pasted image 20230811172907.png]]
```js
// 对主串中的n-m+1个子串求哈希值，然后模式串对哈希值逐个进行比较

const alphabetSize = 26;

const rk = (text, pattern) => {
  const m = pattern.length;
  const n = text.length;

  const h = [];
  const calculateHash = (s, i) => {
    if (i === 0) {
      let total = 0;
      for (let i = 0; i < m; i++) {
        total +=
          (s[i].charCodeAt(0) - "a".charCodeAt(0)) * Math.pow(alphabetSize, m - i + 1);
      }
      h[0] = total;
    } else {
      // h[i] = (h[i-1] - (s[i-1] - 'a')*26^m-1) * 26 + (s[i+m-1]-'a') * 26^0
      h[i] =
        (h[i - 1] -
          (s[i - 1].charCodeAt(0) - "a".charCodeAt(0)) * Math.pow(alphabetSize, m - 1)) *
          alphabetSize +
        s[i + m - 1].charCodeAt(0) -
        "a".charCodeAt(0);
    }
    return h[i];
  };

  const p_hash = calculateHash(pattern, 0);
  for (let i = 0; i <= n - m; i++) {
    const t_hash = calculateHash(text, i);
    if (p_hash === t_hash) {
      return i;
    }
  }
  return -1;
};

export function rk_TestFunction() {
  const a = "abca";
  const b = "bca";
  const result = rk(a, b);
  console.log(result);
  return result;
}

```
6、AC自动机
![[Pasted image 20230811172935.png]]
经典问题： 敏感词过滤
```js
function createAcNode(data) {
    return {
        data,
        children: new Array(26).fill(null),
        isEndingChar: false,
        length: -1,
        fail: null,
    };
}

// 创建字典上
const createTrie = () => {
    const root = createAcNode("/");
    const insert = (words: string) => {
        let p = root;
        Array.from(words).forEach((c: string) => {
            let index: number = c.charCodeAt(0) - "a".charCodeAt(0);
            // 创建新节点
            if (p.children[index] === null) {
                p.children[index] = createAcNode(c);
            }
            // 指向新节点
            p = p.children[index];
        });
        // 标记为单词结束节点
        p.isEndingChar = true;
        p.length = words.length;
    };

    return {
        insert,
        root
    };
};


//-----------------------

function buildFailurePointer(root) {
  const queue = [];
  root.fail = null; // 根节点标记
  queue.push(root);
  while (queue.length > 0) {
    const p = queue.shift();// p是当前字典树的指针
    for (let i = 0; i < 26; i++) { // 遍历子节点的时候
      const pc = p.children[i];// pc是p的子节点
      if (pc === null) {// 跳过空的子节点
        continue;
      }
      if (p === root) { // 根节点的所有子节点的fail指针都指向根节点
        pc.fail = root;
      }
      else { // 不是根节点，也就是p
        let q = p.fail;// 当前节点的失败指针的位置
        while (q !== null) {
          const qc = q.children[pc.data.charCodeAt(0) - "a".charCodeAt(0)];
          if (qc !== null) { // qc存在，则把pc的失败指针指向qc，并且结束寻找
            pc.fail = qc;
            break;
          }
          // 如果这样的qc不存在，找上一个可匹配的后缀子串
          q = q.fail;
        }
        // 到达根节点了，将pc的失败指针指向root
        if (q === null) {
          pc.fail = root;
        }
      }
      queue.push(pc);
    }
  }
}

function match(root, text) {
  const n = text.length;
  let p = root; // 从根节点开始
  for (let i = 0; i < n; i++) { // 扫一遍主串
    const idx = text[i].charCodeAt(0) - "a".charCodeAt(0); // 获得当前字符的数组索引
    // p.children[idx]的含义是p指针的子节点找主串的对应字符
    while (p.children[idx] === null && p !== root) {//f这个情况，和主串不相等，则通过失败指针查找
      p = p.fail;
    }
    p = p.children[idx]; // 层序遍历，指向子节点
    if (p === null) { // 如果没有可匹配的，比如f这个情况，则从root重新开始匹配
      p = root;
    }
    // 检测一系列失败指针为结尾的路径是否模式串，如果是，则此模式串就是感敏词
    let tmp = p;// 子节点不为空
    while (tmp !== root) { // 直到指针指向根节点
      if (tmp.isEndingChar) { // 判断是否是模式串，如果是，表示该模式串是敏感词，则打印结果
        const pos = i - tmp.length + 1;
        console.log("起始下标，",pos, "长度", tmp.length);
      }
      // 否则， 循着失败指针检测
      tmp = tmp.fail;
    }
  }
}


export function ac_TestFunction() {
    const trie = createTrie();
    const { insert, root } = trie;
    insert("c");
    insert("bc");
    insert("bcd");
    insert("abcd");

    buildFailurePointer(root);
    match(root, "abcd")
    return null
}

```

### 垃圾回收算法
比如jvm, 先标记删除，当没有空间的时候再一次性删除。

### 压缩算法
霍夫曼编码对字符串压缩：

```js
const createNode = (char, frequency) => {
    return {
        char,
        frequency,
        left: null,
        right: null
    }
}

const buildHuffmanTree = (data) => {

    // 保存频率升序排列的节点数组
    const nodes = Object.entries(data).map(([char, value]) => {
        return createNode(char, data[char])
    })

    // 构建霍夫曼树
    while(nodes.length > 1) {
        // 升序排列
        nodes.sort((a,b) => a.frequency - b.frequency)
        const left = nodes.shift()
        const right = nodes.shift()
        const parent = createNode(null, left.frequency + right.frequency)
        parent.left = left;
        parent.right = right;
        nodes.push(parent)
    }

    // root节点
    return nodes[0]
}


const buildHuffmanTable = root => {
    const huffmanTable = {}

    // 遍历边: 前序遍历
    const  traverse = (node, code) => {
        if(node.char) { // 叶子节点
            console.log('node.char', node.char)
            huffmanTable[node.char] = code
        }
        else { // 非叶子节点
            traverse(node.left, code + '0')
            traverse(node.right, code + '1')
        }
    }
    traverse(root, '');
    console.log('hu', huffmanTable)
    return huffmanTable
}

// 获得霍夫曼的编码：树的路径
function huffmanEncoding(data) {
    const root = buildHuffmanTree(data)
    const huffmanTable = buildHuffmanTable(root)

    let encodedData  = ''
    for(let symbol in data) {
        encodedData += huffmanTable[symbol] + " "
    }
    return encodedData.trim()
}

export function hf_TestFunction() {
    const data = {
        'a': 450,
        'b': 350,
        'c': 90,
        'd': 60,
        'e': 30,
        'f': 20,
    };

    const encodedData = huffmanEncoding(data);
    console.log(encodedData);
    return null;
}

```

### 莱文斯坦算法
搜索引擎的拼写纠错功能
```js
function lwstDP(a, n, b, m) {
    const minDist = new Array(n + 1);
    for (let i = 0; i < n + 1; i++) {
        minDist[i] = new Array(m + 1);
        minDist[i][0] = i;
    }

    for (let j = 0; j < m + 1; j++) {
        minDist[0][j] = j;
    }

    for (let i = 1; i < n + 1; i++) {
        for (let j = 1; j < m + 1; j++) {
            if (a[i - 1] === b[j - 1]) {
                minDist[i][j] = minOfThree(
                    minDist[i - 1][j] + 1,
                    minDist[i][j - 1] + 1,
                    minDist[i - 1][j - 1]
                );
            } else {
                minDist[i][j] = minOfThree(
                    minDist[i - 1][j] + 1,
                    minDist[i][j - 1] + 1,
                    minDist[i - 1][j - 1] + 1
                );
            }
        }
    }

    return minDist[n][m];
}

function minOfThree(n1, n2, n3) {
    return Math.min(n1, Math.min(n2, n3));
}

```
# 参考资料
1. 《数据结构与算法之美》王争
2. [freecodecamp教程](https://www.freecodecamp.org/chinese/news/big-o-notation/)
3. NeetCode.io
4. 《hello 算法》


