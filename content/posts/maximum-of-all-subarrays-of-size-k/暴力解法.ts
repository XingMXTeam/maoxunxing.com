function getMaxK(arr, k) {
  if (!arr) return;
  if (arr.length <= k) {
    return Math.max(...arr);
  }
  const result = [];
  for (let index = 0; index <= arr.length - k; index++) {
    result.push(Math.max(arr[index], arr[index + 1], arr[index + 2]));
  }
  return result.join(" ");
}

const arr = [1, 2, 3, 1, 4, 5, 2, 3, 6];
const result = getMaxK(arr, 3);
console.log(result);
