class Int {
    constructor(d) {
        this.data = d
    }
}

function postOrder(arr) {
    let preIndex = new Int(0) // 索引
    return loopUtil(arr, arr.length, Number.MIN_VALUE, Number.MAX_VALUE, preIndex)
}

function loopUtil(pre, size, min, max, preIndex) {
    if(preIndex.data == size) return 

    // 不属于当前子树
    if(pre[preIndex.data] < min && pre[preIndex.data] > max) {
        return 
    }
    let val = pre[preIndex.data]
    preIndex.data++

    // 在{ min, val }区间的在左子树
    loopUtil(pre, size, min, val, preIndex)
    
    // 在{ val, max }区间的在右子树
    loopUtil(pre, size, val, max, preIndex)

    // 打印当前的
    console.log('val', val)
}
