import api from './index';

// ─── Kegiatan ────────────────────────────────────────────
export const getKegiatan = (params) => api.get('/kegiatan', { params });
export const getKegiatanById = (id) => api.get(`/kegiatan/${id}`);
export const createKegiatan = (data) => api.post('/kegiatan', data);
export const updateKegiatan = (id, data) => api.put(`/kegiatan/${id}`, data);
export const deleteKegiatan = (id) => api.delete(`/kegiatan/${id}`);

// ─── Merchandise ─────────────────────────────────────────
export const getMerchandise = (params) => api.get('/merchandise', { params });
export const getMerchandiseById = (id) => api.get(`/merchandise/${id}`);
export const createMerchandise = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') formData.append(key, val);
    });
    return api.post('/merchandise', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateMerchandise = (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') formData.append(key, val);
    });
    return api.put(`/merchandise/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteMerchandise = (id) => api.delete(`/merchandise/${id}`);
