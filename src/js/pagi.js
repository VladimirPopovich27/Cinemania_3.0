import Pagination from 'tui-pagination';
import Api from './api';
import { Api_widely_form } from './widelySearch';
import { createGallery } from './render-card';
import { noFilmError } from './components/msg-error';
import { searchMovies } from './seachcatalog';
import { startSpinner, stopSpinner } from './loader';

const container = document.getElementById('tui-pagination-container');
const options = {
  totalItems: 40,
  itemsPerPage: 20,
  visiblePages: 10,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}"></span>' +
      '</span>',
    moreButton: `<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">...</a>`,
  },
};

const api = new Api();
const pagination = new Pagination(container, options);
let isDefaultRender = true;
pagiIni();

// onLoadPage
async function pagiIni() {
  startSpinner();
  try {
    const response = await api.weekTrends();
    createGallery(response.results);
    pagination.reset(response.total_results);
  } catch (error) {
    noFilmError();
  }
  stopSpinner();
}

// onBefore-week
pagination.on('beforeMove', async function (eventData) {
  const currentPage = eventData.page;
  startSpinner();
  if (isDefaultRender) {
    try {
      api.setPage(currentPage);
      const response = await api.weekTrends();
      createGallery(response.results);
    } catch (error) {
      noFilmError();
    }
  } else {
    try {
      const response = await Api_widely_form.paginateByPage(currentPage);
      createGallery(response.results);
    } catch (error) {
      noFilmError();
    }
  }
  stopSpinner();
});

export async function pagiSubmit() {
  startSpinner();
  isDefaultRender = false;
  const { query, year, code, CODE } = Api_widely_form;

  Api_widely_form.response = await getDataFromDB(query, year, code, CODE, 1);
  // console.log(Api_widely_form.requestString);
  searchMovies(Api_widely_form.response);
  pagination.reset(Api_widely_form.response.total_results);
  stopSpinner();
}

async function getDataFromDB(query, year, code, CODE, page) {
  try {
    const response = await Api_widely_form.searhByNameYearCountry({
      query: query || null,
      year: year || null,
      language: code && CODE && `${code}-${CODE}`,
      page: page,
    });
    if (response.status) {
      throw new Error(`Error! status: ${response.status}`);
    }
    return await response;
  } catch (err) {
    console.log(err.message);
    noFilmError();
  }
}
