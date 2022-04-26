class TreeNode {
    constructor(d) {
        this.data = d
        this.left = this.right = null
    }
}

let index = 0

function construct(arr, value, min, max, size) {
    if (index > size)
        return null
    var root = null
    if (value > min && value < max) {
        root = new TreeNode(value)
        index += 1
        root.left = construct(arr, arr[index], min, value, size)
        root.right = construct(arr, arr[index], value, max, size)
    }
    return root
}

function conductBSTTree(arr) {
    return construct(arr, arr[0], Number.MIN_VALUE, Number.MAX_VALUE, arr.length)
}

function postTraverse(node) {
    if (!node)
        return
    postTraverse(node.left)
    console.log(node.data + " ")
    postTraverse(node.right)
}

const arr = [10, 5, 1, 7, 40, 50]
const node = conductBSTTree(arr)
postTraverse(node)