import axios from "./axiosConfig";

export async function fetchAndSetCsrfToken() {
    const res = await axios.get('/api/csrf/');
    const token = res.data.csrftoken;
    axios.defaults.headers.common['X-CSRFToken'] = token;
    return token;
  }