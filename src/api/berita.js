import api from './index';

export const getBerita = (params = {}) => api.get('/berita', { params });
export const getBeritaBySlug = (slug) => api.get(`/berita/${slug}`);
