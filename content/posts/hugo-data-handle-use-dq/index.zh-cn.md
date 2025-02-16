---
title: "海量数据排序案例：1TB订单数据的排序"
date: 2023-06-18T11:52:40+08:00
tags:
- 算法
description: "用一个实际案例去解析，分治算法在海量数据处理中的应用"
images:
- hugo-data-handle-use-dq/img_2.png
---

## 案例背景
我们有 **1TB 的订单数据**，需要按照金额大小进行排序。然而，机器内存只有 **2GB**，无法一次性加载所有数据到内存中。如何解决这个问题？

---

## 分析与思路

这是一个典型的 **海量数据处理问题**，可以利用 **分治思想** 来解决。分治思想的核心是将一个大问题拆解成多个小问题，分别解决这些小问题后，再将结果合并得到最终答案。

### 归并排序的启示
归并排序是分治思想的经典应用。它通过以下步骤实现排序：
1. **分解**：将数组不断分割，直到每个子数组只剩下一个元素（已排序）。
2. **合并**：将两个有序数组合并成一个更大的有序数组，最终得到完整的排序结果。

以下是归并排序的过程示意图：
{{< img src="img.png" alt="归并排序的过程" maxWidth="960px" caption="归并排序的过程" >}}

#### 合并的关键逻辑
假设我们需要合并两个有序数组 `A` 和 `B`：
1. 申请一个新数组，大小为 `A + B`。
2. 使用两个游标分别指向 `A` 和 `B` 的起始位置。
3. 比较两个游标指向的值，将较小的值写入新数组，并移动对应游标。
4. 当某个数组的游标到达末尾时，将另一个数组的剩余部分直接复制到新数组。
5. 最终将新数组的内容复制回原数组。

以下是归并排序的代码实现：

```js
const mergeSort = (data, p, r) => {
    // 如果只剩一个元素，结束递归
    if (p >= r) return;

    // 分割点
    let q = Math.floor((p + r) / 2);

    // 分解
    mergeSort(data, p, q);
    mergeSort(data, q + 1, r);

    // 合并
    merge(data, p, q, r);
};

const merge = (data, p, q, r) => {
    const temp = new Array(r - p + 1);
    let i = p;
    let j = q + 1;
    let k = 0;

    // 比较两个数组的元素，按升序写入临时数组
    while (i <= q && j <= r) {
        if (data[i] <= data[j]) {
            temp[k++] = data[i++];
        } else {
            temp[k++] = data[j++];
        }
    }

    // 将剩余元素写入临时数组
    let start = i;
    let end = r;
    if (j > r) {
        end = q;
    } else {
        start = j;
    }
    while (start <= end) {
        temp[k++] = data[start++];
    }

    // 将临时数组内容复制回原数组
    for (let i = 0; i < r - p + 1; i++) {
        data[p + i] = temp[i];
    }
    return data;
};

export const ms_test_function = () => {
    const data = [11, 8, 3, 9, 7, 1, 2, 3];
    mergeSort(data, 0, data.length - 1);
    return true;
};
```

---

## 解决方案：分治思想在海量数据排序中的应用

回到正题，面对 **1TB 订单数据** 和 **2GB 内存限制**，我们可以采用以下步骤解决问题：

---

### **Step 1: 分解大文件**
由于内存有限，我们需要将大文件逐行读取并根据订单金额拆分成多个小文件。例如，假设订单金额最大为 1 万，我们可以按照金额范围拆分：
- 0-99 元 → 文件 `partition_0.txt`
- 100-199 元 → 文件 `partition_1.txt`
- 200-299 元 → 文件 `partition_2.txt`
- ...

这样做的好处是便于后续合并时，可以根据文件名顺序快速排序。

以下是拆分文件的代码实现：

```js
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
```

---

### **Step 2: 对小文件排序**
每个小文件的数据量较小，可以直接加载到内存中进行排序。可以使用高效的排序算法（如归并排序或快速排序），并将排序后的结果写回文件。

以下是排序小文件的代码实现：

```js
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
```

---

### **Step 3: 合并小文件**
将所有排序后的小文件按照文件名顺序进行合并。这一步类似于归并排序的合并过程，每次从各个小文件中取出最小的元素，逐步生成最终的排序结果。

以下是合并小文件的代码实现：

```js
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
    });
}
```

---

## 运行结果

以下是整个流程的运行结果：
1. **输入文件**：原始 1TB 订单数据。
2. **中间文件**：
   - `temp/input`：分小文件后的结果，每个小文件存储对应的订单数据。
   - `temp/output`：小文件内部排序后的结果。
3. **输出文件**：`sorted_file.txt` 是最终的合并结果，已经按照订单金额排序完成。

运行结果如下图所示：
{{< img src="img_3.png" alt="运行结果" maxWidth="960px" caption="运行结果" >}}

---

## 总结

通过分治思想，我们将一个看似不可能的任务分解为三个可行的步骤：
1. **分解大文件**：根据订单金额范围将大文件拆分为多个小文件。
2. **排序小文件**：对每个小文件进行排序。
3. **合并小文件**：将所有排序后的小文件合并成最终的排序结果。

这种方法不仅解决了内存不足的问题，还可以通过分布式计算进一步加速处理（如 MapReduce）。以下是分治过程的完整示意图：
{{< img src="img_1.png" alt="分治过程" maxWidth="960px" caption="分治过程" >}}