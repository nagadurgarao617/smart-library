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
  X
} from 'lucide-react';
import { api } from '../services/api';
import InteractiveMapViewer from '../components/InteractiveMapViewer';

export default function StudentPortal() {
  // Only Book Name Search
  const [bookName, setBookName] = useState('');

  // Results & Loading
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Active Map Modal State
  const [mapBook, setMapBook] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Quick suggestions for fast 1-tap book finding
  const quickBooks = [
    'Structural Analysis',
    'Python',
    'Data Structures',
    'Engineering Mathematics',
    'Machine Learning',
    'Thermodynamics',
    'VLSI Design',
    'Digital Signal Processing'
  ];

  // Search when bookName changes (with 250ms debounce) or on form submit
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(bookName);
    }, 250);
    return () => clearTimeout(timer);
  }, [bookName]);

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const res = await api.searchBooks({
        title: query.trim()
      });
      setBooks(res.books || []);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.error('Failed to search books by name:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(bookName);
  };

  const handleClear = () => {
    setBookName('');
    fetchBooks('');
  };

  const handleOpenMap = (book) => {
    setMapBook(book);
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
    setMapBook(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* 1. PORTAL HEADER BANNER */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Sri Vasavi Engineering College
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
            Find Book by Name
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Type the book name to find its exact floor, rack, shelf, and indoor walking route.
          </p>

          {/* Quick Floor Maps View Button */}
          <button
            onClick={() => {
              setMapBook(null);
              setIsMapOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <Layers className="w-4 h-4 text-sky-400" /> Explore Interactive Floor Maps (GF & 1F)
          </button>
        </div>
      </section>

      {/* 2. DEDICATED BOOK NAME SEARCH BAR */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200/90"
        >
          <div className="relative flex items-center">
            <Search className="w-6 h-6 text-blue-600 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              placeholder="Search by Book Name... (e.g. Structural Analysis, Python, Thermodynamics)"
              className="w-full text-sm sm:text-base pl-13 pr-28 py-3.5 sm:py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
              autoFocus
            />

            {/* Clear Button */}
            {bookName && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-28 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-5 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                'Find Book'
              )}
            </button>
          </div>

          {/* Quick Suggestions Pills */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Books:
            </span>
            {quickBooks.map((qb) => (
              <button
                key={qb}
                type="button"
                onClick={() => setBookName(qb)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  bookName === qb
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700'
                }`}
              >
                {qb}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 3. SEARCH RESULTS SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900">
              {bookName ? `Books matching "${bookName}"` : 'All Library Books'}
              <span className="text-xs font-bold text-blue-600 ml-2 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                {totalCount} books found
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click <strong>VIEW ON MAP</strong> on any book to see the indoor route to its rack and shelf.
            </p>
          </div>
        </div>

        {/* Results Cards Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => {
              const isAvailable = book.availability_status === 'Available';
              const isFirstFloor = book.floor.includes('First') || book.floor === '1F';

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Floor & Availability Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span
                        className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                          isFirstFloor
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {book.floor}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isAvailable ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {book.availability_status}
                      </span>
                    </div>

                    {/* Book Title (Prominently Highlighted) */}
                    <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Subject: <strong className="text-slate-700">{book.subject}</strong>
                    </p>

                    {/* Exact Location Box */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs grid grid-cols-2 gap-2.5">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                          Rack
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          {book.rack_number}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                          Rack Category
                        </span>
                        <span className="font-bold text-slate-700 truncate block">
                          {book.rack_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                          Shelf
                        </span>
                        <span className="font-extrabold text-blue-700">
                          Shelf {book.shelf_number}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">
                          Position
                        </span>
                        <span className="font-semibold text-slate-700 truncate block">
                          {book.position}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* VIEW ON MAP BUTTON */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenMap(book)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
                    >
                      <MapPin className="w-4 h-4 text-sky-200" />
                      VIEW ON MAP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">
              No book found matching "{bookName}"
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Please check the spelling or search another book title like "Structural Analysis", "Python", "Data Structures".
            </p>
            <button
              onClick={handleClear}
              className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
            >
              Show All Books
            </button>
          </div>
        )}
      </main>

      {/* 4. FULL-SCREEN INTERACTIVE MAP MODAL */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-6xl h-[92vh] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Indoor Library Navigation System
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sri Vasavi Engineering College • Exact Floor Map Simulation
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseMap}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Master Map Viewer Container */}
            <div className="flex-1 overflow-hidden">
              <InteractiveMapViewer
                selectedBook={mapBook}
                initialFloor={mapBook ? mapBook.floor : 'Ground Floor'}
                onClose={handleCloseMap}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
