import Api from './api';
import { startSpinner, stopSpinner } from './loader';

const modal = document.querySelector('.modal-empty__backdrop');
const close = document.querySelector('.modal-empty__close');
modal.addEventListener('click', onModalEmpty);
close.addEventListener('click', onCloseModalEmpty);

const api = new Api();
const modalEmptyEl = document.querySelector('.modal-empty');
const modalWrapperEl = document.querySelector('.modal-wrapper');

export default async function onOpenModalEmpty(e) {
  toggleModalEmpty();
  window.document.addEventListener('keydown', onTapEsc);

  try {
    startSpinner();
    modalWrapperEl.classList.add('isHidden');
    modalEmptyEl.classList.add('no-padding');
    const { results } = await api.searhMovieKey(
      e.currentTarget.getAttribute('data-trendId')
    );

    const key = results[0].key;
    const videoUrl = `https://www.youtube.com/embed/${key}`;
    modalEmptyEl.insertAdjacentHTML('afterbegin', trailerMarkup(videoUrl));
  } catch (er) {
    modalWrapperEl.classList.remove('isHidden');
    modalEmptyEl.classList.remove('no-padding');
  } finally {
    stopSpinner();
  }
}

function onModalEmpty(e) {
  if (e.target === e.currentTarget) {
    toggleModalEmpty();
    hideTrailerMarkup();
    window.document.removeEventListener('keydown', onTapEsc);
  }
}

function onCloseModalEmpty() {
  toggleModalEmpty();
  hideTrailerMarkup();
  window.document.removeEventListener('keydown', onTapEsc);
}

function onTapEsc(e) {
  if (e.key === 'Escape') {
    toggleModalEmpty();
    hideTrailerMarkup();
  }
}

function toggleModalEmpty() {
  if (modal.classList.contains('modal-empty__backdrop--close')) {
    modal.classList.remove('modal-empty__backdrop--close');
  } else {
    modal.classList.add('modal-empty__backdrop--close');
  }
}

function trailerMarkup(url) {
  return `<div class='watch-modal'>  
    <iframe
      id='trailer-video'
      class='watch-modal__iframe'
      src='${url}'
      frameborder='0'
      allowfullscreen
    ></iframe>  
</div>`;
}

function hideTrailerMarkup(url) {
  modalEmptyEl.innerHTML = '';
  modalEmptyEl.classList.remove('no-padding');
}
