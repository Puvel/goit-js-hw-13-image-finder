import './styles.css';
import 'material-design-icons/iconfont/material-icons.css';
import apiService from './js/apiService';
import imageCardTemplate from './templates/imageCardTemplate.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  query: document.querySelector('input[name="query"]'),
  loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', handleInputForm);
refs.loadMoreBtn.addEventListener('click', fetchImages);
refs.gallery.addEventListener('click', showImage);

function handleInputForm(e) {
  e.preventDefault();
  clearList();
  apiService.resetPage();
  apiService.searchQuery = refs.query.value;
  fetchImages();
  modul();
  refs.loadMoreBtn.classList.add('js-btn-visibil');
}

function fetchImages() {
  apiService
    .fetchImages()
    .then(hits => {
      createElement(hits);
    })
    .then(() => scroll())
    .catch(() => {
      PNotify.error({
        title: 'Oh No!',
        text: 'Something terrible happened.',
      });
    });
}

function createElement(items) {
  const newList = items.map(item => imageCardTemplate(item)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', newList);
}

function clearList() {
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.remove('js-btn-visibil');
}

function scroll() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
}

function modul() {
  const success = PNotify.success({
    title: 'Desktop Success',
    text: 'All done! Come back to my tab!',
    modules: {
      Buttons: {
        closer: false,
        sticker: false,
      },
      Desktop: {
        desktop: true,
      },
    },
  });
  success.on('click', function () {
    success.close();
  });
}

function showImage(e) {
  if (e.target.nodeName === 'IMG') {
    const largImg = e.target.dataset.url;
    basicLightbox
      .create(
        `
    	<img width="1200" height="900" src="${largImg}">
    `,
      )
      .show();
  }
}
