//   i=1
// 1 0 0 0 0  1  4
// maxR 1 1
// step 1 2 1 0
// jump 2
function miniJumpsToEnd(arr) {
  const n = arr.length;
  if (n <= 1) return 0;
  if (arr[0] == 0) return -1;

  let maxReach = arr[0]; // 最大能走得到的索引
  let step = arr[0]; // 当前还剩几步
  let jumps = 1; // 总共走了多少步

  for (let index = 0; index < arr.length; index++) {
    if (index == arr.length - 1) {
      return jumps;
    }

    maxReach = Math.max(maxReach, index + arr[index]);

    step--;

    if (step == 0) {
      jumps++;

      // 不能继续往前走了 表示没有走到最后
      if (index >= maxReach) {
        return -1;
      }
      step = maxReach - index;
    }
  }
}
