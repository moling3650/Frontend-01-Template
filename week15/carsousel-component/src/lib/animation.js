export class Timeline {

  constructor (animations) {
    this.animations = animations || [];
    this.requestID = null;
    this.state = 'inited';
    this.startTime = null;
    this.pauseTime = null;
    this.tick = () => {
      const t = Date.now() - this.startTime;
      const animations = this.animations.filter(a => !a.finished);

      animations.forEach(animation => {
        animation.move(t);
      })
      if (animations.length) {
        this.requestID = requestAnimationFrame(this.tick);
      }
    }
  }

  add(animation, addTime) {
    animation.finished = false;
    if (this.state === 'playing') {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
    }
    this.animations.push(animation);
  }

  clear() {
    this.pause()
    this.animations = [];
    this.requestID = null;
    this.state = 'inited';
    this.startTime = null;
    this.pauseTime = null;
  }

  start() {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    this.pause();
    this.animations.forEach(animation => {
      animation.finished = false
    })
    this.requestID = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  pause() {
    if (this.state !== 'playing') {
      return;
    }
    this.state = 'paused';
    this.pauseTime = Date.now();
    this.requestID && cancelAnimationFrame(this.requestID);
  }

  resume() {
    if (this.state !== 'paused') {
      return;
    }
    this.state = 'playing';
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  } 
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
    this.finished = false;
    this.addTime = 0
  }

  computeProgression(t) {
    let progression = this.timingFunction((t - this.delay - this.addTime) / this.duration);
    if (t > this.duration + this.delay + this.addTime) {
      progression = 1;
      this.finished = true;
    }
    return progression;
  }

  move(t) {
    let progression = this.computeProgression(t);

    const value = this.start + progression * (this.end - this.start);
    this.object[this.property] = this.template(value);
  }
}