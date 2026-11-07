import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Search,
  Compass,
  ArrowRight,
  User,
  Lock,
  UserPlus,
  LogIn,
  Sparkles,
  GraduationCap,
  Library,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  KeyRound,
  X,
  Phone,
  Mail,
  Calendar,
  Building
} from 'lucide-react';
import { api } from '../services/api';

// ─── Forgot Password Modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: request code, 2: reset password
  const [rollOrEmail, setRollOrEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [returnedRoll, setReturnedRoll] = useState('');

  if (!isOpen) return null;

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!rollOrEmail.trim()) {
      setError('Please enter your Roll Number or registered Email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.forgotPassword(rollOrEmail.trim());
      setReturnedRoll(res.roll_number);
      setResetToken(res.reset_token);
      setSuccess(`Reset code generated: ${res.reset_token}. Enter your new password below.`);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Unable to find student account with that Roll Number.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.resetPassword({
        roll_number: returnedRoll,
        reset_token: resetToken,
        new_password: newPassword
      });
      setSuccess('Password reset successfully! You can now login with your new password.');
      setTimeout(() => {
        onClose();
        setStep(1);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Student Password Recovery</h3>
            <p className="text-xs text-slate-500">Reset your SVEC library account password</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-start gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-start gap-2 border border-emerald-200">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Registered Roll Number or Email
              </label>
              <input
                type="text"
                value={rollOrEmail}
                onChange={(e) => setRollOrEmail(e.target.value)}
                placeholder="e.g. 22B91A6128"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold uppercase"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              {loading ? 'Verifying...' : 'Generate Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reset Code</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 6 chars)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md mt-2"
            >
              {loading ? 'Updating Password...' : 'Save New Password & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Student Login / Register Card (Vasavi E-CAP Style) ───────────────────────
function StudentAuthCard({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({
    name: '',
    roll_number: '',
    department: 'CSE',
    year: '3rd Year B.Tech',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const departments = ['CSE', 'ECE', 'EEE', 'Civil', 'Mech', 'IT', 'AI&ML', 'MBA', 'Diploma'];
  const years = ['1st Year B.Tech', '2nd Year B.Tech', '3rd Year B.Tech', '4th Year B.Tech', '1st Year MBA', '2nd Year MBA', 'Diploma'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.roll_number.trim() || !form.password) {
      setError('Please enter your Roll Number and Password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.studentLogin(form.roll_number.trim(), form.password);
      localStorage.setItem('svec_student_token', res.token);
      setSuccess(`Authentication successful! Welcome, ${res.student.name}`);
      setTimeout(() => onLoginSuccess(res.student), 500);
    } catch (err) {
      setError(err.message || 'Invalid Roll Number or Password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.roll_number.trim() || !form.password) {
      setError('Name, Roll Number, and Password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.studentRegister({
        name: form.name.trim(),
        roll_number: form.roll_number.trim().toUpperCase(),
        department: form.department,
        year: form.year,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        password: form.password
      });
      localStorage.setItem('svec_student_token', res.token);
      setSuccess(`Registration complete! Welcome, ${res.student.name}`);
      setTimeout(() => onLoginSuccess(res.student), 500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-blue-200/80 overflow-hidden flex flex-col h-full transition-all">
      {/* Header Styled like E-CAP Student Portal */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-6 sm:px-8 pt-7 pb-6 text-white relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Candidate Access</div>
              <h2 className="text-xl font-black tracking-tight">Student Portal</h2>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-blue-500/30 border border-blue-300/40 px-2.5 py-1 rounded-full text-blue-100">
            E-Library
          </span>
        </div>

        {/* Tab switchers: Sign In / Create Account */}
        <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl mt-4">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-white text-blue-800 shadow-md font-extrabold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-white text-blue-800 shadow-md font-extrabold'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> New Account
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 sm:px-8 py-6 flex flex-col justify-between">
        <div>
          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* ── STUDENT SIGN IN ── */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Student Roll Number / Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    name="roll_number"
                    value={form.roll_number}
                    onChange={handleChange}
                    placeholder="e.g. 22B91A6128"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold uppercase text-slate-900 placeholder:text-slate-400 placeholder:normal-case transition-colors"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Enter Student Dashboard
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ── STUDENT REGISTRATION ── */
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Naga Durga Rao"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Roll Number *</label>
                  <input
                    name="roll_number"
                    value={form.roll_number}
                    onChange={handleChange}
                    placeholder="22B91A6128"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold uppercase focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Department *</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:border-blue-600 focus:outline-none"
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Academic Year</label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:border-blue-600 focus:outline-none"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Email Address (Optional)</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@svec.edu.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Password *</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Confirm *</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs shadow-md mt-2 transition-all"
              >
                {loading ? 'Creating Account...' : 'Register & Enter Library'}
              </button>
            </form>
          )}
        </div>

        {/* Sample Credentials Helper Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Demo Student: <strong className="text-blue-700 font-mono">22B91A6128</strong></span>
          <span>Password: <strong className="text-blue-700 font-mono">student123</strong></span>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
    </div>
  );
}

// ─── Staff Login Card (Vasavi E-CAP Style) ────────────────────────────────────
function StaffAuthCard({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      setError('Staff Username and Password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.login(form.username.trim(), form.password);
      localStorage.setItem('svec_staff_token', res.token);
      setSuccess(`Authentication successful! Welcome, ${res.staff.name}`);
      setTimeout(() => onLoginSuccess(res.staff), 500);
    } catch (err) {
      setError(err.message || 'Invalid Staff Username or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-indigo-200/80 overflow-hidden flex flex-col h-full transition-all">
      {/* Header Styled like E-CAP Staff Portal */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 pt-7 pb-6 text-white relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">Administrative Access</div>
              <h2 className="text-xl font-black tracking-tight">Staff Portal</h2>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-indigo-500/30 border border-indigo-300/40 px-2.5 py-1 rounded-full text-indigo-200">
            Authorized Only
          </span>
        </div>

        {/* Features preview strip */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-indigo-200/90 bg-white/5 p-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Catalog &amp; Inventory CRUD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Return Verifications</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Borrowing Monitor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Student Management</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 sm:px-8 py-6 flex flex-col justify-between">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Staff Username
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. admin or staff"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Staff password"
                className="w-full pl-10 pr-11 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Verifying Access...
              </span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Access Staff Management
              </>
            )}
          </button>
        </form>

        {/* Default Staff Credentials Helper */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Admin: <strong className="text-indigo-700 font-mono">admin</strong> / <strong className="text-indigo-700 font-mono">admin123</strong></span>
          <span>Staff: <strong className="text-indigo-700 font-mono">staff</strong> / <strong className="text-indigo-700 font-mono">staff123</strong></span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function HomePage({
  onNavigateToStudent,
  onNavigateToStaff,
  onOpenQr,
  stats,
  setStaffUser,
  setStudentUser
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* ── COLLEGE HERO HEADER (Inspired by Vasavi E-CAP) ── */}
      <section className="relative overflow-hidden pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950/60 border-b border-slate-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sri Vasavi Engineering College (Autonomous) • Central Library Portal
          </div>

          <div className="flex items-center justify-center gap-3.5 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <Library className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Smart Library Management Portal
              </h1>
              <p className="text-xs sm:text-sm text-sky-300 font-semibold tracking-wide">
                Book Finder, Indoor Waypoint Navigation &amp; Automated Borrowing System
              </p>
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            Log in to your respective portal to search 1,000+ textbooks, view floor-accurate rack layouts,
            follow animated walking navigation routes, collect books, and manage returns seamlessly.
          </p>

          {/* Real-time Library Metrics Strip */}
          {stats && (
            <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap pt-2 border-t border-slate-800/80">
              <div className="text-center px-3 py-1">
                <div className="text-xl sm:text-2xl font-black text-white">{stats.totalBooks || 1046}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total Books</div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="text-center px-3 py-1">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">{stats.availableBooks || 1045}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Available Now</div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="text-center px-3 py-1">
                <div className="text-xl sm:text-2xl font-black text-amber-400">{stats.totalBorrowed || 1}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Borrowed</div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="text-center px-3 py-1">
                <div className="text-xl sm:text-2xl font-black text-sky-400">{stats.totalRacks || 35}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Physical Racks</div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="text-center px-3 py-1">
                <div className="text-xl sm:text-2xl font-black text-indigo-400">GF &amp; 1F</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Library Floors</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TWO DEDICATED LOGIN PORTAL BOXES ── */}
      <section className="flex-1 px-4 sm:px-6 lg:px-8 py-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700">
            Please Select Your Portal To Proceed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 1. STUDENT LOGIN BOX */}
          <StudentAuthCard
            onLoginSuccess={(student) => {
              if (setStudentUser) setStudentUser(student);
              onNavigateToStudent();
            }}
          />

          {/* 2. STAFF LOGIN BOX */}
          <StaffAuthCard
            onLoginSuccess={(staff) => {
              if (setStaffUser) setStaffUser(staff);
              onNavigateToStaff();
            }}
          />
        </div>

        {/* Quick action shortcuts */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={onOpenQr}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 transition-all"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            Generate Entrance QR Code Standee
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 bg-slate-950">
        <p className="font-semibold text-slate-400">
          Sri Vasavi Engineering College (Autonomous) • Central Library Management System
        </p>
        <p className="mt-1">
          Pedatadepalli, Tadepalligudem, West Godavari District, Andhra Pradesh 534101
        </p>
      </footer>
    </div>
  );
}
