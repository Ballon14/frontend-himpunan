import api from './index';

function toFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
    });
    return formData;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const adminLogin = (email, password) =>
    api.post('/login', { email, password });

export const adminLogout = () => api.post('/logout');

export const getMe = () => api.get('/me');

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardCharts = () => api.get('/dashboard/charts');

// ─── Anggota ─────────────────────────────────────────────────────────────────
export const getAnggotaAdmin = (params = {}) => api.get('/anggota', { params });
export const getStrukturAdmin = (params = {}) => api.get('/anggota', { params: { ...params, has_jabatan: true } });
export const getStrukturImage = () => api.get('/struktur');
export const uploadStrukturImage = (file) => {
    const fd = new FormData();
    fd.append('bagan', file);
    return api.post('/struktur', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const createAnggota = (data) => {
    return api.post('/anggota', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateAnggota = (id, data) => {
    return api.put(`/anggota/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteAnggota = (id) => api.delete(`/anggota/${id}`);

// ─── Berita ──────────────────────────────────────────────────────────────────
export const getBeritaAdmin = (params = {}) => api.get('/berita/all', { params });
export const createBerita = (data) => {
    return api.post('/berita', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateBerita = (id, data) => {
    return api.put(`/berita/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteBerita = (id) => api.delete(`/berita/${id}`);

// ─── Program Kerja ───────────────────────────────────────────────────────────
export const getProgramKerjaAdmin = (params = {}) => api.get('/program-kerja', { params });
export const createProgramKerja = (data) => {
    return api.post('/program-kerja', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateProgramKerja = (id, data) => {
    return api.put(`/program-kerja/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteProgramKerja = (id) => api.delete(`/program-kerja/${id}`);

// ─── Galeri ──────────────────────────────────────────────────────────────────
export const getGaleriAdmin = (params = {}) => api.get('/galeri', { params });
export const createGaleri = (data) => {
    return api.post('/galeri', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateGaleri = (id, data) => {
    return api.put(`/galeri/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteGaleri = (id) => api.delete(`/galeri/${id}`);

// ─── Pesan ───────────────────────────────────────────────────────────────────
export const getPesanAdmin = (params = {}) => api.get('/pesan', { params });
export const markPesanRead = (id) => api.patch(`/pesan/${id}/read`);
export const deletePesan = (id) => api.delete(`/pesan/${id}`);

// ─── Export Data ─────────────────────────────────────────────────────────
export const exportTable = (table, format = 'xlsx') =>
    api.get(`/export/${table}`, { params: { format }, responseType: 'blob' });
export const exportAll = (format = 'xlsx') =>
    api.get('/export', { params: { format }, responseType: 'blob' });

// ─── Logs ───────────────────────────────────────────────────────────────────
export const getLogs = (limit = 200) => api.get('/logs', { params: { limit } });
export const getSystemLogs = (limit = 100) => api.get('/logs/system', { params: { limit } });
export const clearLogs = () => api.delete('/logs');
export const downloadLogs = () => api.get('/logs/download', { responseType: 'blob' });
