import api from './index';

export const getGaleri = (params = {}) => api.get('/galeri', { params });
export const getGaleriById = (id) => api.get(`/galeri/${id}`);
