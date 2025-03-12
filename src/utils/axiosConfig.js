import axios from 'axios';
import config from '../config';
import { getCookie } from './cookieUtils';

const axiosInstance = axios.create({
  baseURL: `${config.API_BASE_URL}/`,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'X-CSRFToken': getCookie('csrftoken') || '',
  }
});

const authToken = localStorage.getItem('authToken');
if (authToken) {
  axiosInstance.defaults.headers['Authorization'] = `Token ${authToken}`;
}

axiosInstance.get('/api/csrf/')
  .then(() => {
  })
  .catch(err => {
    console.error('Error fetching CSRF cookie:', err);
  });

axiosInstance.interceptors.request.use(
  config => {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
