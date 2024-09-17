import { lerp, clamp, getNumericCssValue } from './utils.js';

class DragScroll {
  constructor(obj) {
    this.el = document.querySelector(obj.el);
    this.wrap = document.querySelector(obj.wrap);
    this.items = document.querySelectorAll(obj.items);
    this.init();
  }

  init() {
    this.progress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;

    this.bindings();
    this.events();
    this.calculate();
    this.raf();
  }

  bindings() {
    const methods = [
      'events',
      'calculate',
      'raf',
      'handleWheel',
      'move',
      'handleTouchStart',
      'handleTouchMove',
      'handleTouchEnd',
    ];

    methods.forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  calculate() {
    const gap = getNumericCssValue(this.wrap, '--gap');

    this.progress = 0;
    this.wrapWidth =
      (this.items[0].clientWidth + gap) * this.items.length - gap;
    this.wrap.style.width = `${this.wrapWidth}px`;
    this.maxScroll = this.wrapWidth - this.el.clientWidth;
  }

  handleWheel(evt) {
    this.progress += evt.deltaY;
    this.move();
  }

  handleTouchStart(evt) {
    evt.preventDefault();
    this.dragging = true;
    this.startX = evt.clientX ?? evt.touches[0].clientX;
  }

  handleTouchMove(evt) {
    if (!this.dragging) return false;

    const x = evt.clientX ?? evt.touches[0].clientX;
    this.progress += (this.startX - x) * 2.5;
    this.startX = x;
    this.move();
  }

  handleTouchEnd() {
    this.dragging = false;
  }

  move() {
    this.progress = clamp(this.progress, 0, this.maxScroll);
  }

  events() {
    window.addEventListener('resize', this.calculate);
    window.addEventListener('wheel', this.handleWheel);

    this.wrap.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);

    this.wrap.addEventListener('mousedown', this.handleTouchStart);
    window.addEventListener('mousemove', this.handleTouchMove);
    window.addEventListener('mouseup', this.handleTouchEnd);
  }

  raf() {
    this.x = lerp(this.x, this.progress, 0.04);

    if (this.x === this.oldX) return;

    this.wrap.style.transform = `translateX(-${this.x}px)`;

    this.speed = Math.min(50, this.oldX - this.x);
    this.oldX = this.x;

    this.items.forEach(item => {
      item.style.transform = `scale(${1 - Math.abs(this.speed) * 0.003})`;
      item.querySelector('img').style.transform = `scaleX(${
        1 + Math.abs(this.speed) * 0.004
      });`;
    });
  }
}

export default DragScroll;
