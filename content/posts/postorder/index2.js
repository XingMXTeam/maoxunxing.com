const arr = [10, 5, 1, 7, 40, 50]
    
class TreeNode {
    constructor(d) {
        this.data = d
        this.left = this.right = null
    }
}

let node;

function createNode(node, data) {
    if (!node) {
        node = new TreeNode(data)
    }
    if (node.data > data) {
        node.left = createNode(node.left, data)
    }
    if (node.data < data) {
        node.right = createNode(node.right, data)
    }
    return node
}


function postTraverse(node) {
    if (!node)
        return
    postTraverse(node.left)
    console.log(node.data + " ")
    postTraverse(node.right)
}


for (let i = 0; i < arr.length; i++) {
    node = createNode(node, arr[i])
}
postTraverse(node)
