import getRefs from './components/get-refs';
import { createGallery, clearGallery } from './render-card';

const refs = getRefs();

export async function searchMovies(response) {
  if (response.results.length === 0 || response.results === null) {
    clearGallery();
    noSearchResults();
    document.querySelector('#tui-pagination-container').classList.add('hidden');
  } else if (response.results) {
    createGallery(response.results.slice(0, 10));
  }
}

export function noSearchResults() {
  refs.galleryCatalog.innerHTML = `<p class="no-results">
  OOPS...<br />
  We are very sorry!<br />
  We don't have any results due to your search.
  </p>`;
}
