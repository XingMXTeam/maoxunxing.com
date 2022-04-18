class TreeNode {
  [x: string]: any;
  constructor(data) {
    this.data = data;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}
class AVLTree {
  [x: string]: any;
  constructor() {
    this.root = null;
  }
  height(node) {
    if (!node) return 0;
    return node.height;
  }
  getBalance(node) {
    if (!node) return 0;
    return this.height(node.left) - this.height(node.right);
  }

  rightRotate(node) {
    // use two pointer
    const x = node.left;
    // ref to old x.right
    const y = x.right;

    // perform rotate
    x.right = node; // change x.right keep x.left
    node.left = y; // change node.left keep node.right

    // update nodes
    node.height = max(this.height(node.left), this.height(node.right)) + 1;
    x.height = max(this.height(x.left), this.height(x.right)) + 1;

    return x;
  }
  leftRotate(x) {
    const y = x.right;
    // cache y.left
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = max(this.height(x.left), this.height(x.right)) + 1;
    y.height = max(this.height(y.left), this.height(y.height)) + 1;
  }
  
  insert(node, data) {
    // if leaf node (when root is null , return a new node)
    if (!node) {
      return new TreeNode(data);
    }

    // 1 insert to the tree
    if (data < node.data) {
      node.left = this.insert(node.left, data);
    } else if (data > node.data) {
      node.right = this.insert(node.right, data);
    } else {
      // duplicated data
      return node;
    }

    // 2 update node's height
    node.height = max(this.height(node.left), this.height(node.right)) + 1;

    // 3 balance tree
    const balance = this.getBalance(node);
    //  we always think about three nodes
    if (balance > 1 && data < node.left.data) {
      return this.rightRotate(node);
    }
    if (balance < -1 && data > node.right.data) {
      return this.leftRotate(node);
    }
    if (balance > 1 && data > node.left.data) {
      // rotate left part
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && data < node.right.data) {
      // rotate right part
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }
    return node;
  }
  deleteNode(x) {
    if (this.root === null) return null;
  }
  
}

// const findMax = (root) => {
//   if(root===null) return null;
//   const data = root.data;
//   const ldata = findMax(root.left);
//   const rdata = findMax(root.right);
//   if(ldata > data) {
//     data = ldata
//   }
//   if(rdata > data) {
//     data = rdata
//   }
//   return data;
// }

// const printKMax(arr, k) {
//   const avl = new AVLTree();
//   arr.forEach(i=>{
//     avl.insert(null, i)
//   });
//   // for(let i =0; i<arr.length;i++) {
//     console.log(findMax(avl.root))
//   // }
// }
