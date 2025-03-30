import axios from 'axios';
import config from '../config';
import { getCookie } from './cookieUtils';

const axiosInstance = axios.create({
  baseURL: `${config.API_BASE_URL}/`,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
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
