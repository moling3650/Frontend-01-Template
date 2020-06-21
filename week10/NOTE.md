# Tic-Tac-Toe

[示例网站](http://47.114.59.114:8012/)

### 概念定义
- 棋子（Piece）
  - PIECE_O
  - PIECE_X
- 棋格（Cell）
  - PIECE_O
  - PIECE_X
  - EMPTY
- 胜者（Winner）
  - PIECE_O
  - PIECE_X
  - DRAW
---
### 模型定义
#### 棋盘（Board）
- 属性
  - dimension：尺寸，Tic-Tac-Toe的棋盘尺寸是3
  - cells：棋盘数据，用一维数组储存
- 方法
  - constructor (dimension = 3, cells = null)：棋盘初始化
  - getDimension ()：获取棋盘尺寸
  - switchPiece (piece)：切换棋子，返回`O、X`其中之一
  - cellFor (position)：获取positon的Cell，返回`O、X、EMPTY`其中之一
  - getEmptyCells ()：获取所有空白棋格的position的数组
  - move (position, piece)：落子
  - checkWin ()：获取棋局的胜者，棋局结束返回`O、X、DRAW`其中之一，否则返回`null`
  - clone ()：返回一个克隆的棋盘
  - clearCell (position)：清空一个棋格
  - clear ()：清空棋盘
  - displayFor (cell)：显示一个棋格的内容
  - display ()：显示整个棋盘
  - isEmptyCell (cell)：判断某个棋格是否为空
  - isEmpty ()：判断棋盘是否空的
  - isFull ()：判断棋盘是否满子

#### 策略（Strategy）
- 抽象方法
  - calculatePosition (board, piece)：计算落子点

#### 游戏（Game）
- 属性
  - board：棋盘
  - containerEl：容器元素
  - currentPiece：当前落子的棋子
  - isRunning：游戏是否运行中
- 方法
  - constructor(board, containerSelector = '.container')：游戏初始化
  - _initDom ()：初始化DOM
  - _draw ()：绘制棋盘
  - move (position): 落子，棋子自动判定
  - moveByStratepy (strategy)：根据某个策略模型落子
  - start ()：开始游戏
  - restart ()：重置游戏
---
### 落子策略
- Random
  > 随机选择一个空格落子。
- MonteCarlo
  > 蒙特卡罗方法（英语：Monte Carlo method），也称统计模拟方法，是1940年代中期由于科学技术的发展和电子计算机的发明，而提出的一种以概率统计理论为指导的数值计算方法。是指使用随机数（或更常见的伪随机数）来解决很多计算问题的方法。
- Minimax
  > Minimax算法常用于棋类等由两方较量的游戏和程序。该算法是一个零总和算法，即一方要在可选的选项中选择将其优势最大化的选择，另一方则选择令对手优势最小化的方法。而开始的时候总和为0。很多棋类游戏可以采取此算法。

#### RandomStrategy（随机策略：人工智障）
1. 获取所有的空棋格
2. 随机选择一个棋格落子

#### MonteCarloStrategy（蒙特卡罗策略：统计模拟方法）
1. 在当前的棋局进行N次训练，把棋局进行到分胜负
2. 根据每次训练结果更新统计信息
3. 统计出所有胜率最高的落子位置
4. 随机选择一个胜率最高的位置落子

#### MinimaxStrategy（极小化极大策略）
1. 先假设自己处在一个最差的结果
2. 穷尽所有尝试去找一个稍微好一点的结果
3. 假设对手也是采用这个策略
4. 递归寻求一个不败的结果
