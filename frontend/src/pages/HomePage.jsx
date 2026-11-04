import React from 'react';
import {
  BookOpen,
  MapPin,
  ShieldCheck,
  Search,
  Navigation,
  Compass,
  QrCode,
  Layers,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BookMarked,
  Cpu
} from 'lucide-react';

export default function HomePage({ onNavigateToStudent, onNavigateToStaff, onOpenQr, stats }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 1. HERO SECTION WITH COLLEGE BRANDING */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background grid & glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Institutional Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" /> Sri Vasavi Engineering College Library System
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Smart Library <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Book Finder</span> <br className="hidden sm:inline" />
            & Indoor Navigation System
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed mb-10">
            Locate library books across Ground Floor and First Floor stacks with architectural-accurate digital layouts, turn-by-turn waypoint pathfinding, and real-time inventory tracking.
          </p>

          {/* TWO MAIN PORTAL ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {/* OPTION 1: STUDENT PORTAL */}
            <div
              onClick={onNavigateToStudent}
              className="group relative p-8 rounded-3xl bg-slate-900/80 border-2 border-blue-500/40 hover:border-blue-400 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/20"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
                  <Search className="w-7 h-7" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800">
                  <Compass className="w-3.5 h-3.5" /> Interactive Map
                </span>
              </div>

              <h2 className="text-2xl font-black text-white mb-2 group-hover:text-blue-300 transition-colors">
                STUDENT PORTAL
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Search over 1,000+ cataloged textbooks, references, competitive exams, and journals. View exact floor racks and follow animated walking routes directly to your shelf.
              </p>

              <div className="flex items-center text-sm font-bold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                Find Books & Navigate <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* OPTION 2: STAFF PORTAL */}
            <div
              onClick={onNavigateToStaff}
              className="group relative p-8 rounded-3xl bg-slate-900/80 border-2 border-indigo-500/40 hover:border-indigo-400 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/20"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
                  Password Protected
                </span>
              </div>

              <h2 className="text-2xl font-black text-white mb-2 group-hover:text-indigo-300 transition-colors">
                STAFF PORTAL
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Librarian administrative dashboard. Add new books, update shelf locations, toggle real-time availability on issue/return, and oversee library inventory metrics.
              </p>

              <div className="flex items-center text-sm font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all">
                Staff Login & Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME STATS COUNTER STRIP */}
      <section className="-mt-10 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-blue-700">
              {stats?.totalBooks || '1046+'}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Cataloged Books</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">
              {stats?.availableBooks || '980+'}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Available On Shelf</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-indigo-600">
              {stats?.totalRacks || '35'}
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Mapped Racks</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-amber-600">2 Floors</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Ground & 1st Floor</p>
          </div>
        </div>
      </section>

      {/* 3. FLOOR LAYOUT ARCHITECTURE ACCURACY HIGHLIGHTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Verified Map Reproductions</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Ground Floor & First Floor Layouts Matching Official College Sketches
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Every rack, table, room, and scanner strictly matches the physical architectural placement drawn in library floor plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ground Floor Features Card */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">GF</span>
              <h4 className="font-extrabold text-lg text-slate-900">Ground Floor Facilities</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>20 Main Racks:</strong> Racks 1 to 10 and 11 to 20 positioned together in adjacent columns.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Diploma & MBA Racks:</strong> Dedicated row near the staircase.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Key Zones:</strong> Entrance, ID Card Scanner Gates, Staff Desk, Head of Library Room, Digital Library, Newspaper Stand, and Study Tables.</span>
              </li>
            </ul>
          </div>

          {/* First Floor Features Card */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center">1F</span>
              <h4 className="font-extrabold text-lg text-slate-900">First Floor Facilities</h4>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>11 Reference Racks:</strong> Positioned on the RIGHT side next to study tables.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Laptop Charging Area:</strong> 3 long charging benches positioned on the LEFT side.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Project Working Rooms:</strong> 4 private discussion rooms along the northern wall.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>SC/ST Book Bank:</strong> Two dedicated category racks near central study tables.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Entrance QR Spotlight Card */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Physical Library Entrance QR Standee</h4>
              <p className="text-xs text-blue-200 mt-1 max-w-xl">
                Generate and download a high-resolution QR Code badge to print and affix at the library entrance. Scanning immediately opens the Student Navigation Portal on mobile.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenQr}
            className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            Generate Entrance QR Code
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 px-4 border-t border-slate-800 text-xs text-center">
        <p className="font-semibold text-slate-300">
          Sri Vasavi Engineering College (Autonomous) • Department of Central Library
        </p>
        <p className="mt-1 text-slate-500">
          Smart Library Book Finder and Indoor Navigation System • Developed with React.js, Express.js & SQLite
        </p>
      </footer>
    </div>
  );
}
