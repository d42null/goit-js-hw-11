import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix';
const catInfoDiv = document.querySelector('.cat-info');
const errorP = document.querySelector('.error');
const loaderP = document.querySelector('.loader');
const slct = document.querySelector('.breed-select');

function renderCatInfo(url, { name, description, temperament }) {
  catInfoDiv.innerHTML = `<img src=${url} alt='cat' width=400>
    <div>
    <h1>${name}</h1>
    <p>${description}</p>
    <p><b>Temperament:</b> ${temperament}</p>
    </div>`;
}
fetchBreeds()
  .then(breeds => {
    new SlimSelect({
      select: document.querySelector('.breed-select'),
      events: {
        afterChange: options => {
          showEl(loaderP);
          hideEl(catInfoDiv, errorP);
          fetchCatByBreed(options[0].value)
            .then(data => {
              renderCatInfo(data[0].url, data[0].breeds[0]);
              showEl(catInfoDiv);
            })
            .catch(e => {
              showEl(errorP);
              Notify.failure(e.message);
            })
            .finally(() => {
              hideEl(loaderP);
            });
        },
      },
      data: breeds.map(({ id, name }) => {
        return { text: name, value: id };
      }),
    });
    showEl(slct);
  })
  .catch(e => {
    showEl(errorP);
    Notify.failure(e.message);
  })
  .finally(() => hideEl(loaderP));
function hideEl(...elements) {
  elements.forEach(el => el.classList.add('visually-hidden'));
}
function showEl(...elements) {
  elements.forEach(el => el.classList.remove('visually-hidden'));
}
