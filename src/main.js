import DragScroll from './dragScroll.js';
import data from './data.js';

function populateSliderWrapper(data) {
  const sliderWrapper = document.querySelector('.slider-wrapper');

  data.forEach(design => {
    const sliderItem = document.createElement('div');
    sliderItem.className = 'slider-item';

    const figure = document.createElement('figure');
    figure.className = 'slider-item__figure';

    const img = document.createElement('img');
    img.className = 'slider-item__image';
    img.src = `../assets/designs/design-${design.id}.png`;
    img.alt = design.description;

    figure.appendChild(img);
    sliderItem.appendChild(figure);
    sliderWrapper.appendChild(sliderItem);
  });
}

populateSliderWrapper(data);

const scroll = new DragScroll({
  el: '.slider',
  wrap: '.slider-wrapper',
  items: '.slider-item',
});

const animateScroll = () => {
  requestAnimationFrame(animateScroll);
  scroll.raf();
};

animateScroll();
