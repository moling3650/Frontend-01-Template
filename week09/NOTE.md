# 本周总结

## CSS

### 颜色
* CMYK：Cyan-青色，Magenta-品红，Yellow-黄色，blacK-黑色
* RGB：Red-红色，Green-绿色，Blue-蓝色
* HSL：Hue-颜色（0-360），Saturation-饱和度（0-100%），Lightness-亮度（0-100%，黑-白）
* HSV：Hue-颜色（0-360），Saturation-饱和度（0-100%），Value-明度（0-100%，黑-白）

### 形状
* SVG
  *  data:image/svg+xml,\<svg\>...\</svg\>

### Animation
+ animation-name 时间曲线
+ animation-duration 动画的时长
+ animation-timing-function 动画的时间曲线
+ animation-delay 动画开始前的延迟
+ animation-iteration-count 动画播放次数
+ animation-direction 动画方向
### Transition
+ transition-property 要变换的属性
+ transition-duration 变换的时长
+ transition-timing-function 时间曲线
+ transition-delay 延迟

## HTML

### 合法元素
* DocumentType: <!Document html>
* ElementL: \<tag\>\</tag\>
* Text: text
* Comment: \<!-- xxx --\>
* ProcessingInstruction: \<?a 1?\>
* CDATA: \<![CDATA[]]\>

### 字符引用
* !: \&#161;
* &: \&amp;
* <: \&lt;
* \>: \&gt;
* ": \&quot;

### NODE
+ Element 元素型节点
+ Document 文档根节点
+ Character 字符数据 包括文本节点 注释 处理信息
+ DocumentFragment 文档片段 不会产生真实dom 减少dom操作 可以作为性能优化的手段
+ DocumentType 文档类型

### 导航类操作
+ parentNode
+ childNodes
+ firstChild
+ lastChild
+ nextSibling
+ previousSibling

### 修改操作
+ appendChild
+ insertBefore
+ removeChild
+ replaceChild

### 高级操作
+ compareDocumentPosition 用于比较两个节点关系的函数
+ contains 检查一个节点是否包含另外一个节点
+ isEqualNode 检查两个节点是否完全相同
+ isSameNode 检查两个节点是否是同一个节点 实际可以在JS中用===去判断
+ cloneNode 复制一个节点 如果参数为true 会连同子元素做深拷贝

# Browser API
+ DOM
  + DOM Tree
  + Events
    + 捕获（push)
    + 冒泡（pop）
  + Range
  + Traversal （废弃）
+ CSSOM
+ BOM
+ Web Animation
+ Crypto
