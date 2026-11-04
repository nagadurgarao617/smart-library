import React from 'react';
import { BookOpen, MapPin, ShieldCheck, QrCode, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenQr, staffUser, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* College & Project Logo Brand */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            {/* Emblem icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-wider text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                  Sri Vasavi Engineering College
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline-block text-[10px] font-medium text-slate-500">Autonomous • Tadepalligudem</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Smart Library <span className="text-blue-600 font-extrabold">Book Finder & Indoor Navigation</span>
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'staff'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Portal</span>
              {staffUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>

            {/* Entrance QR Generator Trigger */}
            <button
              onClick={onOpenQr}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border border-amber-300/60 transition-colors"
              title="Generate Entrance QR Code"
            >
              <QrCode className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Entrance QR</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
