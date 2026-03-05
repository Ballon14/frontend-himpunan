import api from './index';

export const getAnggota = (params = {}) => api.get('/anggota', { params });
export const getAnggotaById = (id) => api.get(`/anggota/${id}`);
