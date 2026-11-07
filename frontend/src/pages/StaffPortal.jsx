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
  SlidersHorizontal,
  Bookmark,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';
import { api } from '../services/api';
import InteractiveMapViewer from '../components/InteractiveMapViewer';

// ─── DEDICATED FULL-PAGE BOOK DETAILS VIEW FOR STAFF ─────────────────────────
function StaffDedicatedBookDetailsView({
  book,
  onBack,
  onOpenMap,
  onEditBook,
  onDeleteBook
}) {
  const isAvailable = (book.available_copies || 0) > 1 || book.availability_status === 'Available';
  const isLimited = (book.available_copies || 0) === 1 || book.availability_status === 'Limited Copies Available';
  const isOutOfStock = (book.available_copies || 0) === 0 || book.availability_status === 'Not Available';

  const badgeColor = isOutOfStock
    ? 'bg-rose-100 text-rose-700 border-rose-300'
    : isLimited
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  const statusText = isOutOfStock ? 'Not Available' : isLimited ? 'Limited Copies Available' : 'Available';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-xs shadow-sm hover:shadow transition-all group"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600 group-hover:-translate-x-1 transition-transform" />
          Back to Search Results
        </button>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          <span className="hover:underline cursor-pointer" onClick={onBack}>Staff Catalog</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs inline-block align-bottom">{book.title}</span>
        </div>
      </div>

      {/* Main Full-Width Staff Book Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header Tag Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              {book.department}
            </span>
            {book.category && (
              <span className="px-3.5 py-1 rounded-full text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200">
                {book.category}
              </span>
            )}
            {book.book_id && (
              <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold text-slate-500 bg-slate-50 border border-slate-200">
                ID: {book.book_id}
              </span>
            )}
          </div>

          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${badgeColor}`}>
            ● {statusText}
          </span>
        </div>

        {/* Title & Author */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-2">
            {book.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-semibold">
            Author: <strong className="text-slate-900 font-extrabold">{book.author}</strong>
            <span className="mx-2 text-slate-300">•</span>
            Subject: <strong className="text-slate-800 font-bold">{book.subject}</strong>
          </p>
          {book.isbn && (
            <p className="text-xs text-slate-400 font-mono mt-1.5">ISBN: {book.isbn}</p>
          )}
        </div>

        {/* Physical Architectural Location Details */}
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-xs border border-indigo-400/30">
                📍
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Physical Location &amp; Shelf Coordinates</h3>
            </div>
            <span className="text-xs text-indigo-300 font-bold">
              {book.floor}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Floor Level</span>
              <span className="text-base font-black text-white">{book.floor}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {book.floor.includes('First') ? 'Upper Level (1F)' : 'Ground Level (GF)'}
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">Rack Number</span>
              <span className="text-base font-black text-amber-300 font-mono">{book.rack_number}</span>
              <span className="text-[10px] text-slate-300 block truncate mt-0.5">{book.rack_name}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Shelf Number</span>
              <span className="text-base font-black text-sky-300">Shelf {book.shelf_number || 1}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Vertical Tier {book.shelf_number || 1}</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Exact Position</span>
              <span className="text-sm font-extrabold text-white truncate block">{book.position || 'Main Stacks'}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Shelf bay position</span>
            </div>
          </div>
        </div>

        {/* Copy Availability Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Cataloged Copies</span>
            <span className="text-2xl font-black text-slate-900">{book.total_copies || 2}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Available on Shelf</span>
            <span className="text-2xl font-black text-emerald-700">{book.available_copies ?? 1}</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">Currently Borrowed</span>
            <span className="text-2xl font-black text-amber-700">{book.borrowed_copies ?? 0}</span>
          </div>
        </div>

        {/* Staff Management Action Buttons Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onOpenMap(book)}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01]"
          >
            <MapPin className="w-4 h-4 text-indigo-200" />
            VIEW LOCATION ON FLOOR MAP
          </button>

          <button
            onClick={() => onEditBook(book)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-300" />
            EDIT BOOK DETAILS
          </button>

          <button
            onClick={() => onDeleteBook(book)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            DELETE BOOK
          </button>

          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN STAFF PORTAL COMPONENT ────────────────────────────────────────────
export default function StaffPortal({ staffUser, setStaffUser }) {
  // Navigation Tabs in Staff Portal: 'dashboard' | 'books' | 'borrowing' | 'students' | 'racks'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Global Notification
  const [notification, setNotification] = useState('');

  // Metrics State
  const [stats, setStats] = useState(null);

  // Book Management & Search State
  const [books, setBooks] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [bookSearch, setBookSearch] = useState('');
  const [bookFloorFilter, setBookFloorFilter] = useState('All');
  const [bookDeptFilter, setBookDeptFilter] = useState('All');
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);

  // Pagination for 5 books per page in Staff search
  const [staffSearchPage, setStaffSearchPage] = useState(1);
  const RESULTS_PER_PAGE = 5;

  // Dedicated Selected Book for Details View
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);

  // Modals
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    subject: '',
    department: 'CSE',
    category: '',
    isbn: '',
    total_copies: 2,
    available_copies: 2,
    floor: 'Ground Floor',
    rack_number: 'RACK-01',
    rack_name: 'Computer Science Core',
    shelf_number: 1,
    position: 'Row 1, Top Shelf'
  });

  // Map Modal
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapBook, setMapBook] = useState(null);

  // Borrowing Transactions State
  const [transactions, setTransactions] = useState([]);
  const [txFilter, setTxFilter] = useState('ALL');
  const [txSearch, setTxSearch] = useState('');
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [confirmingTxId, setConfirmingTxId] = useState(null);

  // Student Management State
  const [studentsList, setStudentsList] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('All');
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [studentEditForm, setStudentEditForm] = useState({
    id: null,
    name: '',
    department: '',
    year: '',
    phone: '',
    email: '',
    is_active: true
  });

  // Racks Explorer State
  const [racksList, setRacksList] = useState([]);

  // Check login on mount
  useEffect(() => {
    const token = localStorage.getItem('svec_staff_token');
    if (token) {
      fetchStaffProfile();
    }
  }, []);

  // When staff is logged in, refresh data
  useEffect(() => {
    if (staffUser) {
      loadAllDashboardData();
    }
  }, [staffUser]);

  // Load books when filters change
  useEffect(() => {
    if (staffUser && activeTab === 'books') {
      setStaffSearchPage(1);
      loadBooks();
    }
  }, [staffUser, activeTab, bookFloorFilter, bookDeptFilter]);

  // Load transactions when filter changes
  useEffect(() => {
    if (staffUser && activeTab === 'borrowing') {
      loadTransactions();
    }
  }, [staffUser, activeTab, txFilter]);

  // Load students when student tab selected
  useEffect(() => {
    if (staffUser && activeTab === 'students') {
      loadStudents();
    }
  }, [staffUser, activeTab, studentDeptFilter]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 5000);
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

  const loadAllDashboardData = async () => {
    loadStats();
    loadBooks();
    loadTransactions();
    loadStudents();
    loadRacks();
  };

  const loadStats = async () => {
    try {
      const res = await api.getStats();
      setStats(res);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const res = await api.searchBooks({
        q: bookSearch.trim() || undefined,
        floor: bookFloorFilter !== 'All' ? bookFloorFilter : undefined,
        department: bookDeptFilter !== 'All' ? bookDeptFilter : undefined,
        limit: 300
      });
      setBooks(res.books || []);
      setTotalBooks(res.count || 0);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoadingTx(true);
    try {
      const res = await api.getStaffTransactions({
        status: txFilter !== 'ALL' ? txFilter : undefined,
        search: txSearch.trim() || undefined
      });
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoadingTx(false);
    }
  };

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await api.getStaffStudents({
        search: studentSearch.trim() || undefined,
        department: studentDeptFilter !== 'All' ? studentDeptFilter : undefined
      });
      setStudentsList(res.students || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const loadRacks = async () => {
    try {
      const res = await api.getRacks();
      setRacksList(res.racks || []);
    } catch (err) {
      console.error('Failed to load racks:', err);
    }
  };

  // ── Authentication Handlers ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setLoginError('Staff username and password are required.');
      return;
    }
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await api.login(username.trim(), password);
      localStorage.setItem('svec_staff_token', res.token);
      setStaffUser(res.staff);
      showNotification(`Welcome back, ${res.staff.name}`);
    } catch (err) {
      setLoginError(err.message || 'Invalid staff credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('svec_staff_token');
    setStaffUser(null);
  };

  // ── Book CRUD Handlers ──
  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createBook({
        ...bookForm,
        shelf_number: parseInt(bookForm.shelf_number, 10) || 1,
        total_copies: parseInt(bookForm.total_copies, 10) || 1,
        available_copies: parseInt(bookForm.available_copies, 10) || 1
      });
      showNotification(`Book '${bookForm.title}' added successfully!`);
      setIsAddBookModalOpen(false);
      loadBooks();
      loadStats();
    } catch (err) {
      showNotification('Error: ' + err.message);
    }
  };

  const handleEditBookSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;
    try {
      const updated = await api.updateBook(selectedBook.id, {
        ...bookForm,
        shelf_number: parseInt(bookForm.shelf_number, 10) || 1,
        total_copies: parseInt(bookForm.total_copies, 10) || 1,
        available_copies: parseInt(bookForm.available_copies, 10) || 1
      });
      showNotification(`Book '${bookForm.title}' updated successfully!`);
      setIsEditBookModalOpen(false);
      loadBooks();
      loadStats();
      if (selectedBookForDetails && selectedBookForDetails.id === selectedBook.id) {
        setSelectedBookForDetails(updated);
      }
    } catch (err) {
      showNotification('Error: ' + err.message);
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Are you sure you want to delete '${book.title}'? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteBook(book.id);
      showNotification(`Book '${book.title}' deleted successfully.`);
      if (selectedBookForDetails && selectedBookForDetails.id === book.id) {
        setSelectedBookForDetails(null);
      }
      loadBooks();
      loadStats();
    } catch (err) {
      showNotification('Error: ' + err.message);
    }
  };

  const openEditModalForBook = (b) => {
    setSelectedBook(b);
    setBookForm({
      title: b.title,
      author: b.author,
      subject: b.subject,
      department: b.department,
      category: b.category || b.rack_name,
      isbn: b.isbn || '',
      total_copies: b.total_copies ?? 2,
      available_copies: b.available_copies ?? 2,
      floor: b.floor,
      rack_number: b.rack_number,
      rack_name: b.rack_name,
      shelf_number: b.shelf_number || 1,
      position: b.position || ''
    });
    setIsEditBookModalOpen(true);
  };

  // ── Staff Return Verification ──
  const handleConfirmReturn = async (tx) => {
    setConfirmingTxId(tx.id);
    try {
      const res = await api.staffConfirmReturn(tx.id, 'Verified by staff');
      showNotification(res.message || 'Book return confirmed and inventory updated!');
      loadTransactions();
      loadStats();
      loadBooks();
    } catch (err) {
      showNotification('Error: ' + err.message);
    } finally {
      setConfirmingTxId(null);
    }
  };

  // ── Student Management Handlers ──
  const handleToggleStudentStatus = async (student) => {
    try {
      const res = await api.toggleStudentStatus(student.id);
      showNotification(res.message);
      loadStudents();
    } catch (err) {
      showNotification('Error: ' + err.message);
    }
  };

  const handleViewStudentDetails = async (student) => {
    try {
      const details = await api.getStaffStudentDetails(student.id);
      setViewingStudent(details);
    } catch (err) {
      showNotification('Error: ' + err.message);
    }
  };

  const handleSaveStudentEdit = async (e) => {
    e.preventDefault();
    try {
      await api.updateStudentDetails(studentEditForm.id, studentEditForm);
      showNotification('Student details updated successfully!');
      setIsEditStudentModalOpen(false);
      loadStudents();
    } catch (err) {
      showNotification('Error: ' + err.message);
    }
  };

  // ── Pagination Calculation for Staff (5 results per page) ──
  const totalStaffPages = Math.ceil(books.length / RESULTS_PER_PAGE) || 1;
  const currentStaffBooksSlice = books.slice((staffSearchPage - 1) * RESULTS_PER_PAGE, staffSearchPage * RESULTS_PER_PAGE);

  // ── AUTHENTICATION GATE: IF NOT LOGGED IN ──
  if (!staffUser) {
    return (
      <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white text-center mb-1">Staff Portal Login</h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            Authorized Sri Vasavi Engineering College library personnel only.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                Staff Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or staff"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 mt-2"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In as Staff'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Demo Credentials: <strong className="text-indigo-400 font-mono">admin / admin123</strong> or <strong className="text-indigo-400 font-mono">staff / staff123</strong>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN AUTHENTICATED STAFF DASHBOARD ──
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* ── TOP STAFF APP BAR ── */}
      <header className="bg-slate-950 text-white shadow-md sticky top-0 z-30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white">{staffUser.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold">
                    {staffUser.role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">SVEC Central Library Management Dashboard</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── TOAST NOTIFICATION ── */}
      {notification && (
        <div className="bg-indigo-600 text-white px-4 py-2.5 text-center text-xs font-bold shadow-md sticky top-16 z-20 flex items-center justify-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}

      {/* ── MAIN CONTENT WRAPPER: SIDEBAR + CONTENT ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80 sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Staff Functions
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard & Metrics', icon: BookOpen },
              { id: 'books', label: 'Book Catalog & Search', icon: Edit2, badge: stats?.totalBooks || 1046 },
              { id: 'borrowing', label: 'Borrowing & Returns', icon: Bookmark, badge: stats?.pendingReturns || 0, badgeColor: 'bg-amber-500' },
              { id: 'students', label: 'Student Management', icon: Users, badge: stats?.totalStudents || 5 },
              { id: 'racks', label: 'Floor & Rack Layout', icon: Layers, badge: stats?.totalRacks || 35 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'books') {
                      setSelectedBookForDetails(null);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.badgeColor ? `${tab.badgeColor} text-white` : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: DASHBOARD & METRICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Comprehensive Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Books</div>
                  <div className="text-2xl font-black text-slate-900">{stats?.totalBooks || 1046}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Cataloged titles</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Available Books</div>
                  <div className="text-2xl font-black text-emerald-600">{stats?.availableBooks || 1045}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Ready for checkout</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Total Borrowed</div>
                  <div className="text-2xl font-black text-amber-600">{stats?.totalBorrowed || 1}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Active student loans</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Registered Students</div>
                  <div className="text-2xl font-black text-indigo-600">{stats?.totalStudents || 5}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Active student cards</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Pending Returns</div>
                  <div className="text-2xl font-black text-amber-500">{stats?.pendingReturns || 0}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Awaiting physical check</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Overdue Loans</div>
                  <div className="text-2xl font-black text-rose-600">{stats?.overdueLoans || 0}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Past due return date</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Ground Floor (GF)</div>
                  <div className="text-2xl font-black text-blue-600">{stats?.groundFloorBooks || 877}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Main racks 1-20 &amp; MBA</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">First Floor (1F)</div>
                  <div className="text-2xl font-black text-purple-600">{stats?.firstFloorBooks || 169}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Reference &amp; Project rooms</div>
                </div>
              </div>

              {/* Pending Return Verification Alert */}
              {transactions.filter(t => t.status === 'RETURN_REQUESTED').length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-extrabold text-sm text-amber-900">
                        Pending Return Verifications ({transactions.filter(t => t.status === 'RETURN_REQUESTED').length})
                      </h4>
                    </div>
                    <button
                      onClick={() => { setActiveTab('borrowing'); setTxFilter('RETURN_REQUESTED'); }}
                      className="text-xs font-bold text-amber-900 hover:underline"
                    >
                      View All in Borrowing Tab →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {transactions
                      .filter(t => t.status === 'RETURN_REQUESTED')
                      .slice(0, 3)
                      .map(t => (
                        <div key={t.id} className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{t.student_name} ({t.student_roll})</span>
                            <span className="text-slate-500 ml-2">— '{t.book_title}'</span>
                          </div>
                          <button
                            onClick={() => handleConfirmReturn(t)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          >
                            Verify &amp; Confirm Return
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Recent Activity Quick View */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-base text-slate-900">Recent Borrowing Transactions</h4>
                  <button
                    onClick={() => setActiveTab('borrowing')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Transactions
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Student</th>
                        <th className="py-2.5 px-3">Book</th>
                        <th className="py-2.5 px-3">Issue Date</th>
                        <th className="py-2.5 px-3">Due Date</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.slice(0, 5).map(t => (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            {t.student_name}
                            <span className="block text-[10px] text-slate-400 font-normal font-mono">{t.student_roll}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{t.book_title}</td>
                          <td className="py-2.5 px-3 text-slate-500">{new Date(t.borrow_date).toLocaleDateString()}</td>
                          <td className="py-2.5 px-3 text-slate-500">{new Date(t.due_date).toLocaleDateString()}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              t.status === 'RETURNED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'RETURN_REQUESTED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOK CATALOG SEARCH & DEDICATED BOOK DETAILS PAGE */}
          {activeTab === 'books' && (
            <div>
              {/* IF A BOOK IS SELECTED: RENDER DEDICATED FULL-PAGE VIEW */}
              {selectedBookForDetails ? (
                <StaffDedicatedBookDetailsView
                  book={selectedBookForDetails}
                  onBack={() => setSelectedBookForDetails(null)}
                  onOpenMap={(b) => {
                    setMapBook(b);
                    setIsMapOpen(true);
                  }}
                  onEditBook={(b) => openEditModalForBook(b)}
                  onDeleteBook={(b) => handleDeleteBook(b)}
                />
              ) : (
                /* MAIN CONTENT AREA: SEARCH & 5 MATCHING BOOK RESULTS */
                <div className="space-y-4">
                  <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="relative flex-1 w-full">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={bookSearch}
                          onChange={(e) => {
                            setBookSearch(e.target.value);
                            setStaffSearchPage(1);
                          }}
                          placeholder="Search catalog by title, author, subject, or rack number..."
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 text-xs font-semibold focus:border-indigo-600 focus:outline-none"
                        />
                        {bookSearch && (
                          <button
                            onClick={() => {
                              setBookSearch('');
                              setStaffSearchPage(1);
                              loadBooks();
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={loadBooks}
                          className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          Search
                        </button>
                        <button
                          onClick={() => {
                            setBookForm({
                              title: '',
                              author: '',
                              subject: '',
                              department: 'CSE',
                              category: '',
                              isbn: '',
                              total_copies: 2,
                              available_copies: 2,
                              floor: 'Ground Floor',
                              rack_number: 'RACK-01',
                              rack_name: 'Computer Science Core',
                              shelf_number: 1,
                              position: 'Row 1, Top Shelf'
                            });
                            setIsAddBookModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shrink-0"
                        >
                          <Plus className="w-4 h-4" /> Add New Book
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter Floor</label>
                        <select
                          value={bookFloorFilter}
                          onChange={(e) => {
                            setBookFloorFilter(e.target.value);
                            setStaffSearchPage(1);
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          <option value="All">All Floors</option>
                          <option value="Ground Floor">Ground Floor</option>
                          <option value="First Floor">First Floor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter Department</label>
                        <select
                          value={bookDeptFilter}
                          onChange={(e) => {
                            setBookDeptFilter(e.target.value);
                            setStaffSearchPage(1);
                          }}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          {['All', 'CSE', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA', 'Basic Sciences'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1 flex items-end">
                        <span className="text-xs text-slate-500 font-semibold py-2">
                          Displaying <strong>5 books per page</strong> ({totalBooks} total)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5 CLEAR SEARCH RESULT CARDS IN MAIN CONTENT AREA */}
                  {currentStaffBooksSlice.length > 0 ? (
                    <div className="space-y-3.5">
                      {currentStaffBooksSlice.map((book) => {
                        const isAvailable = (book.available_copies || 0) > 1 || book.availability_status === 'Available';
                        const isLimited = (book.available_copies || 0) === 1 || book.availability_status === 'Limited Copies Available';
                        const isOutOfStock = (book.available_copies || 0) === 0 || book.availability_status === 'Not Available';

                        const badgeColor = isOutOfStock
                          ? 'bg-rose-100 text-rose-700 border-rose-300'
                          : isLimited
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                        const statusText = isOutOfStock ? 'Not Available' : isLimited ? 'Limited Copies Available' : 'Available';

                        return (
                          <div
                            key={book.id}
                            onClick={() => setSelectedBookForDetails(book)}
                            className="bg-white rounded-3xl p-5 border-2 border-slate-200/90 hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  {book.department}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}>
                                  ● {statusText}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {book.floor} • Rack {book.rack_number} • Shelf {book.shelf_number || 1}
                                </span>
                              </div>

                              <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                                {book.title}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                by <strong className="text-slate-700">{book.author}</strong> • Subject: {book.subject}
                              </p>

                              <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                                <span>Copies: <strong className="text-emerald-700">{book.available_copies ?? 1}</strong> avail / {book.total_copies || 2} total</span>
                                <span>•</span>
                                <span>Position: <strong className="text-slate-700">{book.position || 'Main Stacks'}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                className="px-4 py-2.5 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                View Full Details <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <h4 className="font-bold text-sm text-slate-700">No catalog books found</h4>
                      <p className="text-xs text-slate-400 mt-1">Try refining your search keyword or clearing department filter.</p>
                    </div>
                  )}

                  {/* ── 5-PER-PAGE PAGINATION CONTROLS ── */}
                  {books.length > RESULTS_PER_PAGE && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
                      <button
                        disabled={staffSearchPage === 1}
                        onClick={() => setStaffSearchPage(p => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous 5 Books
                      </button>

                      <div className="flex items-center gap-1">
                        <span>Page <strong>{staffSearchPage}</strong> of <strong>{totalStaffPages}</strong></span>
                        <span className="text-slate-400 ml-1">({totalBooks} total)</span>
                      </div>

                      <button
                        disabled={staffSearchPage >= totalStaffPages}
                        onClick={() => setStaffSearchPage(p => Math.min(totalStaffPages, p + 1))}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
                      >
                        Next 5 Books <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BORROWING & RETURN MANAGEMENT */}
          {activeTab === 'borrowing' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadTransactions()}
                      placeholder="Search by student name, roll number, or book title..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <button
                    onClick={loadTransactions}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Search
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                  {[
                    { id: 'ALL', label: 'All Transactions' },
                    { id: 'RETURN_REQUESTED', label: 'Return Requested (Pending)' },
                    { id: 'BORROWED', label: 'Currently Borrowed' },
                    { id: 'OVERDUE', label: 'Overdue Books' },
                    { id: 'RETURNED', label: 'Completed (Returned)' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setTxFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                        txFilter === f.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                        <th className="py-3 px-3">Student</th>
                        <th className="py-3 px-3">Book Borrowed</th>
                        <th className="py-3 px-3">Issue Date</th>
                        <th className="py-3 px-3">Due Date</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Staff Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 block">{t.student_name}</strong>
                            <span className="text-[10px] text-indigo-700 font-mono font-bold">{t.student_roll}</span>
                            <span className="text-[10px] text-slate-400 block">{t.student_dept}</span>
                          </td>
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 block">{t.book_title}</strong>
                            <span className="text-[10px] text-slate-400">{t.book_floor} • Rack {t.book_rack}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{new Date(t.borrow_date).toLocaleDateString()}</td>
                          <td className="py-3 px-3">
                            <span className={t.is_overdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                              {new Date(t.due_date).toLocaleDateString()}
                            </span>
                            {t.is_overdue && (
                              <span className="block text-[10px] text-rose-500 font-bold">
                                Overdue by {Math.abs(t.days_left)} days
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              t.status === 'RETURNED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : t.status === 'RETURN_REQUESTED'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : t.is_overdue
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {t.status === 'RETURN_REQUESTED' ? 'Verification Needed' : t.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {t.status === 'RETURNED' ? (
                              <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Returned
                              </span>
                            ) : (
                              <button
                                disabled={confirmingTxId === t.id}
                                onClick={() => handleConfirmReturn(t)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                {confirmingTxId === t.id ? 'Saving...' : 'Confirm Return'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadStudents()}
                    placeholder="Search students by roll number, name, phone, or email..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={studentDeptFilter}
                    onChange={(e) => setStudentDeptFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {['All', 'CSE', 'ECE', 'EEE', 'Civil', 'Mech', 'IT', 'MBA', 'Diploma'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <button
                    onClick={loadStudents}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Filter
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                        <th className="py-3 px-3">Roll Number</th>
                        <th className="py-3 px-3">Student Name</th>
                        <th className="py-3 px-3">Department &amp; Year</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">Active Loans</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {studentsList.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3 font-mono font-bold text-indigo-700">{s.roll_number}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                          <td className="py-3 px-3 text-slate-600">
                            {s.department} • <span className="text-[11px] text-slate-400">{s.year || '3rd Year'}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            {s.phone || 'No phone'} <br /> {s.email || 'No email'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-blue-700">{s.active_borrowed_count || 0}</span> borrowed
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {s.is_active ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleViewStudentDetails(s)}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 text-[11px]"
                              >
                                View History
                              </button>
                              <button
                                onClick={() => {
                                  setStudentEditForm({
                                    id: s.id,
                                    name: s.name,
                                    department: s.department,
                                    year: s.year || '3rd Year B.Tech',
                                    phone: s.phone || '',
                                    email: s.email || '',
                                    is_active: s.is_active
                                  });
                                  setIsEditStudentModalOpen(true);
                                }}
                                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                                title="Edit Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleStudentStatus(s)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                  s.is_active
                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {s.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FLOOR & RACK EXPLORER */}
          {activeTab === 'racks' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Physical Library Rack Capacities</h3>
                  <p className="text-xs text-slate-500">Overview of all 35 library racks across Ground Floor &amp; First Floor</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {racksList.length} Racks Total
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {racksList.map(r => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
                        {r.rack_number}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">{r.floor}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 mt-1">{r.rack_name}</h5>
                    <p className="text-[11px] text-slate-500 truncate">{r.category}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Books on Rack:</span>
                      <strong className="text-indigo-600 font-extrabold">{r.book_count || 0}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL: ADD NEW BOOK ── */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-slate-900">Add New Book to Catalog</h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Book Title *</label>
                  <input
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    placeholder="e.g. Design and Analysis of Algorithms"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name *</label>
                  <input
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="e.g. Thomas H. Cormen"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    required
                    value={bookForm.subject}
                    onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                    placeholder="e.g. Data Structures &amp; Algorithms"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    value={bookForm.department}
                    onChange={(e) => setBookForm({ ...bookForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    {['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA', 'Basic Sciences'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category / Topic</label>
                  <input
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    placeholder="e.g. Computer Science Core"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor *</label>
                  <select
                    value={bookForm.floor}
                    onChange={(e) => setBookForm({ ...bookForm, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="First Floor">First Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rack Number *</label>
                  <input
                    required
                    value={bookForm.rack_number}
                    onChange={(e) => setBookForm({ ...bookForm, rack_number: e.target.value })}
                    placeholder="e.g. RACK-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shelf Number (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={bookForm.shelf_number}
                    onChange={(e) => setBookForm({ ...bookForm, shelf_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.total_copies}
                    onChange={(e) => setBookForm({ ...bookForm, total_copies: e.target.value, available_copies: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={bookForm.available_copies}
                    onChange={(e) => setBookForm({ ...bookForm, available_copies: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ISBN (Optional)</label>
                  <input
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    placeholder="e.g. 978-0262033848"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT BOOK ── */}
      {isEditBookModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-slate-900">Edit Book: {selectedBook.title}</h3>
              <button onClick={() => setIsEditBookModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditBookSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Book Title *</label>
                  <input
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name *</label>
                  <input
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    required
                    value={bookForm.subject}
                    onChange={(e) => setBookForm({ ...bookForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Floor *</label>
                  <select
                    value={bookForm.floor}
                    onChange={(e) => setBookForm({ ...bookForm, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="First Floor">First Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rack Number *</label>
                  <input
                    required
                    value={bookForm.rack_number}
                    onChange={(e) => setBookForm({ ...bookForm, rack_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shelf Number</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={bookForm.shelf_number}
                    onChange={(e) => setBookForm({ ...bookForm, shelf_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.total_copies}
                    onChange={(e) => setBookForm({ ...bookForm, total_copies: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={bookForm.available_copies}
                    onChange={(e) => setBookForm({ ...bookForm, available_copies: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditBookModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Update Book Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW STUDENT DETAILS & BORROWING HISTORY ── */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{viewingStudent.name}</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">Roll: {viewingStudent.roll_number}</p>
              </div>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div>Department: <strong>{viewingStudent.department}</strong></div>
                <div>Year: <strong>{viewingStudent.year || '3rd Year'}</strong></div>
                <div>Phone: <strong>{viewingStudent.phone || '—'}</strong></div>
                <div>Email: <strong>{viewingStudent.email || '—'}</strong></div>
                <div>Status: <strong className={viewingStudent.is_active ? 'text-emerald-700' : 'text-rose-700'}>
                  {viewingStudent.is_active ? 'Active' : 'Deactivated'}
                </strong></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Student Borrowing History ({viewingStudent.loans?.length || 0})</h4>
                {viewingStudent.loans && viewingStudent.loans.length > 0 ? (
                  <div className="space-y-2">
                    {viewingStudent.loans.map(l => (
                      <div key={l.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <strong className="text-slate-900 block">{l.book_title}</strong>
                          <span className="text-[10px] text-slate-500">
                            Borrowed: {new Date(l.borrow_date).toLocaleDateString()} • Due: {new Date(l.due_date).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          l.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 py-4 text-center">No borrowing records for this student.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT STUDENT DETAILS ── */}
      {isEditStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-slate-900">Edit Student Details</h3>
              <button onClick={() => setIsEditStudentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  value={studentEditForm.name}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={studentEditForm.department}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {['CSE', 'ECE', 'EEE', 'Civil', 'Mech', 'IT', 'MBA', 'Diploma'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                <input
                  value={studentEditForm.year}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  value={studentEditForm.phone}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={studentEditForm.email}
                  onChange={(e) => setStudentEditForm({ ...studentEditForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE FLOOR MAP MODAL FOR STAFF ── */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-6xl h-[92vh] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Staff Library Layout &amp; Rack Coordinates
                  </h3>
                  <p className="text-xs text-slate-400">
                    Floor layout simulation showing exact book shelf coordinates
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsMapOpen(false);
                  setMapBook(null);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <InteractiveMapViewer
                selectedBook={mapBook}
                initialFloor={mapBook ? mapBook.floor : 'Ground Floor'}
                onClose={() => {
                  setIsMapOpen(false);
                  setMapBook(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
