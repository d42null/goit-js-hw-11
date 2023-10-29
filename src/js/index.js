import { getImagesBySearchQuery } from './pixabay-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const PER_PAGE = 40;
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const simpleLB = new SimpleLightbox('.gallery a', {
  captionPosition: 'bottom',
  captionDelay: 250,
  captionsData: 'alt',
});

let pageCount = 1;
let searchQuery = '';
form.addEventListener('submit', async e => {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value;
  pageCount = 1;
  try {
    hideEl(loadMoreBtn);
    const data = await getImagesBySearchQuery(e.target.searchQuery.value);
    if (data.totalHits == 0) {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    gallery.innerHTML = data.hits.map(renderCard).join('');
    simpleLB.refresh();
    checkLoadMore(pageCount, data.totalHits);
  } catch (ex) {
    console.log(ex.message);
  }
});
loadMoreBtn.addEventListener('click', async () => {
  const data = await getImagesBySearchQuery(searchQuery, ++pageCount);
  gallery.insertAdjacentHTML('beforeend', data.hits.map(renderCard).join(''));
  simpleLB.refresh();
  scrollBy({
    top: gallery.firstElementChild.getBoundingClientRect().height * 2,
    behavior: 'smooth',
  });
  checkLoadMore(pageCount, data.totalHits);
});
function checkLoadMore(pageCount, total) {
  if (pageCount * PER_PAGE >= total) {
    hideEl(loadMoreBtn);
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else showEl(loadMoreBtn);
}
const renderCard = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) =>
  `<div class="photo-card">
      <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
          </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div>`;
function hideEl(...elements) {
  elements.forEach(el => el.classList.add('visually-hidden'));
}
function showEl(...elements) {
  elements.forEach(el => el.classList.remove('visually-hidden'));
}
