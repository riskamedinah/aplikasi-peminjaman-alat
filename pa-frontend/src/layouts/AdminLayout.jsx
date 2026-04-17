import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Tag, Users, ArrowLeftRight, 
  ScrollText, LogOut, Menu, X, Bell 
} from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'; 
import api from '../services/api';
import { useDataContext } from '../contexts/DataContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Package, label: 'Manajemen Alat', path: '/admin/alat' },
  { icon: Tag, label: 'Manajemen Kategori', path: '/admin/kategori' },
  { icon: ArrowLeftRight, label: 'Peminjaman', path: '/admin/peminjaman' },
  { icon: Users, label: 'Manajemen User', path: '/admin/users' },
  { icon: ScrollText, label: 'Log Aktivitas', path: '/admin/log' },
];

export default function AdminLayout() { // Hapus props pageTitle di sini
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading } = useDataContext();

  // Proteksi Route: Cek apakah token ada di localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Jika tidak ada token, paksa ke halaman login dan ganti history-nya
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Jika token tidak ada, jangan render apa-apa (mencegah user melihat dashboard sekilas)
  if (!localStorage.getItem('token')) return null;

  // LOGIC OTOMATIS: Cari label berdasarkan path yang sedang aktif
  const currentNav = NAV_ITEMS.find(item => location.pathname === item.path);
  const displayTitle = currentNav ? currentNav.label : 'Dashboard';

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const initial = userData.name ? userData.name.charAt(0).toUpperCase() : 'A';

  const handleLogout = async () => {
  try {
    // Pastikan kita kirim tokennya secara manual agar Laravel bisa menghapusnya
    const token = localStorage.getItem('token'); 
    
    await api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Gagal hapus token di server:', error);
  } finally {
    localStorage.clear();
    sessionStorage.clear();

    window.location.replace('/login');
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Sora']">
      
      {/* 1. SIDEBAR (Kode tetap sama) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-60 transition-transform duration-300 border-r border-white/5
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
        style={{
          background: 'linear-gradient(180deg, #1A1F3C 0%, #111427 100%)'
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <img src="/logo-grafika.webp" alt="Logo Sarana Prasarana" className="w-8 h-8 object-contain flex-none" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">Sarana Prasarana</p>
            <p className="text-white/30 text-[10px] font-medium tracking-widest uppercase">Panel Admin</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/30">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/20">Menu Utama</p>
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)} // Tutup sidebar otomatis di mobile saat klik
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${active ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <item.icon size={16} className={active ? 'text-indigo-400' : 'text-white/20'} />
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 pb-4">
          <div className="rounded-xl p-3 flex items-center gap-3 bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-[#3F51B5] flex items-center justify-center text-white text-xs font-bold">{initial}</div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">{userData.name || 'Admin'}</p>
              <p className="text-[10px] text-white/30 truncate">{userData.email || 'admin@example.com'}</p>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-white/30 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:ml-60 w-full">
        
        {/* LOADING OVERLAY */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">Memuat data...</p>
                <p className="text-xs text-gray-500 mt-1">Tunggu sebentar, sistem sedang persiapkan data</p>
              </div>
            </div>
          </div>
        )}
        
        {/* TOPBAR */}
        <header 
          className="sticky top-0 z-40 border-b border-gray-200 px-5 py-3 flex items-center justify-between"
          style={{ background: 'rgba(244, 245, 249, 0.9)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 bg-white border border-gray-200 rounded-lg">
              <Menu size={18} />
            </button>
            
            {/* JUDUL OTOMATIS DI SINI */}
            <h1 className="text-sm font-bold text-gray-800 tracking-tight uppercase">
               {displayTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 border border-gray-200 bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#3F51B5] flex items-center justify-center text-white text-xs font-bold shadow-sm">{initial}</div>
          </div>
        </header>

        <main className="p-6">
          <Outlet /> 
        </main>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-[2px]" />
      )}
    </div>
  );
}