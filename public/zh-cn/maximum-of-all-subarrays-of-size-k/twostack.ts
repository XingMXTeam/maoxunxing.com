function insert(s2, val) {
  let node = {};
  node.data = val;

  if (s2.length <= 0) node.max = val;
  else {
    const top = s2[s2.length - 1];
    node.max = Math.max(val, top.max);
  }
  s2.push(node);
}
//    i  end
// 2  3  5  6 7
// s1: 5(5) 3(5)
// s2: 6(6)
// 5 6
function update(s1, s2) {
  if (s1.length > 0) s1.pop();
  else {
    while (s2.length > 0) {
      insert(s1, s2[s2.length - 1]);
      s2.pop();
    }
    s1.pop();
  }
}

function getMaxK(arr, k) {
  const res = [];

  const s1 = []; // 划动窗口
  const s2 = []; //

  const n = arr.length;

  // 初始
  for (let index = 0; index < k - 1; index++) {
    insert(s2, arr[index]);
  }

  for (let i = 0; i <= n - k; i++) {
    // 更新
    if (i - 1 >= 0) update(s1, s2);

    // 插入
    insert(s2, arr[i + k - 1]);

    res.push(Math.max(s1[s1.length - 1].max, s2[s2.length - 1].max));
  }
}
