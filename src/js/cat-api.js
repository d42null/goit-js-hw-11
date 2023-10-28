import axios from 'axios';
axios.defaults.baseURL = 'https://api.thecatapi.com/v1';
axios.defaults.headers.common['x-api-key'] =
  'live_bgInZATUzTQnc6IAzc86l4nsdNZcm97Ah3egkxPMFm43QEJhOKRmtiVvOcmIXvSS';

export const fetchBreeds = () => axios.get(`/breeds`).then(res => res.data);
export const fetchCatByBreed = breedId =>
  axios
    .get(`/images/search?breed_ids=${breedId}&limit=1`)
    .then(response => response.data);
