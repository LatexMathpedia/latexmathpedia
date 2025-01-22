export const API_BASE_URL = "https://backend-latex-mathpedia.onrender.com"

export const API_ROUTES = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
  checkSession: `${API_BASE_URL}/auth/check-session`,
  updateUser: `${API_BASE_URL}/users/email=`,
  users: `${API_BASE_URL}/users`,
  pdfs: `${API_BASE_URL}/pdfs`,
  subjects: `${API_BASE_URL}/subjects`,

}

