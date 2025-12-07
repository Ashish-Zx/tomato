import axios from 'axios';

// Add a request interceptor to include the token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Axios interceptor - Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Added Authorization header');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
