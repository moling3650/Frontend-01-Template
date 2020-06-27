### 异步编程
+ setTimeout()
+ Promise
+ async/await
+ generator/iterator

```javascript
async function sleep (timeout) {
    return new Promise(function (resolve) {
        setTimeout(resolve, timeout)
    })
}
function* fibonacci(n) {
    let curr = 0
    let next = 1
    while(n--) {
        yield curr
        next = next + curr
        curr = next - curr
    }
}
const fibList = [...fibonacci(10)]
```

### 寻路

#### 广度优先搜索（BFS）
直观地讲，它其实就是一种“地毯式”层层推进的搜索策略，即先查找离起点最近的，然后是次近的，依次往外搜索，直至到达终点。此算法能够找到最短路径。

使用数据结构——队列，先进先出。

#### 深度优先搜索（DFS）
最直观的例子就是“走迷宫”。假设你站在迷宫的某个岔路口，然后想找到出口。你随意选择一个岔路口来走，走着走着发现走不通的时候，你就回退到上一个岔路口，重新选择一条路继续走，直到最终找到出口。这种走法就是一种深度优先搜索策略。此算法不能找到最短路径。

使用数据结构——栈，后进先出。

#### Dijkstra 算法
此算法能够找到最短路径，算法复杂度高。

#### A* 算法
此算法只能够找最到接近最短路径的次优解，算法复杂度较低。