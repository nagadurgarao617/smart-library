import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudentPortal from './pages/StudentPortal';
import StaffPortal from './pages/StaffPortal';
import QRCodeModal from './components/QRCodeModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [staffUser, setStaffUser] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Check if staff token exists
    const token = localStorage.getItem('svec_staff_token');
    if (token) {
      api.getProfile()
        .then(res => setStaffUser(res.staff))
        .catch(() => {
          localStorage.removeItem('svec_staff_token');
          setStaffUser(null);
        });
    }

    // Load library metrics
    api.getStats()
      .then(res => setStats(res))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQr={() => setIsQrModalOpen(true)}
        staffUser={staffUser}
      />

      {/* Main Page Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <HomePage
            onNavigateToStudent={() => setActiveTab('student')}
            onNavigateToStaff={() => setActiveTab('staff')}
            onOpenQr={() => setIsQrModalOpen(true)}
            stats={stats}
          />
        )}

        {activeTab === 'student' && <StudentPortal />}

        {activeTab === 'staff' && (
          <StaffPortal
            staffUser={staffUser}
            setStaffUser={setStaffUser}
          />
        )}
      </div>

      {/* Entrance QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
}
