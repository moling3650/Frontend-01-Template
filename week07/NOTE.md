1. 获取Http响应
   1. 获取文件流
   2. 解析Body
2. 解析HTML
   1. 使用有限状态机解析token
   2. 用token生成element和text节点
   3. 组合成DOM结构
3. 解析CSS
   1. 收集CSS规则
   2. 判断元素跟CSS规则是否匹配
   3. 计算CSS规则优先级
   4. 把优先级更高的CSS规则应用到元素
4. 布局
   1. 初始化布局属性默认值
   2. 子元素分行
   3. 计算主轴
      - flexible item的mainSize会根据flex line的剩余尺寸来决定的，剩余尺寸按比均摊
      - 当flow-wrap值为nowrap且非flexible item的总尺寸大于flex line尺寸，元素尺寸会被等比压缩
   4. 计算交差轴
      - 当flex-wrap的值为nowrap，把行crossSize设置为容器的crossSize
      - 当item的crossSize没有设置时，如果align-items的值为stretch，则把item的crossSize设置为行crossSize，否则为0
5. 绘制
   1. 根据布局信息绘制整个页面


- CSS
  - At-rules
    - @charset
    - @import
    - @media
    - @page
    - @counter-style
    - @document
    - @keyframes
    - @fontface
    - @supports
    - @namespace
    - @viewport
  - rule
    - Selector
      - selectors_group
      - combinator
        - \s
        - \>
        - \+
        - ~
      - simple_selector
        - type
        - \*
        - \#
        - .
        - []
        - : and ::
        - :not
    - Declaration
      - Key
        - Property
        - Variables
      - Value
