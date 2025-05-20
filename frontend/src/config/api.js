// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  AUTH: {
    BASE: `${API_BASE_URL}/api/auth`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    GOOGLE: `${API_BASE_URL}/api/auth/google`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  AUDIO: {
    BASE: `${API_BASE_URL}/api/audio`,
    UPLOAD: `${API_BASE_URL}/api/audio/upload`,
  },
  FILES: {
    BASE: `${API_BASE_URL}/api/files`,
    FOLDERS: `${API_BASE_URL}/api/files/folders`,
    FOLDER: `${API_BASE_URL}/api/files/folder`,
    UPLOAD: `${API_BASE_URL}/api/files/upload`,
    FILE: `${API_BASE_URL}/api/files/file`,
  },
  SUMMARIZATION: {
    BASE: `${API_BASE_URL}/api/summarization`,
  },
};

export default API_ENDPOINTS;
