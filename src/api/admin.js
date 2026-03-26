import api from './index';

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
export const createAnggota = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.post('/anggota', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateAnggota = (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.put(`/anggota/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteAnggota = (id) => api.delete(`/anggota/${id}`);

// ─── Berita ──────────────────────────────────────────────────────────────────
export const getBeritaAdmin = (params = {}) => api.get('/berita/all', { params });
export const createBerita = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.post('/berita', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateBerita = (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.put(`/berita/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteBerita = (id) => api.delete(`/berita/${id}`);

// ─── Program Kerja ───────────────────────────────────────────────────────────
export const getProgramKerjaAdmin = (params = {}) => api.get('/program-kerja', { params });
export const createProgramKerja = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.post('/program-kerja', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateProgramKerja = (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.put(`/program-kerja/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteProgramKerja = (id) => api.delete(`/program-kerja/${id}`);

// ─── Galeri ──────────────────────────────────────────────────────────────────
export const getGaleriAdmin = (params = {}) => api.get('/galeri', { params });
export const createGaleri = (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.post('/galeri', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateGaleri = (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
    return api.put(`/galeri/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
