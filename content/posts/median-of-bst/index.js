class TreeNode {
    constructor(d) {
        this.data = d
        this.left = this.right = null
    }
}

// 中序遍历
function countNode(root) {
    let current, pre
    let count = 0
    if(root == null)
        return count
    
    current = root
    while(current != null) {
        if(current.left === null) {
            count++
            current = current.right
        }
        else {
            // 找到前任节点
            pre = current.left
            while(pre.right !== null && pre.right !== current) {
                pre = pre.right
            }
            
            if(pre.right === null) {
                pre.right = current
                current = current.left
            }
            else {
                pre.right = null
                count++
                current = current.right
            }
        }
    }
    return count
}

function getMedian(node) {

}