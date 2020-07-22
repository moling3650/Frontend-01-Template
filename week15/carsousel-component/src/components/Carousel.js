import { createElement } from "../lib/createElement";
import { Timeline, Animation } from "../lib/animation";
import { cubicBezier } from "../lib/cubicBezier";

const ease = cubicBezier(.17, .67, .83, .67)

export class Carousel {
  constructor(interval = 3000) {
    this.images = [];
    this.position = 0;
    this.timeline = new Timeline();
    this.timer = null;
    this.interval = interval;
  }

  get lastPosition() {
    return (this.position - 1 + this.images.length) % this.images.length;
  }

  get nextPosition() {
    return (this.position + 1) % this.images.length;
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  render() {
    let children = this.images.map(url => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    })

    let nextPic = () => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.timeline.state !== 'playing') {
        return;
      }
      let current = children[this.position];
      let next = children[this.nextPosition];

      const currentStart = -100 * this.position;
      const nextStart = -100 * (this.nextPosition - 1);

      current.style.transform = `translateX(${currentStart}%)`;
      next.style.transform = `translateX(${nextStart}%)`;

      this.timer = setTimeout(() => {
        this.timeline.clear()
        const a1 = new Animation(current.style, 'transform', currentStart, currentStart - 100, 500, 0, ease, v => `translateX(${v}%)`);
        const a2 = new Animation(next.style, 'transform', nextStart, nextStart - 100, 500, 0, ease, v => `translateX(${v}%)`);
        this.timeline.add(a1);
        this.timeline.add(a2);
        this.timeline.start();

        this.position = this.nextPosition;
      }, 16);

      this.timer = setTimeout(nextPic, this.interval);
    }

    setTimeout(nextPic, this.interval);
    this.timeline.start();

    const carousel = <div class='carousel'>
      {children}
    </div>;

    carousel.addEventListener('mousedown', () => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timeline.pause();
      let startX = event.clientX;
      let offsetX = 0;
      const width = carousel.root.getBoundingClientRect().width;

      let current = children[this.position];
      let last = children[this.lastPosition];
      let next = children[this.nextPosition];

      current.style.transform = `translateX(${-width * this.position}px)`;
      last.style.transform = `translateX(${-width * this.lastPosition - width}px)`;
      next.style.transform = `translateX(${-width * this.nextPosition + width}px)`;

      let move = (event) => {
        offsetX = event.clientX - startX;
        current.style.transform = `translateX(${offsetX - width * this.position}px)`;
        last.style.transform = `translateX(${offsetX - width * this.lastPosition - width}px)`;
        next.style.transform = `translateX(${offsetX - width * this.nextPosition + width}px)`;
      }

      let up = (event) => {
        let offset = 0;

        if (offsetX > (width / 2)) {
          offset = 1;
        } else if (offsetX < -(width / 2)) {
          offset = -1;
        }

        const currentStart = offsetX - width * this.position;
        const lastStart = offsetX - width * this.lastPosition - width;
        const nextStart = offsetX - width * this.nextPosition + width;
        let a1, a2;
        if (offsetX > 0) {
          // last & current
          if (offset) {
            a1 = new Animation(current.style, 'transform', currentStart, currentStart + (width - offsetX), 500, 0, ease, v => `translateX(${v}px)`);
            a2 = new Animation(last.style, 'transform', lastStart, lastStart + (width - offsetX), 500, 0, ease, v => `translateX(${v}px)`);
          } else {
            a1 = new Animation(current.style, 'transform', currentStart, currentStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
            a2 = new Animation(last.style, 'transform', lastStart, lastStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
          }
        } else {
          // current & next
          if (offset) {
            a1 = new Animation(current.style, 'transform', currentStart, currentStart - (width + offsetX), 500, 0, ease, v => `translateX(${v}px)`);
            a2 = new Animation(next.style, 'transform', nextStart, nextStart - (width + offsetX), 500, 0, ease, v => `translateX(${v}px)`);
          } else {
            a1 = new Animation(current.style, 'transform', currentStart, currentStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
            a2 = new Animation(next.style, 'transform', nextStart, nextStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
          }
        }
        this.timeline.clear();
        this.timeline.add(a1);
        this.timeline.add(a2);
        this.timeline.start();

        this.position = (this.position - offset + this.images.length) % this.images.length;
        this.timer = setTimeout(nextPic, this.interval);

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    })

    return carousel;
  }
}
