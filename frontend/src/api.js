import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export function getApiErrorMessage(error, fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.') {
  if (!error.response) {
    return 'Không kết nối được API. Kiểm tra backend Render và cấu hình CORS.';
  }

  const data = error.response.data;

  if (typeof data === 'string' && data.trim() !== '') {
    return data;
  }

  return data?.message || data?.error || `${fallback} (HTTP ${error.response.status})`;
}

export default api;
