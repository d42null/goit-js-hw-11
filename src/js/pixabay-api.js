import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: '40338048-f2df00ec937fbdd3c696643bf',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});
export const getImagesBySearchQuery = async (q, p = 1) => {
  searchParams.set('q', q);
  searchParams.set('page', p);
  const resp = await axios.get(`?${searchParams}`);
  return await resp.data;
};
