### Carousel component

项目地址：https://github.com/moling3650/carousel-component

#### Drag事件
1. onStart：清除动画，计算点击当前图片的X轴偏移值。
2. onPan：根据startX/clientX/offsetX三个值计算当前X轴偏移值，并应用到last/current/next三张图片的transform上。
3. onPanend：根据startX/clientX/offsetX三个值计算当前X轴偏移值，通过当前X轴偏移值和isFlick判断是否切换图片，然后产生动画。回复原状或是切换到另一张图片。

#### 优化
1. 在监听start事件时，可以通过getBoundingClientRect获取carousel的width，并通过父子元素的rect计算当前图片的offsetX值，这样pan事件的transform和nextPic的transform就解耦了，单位可以不一致。
2. 在panEnd事件里，其实只需要播放两个动画。通过当前图片的X轴偏移值就可以判断是播放last & current的动画，还是播放current & next的动画，因为carousel里面只能显示两张图片。
3. flick的逻辑已完成。