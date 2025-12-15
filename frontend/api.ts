const API_BASE_URL = 'http://34.231.105.150';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  
  // User endpoints
  PROFILE: `${API_BASE_URL}/api/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/user/profile`,
  
  // Student endpoints
  STUDENTS: `${API_BASE_URL}/api/students`,
  STUDENT_BY_ID: (id: string) => `${API_BASE_URL}/api/students/${id}`,
  
  // Counselor endpoints
  COUNSELORS: `${API_BASE_URL}/api/counselors`,
  COUNSELOR_BY_ID: (id: string) => `${API_BASE_URL}/api/counselors/${id}`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  
  // Gemini AI endpoints
  GEMINI_CHAT: `${API_BASE_URL}/api/gemini/chat`,
  GEMINI_ANALYSIS: `${API_BASE_URL}/api/gemini/analysis`,
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
} as const;