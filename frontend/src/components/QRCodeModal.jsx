import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Printer, X, ExternalLink, Globe } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose }) {
  const [targetUrl, setTargetUrl] = useState('https://srivasaviengg-library.edu.in/student');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && targetUrl) {
      QRCode.toDataURL(
        targetUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (err, url) => {
          if (!err) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'SVEC_Library_Entrance_QR.png';
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header with College Colors */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Entrance QR Code</h3>
              <p className="text-xs text-blue-200">Sri Vasavi Engineering College</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-600 text-center mb-4">
            Place this QR code at the Library Entrance turnstiles. Students can scan it on their smartphones to instantly open the Book Finder & Indoor Navigation System.
          </p>

          {/* QR Code Container styled as physical standee badge */}
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-inner flex flex-col items-center mb-5">
            <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Library QR Code" className="w-56 h-56 rounded-lg" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>
            <p className="text-[11px] font-bold text-slate-800 mt-3 uppercase tracking-wider">
              Scan For Indoor Navigation
            </p>
            <p className="text-[10px] text-slate-500">Sri Vasavi Engineering College Library</p>
          </div>

          {/* Target URL configuration */}
          <div className="w-full mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              Hosted Destination URL (Non-Localhost):
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
              placeholder="https://srivasaviengg-library.edu.in/student"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Guaranteed production URL so students' smartphones can reach the portal online.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-colors"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Badge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
