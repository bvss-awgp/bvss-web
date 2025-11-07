const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getApiUrl = (path = '') => {
  const trimmedPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${trimmedPath}`;
};

export default API_BASE_URL;

