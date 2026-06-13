import api from './index';

function toFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value) || value instanceof FileList) {
            Array.from(value).forEach(file => formData.append(key, file));
        } else {
            formData.append(key, value);
        }
    });
    return formData;
}

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
    return api.post('/merchandise', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateMerchandise = (id, data) => {
    return api.put(`/merchandise/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteMerchandise = (id) => api.delete(`/merchandise/${id}`);
