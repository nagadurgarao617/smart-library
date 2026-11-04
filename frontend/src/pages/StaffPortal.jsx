import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle,
  XCircle,
  Search,
  BookOpen,
  Layers,
  RefreshCw,
  AlertCircle,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';

export default function StaffPortal({ staffUser, setStaffUser }) {
  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Inventory State
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFloor, setFilterFloor] = useState('All');
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeBook, setActiveBook] = useState(null);

  // Notification message
  const [notification, setNotification] = useState('');

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem('svec_staff_token');
    if (token) {
      fetchStaffProfile();
    }
  }, []);

  // Fetch stats and books when staffUser is logged in
  useEffect(() => {
    if (staffUser) {
      loadStats();
      loadBooks();
    }
  }, [staffUser, currentPage, filterFloor]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const fetchStaffProfile = async () => {
    try {
      const res = await api.getProfile();
      setStaffUser(res.staff);
    } catch (err) {
      localStorage.removeItem('svec_staff_token');
      setStaffUser(null);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      setStats(res);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadBooks = async (query = searchQuery) => {
    setIsLoadingBooks(true);
    try {
      const res = await api.getAllBooks({
        page: currentPage,
        limit: 20,
        floor: filterFloor,
        search: query
      });
      setBooks(res.books || []);
      setTotalBooks(res.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem('svec_staff_token', res.token);
      setStaffUser(res.staff);
      showNotification(`Welcome, ${res.staff.name || res.staff.username}!`);
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('svec_staff_token');
    setStaffUser(null);
    showNotification('Logged out successfully.');
  };

  // Toggle book availability (instant update in DB & Student Portal)
  const handleToggleAvailability = async (book) => {
    const newStatus = book.availability_status === 'Available' ? 'Issued' : 'Available';
    try {
      await api.updateAvailability(book.id, newStatus);
      showNotification(`"${book.title}" marked as ${newStatus}`);
      loadStats();
      loadBooks();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Delete book record
  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to delete "${book.title}" from library inventory?`)) {
      return;
    }
    try {
      await api.deleteBook(book.id);
      showNotification(`Book deleted successfully.`);
      loadStats();
      loadBooks();
    } catch (err) {
      alert(`Failed to delete book: ${err.message}`);
    }
  };

  // 1. IF NOT LOGGED IN: DISPLAY SECURE STAFF LOGIN
  if (!staffUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Top aesthetic glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl" />

          <div className="text-center mb-8 relative">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Staff Portal Login</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sri Vasavi Engineering College • Central Library
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Staff Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. staff or admin"
                className="w-full text-xs px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                'Access Staff Dashboard'
              )}
            </button>
          </form>

          {/* Helper Credentials Hint for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              Demo Credentials: <span className="font-mono text-indigo-300">staff</span> / <span className="font-mono text-indigo-300">staff123</span> or <span className="font-mono text-indigo-300">admin</span> / <span className="font-mono text-indigo-300">admin123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED IN: STAFF DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* DASHBOARD TOP HEADER */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800">
                Librarian Administration
              </span>
              <span className="text-xs text-slate-400">Role: {staffUser.role}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Library Inventory Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Book
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </section>

      {/* INVENTORY STATS METRICS CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Total Books</p>
            <p className="text-3xl font-black text-blue-700 mt-1">{stats?.totalBooks || 0}</p>
            <span className="text-[11px] text-slate-400 mt-1 block">Across all floors & racks</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Available Books</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{stats?.availableBooks || 0}</p>
            <span className="text-[11px] text-emerald-600/80 mt-1 block font-medium">Ready for immediate issue</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Unavailable Books</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{stats?.unavailableBooks || 0}</p>
            <span className="text-[11px] text-rose-500/80 mt-1 block font-medium">Currently borrowed / issued</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Total Racks</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">{stats?.totalRacks || 0}</p>
            <span className="text-[11px] text-indigo-500/80 mt-1 block font-medium">Mapped on indoor layouts</span>
          </div>
        </div>
      </div>

      {/* MAIN INVENTORY TABLE & CONTROLS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
          {/* Table Search & Floor Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  loadBooks(e.target.value);
                }}
                placeholder="Search by Title, Author, ID..."
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500">Floor:</span>
              <select
                value={filterFloor}
                onChange={(e) => {
                  setFilterFloor(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700"
              >
                <option value="All">All Floors</option>
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
              </select>

              <button
                onClick={() => loadBooks()}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Refresh Table"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Book Details</th>
                  <th className="py-3 px-4">Subject & Dept</th>
                  <th className="py-3 px-4">Floor & Rack</th>
                  <th className="py-3 px-4">Shelf & Position</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoadingBooks ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      Loading library inventory...
                    </td>
                  </tr>
                ) : books.length > 0 ? (
                  books.map((book) => {
                    const isAvailable = book.availability_status === 'Available';
                    return (
                      <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Book Info */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 text-sm">{book.title}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            by {book.author} • <span className="font-mono text-slate-400">{book.book_id}</span>
                          </p>
                        </td>

                        {/* Subject */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">{book.subject}</span>
                          <span className="text-[10px] text-slate-500">{book.department}</span>
                        </td>

                        {/* Floor & Rack */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-blue-700 block">{book.floor}</span>
                          <span className="text-slate-600 font-semibold">{book.rack_number}</span>
                        </td>

                        {/* Shelf & Position */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">Shelf {book.shelf_number}</span>
                          <span className="text-[11px] text-slate-500">{book.position}</span>
                        </td>

                        {/* Availability Toggle */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleAvailability(book)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                              isAvailable
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                            }`}
                            title="Click to toggle Available / Issued"
                          >
                            {isAvailable ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {book.availability_status}
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Update Location */}
                            <button
                              onClick={() => {
                                setActiveBook(book);
                                setIsLocationModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                              title="Update Rack Location"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Details */}
                            <button
                              onClick={() => {
                                setActiveBook(book);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                              title="Edit Book Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteBook(book)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Book Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No books found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing page {currentPage} of {Math.ceil(totalBooks / 20) || 1} ({totalBooks} books total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= Math.ceil(totalBooks / 20)}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 disabled:opacity-40 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. ADD NEW BOOK MODAL */}
      {isAddModalOpen && (
        <BookFormModal
          title="Add New Book to Inventory"
          initialData={{
            title: '',
            author: '',
            subject: '',
            department: 'Civil Engineering',
            floor: 'Ground Floor',
            rack_number: 'Rack 1',
            rack_name: 'Civil Engineering',
            shelf_number: 1,
            position: 'Section A - Shelf 1 - Pos 1',
            availability_status: 'Available'
          }}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={async (formData) => {
            try {
              await api.createBook(formData);
              showNotification(`Book "${formData.title}" added to inventory!`);
              setIsAddModalOpen(false);
              loadStats();
              loadBooks();
            } catch (err) {
              alert(`Failed to add book: ${err.message}`);
            }
          }}
        />
      )}

      {/* 4. EDIT BOOK DETAILS MODAL */}
      {isEditModalOpen && activeBook && (
        <BookFormModal
          title={`Edit "${activeBook.title}"`}
          initialData={activeBook}
          onClose={() => {
            setIsEditModalOpen(false);
            setActiveBook(null);
          }}
          onSubmit={async (formData) => {
            try {
              await api.updateBook(activeBook.id, formData);
              showNotification(`Book details updated!`);
              setIsEditModalOpen(false);
              setActiveBook(null);
              loadStats();
              loadBooks();
            } catch (err) {
              alert(`Failed to update book: ${err.message}`);
            }
          }}
        />
      )}

      {/* 5. UPDATE RACK LOCATION MODAL */}
      {isLocationModalOpen && activeBook && (
        <LocationModal
          book={activeBook}
          onClose={() => {
            setIsLocationModalOpen(false);
            setActiveBook(null);
          }}
          onSubmit={async (locData) => {
            try {
              await api.updateLocation(activeBook.id, locData);
              showNotification(`Rack location updated! Students will now see the new position.`);
              setIsLocationModalOpen(false);
              setActiveBook(null);
              loadStats();
              loadBooks();
            } catch (err) {
              alert(`Failed to update location: ${err.message}`);
            }
          }}
        />
      )}
    </div>
  );
}

// Reusable Book Form Modal for Add and Edit
function BookFormModal({ title, initialData, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="font-bold text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
              >
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electrical & Electronics Engineering">Electrical & Electronics</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication</option>
                <option value="Computer Science & Engineering">Computer Science & Engg</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Basic Sciences & Humanities">Basic Sciences & Humanities</option>
                <option value="Management Studies">Management Studies (MBA)</option>
                <option value="Diploma">Diploma Studies</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Floor *</label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
              >
                <option value="Ground Floor">Ground Floor</option>
                <option value="First Floor">First Floor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rack Number *</label>
              <input
                type="text"
                required
                value={formData.rack_number}
                onChange={(e) => setFormData({ ...formData, rack_number: e.target.value })}
                placeholder="e.g. Rack 9, Diploma Books Rack..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rack Name</label>
              <input
                type="text"
                value={formData.rack_name}
                onChange={(e) => setFormData({ ...formData, rack_name: e.target.value })}
                placeholder="e.g. Computer Science Engineering"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shelf Number</label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.shelf_number}
                onChange={(e) => setFormData({ ...formData, shelf_number: parseInt(e.target.value) || 1 })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Book Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Section B - Shelf 2 - Pos 4"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Availability Status</label>
            <select
              value={formData.availability_status}
              onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
            >
              <option value="Available">Available On Shelf</option>
              <option value="Issued">Issued / Borrowed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal for updating rack position
function LocationModal({ book, onClose, onSubmit }) {
  const [floor, setFloor] = useState(book.floor);
  const [rackNumber, setRackNumber] = useState(book.rack_number);
  const [rackName, setRackName] = useState(book.rack_name);
  const [shelfNumber, setShelfNumber] = useState(book.shelf_number);
  const [position, setPosition] = useState(book.position);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      floor,
      rack_number: rackNumber,
      rack_name: rackName,
      shelf_number: shelfNumber,
      position
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-sky-950 text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base">Update Rack Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-sky-900 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Relocating: <strong>"{book.title}"</strong>. The updated position will immediately show in the Student Portal and indoor map.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Floor Level</label>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
            >
              <option value="Ground Floor">Ground Floor</option>
              <option value="First Floor">First Floor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Rack Number</label>
            <input
              type="text"
              required
              value={rackNumber}
              onChange={(e) => setRackNumber(e.target.value)}
              placeholder="e.g. Rack 9, Rack 14..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shelf Number</label>
              <input
                type="number"
                min="1"
                max="8"
                value={shelfNumber}
                onChange={(e) => setShelfNumber(parseInt(e.target.value) || 1)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Section B - Shelf 3 - Pos 2"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md"
            >
              Update Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
