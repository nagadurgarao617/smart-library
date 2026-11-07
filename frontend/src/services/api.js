// API client for Sri Vasavi Engineering College Smart Library
const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  // Determine appropriate token
  const isStudentRoute = endpoint.includes('/student') || endpoint.startsWith('/borrowing/student') || endpoint.startsWith('/borrowing/collect') || endpoint.startsWith('/borrowing/return-request') || endpoint.startsWith('/borrowing/notifications');
  const studentToken = localStorage.getItem('svec_student_token');
  const staffToken = localStorage.getItem('svec_staff_token');

  let token = null;
  if (isStudentRoute) {
    token = studentToken || staffToken;
  } else if (endpoint.includes('/staff') || endpoint.startsWith('/books')) {
    token = staffToken || studentToken;
  } else {
    token = staffToken || studentToken;
  }

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
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.detail || data.error || data.message || `Server request failed (${res.status})`;
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // ─── Books & Search ────────────────────────────────────────────────────────
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

  // ─── Staff Authentication ──────────────────────────────────────────────────
  login: (username, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),

  getProfile: () => request('/auth/me'),

  // ─── Student Authentication ────────────────────────────────────────────────
  studentRegister: (studentData) => request('/auth/student/register', {
    method: 'POST',
    body: JSON.stringify(studentData)
  }),

  studentLogin: (roll_number, password) => request('/auth/student/login', {
    method: 'POST',
    body: JSON.stringify({ roll_number, password })
  }),

  getStudentProfile: () => request('/auth/student/me'),

  updateStudentProfile: (profileData) => request('/auth/student/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  changeStudentPassword: (passwords) => request('/auth/student/change-password', {
    method: 'POST',
    body: JSON.stringify(passwords)
  }),

  forgotPassword: (roll_number_or_email) => request('/auth/student/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ roll_number_or_email })
  }),

  resetPassword: (resetData) => request('/auth/student/reset-password', {
    method: 'POST',
    body: JSON.stringify(resetData)
  }),

  // ─── Borrowing & Transactions ──────────────────────────────────────────────
  collectBook: (book_id, confirm_collection = true) => request('/borrowing/collect', {
    method: 'POST',
    body: JSON.stringify({ book_id, confirm_collection })
  }),

  requestReturn: (transaction_id, confirm_return = true) => request('/borrowing/return-request', {
    method: 'POST',
    body: JSON.stringify({ transaction_id, confirm_return })
  }),

  getMyLoans: () => request('/borrowing/student/my-loans'),

  getNotifications: () => request('/borrowing/notifications'),

  markNotificationRead: (notif_id) => request(`/borrowing/notifications/${notif_id}/read`, {
    method: 'PATCH'
  }),

  markAllNotificationsRead: () => request('/borrowing/notifications/read-all', {
    method: 'PATCH'
  }),

  // ─── Staff Borrowing Management ────────────────────────────────────────────
  getStaffTransactions: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'All')
    ).toString();
    return request(`/borrowing/staff/transactions?${query}`);
  },

  staffConfirmReturn: (transaction_id, notes = '') => request(`/borrowing/staff/confirm-return/${transaction_id}`, {
    method: 'POST',
    body: JSON.stringify({ notes })
  }),

  // ─── Staff Student Management ──────────────────────────────────────────────
  getStaffStudents: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'All')
    ).toString();
    return request(`/staff/students/?${query}`);
  },

  getStaffStudentDetails: (student_id) => request(`/staff/students/${student_id}`),

  toggleStudentStatus: (student_id) => request(`/staff/students/${student_id}/status`, {
    method: 'PATCH'
  }),

  updateStudentDetails: (student_id, details) => request(`/staff/students/${student_id}`, {
    method: 'PUT',
    body: JSON.stringify(details)
  })
};
