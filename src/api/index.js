import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000,
});

// Response interceptor — unwrap the standard API response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
        console.error('[API Error]', message);
        return Promise.reject(error);
    }
);

export default api;
