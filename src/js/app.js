import imageTemplate from '../../src/template/image.hbs';
import apiService from './apiPix';
import * as basicLightbox from 'basiclightbox';
import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyStyleMaterial from 'pnotify/dist/es/PNotifyStyleMaterial.js';
import InfiniteScroll from 'infinite-scroll';

const refs = {
  inputSearch: document.querySelector('input'),
  searchForm: document.querySelector('#search-form'),
  ul: document.querySelector('.gallery'),
  li: document.querySelector('.list-item'),
  body: document.querySelector('body'),
  loadMoreBtn: document.querySelector('#js-load-more'),
};

refs.searchForm.addEventListener('submit', searchImage);
refs.loadMoreBtn.addEventListener('click', loadMore);
refs.loadMoreBtn.addEventListener('click', scroll);
refs.ul.addEventListener('click', modal);

function renderImage(images) {
  refs.ul.insertAdjacentHTML('beforeend', imageTemplate(images));
}

function searchImage(e) {
  e.preventDefault();
  const input = e.currentTarget.elements.query;

  clearMarkup();
  apiService.resetPage();
  apiService.searchQuery = input.value;

  apiServices(input.value);
  input.value = '';
}

function scroll() {
  setTimeout(() => {
    window.scrollTo({
      top: +window.scrollY + 700,
      behavior: 'smooth',
    });
  }, 400);
}

function pnotifyInfo(images) {
  if (!images.length) {
    PNotify.defaults.icons = 'material';
    PNotify.error({
      title: 'Nothing found for this request!',
      text: 'Enter query.',
      delay: 2000,
    });
  } else {
    renderImage(images);
  }
}

function loadMore(input) {
  apiService
    .apiService(input)
    .then(images => pnotifyInfo(images))
    .catch(error => console.log(error));
}

function clearMarkup() {
  refs.ul.innerHTML = '';
}

function apiServices(input) {
  apiService
    .apiService(input)
    .then(images => {
      pnotifyInfo(images);
    })
    .catch(error => console.log(error));
}


function modal(e) {
  if (!e.target.dataset.source) {
    return;
  } else {
    const instance = basicLightbox.create(
      `
    <img src=${e.target.dataset.source} width="800" height="600">
`,
    );
    instance.show();
  }

}

