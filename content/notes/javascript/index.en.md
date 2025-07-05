---
title: "Immutable Data Structure Implementation Principles and Practices"
date: 2019-11-25
tags:
  - JavaScript
  - Data Structures
---

## Table of Contents

- [Core Concepts of Immutability](#core-concepts-of-immutability)
  - [What is Immutability?](#what-is-immutability)
  - [Common Immutable Data Structures](#common-immutable-data-structures)
- [Trie Trees and Bitmapped Vector Trie](#trie-trees-and-bitmapped-vector-trie)
  - [Trie Trees](#trie-trees)
  - [Bitmapped Vector Trie](#bitmapped-vector-trie)
    - [How it works](#How-it-works)
- [How immutable libraries are implemented](#How-immutable-libraries-are-implemented)
  - [Core concepts](#Core-concepts)
  - [Implementation methods](#Implementation-methods)
- [How to implement a simple immutable library](#How-to-implement-a-simple-immutable-library)
  - [Design Goals](#Design Goals)
  - [Sample Code](#Sample Code)
  - [Key Points Analysis](#Key Points Analysis)
- [References](#References)

---

## Core Concepts of Immutable

### What is Immutable?

- **Immutability**: Once created, the data structure cannot be modified.
- **Advantages**:
  - Data consistency: Avoid accidental modifications.
  - Performance optimization: Reduce memory overhead through structural sharing.
  - More suitable for functional programming: Support pure functions and immutable state.

### Common Immutable Data Structures

- **List**: An immutable array.
- **Map**: An immutable collection of key-value pairs.
- **Set**: An immutable set.

---

## Trie Trees and Bitmapped Vector Trie

### Trie Trees

- **Definition**: A tree-like data structure used for efficient storage and retrieval of strings or other data that can be decomposed into sequences.
- **Features**:
  - Each node represents a part of the data.
  - The relationship between nodes is determined by shared prefixes.

### Bitmapped Vector Trie

- **Definition**: An efficient data structure based on Trie trees, commonly used to implement immutable data structures.
- **Features**:
  - Uses bitmaps to optimize node lookup.
  - Supports fast insertion, deletion, and update operations.
  - Widely used in Immutable.js.

#### How it works

1. **Structure sharing**:
   - When modifying, only the affected nodes are copied, and the rest remain unchanged.
   - Unmodified parts are shared by reference, reducing memory usage.
2. **Performance advantages**:
   - Time complexity: O(log₃₂(n)), suitable for large-scale datasets.

---

## Implementation Principles of Immutable Libraries

### Core Ideas

- **Persistent Data Structures**:
  - Each modification generates a new version while retaining the old version.
  - New versions share most of the data with old versions.
- **Structure Sharing**:
  - Only the changed parts are copied, while the rest are shared via references.

### Implementation Methods

1. **Trie Tree**:
   - Used to store hierarchical data structures.
   - Each node contains references to its child nodes.
2. **Bitmap Optimization**:
   - Uses bitmaps to mark the existence status of child nodes, reducing storage overhead for empty nodes.
3. **Path compression**:
   - Improves access efficiency by skipping intermediate nodes.

---

## How to implement a simple Immutable library

### Design goals

- Support basic immutable data structures (such as List and Map).
- Provide efficient update operations (based on structure sharing).

### Sample code

The following is a simple Immutable library implementation:

```javascript
class ImmutableMap {
  constructor(data = {}, bitmap = 0, children = []) {
    this.data = data; // Store the original data
    this.bitmap = bitmap; // Bitmap marking
    this.children = children; // Children array
  }

  get(key) {
    const index = this._getIndex(key);
    if (this.bitmap & (1 << index)) {
      const pos = this._getPos(index);
      return this.children[pos];
    }
    return undefined;
  }

  set(key, value) {
    const index = this._getIndex(key);
    const newBitmap = this.bitmap | (1 << index);
    const pos = this._getPos(index);

    let newChildren = [...this.children];
    if (this.bitmap & (1 << index)) {
      newChildren[pos] = value;
    } else {
      newChildren.splice(pos, 0, value);
    }

    return new ImmutableMap(this.data, newBitmap, newChildren);
  }

  _getIndex(key) {
    return key.charCodeAt(0) % 32; // Simple hash function
  }

  _getPos(index) {
    let pos = 0;
    for (let i = 0; i < index; i++) {
      if (this.bitmap & (1 << i)) {
        pos++;
      }
    }
    return pos;
  }
}

// Test code
const map = new ImmutableMap();
const updatedMap = map.set(“a”, 1).set(“b”, 2);
console.log(updatedMap.get(“a”)); // Output: 1
console.log(updatedMap.get(“b”)); // Output: 2
```

### Key points

1. **Bitmap**:
   - Used to mark which index positions have data.
   - Reduces the storage overhead of empty nodes.
2. **Structure Sharing**:
   - The `set` method returns a new instance, while the original data remains unchanged.
3. **Scalability**:
   - Can be further optimized into a multi-level Trie tree to support larger datasets.

---

## References

- [Immutable Data Structures for Functional JS](http://www.liuyiqi.cn/2017/10/22/immutable-data-structures-for-functional-js/)
- [Immutable.js Official Documentation](https://immutable-js.com/)
- [Bitmapped Vector Trie Principle Detailed Explanation](https://en.wikipedia.org/wiki/Trie)