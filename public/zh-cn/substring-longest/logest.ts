//  i
// forgeeksskeegfor
// l h

function logestPStr(str) {
  let n = str.length;
  if (n < 2) return n;

  let maxLength = 1,
    start = 0;
  let low, high;
  for (let index = 0; index < n; index++) {
    low = index - 1;
    high = index + 1;
    // 跳掉重复
    while (high < n && str[high] == str[index]) {
      high++;
    }
    // 跳掉重复
    while (low >= 0 && str[low] == str[index]) {
      low--;
    }
    // 中间是回文
    while (low >= 0 && high < n && str[low] == str[high]) {
      low--;
      high++;
    }
    let length = high - low - 1;
    if (maxLength < length) {
      maxLength = length;
      start = low + 1;
    }
  }
  return maxLength;
}
