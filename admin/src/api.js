import { backendUrl } from '../src/App';

// Kéo token từ localStorage
const token = localStorage.getItem('adminToken');

// Thiết lập header Authorization cho mọi request
if (token) {
  axios.defaults.baseURL = backendUrl;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export default axios;
