---
title: "Immutable 数据结构实现原理与实践"
date: 2019-11-25
tags:
  - JavaScript
  - Data Structures
  - Programming
---

## 目录

- [Immutable 的核心概念](#immutable-的核心概念)
  - [什么是 Immutable？](#什么是-immutable)
  - [常见的 Immutable 数据结构](#常见的-immutable-数据结构)
- [Trie 树与 Bitmapped Vector Trie](#trie-树与-bitmapped-vector-trie)
  - [Trie 树](#trie-树)
  - [Bitmapped Vector Trie](#bitmapped-vector-trie)
    - [工作原理](#工作原理)
- [Immutable 库的实现原理](#immutable-库的实现原理)
  - [核心思想](#核心思想)
  - [实现方式](#实现方式)
- [如何实现一个简单的 Immutable 库](#如何实现一个简单的-immutable-库)
  - [设计目标](#设计目标)
  - [示例代码](#示例代码)
  - [关键点解析](#关键点解析)
- [参考资料](#参考资料)

---

## Immutable 的核心概念

### 什么是 Immutable？

- **不可变性**：一旦创建，数据结构就不能被修改。
- **优点**：
  - 数据一致性：避免意外修改。
  - 性能优化：通过结构共享（Structural Sharing）减少内存开销。
  - 更适合函数式编程：支持纯函数和不可变状态。

### 常见的 Immutable 数据结构

- **List**：不可变数组。
- **Map**：不可变键值对集合。
- **Set**：不可变集合。

---

## Trie 树与 Bitmapped Vector Trie

### Trie 树

- **定义**：一种树形数据结构，用于高效存储和检索字符串或其他可分解为序列的数据。
- **特点**：
  - 每个节点代表数据的一部分。
  - 节点之间的关系通过前缀共享。

### Bitmapped Vector Trie

- **定义**：一种基于 Trie 树的高效数据结构，常用于实现 Immutable 数据结构。
- **特点**：
  - 使用位图（Bitmap）来优化节点查找。
  - 支持快速的插入、删除和更新操作。
  - 在 Immutable.js 中广泛使用。

#### 工作原理

1. **结构共享**：
   - 修改时，只复制受影响的节点，其余部分保持不变。
   - 通过引用共享未修改的部分，减少内存占用。
2. **性能优势**：
   - 时间复杂度：O(log₃₂(n))，适用于大规模数据集。

---

## Immutable 库的实现原理

### 核心思想

- **持久化数据结构**：
  - 每次修改都会生成一个新的版本，同时保留旧版本。
  - 新版本与旧版本共享大部分数据。
- **结构共享**：
  - 只有发生变化的部分会被复制，其余部分通过引用共享。

### 实现方式

1. **Trie 树**：
   - 用于存储数据的层级结构。
   - 每个节点包含子节点的引用。
2. **位图优化**：
   - 使用位图标记子节点的存在状态，减少空节点的存储开销。
3. **路径压缩**：
   - 通过跳过中间层节点，提升访问效率。

---

## 如何实现一个简单的 Immutable 库

### 设计目标

- 支持基本的不可变数据结构（如 List 和 Map）。
- 提供高效的更新操作（基于结构共享）。

### 示例代码

以下是一个简单的 Immutable 库实现：

```javascript
class ImmutableMap {
  constructor(data = {}, bitmap = 0, children = []) {
    this.data = data; // 存储原始数据
    this.bitmap = bitmap; // 位图标记
    this.children = children; // 子节点数组
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
    return key.charCodeAt(0) % 32; // 简单哈希函数
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

// 测试代码
const map = new ImmutableMap();
const updatedMap = map.set("a", 1).set("b", 2);
console.log(updatedMap.get("a")); // 输出: 1
console.log(updatedMap.get("b")); // 输出: 2
```

### 关键点解析

1. **位图（Bitmap）**：
   - 用于标记哪些索引位置有数据。
   - 减少空节点的存储开销。
2. **结构共享**：
   - `set` 方法返回一个新的实例，而原始数据保持不变。
3. **扩展性**：
   - 可以进一步优化为多层 Trie 树，支持更大规模的数据。

---

## 参考资料

- [Immutable Data Structures for Functional JS](http://www.liuyiqi.cn/2017/10/22/immutable-data-structures-for-functional-js/)
- [Immutable.js 官方文档](https://immutable-js.com/)
- [Bitmapped Vector Trie 原理详解](https://en.wikipedia.org/wiki/Trie)
