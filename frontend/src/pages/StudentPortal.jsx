import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  BookOpen,
  CheckCircle,
  XCircle,
  Layers,
  Compass,
  ArrowRight,
  Sparkles,
  RefreshCw,
  X,
  Bell,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  Shield,
  KeyRound,
  LogOut,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';
import { api } from '../services/api';
import InteractiveMapViewer from '../components/InteractiveMapViewer';

export default function StudentPortal({ studentUser, setStudentUser, onOpenLogin }) {
  // Navigation tab state inside Student Dashboard
  // 'overview' | 'search' | 'borrowed' | 'history' | 'notifications' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [totalBooksCount, setTotalBooksCount] = useState(0);

  // Active Map Modal
  const [mapBook, setMapBook] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Loans & History state
  const [activeLoans, setActiveLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  // Notifications & Reminders state
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Return Book Confirmation Modal
  const [returnModalTx, setReturnModalTx] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: studentUser?.name || '',
    email: studentUser?.email || '',
    phone: studentUser?.phone || '',
    year: studentUser?.year || '3rd Year B.Tech'
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // ── Sync Profile Data on Mount ──
  useEffect(() => {
    if (studentUser) {
      setProfileForm({
        name: studentUser.name || '',
        email: studentUser.email || '',
        phone: studentUser.phone || '',
        year: studentUser.year || '3rd Year B.Tech'
      });
      loadStudentLoans();
      loadNotifications();
    }
  }, [studentUser]);

  // ── Fetch Books on Search or Filter Change ──
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedDept, selectedCategory, selectedFloor, selectedAvailability]);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await api.searchBooks({
        q: searchTerm.trim() || undefined,
        department: selectedDept !== 'All' ? selectedDept : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        floor: selectedFloor !== 'All' ? selectedFloor : undefined,
        availability: selectedAvailability !== 'All' ? selectedAvailability : undefined
      });
      setBooks(res.books || []);
      setTotalBooksCount(res.count || 0);
    } catch (err) {
      console.error('Failed to load books:', err);
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadStudentLoans = async () => {
    setLoadingLoans(true);
    try {
      const res = await api.getMyLoans();
      setActiveLoans(res.active_loans || []);
      setLoanHistory(res.history || []);
    } catch (err) {
      console.error('Failed to load student loans:', err);
    } finally {
      setLoadingLoans(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadNotifCount(res.unread_count || 0);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadNotifCount(0);
      loadNotifications();
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  // ── Book Collection (Borrowing) ──
  const handleCollectBook = async (book) => {
    if (!studentUser) {
      throw new Error('Please login as a student to borrow books.');
    }
    const res = await api.collectBook(book.id, true);
    setActionSuccessMsg(res.message || `Successfully borrowed '${book.title}'!`);
    setTimeout(() => setActionSuccessMsg(''), 5000);
    // Refresh student data & book list
    loadStudentLoans();
    loadNotifications();
    fetchBooks();
    return res;
  };

  // ── Book Return Request ──
  const handleConfirmReturn = async () => {
    if (!returnModalTx) return;
    setIsReturning(true);
    setActionErrorMsg('');
    try {
      const res = await api.requestReturn(returnModalTx.id, true);
      setActionSuccessMsg(res.message || 'Return request recorded! Staff will verify physical return.');
      setReturnModalTx(null);
      loadStudentLoans();
      loadNotifications();
      setTimeout(() => setActionSuccessMsg(''), 6000);
    } catch (err) {
      setActionErrorMsg(err.message || 'Failed to submit return request.');
    } finally {
      setIsReturning(false);
    }
  };

  // ── Update Profile ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const res = await api.updateStudentProfile(profileForm);
      setStudentUser(res.student);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err) {
      setProfileMsg('Error: ' + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Change Password ──
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg('Error: Passwords do not match.');
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordMsg('Error: Password must be at least 6 characters.');
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg('');
    try {
      await api.changeStudentPassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      });
      setPasswordMsg('Password changed successfully!');
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setPasswordMsg(''), 4000);
    } catch (err) {
      setPasswordMsg('Error: ' + err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem('svec_student_token');
    setStudentUser(null);
  };

  // ── AUTHENTICATION GATE: IF NOT LOGGED IN ──
  if (!studentUser) {
    return (
      <div className="min-h-[85vh] bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-blue-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Authentication Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Access to the Student Dashboard, book borrowing, waypoint navigation, and loan management is restricted to registered SVEC students.
          </p>
          <button
            onClick={() => {
              if (onOpenLogin) onOpenLogin();
              else window.location.reload();
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-102 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Go to Student Login
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN AUTHENTICATED STUDENT DASHBOARD ──
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* ── TOP STUDENT PORTAL APP BAR (Inspired by Vasavi E-CAP) ── */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white shadow-lg sticky top-0 z-30 border-b border-blue-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Student Info Pill */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center text-white font-black text-sm shadow-md">
                {studentUser.name.charAt(0)}
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                    {studentUser.name}
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold font-mono">
                    {studentUser.roll_number}
                  </span>
                </div>
                <p className="text-[11px] text-blue-200">
                  {studentUser.department} • {studentUser.year || '3rd Year B.Tech'}
                </p>
              </div>
            </div>

            {/* Notification Bell & Logout */}
            <div className="flex items-center gap-3">
              {/* Notification Bell with Badge */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white transition-colors relative"
                  title="Notifications & Reminders"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-pulse">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Reminders &amp; Alerts</h4>
                      </div>
                      {unreadNotifCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-blue-600 hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl text-xs transition-colors ${
                              n.type === 'OVERDUE'
                                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                                : n.type === 'DUE_SOON'
                                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                : n.is_read
                                ? 'bg-slate-50 text-slate-600'
                                : 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className="font-bold text-[11px] flex items-center gap-1">
                                {n.type === 'OVERDUE' ? '⚠️ OVERDUE' : n.type === 'DUE_SOON' ? '⏰ DUE SOON' : 'ℹ️ NOTE'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(n.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] leading-snug">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-6 text-xs text-slate-400">No new notifications</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-bold transition-all"
                title="Sign out of student portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── GLOBAL ACTION ALERT TOASTS ── */}
      {actionSuccessMsg && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2 sticky top-16 z-20 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg('')} className="ml-2 hover:opacity-75">✕</button>
        </div>
      )}

      {/* ── MAIN DASHBOARD LAYOUT: SIDEBAR + CONTENT AREA ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* ── SIDEBAR NAVIGATION (Vasavi E-CAP Structure) ── */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80 sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Navigation Menu
            </div>

            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BookOpen },
              { id: 'search', label: 'Search & Waypoint Map', icon: Search, badge: totalBooksCount },
              { id: 'borrowed', label: 'Currently Borrowed', icon: Bookmark, badge: activeLoans.length },
              { id: 'history', label: 'Borrowing History', icon: Clock },
              { id: 'notifications', label: 'Reminders & Alerts', icon: Bell, badge: unreadNotifCount, badgeColor: 'bg-rose-500' },
              { id: 'profile', label: 'Personal Details & Settings', icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : tab.badgeColor ? `${tab.badgeColor} text-white` : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-[11px] text-blue-900">
                <span className="font-extrabold block text-blue-950 mb-0.5">Need Library Help?</span>
                Central Library Counter Ground Floor is open 8:30 AM – 6:00 PM.
              </div>
            </div>
          </div>
        </aside>

        {/* ── TAB CONTENT AREA ── */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> SVEC Smart Library Portal
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                    Welcome, {studentUser.name}!
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-6">
                    Search over 1,000+ engineering titles, view accurate architectural rack layouts, and follow
                    animated walking navigation straight to your shelf.
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105"
                  >
                    <Search className="w-4 h-4" /> Search &amp; Navigate Books
                  </button>
                </div>
              </div>

              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Borrowed Books
                  </div>
                  <div className="text-2xl font-black text-blue-600">{activeLoans.length}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Currently in possession</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Due Soon / Overdue
                  </div>
                  <div className="text-2xl font-black text-amber-500">
                    {activeLoans.filter(l => l.days_left <= 3 || l.is_overdue).length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Requires return attention</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Total Borrowed
                  </div>
                  <div className="text-2xl font-black text-indigo-600">
                    {activeLoans.length + loanHistory.length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Lifetime book loans</div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Active Alerts
                  </div>
                  <div className="text-2xl font-black text-rose-600">{unreadNotifCount}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Unread reminders</div>
                </div>
              </div>

              {/* Urgent Due Date Alert Box (if any book is due soon or overdue) */}
              {activeLoans.some(l => l.is_overdue || l.days_left <= 3) && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 text-amber-900 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 font-black text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Return Date Reminder</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {activeLoans
                      .filter(l => l.is_overdue || l.days_left <= 3)
                      .map(l => (
                        <div key={l.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-200">
                          <div>
                            <span className="font-bold">{l.book_title}</span>
                            <span className="text-[11px] text-slate-500 ml-2">
                              Due: {new Date(l.due_date).toLocaleDateString()}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              l.is_overdue
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {l.is_overdue ? 'OVERDUE' : `Due in ${l.days_left} day(s)`}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Currently Borrowed Books Section */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-blue-600" />
                    <h3 className="font-extrabold text-base text-slate-900">Currently Borrowed Books</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('borrowed')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    View All ({activeLoans.length})
                  </button>
                </div>

                {activeLoans.length > 0 ? (
                  <div className="space-y-3">
                    {activeLoans.slice(0, 3).map((loan) => (
                      <div
                        key={loan.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{loan.book_title}</h4>
                          <p className="text-xs text-slate-500">
                            by {loan.book_author} • Floor: {loan.book_floor} (Rack {loan.book_rack})
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                            <span>Issued: {new Date(loan.borrow_date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Due: <strong className="text-slate-800">{new Date(loan.due_date).toLocaleDateString()}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              loan.status === 'RETURN_REQUESTED'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : loan.is_overdue
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}
                          >
                            {loan.status === 'RETURN_REQUESTED'
                              ? 'Return Pending'
                              : loan.is_overdue
                              ? 'Overdue'
                              : `${loan.days_left}d Left`}
                          </span>

                          {loan.status !== 'RETURN_REQUESTED' && (
                            <button
                              onClick={() => setReturnModalTx(loan)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                            >
                              Return Book
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold">You have no borrowed books currently.</p>
                    <button
                      onClick={() => setActiveTab('search')}
                      className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                    >
                      Find Books To Borrow
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SEARCH BOOKS & WAYPOINT NAVIGATION MAP */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Control Box */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-blue-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Title, Author, Subject, Department, or Category..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Department</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                    >
                      {['All', 'CSE', 'ECE', 'EEE', 'Civil', 'Mechanical', 'MBA', 'Basic Sciences'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Floor</label>
                    <select
                      value={selectedFloor}
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                    >
                      <option value="All">All Floors</option>
                      <option value="Ground Floor">Ground Floor (GF)</option>
                      <option value="First Floor">First Floor (1F)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Availability</label>
                    <select
                      value={selectedAvailability}
                      onChange={(e) => setSelectedAvailability(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Available">Available (Green)</option>
                      <option value="Not Available">Not Available (Red)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Floor Map View</label>
                    <button
                      onClick={() => { setMapBook(null); setIsMapOpen(true); }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-sky-400" /> View Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Books List Header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Catalog Results ({totalBooksCount} titles)
                </span>
                {loadingBooks && <span className="text-xs text-blue-600 animate-pulse font-bold">Loading books...</span>}
              </div>

              {/* Book Cards Grid */}
              {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book) => {
                    // Availability status indicators (Green, Orange, Red)
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
                        className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          {/* Title & Status Badge */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-200">
                              {book.department}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}>
                              {statusText}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug mb-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-500 mb-3">
                            by <strong className="text-slate-700">{book.author}</strong> • {book.subject}
                          </p>

                          {/* Location & Copies Details Grid */}
                          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-[11px] border border-slate-100 mb-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Floor</span>
                              <strong className="text-slate-800">{book.floor}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rack No.</span>
                              <strong className="text-blue-700">{book.rack_number}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">Shelf</span>
                              <strong className="text-slate-800">Shelf {book.shelf_number || 1}</strong>
                            </div>
                            <div className="col-span-3 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Total Copies: <strong>{book.total_copies || 2}</strong></span>
                              <span>Available: <strong className="text-emerald-700">{book.available_copies ?? 1}</strong></span>
                              <span>Borrowed: <strong className="text-amber-700">{book.borrowed_copies ?? 0}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Action: VIEW PATH BUTTON */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setMapBook(book);
                              setIsMapOpen(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
                          >
                            <MapPin className="w-3.5 h-3.5 text-sky-200" />
                            VIEW PATH &amp; NAVIGATE
                          </button>

                          {/* Quick Collect Button if available */}
                          {!isOutOfStock && (
                            <button
                              onClick={() => handleCollectBook(book)}
                              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-all"
                              title="Directly record borrowing"
                            >
                              Collect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-700">No books found matching your criteria</h4>
                  <p className="text-xs text-slate-400 mt-1">Try searching by partial title, subject, or author name.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRENTLY BORROWED BOOKS */}
          {activeTab === 'borrowed' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Currently Borrowed Books</h3>
                    <p className="text-xs text-slate-500">Track active loans and initiate book returns</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                    {activeLoans.length} Active Loan(s)
                  </span>
                </div>

                {activeLoans.length > 0 ? (
                  <div className="space-y-4">
                    {activeLoans.map((loan) => (
                      <div
                        key={loan.id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-extrabold text-base text-slate-900">{loan.book_title}</h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                loan.status === 'RETURN_REQUESTED'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : loan.is_overdue
                                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {loan.status === 'RETURN_REQUESTED'
                                ? 'Return Requested (Pending Verification)'
                                : loan.is_overdue
                                ? `Overdue by ${Math.abs(loan.days_left)} days`
                                : `${loan.days_left} days remaining`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">
                            Author: <strong className="text-slate-700">{loan.book_author}</strong> • Location: {loan.book_floor} (Rack {loan.book_rack})
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Issue Date</span>
                              <strong>{new Date(loan.borrow_date).toLocaleDateString()}</strong>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Expected Return Date</span>
                              <strong className={loan.is_overdue ? 'text-rose-600' : 'text-slate-900'}>
                                {new Date(loan.due_date).toLocaleDateString()}
                              </strong>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                              <strong>{loan.status}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Return Book Action */}
                        <div className="shrink-0">
                          {loan.status === 'RETURN_REQUESTED' ? (
                            <div className="text-right">
                              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                                <Clock className="w-4 h-4 text-amber-600" /> Staff Verification Pending
                              </span>
                              <p className="text-[10px] text-slate-500 mt-1">Please deposit physical copy</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReturnModalTx(loan)}
                              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105"
                            >
                              RETURN BOOK
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No active book loans</p>
                    <p className="text-xs text-slate-500 mt-1">You currently do not have any borrowed books.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BORROWING HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Borrowing History</h3>
                  <p className="text-xs text-slate-500">Record of all past completed library book returns</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  {loanHistory.length} Record(s)
                </span>
              </div>

              {loanHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-3 px-3">Book Title</th>
                        <th className="py-3 px-3">Borrow Date</th>
                        <th className="py-3 px-3">Due Date</th>
                        <th className="py-3 px-3">Return Date</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {loanHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {item.book_title}
                            <span className="block text-[11px] text-slate-400 font-normal">by {item.book_author}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {new Date(item.borrow_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {new Date(item.due_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {item.return_date ? new Date(item.return_date).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Clock className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">No past borrowing records yet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS & REMINDERS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Notifications &amp; Return Reminders</h3>
                  <p className="text-xs text-slate-500">Automated system alerts, approaching due dates, and return confirmations</p>
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all"
                  >
                    Mark All As Read
                  </button>
                )}
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border text-xs transition-colors flex items-start gap-3.5 ${
                        n.type === 'OVERDUE'
                          ? 'bg-rose-50/70 border-rose-300 text-rose-900'
                          : n.type === 'DUE_SOON'
                          ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white shadow-sm shrink-0 mt-0.5">
                        {n.type === 'OVERDUE' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        ) : n.type === 'DUE_SOON' ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-extrabold text-sm">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">No notifications available.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PERSONAL DETAILS & SETTINGS */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details Edit Form */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Personal Details</h3>
                </div>

                {profileMsg && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${
                    profileMsg.startsWith('Error') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Roll Number (Permanent / Locked)
                    </label>
                    <input
                      type="text"
                      value={studentUser.roll_number}
                      disabled
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={studentUser.department}
                      disabled
                      className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      placeholder="e.g. 3rd Year B.Tech"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="you@svec.edu.in"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md mt-2"
                  >
                    {profileSaving ? 'Saving...' : 'Update Profile Details'}
                  </button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Security &amp; Password</h3>
                </div>

                {passwordMsg && (
                  <div className={`p-3 rounded-xl text-xs font-bold ${
                    passwordMsg.startsWith('Error') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {passwordMsg}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.old_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      New Password * (Min 6 characters)
                    </label>
                    <input
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md mt-2"
                  >
                    {passwordSaving ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── RETURN BOOK CONFIRMATION MODAL ── */}
      {returnModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Have you returned the book to the library?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Book: <strong className="text-slate-800">{returnModalTx.book_title}</strong>
              <br />
              Please physically return the book copy at the Central Library desk.
            </p>

            {actionErrorMsg && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                {actionErrorMsg}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                disabled={isReturning}
                onClick={handleConfirmReturn}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
              >
                {isReturning ? 'Submitting...' : 'YES (Confirm Return)'}
              </button>
              <button
                onClick={() => setReturnModalTx(null)}
                className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
              >
                NO (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE FLOOR MAP MODAL (Preserves all original floor maps) ── */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-6xl h-[92vh] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    SVEC Smart Library Indoor Waypoint Navigation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Floor layout simulation with turn-by-turn guidance to rack &amp; shelf
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

            {/* Interactive Map Component Container */}
            <div className="flex-1 overflow-hidden">
              <InteractiveMapViewer
                selectedBook={mapBook}
                initialFloor={mapBook ? mapBook.floor : 'Ground Floor'}
                onClose={() => {
                  setIsMapOpen(false);
                  setMapBook(null);
                }}
                onCollectBook={handleCollectBook}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
