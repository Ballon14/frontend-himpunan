import api from './index';

export const getProgramKerja = (params = {}) => api.get('/program-kerja', { params });
export const getProgramKerjaById = (id) => api.get(`/program-kerja/${id}`);
