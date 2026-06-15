import api from './index';

function toFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
    });
    return formData;
}

// ─── Public ──────────────────────────────────────────────────────────────────
export const getPrestasi = (params = {}) => api.get('/prestasi', { params });
export const getPrestasiById = (id) => api.get(`/prestasi/${id}`);

// ─── Admin ───────────────────────────────────────────────────────────────────
export const getPrestasiAdmin = (params = {}) => api.get('/prestasi', { params });
export const createPrestasi = (data) => {
    return api.post('/prestasi', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updatePrestasi = (id, data) => {
    return api.put(`/prestasi/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deletePrestasi = (id) => api.delete(`/prestasi/${id}`);
