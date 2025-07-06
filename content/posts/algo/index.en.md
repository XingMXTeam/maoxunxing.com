---
title: "Algorithm Analysis"
date: 2025-03-03
tags:
  - Algorithm
custom_toc:
  - title: "Complexity Analysis"
  - title: "Sorting"
  - title: "Binary Search"
  - title: "Greedy Algorithms"
  - title: "Divide and Conquer Algorithms"
  - title: "Backtracking Algorithms"
  - title: "Dynamic Programming"
  - title: "String Matching"
  - title: "Garbage Collection Algorithms"
  - title: "Compression Algorithms"
  - title: "Levenshtein Algorithm"
---
Common algorithm ideas: Binary search, dynamic programming: 1. Brute force 2. Caching 3. Recurrence relations. Problem-solving: Finding extrema, making change. Key concepts: backtracking, recursion, and iteration, level-order traversal, for example; virtual DOM, longest increasing subsequence (Vue's renderer.ts getSequence, keepAlive (LRU Cache based on a linked list structure)).
## Complexity Analysis
Time complexity is generally expressed using Big O notation. A simple understanding is that constants are O(1), linear is O(n), quadratic is O(n^2), and logarithmic is O(log n). Here, 1, n, n^2, and log n can be simply understood as the sum of the number of lines of code executed, where n is the size of the input. For example, a for loop that executes n times has a time complexity of O(n), equivalent to `console.log` being executed n times. Here, n is an indeterminate variable. If n were a constant, say 100, the time complexity would be O(1).
```js
for(let i = 0; i < n; i++) {
	console.log(i)
}
```
Therefore, time complexity is viewed over the long run, not as a specific value. It's an estimate, and this estimate is an upper bound. It represents a trend graph of the number of lines of code that need to be executed as n (the input size) changes. For example, a time complexity of f(n)=n would be plotted as a linear graph.
![[Pasted image 20230809113502.png]]
If there are two nested loops, the time complexity is n * n, which is f(n)=n^2. The multiplication rule is used here.
![[Pasted image 20230809113339.png]]
Space Complexity: Also uses Big O notation, and the understanding is consistent with time complexity, with the difference being that time is replaced by space. In other words, it's the relationship between the space occupied and the input size. For example, if the space occupied is fixed, it's O(1); if it's related to n, it's O(n), and so on. An important point to note: I used to misunderstand it as all the space occupied by the code, but that's not correct. The focus is on the *extra* space consumed. For example, when checking for a palindrome using fast and slow pointers, the space complexity is O(1), not O(n).
Amortized Complexity: Generally equals the best-case time complexity; it's used less often.
Time complexity usually involves the addition rule. More complex cases use the multiplication rule, and even more difficult ones require algebraic calculation:
1. The time complexity analysis of binary search requires algebraic calculation (e.g., summing a geometric series).
2. The time complexity analysis of a binary tree: The method is to draw a recursion tree and calculate it through simple algebraic operations (e.g., summing a geometric series).
## Sorting
1. Bubble Sort, Insertion Sort, Selection Sort
If the data is stored in a linked list, can these three sorting algorithms still work? If so, what are their corresponding time and space complexities?
Regarding the homework question posed by the teacher, I think there should be a prerequisite: whether we are allowed to modify the `value` of the linked list nodes, or only change the node positions. Generally speaking, if we can only change node positions: for bubble sort, the number of comparisons is the same as the array implementation, but the swap operation is more complex. For insertion sort, the number of comparisons is the same, and there's no need for shifting elements; after finding the position, we can insert directly, but it might be necessary to reverse the list after sorting. For selection sort, the number of comparisons is the same, and the swap operation is also quite troublesome. In summary, the time and space complexities do not change significantly. However, if pursuing ultimate performance, the constant factor in bubble sort's time complexity will increase, insertion sort's will decrease, and selection sort's will show no obvious change.
Suppose we have 100,000 order records, and we want to sort them by amount in ascending order. For orders with the same amount, we want them to be sorted by their order time from earliest to latest. How should we approach this sorting requirement?
A less ideal approach is to first sort by amount, and then for small intervals with the same amount, sort them by order time. This method is actually very complex.
A better approach is: First, sort by order time (using a stable sorting algorithm), and then sort by amount.
Insertion sort is better than bubble sort:
The data swap in bubble sort is more complex than the data movement in insertion sort. Bubble sort requires 3 assignment operations, while insertion sort only requires 1.
2. Quick Sort, Merge Sort
Scenario:
Find the Kth largest element in O(n) time?
Find the Kth largest element in an unsorted array within O(n) time complexity. For example, in the dataset {4, 2, 5, 12, 3}, the 3rd largest element is 4. We can select the last element A[n-1] of the array interval A[0...n-1] as the pivot and partition the array A[0...n-1] in-place. This divides the array into three parts: A[0...p-1], A[p], and A[p+1...n-1]. If p+1=K, then A[p] is the element we are looking for. If K>p+1, it means the Kth largest element is in the interval A[p+1...n-1], and we recursively search within this interval using the same logic. Similarly, if K<p+1, we search in the interval A[0...p-1].
You have 10 API access log files, each about 300MB in size. The logs in each file are sorted by timestamp in ascending order. You want to merge these 10 smaller log files into one large log file, with the merged log also sorted by timestamp in ascending order. If the machine processing this task has only 1GB of memory, what's a good solution to 'quickly' merge these 10 log files?
First, create ten I/O streams, each pointing to one of the ten files. Each I/O stream reads the first line of data from its corresponding file. Then, compare the timestamps, select the data with the smallest timestamp, and write it to a new file. The I/O stream from which the data was taken then reads the next line. This process continues: compare, select the minimum timestamp data, write to the new file, and have the corresponding I/O stream read the next line. This is repeated until the files are merged. With this approach, if there are n total data entries in the log files, there will be n comparisons, with one piece of data being written out after each comparison. The time complexity is O(n), and the space complexity is O(1), using almost no memory.
Take one piece of data from each file at a time, and build a min-heap in memory based on the timestamps. Then, each time, write the minimum value to the new file, and take another piece of data from the file that the minimum value came from, adding it to the min-heap. The space complexity is constant, but this doesn't make good use of the 1GB of memory, and individual disk reads are slow. Therefore, consider reading a batch of data each time, and when it's used up, fetch more from the disk. The time complexity remains O(n).
3. Bucket Sort, Radix Sort, Counting Sort
Non-comparison-based sorting, and they complete in linear time.
How to sort the age data of 1 million users 🤔?
Minimum age is 1, maximum is 120. Divide into 120 buckets.
Bucket Sort Time Complexity Analysis:
If there are n items to be sorted, and we divide them evenly into m buckets, each bucket will have k = n/m elements. We use quick sort within each bucket, which has a time complexity of O(k * log k). The time complexity for sorting m buckets is O(m * k * log k). Since k = n/m, the total time complexity for bucket sort is O(n*log(n/m)). When the number of buckets, m, is close to the number of data items, n, log(n/m) becomes a very small constant, and the time complexity of bucket sort approaches O(n).
Bucket Sort Scenarios:
<mark style="background: #FFB8EBA6;">**Bucket sort is well-suited for external sorting**</mark>: External sorting is when data is stored on disk, the data volume is large, and memory is limited, so it cannot all be loaded into memory at once. For example, sorting 10GB of order data by order amount with only a few hundred MB of memory.
Step 1: First, scan the file to determine the range of order amounts. Let's assume after scanning, we find the minimum order amount is 1 yuan and the maximum is 100,000 yuan. We divide all orders into 100 buckets based on their amount. The first bucket stores orders with amounts between 1 and 1000 yuan, the second bucket for amounts between 1001 and 2000 yuan, and so on. Each bucket corresponds to a file, and they are named and numbered sequentially according to the amount range (00, 01, 02...99).
Step 2: If the order amounts are uniformly distributed between 1 and 100,000, the orders will be evenly divided among the 100 files. Each small file will store about 100MB of order data. We can then load these 100 small files into memory one by one and sort them using quick sort.
Step 3: After all the files are sorted, we just need to read the order data from each small file in sequence, from smallest to largest file number, and write it into a single file. This final file will contain all the order data sorted by amount in ascending order.
<mark style="background: #BBFABBA6;">If the amounts are not uniformly distributed</mark>: We can continue to partition. For example, if there are many orders with amounts between 1 and 1000 yuan, we can further divide this range into 10 smaller intervals: 1 to 100 yuan, 101 to 200 yuan, 201 to 300 yuan... 901 to 1000 yuan. If after this division, the orders between 101 and 200 yuan are still too numerous to be loaded into memory at once, we continue to partition until all files can be loaded into memory.
Here we can see the limitations of bucket sort:
1. The data must be easy to divide into buckets.
2. The data distribution across the buckets should be relatively uniform.
Counting Sort:
Sorting the college entrance exam scores of 500,000 students, with a maximum score of 900 and a minimum of 0. The range of this data is very small, so we can divide it into 901 buckets, corresponding to scores from 0 to 900. Based on the students' scores, we place these 500,000 students into these 901 buckets. The data within each bucket consists of students with the same score, so no further sorting is needed. We just need to scan each bucket in order and output the students from each bucket into an array. This accomplishes the sorting of the 500,000 students. Since this only involves scanning and traversal operations, the time complexity is O(n).
This is counting sort. It's a special case of bucket sort. But we don't see any 'counting'. Why is it called counting? Here we need to discuss the key points of counting sort:
```java
// Counting sort, a is the array, n is the array size. Assume the array stores non-negative integers.
public void countingSort(int[] a, int n) {
  if (n <= 1) return;
  // 1. Find the data range in the array
  int max = a[0];
  for (int i = 1; i < n; ++i) {
    if (max < a[i]) {
      max = a[i];
    }
  }
  // 2. Count
  int[] c = new int[max + 1]; // Apply for a counting array c, with index size [0, max]
  for (int i = 0; i <= max; ++i) {
    c[i] = 0;
  }
  // Calculate the count of each element and put it in c
  for (int i = 0; i < n; ++i) {
    c[a[i]]++;
  }
  // 3. Sum sequentially
  for (int i = 1; i <= max; ++i) {
    c[i] = c[i-1] + c[i];
  }
  // Temporary array r to store the sorted result
  int[] r = new int[n];
  // 4. The key step for calculating the sort, a bit hard to understand: remember to traverse the original array from back to front (to ensure it's a stable algorithm)
  for (int i = n - 1; i >= 0; --i) {
    int index = c[a[i]]-1;
    r[index] = a[i];
    c[a[i]]--;
  }
  // Copy the result to array a
  for (int i = 0; i < n; ++i) {
    a[i] = r[i];
  }
}
```
Scenarios for Counting Sort:
1. The data range is not large. If the data range k is much larger than the number of data items n to be sorted, it is not suitable.
2. It can only sort non-negative integers. If there are negative numbers, you need to add a certain number to them or use the modulo operator, but you must not change their original relative order.
Radix Sort:
How to sort 10 million phone numbers 🤔?
The data range is too large, making counting sort unsuitable. If, in the first few digits, phone number 'a' is already greater than phone number 'b', there's no need to look at the remaining digits. A stable sorting algorithm sorts from the least significant digit, and after it's done, the entire set is ordered (refer to the example of sorting orders by amount, and for the same amount, by time).
Sorting 200,000 English words from the Oxford dictionary?
Because the words have different lengths. Pad the words with '0' at the end. For example, 'ab' and 'a0'. Since all letters are greater than '0', this won't affect the original sorting result.
Scenarios:
1. The data can be split into independent digits for comparison.
2. There is a progressive relationship between the digits.
3. The data range for each digit cannot be too large, so that counting sort can be used to control the time complexity to O(n).
Time Complexity:
To sort by each digit, we can use the bucket sort or counting sort we just discussed, whose time complexity can be O(n). If the data to be sorted has k digits, then we need k rounds of bucket or counting sort, making the total time complexity O(k*n). When k is not large, for example, in the case of sorting phone numbers where k is at most 11, the time complexity of radix sort is approximately O(n).
An example that looks like sorting but doesn't actually require it:
We need to sort the string 'D, a, F, B, c, A, z', with the requirement that all lowercase letters come before all uppercase letters, but the order within the lowercase letters and within the uppercase letters is not required. For example, after sorting, it could be 'a, c, z, D, F, B, A'. How can this be implemented? If the string contains not only uppercase and lowercase letters but also numbers, and we need to put lowercase letters at the beginning, uppercase letters at the end, and numbers in the middle, how can this be solved without using a sorting algorithm?
Use two pointers, a and b: pointer 'a' traverses forward from the beginning, stopping when it encounters an uppercase letter. Pointer 'b' traverses backward from the end, stopping when it encounters a lowercase letter. Then, swap the elements at pointers 'a' and 'b'. Repeat this process until pointers 'a' and 'b' cross. For putting lowercase letters first, numbers in the middle, and uppercase letters last, you can first divide the data into two categories: lowercase letters and non-lowercase letters. Perform the swap as described above, and then within the non-lowercase letter section, divide it into numbers and uppercase letters and apply the same process.
How to design a general-purpose sorting algorithm:
Summary: Selection sort and quick sort are unstable. Merge sort and linear sorting algorithms are not in-place.
In terms of data volume and scenario, the preferred choices are quick sort, merge sort, and heap sort. However, the average complexity of quick sort is not n log n, while merge sort's average complexity is n log n, but its space complexity is O(n). Therefore, for quick sort, we can use the median-of-three method or a random method to select the partition, and then manually simulate a stack on the heap for push and pop operations to overcome the system stack limitations (Glibc's qsort() implementation: median-of-three, simulated stack).
Quick sort is not stable, bubble sort is stable.
### Binary Search
Limitations of Binary Search Scenarios:
1. Applicable to arrays.
2. The array must be sorted.
3. The data volume should not be too small, and the comparison operation should be relatively time-consuming: For example, if an array stores strings with a length of over 300, comparing two such long strings is very time-consuming. We need to minimize the number of comparisons as much as possible, and reducing comparisons will significantly improve performance. In this case, binary search has an advantage over sequential traversal.
4. Multiple lookups. If it's a one-time lookup, sorting might not be worth it.
5. Generally for static data: Deletions and insertions are infrequent (for dynamic data, use a binary search tree).
Time complexity is: O(log n)
Problem:
1. How to programmatically implement 'finding the square root of a number'? It should be accurate to 6 decimal places. Binary search or Newton's method;
Newton's method:
```c++
double number = 15; // The number whose square root is to be found
double xini = 10; // Initial point
while(xini*xini - number > 1e-6) { 
  xini = (number + xini*xini)/2/xini; 
}
```
2. I just mentioned that if data is stored in a linked list, the time complexity of binary search becomes very high. So, what exactly is the time complexity of the search? If you derive it yourself, you will deeply understand why we choose arrays over linked lists to implement binary search.
Assuming the length of the linked list is n, binary search needs to find the midpoint each time (ignoring odd/even differences in calculation): The first time finding the midpoint requires moving the pointer n/2 times; the second time requires n/4 moves; the third time requires n/8 moves; ... and so on, until it's 1 move. The total number of pointer moves (lookups) = n/2 + n/4 + n/8 + ... + 1. This is clearly a geometric series. According to the formula for the sum of a geometric series: Sum = n - 1. Finally, the algorithm's time complexity is O(n-1), which, ignoring the constant, is written as O(n). The time complexity is the same as a sequential search.
3. Quickly finding a specific integer among 10 million numbers.
- Binary search.
- Consider using array indices to store data, with one bit for a flag. During the initial sort, we can get the maximum and minimum values of the set. Suppose the minimum is 5 and the maximum is 20 million. We can define a byte array `Byte arr[20000000]`. Since I only need to set a flag, one bit is enough for the flag, and one byte can store flags for 8 numbers. It would take just over 2MB to store the state (exists or not) of 20 million numbers. First, store these 10 million numbers. Use the number `x / 8` to get the array index. Use `x % 8` to get the remainder. Since every group of 8 numbers gets the same array index, we need the remainder to determine the specific number. Then, start setting the state. From low bit to high bit, each bit represents the state of a number, cases 0 to 7. Each time you set the state for the current number, first use a bitwise AND operation to set other irrelevant positions to 1 and the current position to 0, then use a bitwise OR to set the state for the current position. Set it to 1 if it exists, 0 if it doesn't. After completing the above operations, you can support any lookup. Just input a number x, and I can immediately get the position of this number using `x / 8` and `x % 8`, and then retrieve the state bit. If it's 1, it exists; if it's 0, it doesn't.
Case Study:
Finding the province of an IP address: When looking up the location of the IP address 102.102.133.13, we search in an address database and find that this IP address falls within the range [202.102.133.0, 202.102.133.255]. We can then display the location corresponding to this IP address range, 'Dongying City, Shandong Province', to the user.
This is a variation of the binary search problem.
Thought-provoking question: An ordered array is a cyclically sorted array, for example, {4, 5, 6, 1, 2, 3}. For this situation, how do you implement a binary search algorithm to find a 'value equal to a given value'?
There are three methods to search a cyclically sorted array. First: 1. Find the boundary index, splitting it into two sorted arrays. 2. Determine which sorted range the target value is in and perform a binary search. Second: 1. Find the index 'x' of the maximum value. 2. Offset all element indices by +x, taking the modulus for values exceeding the array bounds. 3. Perform a binary search using the offset indices. 4. If the target index is found, offset it by -x to get the actual index of the target value. In both cases, the highest time cost is in finding the boundary point, so the time complexity is O(N). The complexity is a bit high, can it be optimized? Third: We find that a cyclically sorted array has a property: partitioning the array at its midpoint will divide it into one sorted subarray and one cyclically sorted subarray. If the first element is less than the middle element, the first half is sorted, and the second half is cyclically sorted. If the first element is greater than the middle element, the second half is sorted, and the first half is cyclically sorted. If the target element is in the sorted subarray, use binary search. If the target element is in the cyclically sorted subarray, set the array boundaries and continue searching using the method above. The time complexity is O(log N).
Basic Usage:
Not often used for finding a given value; hash tables and binary search trees are generally used instead: <mark style="background: #FFB86CA6;">Assuming no duplicate elements exist</mark>
<mark style="background: #FF5582A6;">1. Recursive Method: </mark>
```c++
int binarySearchInternal(int arr[], int low, int high, int value) {
   if(low > high) return -1; // Note 1
   int mid = low + ((high - low) >> 1); // Note 2: When optimizing mid = lo + (hi - lo) / 2 to a bit shift, be aware of operator precedence. Never write it as: mid = lo + (hi - lo) >> 1
   if(arr[mid] == value) {
       return mid;
   }
   else if(arr[mid] < value) {
	  // Note 3
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
<mark style="background: #FF5582A6;">2. Iterative Method:</mark>
```c++
int binarySearch(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   // Note 1: it's <=
   while(low <= high) { 
       // Note 2: otherwise it might overflow
       int mid = low + ((high-low) >> 1); 
       if(arr[mid] == value) {
           return mid;
       }
       else if(arr[mid] < value) {
           low = mid + 1; // Note 3: need +1/-1, otherwise it might be an infinite loop
       }
       else {
           high = mid - 1;
       }
   }
   return -1;
}
```
Generally used for "approximate" searching
Points to Note:
1. Loop exit condition
2. Calculation of mid
3. Updates to low and high
Assuming data is sorted in ascending order:
Variation 1: Find the first element equal to the given value.
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + ((high - low) >> 1);
       if(arr[mid] > value) {
           high = mid - 1;
       }
       else if(arr[mid] < value) {
           low = mid + 1;
       }
       else {
       // arr[mid] is the first element, or the previous one is not equal to value, then the element is found
       // otherwise, it must be on the left side
           if(mid == 0 || (arr[mid -1 ] != value)) return mid;
           else high = mid - 1;
       }
   }
   return -1;
}
```
Variation 2: Find the last element equal to the given value.
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + ((high - low) >> 1);
       if(arr[mid] > value) {
           high = mid - 1;
       }
       else if(arr[mid] < value) {
           low = mid + 1;
       }
       else {
          // arr[mid] is the last element or the next one is not equal to value, then the element is found
          // otherwise, it must be on the right side
           if(mid == n - 1 || (arr[mid + 1 ] != value)) return mid;
           else high = mid + 1; // This should be low = mid + 1
       }
   }
   return -1;
}
```
Variation 3: Find the first element greater than or equal to the given value.
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + ((high - low) >> 1);
       if(arr[mid] >= value) {
           // mid is the first element or the previous element is less than the value to be found
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
Variation 4: Find the last element less than or equal to the given value.
```c++
int binary(int arr[], int n, int value) {
   int low = 0;
   int high = n - 1;
   while(low <= high) {
       int mid = low + ((high - low) >> 1);
       if(arr[mid] > value) {
           high = mid - 1;
       }
       else {
           // mid is the last element or the next element is greater than the value to be found
           if((mid == n - 1) || (arr[mid + 1] > value)) return mid;
           else low = mid + 1;
       }
   }
   return -1;
}
```
## Greedy Algorithms
Characteristics (Information), Model (Model), Approach & Template (Action)
![[Pasted image 20230811173017.png]]  
It is a special case of dynamic programming, 
Characteristics: Optimal substructure (i.e., the optimal solution to the problem can be derived from the optimal solutions of its subproblems), and the greedy choice property (i.e., a locally optimal choice leads to a globally optimal solution).
Classic Problem: Suppose there are n intervals. Select a subset of these intervals such that no two intervals in the subset overlap. What is the maximum number of intervals you can select?
```js
// Suppose there are n intervals. Select a subset of these intervals such that no two intervals in the subset overlap. What is the maximum number of intervals you can select?
function greedyMaxIntervals(intervals) {
  intervals = intervals.sort((a, b) => a[1] - b[1]); // Sort by end time
  let result = []; // Record the number of selected intervals
  let endTime = 0; // Record the latest end time of the currently selected intervals
  for (const [start, end] of intervals) {
    if (start >= endTime) {
      // If the start time of this interval is later than or equal to the latest end time of the currently selected intervals, it means this interval can be selected
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
[Test Online](https://codesandbox.io/s/jolly-tess-qs52l6?file=/src/index.ts)
## Divide and Conquer Algorithms
Using the merge sort algorithm to sort large data with limited machine memory
![[Pasted image 20230811173039.png]]
![[Pasted image 20230811173107.png]]
```js
const mergeSort = (data, p, r) => {
    // If only one element is left, end the loop
    if(p >= r) return;
    // Temporarily divide in the middle
    let q = Math.floor((p + r) / 2);
    // Decompose
    mergeSort(data, p, q)
    mergeSort(data, q + 1, r)
    // Merge
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
    // Check which array has remaining data
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
    // Copy temp back
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
            // Read the number after the file title
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
### Backtracking Algorithms
```js
let minDist: number = Number.MAX_VALUE;
/**
 * Backtracking method to calculate the minimum distance.
 * @param i x-coordinate position
 * @param j y-coordinate position
 * @param dist current distance
 * @param w table array
 * @param n array length
 */
const minDistBT = (
  i: number,
  j: number,
  dist: number,
  w: Array<Array<number>>,
  n: number
) => {
  dist += w[i][j];
  // Reached the destination
  if (i === n - 1 && j === n - 1) {
    if (dist < minDist) {
      minDist = dist;
      return;
    }
  }
  // Move one step to the right
  if (i < n - 1) {
    minDistBT(i + 1, j, dist, w, n);
  }
  // Move one step down
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
**[Backtracking Code](https://codesandbox.io/s/hui-su-suan-fa-ww9ien?file=/src/index.ts) Test Online**
## Dynamic Programming
Problem Domain: Optimization problems (finding maximum/minimum values).
Classic Problems: Knapsack problem, Fibonacci sequence, coin change problem, climbing stairs problem, longest common subsequence, decoding methods.
Essentially, for these types of problems, a machine needs to perform an exhaustive search. Exhaustive search is generally implemented with recursion. Dynamic programming shows us how to search exhaustively in a smart way, optimizing the performance issues caused by direct recursive exhaustive search. Conversely, dynamic programming can essentially always be implemented using recursion.
The approach to dynamic programming: First, write the recurrence relation (or the code directly). Then, draw the recursion tree. By analyzing the recursion tree, you can find overlapping subproblems (repeated calculations). We can optimize this by using memoization or a DP table, either top-down (usually requiring depth-first search) or bottom-up. This is a way of trading space for time to reduce the time complexity.
A recursion tree generally solves a problem by solving its subproblems.
Classic Problem: Shortest path for a chess piece
Suppose we have an n x n matrix w[n][n]. The matrix stores positive integers. A chess piece starts at the top-left corner and must reach the bottom-right corner. We move the piece from the top-left to the bottom-right. At each step, it can only move one position to the right or one position down. Throughout the process, there are many different paths to choose from. We consider the sum of the numbers along each path as the length of that path. What is the length of the shortest path from the top-left to the bottom-right corner?
![[Pasted image 20240225215056.png]]
```js
[
   [1, 2, 5],
   [3, 2, 1],
   [9, 2, 11]
 ];
```
  
For the [[Backtracking Code](https://codesandbox.io/s/hui-su-suan-fa-ww9ien?file=/src/index.ts) Case 1], we can draw a recursion tree and find repeating nodes for f(i,j). We can use a state table to avoid re-computation, [Code 2](https://codesandbox.io/s/little-hill-u4v8wy?file=/src/index.ts). Using the state transition equation: min_dist[i, j] = w[i][j] + min(min_dist[i-1][j], min_dist[i][j-1]). [Code 3](https://codesandbox.io/s/adoring-bhaskara-5vskoh?file=/src/index.ts).
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
  
Through the multi-stage decision optimal solution model, which means optimization problems are suitable for being solved by dynamic programming (a model).
Generally, backtracking can solve it. Then, by using a recursion tree, we discover overlapping subproblems (DP characteristic 1). Additionally, the optimal solution to the problem is derived from the optimal solutions of its subproblems, and these subproblems can be further broken down (characteristic 2). Using a state table is a top-down approach, and writing the code is the process of filling the table. Alternatively, using a state transition equation is a bottom-up approach to writing the code.
Models: Greedy, backtracking, and dynamic programming are in one category. Divide and conquer is in another (it also solves for optimality, but the global optimum is not derived from the subproblem optima).
Characteristics: Characteristic 2 is the opposite of divide and conquer algorithms; in divide and conquer, subproblems cannot be further decomposed into subproblems.
Solution Methods:
State Transition Table Method: Implement with backtracking -> Define states (nodes of the recursion tree) -> Draw the recursion tree -> Find overlapping subproblems -> Draw the state transition table -> Fill the table according to the recurrence relation -> 'Translate' the table-filling process into code
State Transition Equation Method: Find the optimal substructure -> Write the state transition equation -> 'Translate' the state transition equation into code (bottom-up)
Memorize: 8 dynamic programming case studies.
Classic Problem: Making up the difference for a Double 11 (Singles' Day) discount.
```js
/**
 * Double 11 discount problem
 * @param items  Product prices
 * @param n Number of products
 * @param w Target amount for discount
 */
function double11advance(items, n, w) {
    let states = new Array(n); // Initialize state table
    for (let i = 0; i < n; i++) {
        states[i] = new Array(3 * w + 1).fill(false);
    }
    states[0][0] = true; // First decision
    if (items[0] <= 3 * w) {
        states[0][items[0]] = true;
    }
    for (let i = 1; i < n; i++) {
        for (let j = 0; j <= 3 * w; j++) { // Do not select
            if (states[i - 1][j] === true) {
                states[i][j] = states[i - 1][j]; // State remains the same as the previous one
            }
        }
        for (let j = 0; j <= 3 * w - items[i]; j++) { // Select
            if (states[i - 1][j] === true) {
                states[i][j + items[i]] = true; // Mark this point as decided
            }
        }
    }
    let j;
    for (j = w; j < 3 * w + 1; j++) { // Find the decision price closest to 200
        if (states[n - 1][j] === true) {
            break;
        }
    }
    if (j === 3 * w + 1) { // Cannot find such a combination
        return;
    }
    for (let i = n - 1; i >= 1; i--) { // Start from the first product
        // Check from n products, if the previous marked point [i-1, j-items[i]] is marked as 1, it means this product was selected
        if (j - items[i] > 0 && states[i - 1][j - items[i]] === true) {
            console.log(items[i] + " ");// Print selected product
            j = j - items[i];
        }
    }
    if (j !== 0) { // If there is still money left, it means the 0th product was also selected (because our state table is derived from the previous state to the next). If the 0th was not bought, j would be 0 here. If j is not 0, it means the 0th was bought.
        console.log(items[0]);
    }
}
export const dy_test_function = () => {
    // Select from these products to reach exactly 10 yuan for the discount
    const items = [2,2,4,6,3]
    double11advance(items, items.length, 10)
    return true
}
```
## String Matching
1. BM Algorithm
Bad Character Rule:
![[Pasted image 20230810120918.png]]
Good Suffix Rule:
![[Pasted image 20230810120757.png]]
![[Pasted image 20230810120825.png]]
![[Pasted image 20230810120834.png]]
```js
const SIZE = 256;
// Save the character index of the pattern string
function generateBC(bc: Array<number>, b: string) {
  for (let i = 0; i < b.length; i++) {
    const ascii = b[i].charCodeAt(0); // Convert to ASCII value of b[i]
    bc[ascii] = i;
  }
}
/**
 * Bad character matching algorithm implementation
 * @param a main string
 * @param b pattern string
 */
function bm_bc(a: string, b: string) {
  // Used to store the index corresponding to each character in the pattern string
  const bc: number[] = new Array(SIZE).fill(-1);
  generateBC(bc, b); // Generate a 256-bit ASCII array to store character indices, avoiding search by traversal
  let n = a.length; // length of the main string
  let m = b.length; // length of the pattern string
  // Represents the first character where the main string and pattern string are aligned
  let i = 0;
  while (i <= n - m) {
    // When the first character is smaller than the length difference between the main and pattern strings, it means no more backward movement is needed
    let j;
    // Pattern string matches from back to front
    for (j = m - 1; j >= 0; j--) {
      // Mismatch. Index j is the position of the bad character in the pattern string
      if (a[i + j] !== b[j]) {
        break;
      }
    }
    // Match successful. Return the first matching position of the pattern and main strings
    if (j <= 0) {
      return i;
    }
    // Move the pattern string backward: according to the bad character rule, si - xi
    // xi: a[i+j] the position of this bad character in the pattern string
    // si: j
    i = i + (j - bc[a[i + j].charCodeAt(0)]);
  }
  return -1; // No match found
}
// Through the above three diagrams, to calculate the number of bits to shift right, we need to know
// The matching index of the good suffix string {u} and another substring {u*}, which is x
// We build an array suffix[length of substring] = x
/**
 * @param b pattern string
 * @param suffix
 * @param prefix
 * @param m
 */
function generateSuffix(b: string, suffix: number[], prefix: boolean[], m) {
  for(let i = 0; i < m - 1; i++) { // traverse b
    let j = i;
    let k = 0; // length of the common suffix substring
    // Compare head and tail elements, if equal, move the head element forward, continue comparing two, three lengths
    while(j >= 0 && b[j] == b[m - 1 - k]) {
      --j;
      ++k;
      suffix[k] = j + 1;
    }
    if(j === -1) {
      prefix[k] = true; // It is the longest substring. Because we are looking for the longest substring
    }
  }
}
function moveByGS(j: number, m: number, suffix: number[], prefix: boolean[]) {
  let k = m - 1 - j; // length of the good suffix
  // 1. Perfect match
  if(suffix[k] !== -1) { // Indicates that the longest common suffix substring exists, find bc first, then c
    return j - suffix[k] + 1;
  }
  // 2. Partial match
  for(let r = j + 2; r <= m -1; ++r) {
    if(prefix[m-1-r+1]) { // This is our longest common substring
      return r
    }
  }
  // 3. Mismatch
  return m;
}
/**
 * @param a main string
 * @param b pattern string
 */
function bm(a: string, b: string) {
  // Used to store the index corresponding to each character in the pattern string
  const bc: number[] = new Array(SIZE).fill(-1);
  generateBC(bc, b); // Generate a 256-bit ASCII array to store character indices, avoiding search by traversal
  let suffix = new Array(b.length).fill(-1);
  let prefix = new Array(b.length).fill(false);
  let n = a.length;
  let m = b.length;
  generateSuffix(b, suffix, prefix, m);
  // Represents the first character where the main string and pattern string are aligned
  let i = 0;
  while (i <= n - m) {
    // When the first character is smaller than the length difference between the main and pattern strings, it means no more backward movement is needed
    let j;
    // Pattern string matches from back to front
    for (j = m - 1; j >= 0; j--) {
      // Mismatch. Index j is the position of the bad character in the pattern string
      if (a[i + j] !== b[j]) {
        break;
      }
    }
    // Match successful. Return the first matching position of the pattern and main strings
    if (j <= 0) {
      return i;
    }
    // Move the pattern string backward: according to the bad character rule, si - xi
    // si: a[i+j] the position of this bad character in the pattern string
    // xi: j
    let x = j - bc[a[i + j].charCodeAt(0)]; // length of bad character movement
    let y = 0;
    if(j < m - 1) { // has good suffix
      y = moveByGS(j, m, suffix, prefix); // length of good character movement
    }
    i = i + Math.max(x, y);
  }
  return -1; // No match found
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
2. KMP Algorithm
![[Pasted image 20230811172611.png]]
```js
function genNexts(b) {
    let m = b.length;
    let next = new Array(m);
    next[0] = -1;
    let k = -1; // prefix substring of the good prefix
    for(let i =1; i< m;i++) {
        // case 2: loop to find
        while(k !== -1 && b[k+1] != b[i]) {
            k = next[k]
        }
        // case 1
        if(b[k+1] === b[i]) {
            ++k;
        }
        // record it
        next[i] = k;
    }
    return next;    
}
function kmp(a, b) {
    let n = a.length; 
    let m = b.length; // pattern string length
    let next = genNexts(b, m); // only related to the pattern string
    let j = 0; // pattern string index
    for(let i=0; i<n; i++) {
        while(j > 0 && a[i] !== b[j]) { // found a bad character
            j = next[j-1] + 1; // j is updated to k. 
        }
        if(a[i] === b[j]) { // equal case
            ++j; // move pattern string index
        }  
        if(j == m) { // found a matching character, return the position of i
            return  i - m + 1;
        }
    }
    return -1; // no match found
}
export function kmp_TestFunction() {
  const a = "abcacabdc";
  const b = "abd";
  const result = kmp(a, b);
  console.log(result);
  return result;
}
```
3. Trie Algorithm
![[Pasted image 20230811172831.png]]
5. RK Algorithm
![[Pasted image 20230811172907.png]]
```js
// Calculate hash values for the n-m+1 substrings in the main string, then compare the hash value of the pattern string with each of them.
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
6. Aho-Corasick Automaton
![[Pasted image 20230811172935.png]]
Classic Problem: Sensitive word filtering
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
// Create on the dictionary
const createTrie = () => {
    const root = createAcNode("/");
    const insert = (words: string) => {
        let p = root;
        Array.from(words).forEach((c: string) => {
            let index: number = c.charCodeAt(0) - "a".charCodeAt(0);
            // create new node
            if (p.children[index] === null) {
                p.children[index] = createAcNode(c);
            }
            // point to new node
            p = p.children[index];
        });
        // mark as end of word node
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
  root.fail = null; // mark root node
  queue.push(root);
  while (queue.length > 0) {
    const p = queue.shift(); // p is the current pointer of the trie
    for (let i = 0; i < 26; i++) { // when traversing child nodes
      const pc = p.children[i]; // pc is a child node of p
      if (pc === null) { // skip empty child nodes
        continue;
      }
      if (p === root) { // all child nodes of the root node have their fail pointers pointing to the root node
        pc.fail = root;
      }
      else { // not the root node, i.e., p
        let q = p.fail; // the position of the current node's failure pointer
        while (q !== null) {
          const qc = q.children[pc.data.charCodeAt(0) - "a".charCodeAt(0)];
          if (qc !== null) { // if qc exists, point pc's failure pointer to qc and stop searching
            pc.fail = qc;
            break;
          }
          // if such a qc does not exist, find the previous matchable suffix substring
          q = q.fail;
        }
        // reached the root node, point pc's failure pointer to root
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
  let p = root; // start from the root node
  for (let i = 0; i < n; i++) { // scan the main string once
    const idx = text[i].charCodeAt(0) - "a".charCodeAt(0); // get the array index of the current character
    // p.children[idx] means the child node of pointer p finds the corresponding character of the main string
    while (p.children[idx] === null && p !== root) { // in this case, it is not equal to the main string, so search through the failure pointer
      p = p.fail;
    }
    p = p.children[idx]; // level order traversal, point to child node
    if (p === null) { // if there is no match, e.g., in this case, restart matching from root
      p = root;
    }
    // check if a series of paths ending with a failure pointer is a pattern string, if so, this pattern string is a sensitive word
    let tmp = p; // child node is not null
    while (tmp !== root) { // until the pointer points to the root node
      if (tmp.isEndingChar) { // determine if it is a pattern string, if so, it means this pattern string is a sensitive word, then print the result
        const pos = i - tmp.length + 1;
        console.log("start index,",pos, "length", tmp.length);
      }
      // otherwise, check along the failure pointer
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
## Garbage Collection Algorithms
For example, the JVM first marks for deletion, and when there is no more space, it deletes them all at once.
## Compression Algorithms
Huffman coding for string compression:
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
    // Array of nodes sorted in ascending order of frequency
    const nodes = Object.entries(data).map(([char, value]) => {
        return createNode(char, data[char])
    })
    // Build Huffman tree
    while(nodes.length > 1) {
        // sort in ascending order
        nodes.sort((a,b) => a.frequency - b.frequency)
        const left = nodes.shift()
        const right = nodes.shift()
        const parent = createNode(null, left.frequency + right.frequency)
        parent.left = left;
        parent.right = right;
        nodes.push(parent)
    }
    // root node
    return nodes[0]
}
const buildHuffmanTable = root => {
    const huffmanTable = {}
    // Traverse edges: preorder traversal
    const  traverse = (node, code) => {
        if(node.char) { // leaf node
            console.log('node.char', node.char)
            huffmanTable[node.char] = code
        }
        else { // non-leaf node
            traverse(node.left, code + '0')
            traverse(node.right, code + '1')
        }
    }
    traverse(root, '');
    console.log('hu', huffmanTable)
    return huffmanTable
}
// Get Huffman encoding: path of the tree
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
## Levenshtein Algorithm
Search engine's spell-checking feature
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
# References
1. 'The Beauty of Data Structures and Algorithms' by Wang Zheng
2. [freecodecamp tutorial](https://www.freecodecamp.org/chinese/news/big-o-notation/)
3. NeetCode.io
4. 'Hello Algorithm'
