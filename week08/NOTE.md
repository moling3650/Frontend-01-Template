## 本周总结

### 重学CSS——选择器

#### 选择器语法
+ 简单选择器
  + \*
  + div svg|a
  + .class
  + #id
  + [attr=value] 比较器(=、~=、|=、^=、$=、*=)
  + :hover
  + ::before

+ 复合选择器
  + <简单选择器><简单选择器><简单选择器>
  + \*或者div必须写在最前面
  + 伪类伪元素必须写在后面

+ 复杂选择器
  + <复合选择器><sp><复合选择器>
  + <复合选择器>">"<复合选择器>
  + <复合选择器>"~"<复合选择器>
  + <复合选择器>"+"<复合选择器>

#### 组合器回溯

##### 例子
像```.a + .b ~ .target```，首先是匹配最右边的.target，然后在.target的所有的前兄弟找一个与.b匹配的元素，然后再在.b元素找它的前兄弟来匹配.a，一旦失配，下次和新元素匹配还是从.b开始，这就是回溯。

##### 规则
- \<SP>： ~、+、>
- ~： +


#### 选择器优先级

取一个四元组，按照[行内元素, id选择器, class选择器, tag选择器]来进行优先级比较

其中，伪类、伪元素装入tag选择器中，属性选择器装入class选择器中，而*通配符、not伪类、+、~、>、 等符号不增加优先级，但是not括号内的选择器会加入到这个四元组中

最特殊的!important，会吃掉所有的这些优先级，成为最强的优先级

不过强烈建议不要在生产环境中使用，仅允许在hotfix中使用，后期必须更换。!important总是会造成不可预知的麻烦

#### 伪类
+ 链接/行为
  + :any-link
  + :link :visited
  + hover
  + active
  + :focus
  + target

+ 树结构
  + empty
  + nth-child()
  + nth-last-child()
  + first-child :last-child :only-child

+ 逻辑型
  + :not
  + :where :has

#### 伪元素
+ ::before
+ ::after
+ ::first-line
+ ::first-letter

*first-line和first-letter可用属性*

|| first-line | first-letter |
|:-:|:-:|:-:|
| font系列 | √ | √ |
| color系统 | √ | √ |
| background系列 | √ | √ |
| word-spacing | √ | √ |
| letter-spacing | √ | √ |
| text-decoration | √ | √ |
| text-transform | √ | √ |
| line-height | √ | √ |
| float | × | √ |
| vertical-align | × | √ |
| 盒模型系列：margin,padding,border | × | √ |


### 重学CSS——排版

#### 盒(Box)

| 源代码 | 语义 | 表现 |
|:-:|:-:|:-:|
| 标签 | 元素 | 盒 |
| Tag | Element | Box |

HTML代码中可以书写开始**标签**，结束**标签**，和自封闭**标签**

一对起止**标签**，表示一个**元素**

DOM树中存储的是**元素**和其他类型的节点（Node）

CSS选择器选中的是**元素**

CSS选择器选中的**元素**，在排版时可能产生多个**盒**

排序和渲染的基本单位是**盒**

#### 盒模型

+ box-sizing
  + content-box：width = content
  + border-box：width = content + padding + border


#### 正常流（一代排版方式）

包括float、position为非static的布局方式

思考：我们如何写字
+ 从左到右书写
+ 同一行写的文字都是对齐的
+ 一行写满了，就换到下一行

正常流排版
+ 收集盒进行
+ 计算盒在行中的排布
+ 计算行的排布

#### 正常流的行模型

#### overflow: visible与BFC

#### margin折叠

+ block-level 表示可以被放入bfc
+ block-container 表示可以容纳bfc
+ block-box = block-level + block-container
+ block-box 如果 overflow 是 visible， 那么就跟父bfc合并

#### Flex排版

+ 收集盒进行
+ 计算盒在主轴方向的排布
+ 计算盒在交叉轴方向的排布

##### 分行
+ 根据主轴尺寸，把元素分进行
+ 若设置了no-wrap，则强行分配进第一行

##### 计算主轴方向
+ 找出所有Flex元素
+ 把主轴方向的剩余尺寸按比例分配给这些元素
+ 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素

##### 计算交叉轴方向
+ 会将每行元素最大crossSize设置为行crossSize，但flex-wrap值为nowrap时，会把行的crossSize设置为容器的crossSize，如果没设置容器crossSize，容器crossSize是所有行crossSize总和
+ 根据行高align-items和align-self以及align-content，确定元素具体位置