// API client for Sri Vasavi Engineering College Smart Library
const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('svec_staff_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server request failed');
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Books & Search
  searchBooks: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'All')
    ).toString();
    return request(`/books/search?${query}`);
  },

  getStats: () => request('/books/stats'),
  getRacks: () => request('/books/racks'),
  
  getAllBooks: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'All')
    ).toString();
    return request(`/books?${query}`);
  },

  getBookById: (id) => request(`/books/${id}`),

  createBook: (bookData) => request('/books', {
    method: 'POST',
    body: JSON.stringify(bookData)
  }),

  updateBook: (id, bookData) => request(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData)
  }),

  updateAvailability: (id, status) => request(`/books/${id}/availability`, {
    method: 'PATCH',
    body: JSON.stringify({ availability_status: status })
  }),

  updateLocation: (id, locData) => request(`/books/${id}/location`, {
    method: 'PATCH',
    body: JSON.stringify(locData)
  }),

  deleteBook: (id) => request(`/books/${id}`, {
    method: 'DELETE'
  }),

  // Staff Auth
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  getProfile: () => request('/auth/me')
};
