function getMaxK(arr, k) {
  const res = [];

  const queue = [];
  let index = 0;
  for (; index < k; index++) {
    queue.push(arr[index]);
  }

  queue.sort((a, b) => b - a);
  res.push(queue[0]);

  // 删除数组第一个元素
  queue.splice(arr[0], 1);

  for (; index < arr.length; index++) {
    const element = arr[index];
    queue.push(element);
    queue.sort((a, b) => b - a);
    res.push(queue[0]);

    queue.splice(arr[index - k + 1], 1);
  }
  return res;
}

const arr = [1, 2, 3, 1, 4, 5, 2, 3, 6];
const result = getMaxK(arr, 3);
console.log(result);
