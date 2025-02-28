import axios from 'axios';
import { getCookie } from './cookieUtils';

const csrftoken = getCookie();
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true,
});

axiosInstance.defaults.headers.common['X-CSRFToken'] = csrftoken;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((config) => {
  const token = getCookie('csrftoken');
  config.headers['X-CSRFToken'] = token;
  return config;
});

export default axiosInstance;