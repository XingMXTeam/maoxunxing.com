function insert(stack2, val) {

}

function delete(stack1, stack2) {

}

function getMaxK(arr, k) {
    const res = []

    const stack1 = [] //只删除
    const stack2 = [] //只插入

    const n = arr.length

    for (let index = 0; index < k - 1; index++) {
        insert(stack2, arr[index])
    }

    




}