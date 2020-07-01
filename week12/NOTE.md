### 串匹配算法

#### 蛮力算法
```javascript
function bf_match(pattern, text) {
  let pi = 0
  let ti = 0
  while (pi < pattern.length && ti < text.length) {
    if (pattern[pi] === text[ti]) {
      ti += 1
      pi += 1
    } else {
      ti -= pi - 1
      pi = 0
    }
  }
  return ti - pi
}
```

#### KMP算法
KMP算法是从蛮力算法推导出来的，通过构建出一个next备查表，快速移动对齐匹配位置。
```javascript
function buildNext(pattern) {
  const next = new Array(pattern.length).fill(-1)
  let pi = 0
  let pj = -1
  while (pi < pattern.length - 1) {
    if (pj < 0 || pattern[pi] === pattern[pj]) {
      pi += 1
      pj += 1
      next[pi] = (pattern[pi] === pattern[pj]) ? next[pj] : pj
    } else {
      pj = next[pj]
    }
  }
  return next
}

function kmp_match(pattern, text) {
  const next = buildNext(pattern)
  let pi = 0
  let ti = 0
  while (pi < pattern.length && ti < text.length) {
    if (pi < 0 || pattern[pi] === text[ti]) {
      pi += 1
      ti += 1
    } else {
      pi = next[pi]
    }
  }
  return ti - pi
}
```
可以看出，KMP和蛮力算法的关键区别就在于next表，KMP可以通过查询next表就可以跳过一些已经比较过的字符。
比如一个文本串'010102'和一个模式串'0102'
> T: 010102
> P: 0102

现在是在文本串第四个字符的地方匹配失败，如果是蛮力匹配的话，下一步应该是从文本串的第二个字符，和模式串的第一个字符，重新开始匹配。
但是用了KMP算法之后，通过查询next表，就可以把模式串向后滑动两位对齐，然后再从文本串的第四个字符，和模式串的第二个字符，重新开始匹配。
> T: 010102
> P: &ensp;&ensp;0102

##### 如果模式串带有通配符会怎么样？

> T: 0123401
> P: ????01

模式串前面有多少个?，就可以先在文本串消解多少个字符。模式串前面的?并不会影响KMP的next表

> T: 0123
> P: 4????

模式串后面有多少个?，除非是超出文本串的长度，否则就能匹配成功，模式串后面的?也不会影响KMP的next表

