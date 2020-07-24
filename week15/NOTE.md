### Webpack-loader
把一个任意的source文本串解析为一个js module的文本串

### JavaScript Animation
把动画添加到时间轴，用时间轴控制所有动画的状态

#### Timeline（时间轴）
- state
  - inited
  - playing
  - paused
- propteries
  - animations
  - requestID
  - startTime
  - pauseTime
- methods
  - _tick()
  - add(animation, addTime)
  - clear()
  - start()
  - restart()
  - pause()
  - resume()

#### Animation（动画）
- state
  - inited
  - finished
- propteries
  - object
  - property
  - start
  - end
  - duration
  - delay
  - timingFunction
  - template
  - addTime
- methods
  - _computeProgression(time)
  - move(time)