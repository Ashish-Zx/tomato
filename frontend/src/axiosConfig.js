import axios from 'axios';
import { API_URL } from './config/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Axios interceptor - Token from localStorage:', token ? 'FOUND' : 'NOT FOUND');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
