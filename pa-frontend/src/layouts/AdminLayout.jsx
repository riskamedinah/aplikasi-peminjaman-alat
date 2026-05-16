import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Package, Tag, Users, ArrowLeftRight, 
  ScrollText, LogOut, Menu, X, Bell, CheckCheck
} from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAdminNotifications } from '../hooks/useAdminNotifications';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',         path: '/admin/dashboard' },
  { icon: Package,         label: 'Manajemen Alat',    path: '/admin/alat' },
  { icon: Tag,             label: 'Manajemen Kategori',path: '/admin/kategori' },
  { icon: ArrowLeftRight,  label: 'Peminjaman',        path: '/admin/peminjaman' },
  { icon: Users,           label: 'Manajemen User',    path: '/admin/users' },
  { icon: ScrollText,      label: 'Log Aktivitas',     path: '/admin/log' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const bellRef = useRef(null);

const {
  pending, pendingCount, unseenCount,
  open, setOpen, markAllRead, markOneRead, deleteAllRead,
  formatTime, readIds,
} = useAdminNotifications();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setOpen]);

  if (!localStorage.getItem('token')) return null;

  const currentNav = NAV_ITEMS.find(item => location.pathname === item.path);
  const displayTitle = currentNav ? currentNav.label : 'Dashboard';
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const initial = userData.name ? userData.name.charAt(0).toUpperCase() : 'A';

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Sora']">

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 transition-transform duration-300 border-r border-white/5 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: 'linear-gradient(180deg, #1A1F3C 0%, #111427 100%)' }}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <img src="/logo-grafika.webp" alt="Logo" className="w-8 h-8 object-contain flex-none" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">Altera</p>
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
              const isPeminjaman = item.path === '/admin/peminjaman';
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
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
            <button onClick={handleLogout} className="text-white/30 hover:text-red-400 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:ml-60 w-full">
        <header
          className="sticky top-0 z-40 border-b border-gray-200 px-5 py-3 flex items-center justify-between"
          style={{ background: 'rgba(244, 245, 249, 0.9)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 bg-white border border-gray-200 rounded-lg">
              <Menu size={18} />
            </button>
            <h1 className="text-sm font-bold text-gray-800 tracking-tight uppercase">{displayTitle}</h1>
          </div>

          <div className="flex items-center gap-3">

{/* Bell Notifikasi */}
<div ref={bellRef} className="relative">
  <button
    onClick={() => { setOpen(o => !o); }}
    className="relative p-2 border border-gray-200 bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all"
  >
    <Bell size={16} />
    {unseenCount > 0 && (
      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
    )}
  </button>

  {open && (
    <div style={{
      position: 'absolute', top: 48, right: 0,
      width: 360, backgroundColor: '#fff',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid #E8EAF6',
      overflow: 'hidden', zIndex: 200,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>
            Peminjaman Terbaru
          </span>
          {unseenCount > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              backgroundColor: '#EF4444', color: '#fff',
              padding: '2px 7px', borderRadius: 10,
            }}>
              {unseenCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {unseenCount > 0 && (
            <button onClick={markAllRead} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#3F51B5', fontWeight: 600,
            }}>
              <CheckCheck size={14} /> Tandai semua dibaca
            </button>
          )}
          {pending.some(p => readIds.map(Number).includes(Number(p.id))) && (
            <button onClick={deleteAllRead} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#E53935', fontWeight: 600,
            }}>
              Hapus dibaca
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {pending.length === 0 ? (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            color: '#888', fontSize: 13,
          }}>
            <Bell size={28} color="#E0E0E0" style={{ display: 'block', margin: '0 auto 8px' }} />
            <p style={{ margin: 0 }}>Tidak ada peminjaman terbaru</p>
          </div>
        ) : (
          pending.map(p => {
            const isRead = readIds.map(Number).includes(Number(p.id));
            return (
              <div
                key={p.id}
                onClick={() => {
                  markOneRead(p.id);
                  navigate('/admin/peminjaman');
                  setOpen(false);
                }}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #F5F5F5',
                  backgroundColor: isRead ? '#fff' : '#F8F9FF',
                  cursor: 'pointer',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F0F4FF'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = isRead ? '#fff' : '#F8F9FF'}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: isRead ? '#D0D0D0' : '#F57C00',
                  marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: 8,
                  }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: isRead ? 500 : 700,
                      color: '#1A1A2E',
                    }}>
                      {p.user_name}
                    </span>
                    <span style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {formatTime(p.created_at)}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                    {p.keperluan || '-'}
                  </p>
                </div>
                {!isRead && (
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    backgroundColor: '#3F51B5',
                    flexShrink: 0, marginTop: 5,
                  }} />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {pendingCount > 5 && (
        <div
          onClick={() => { setOpen(false); navigate('/admin/peminjaman'); }}
          style={{
            padding: '12px 16px', borderTop: '1px solid #F0F0F0',
            textAlign: 'center', fontSize: 12,
            color: '#3F51B5', fontWeight: 600, cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F5F5'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
        >
          +{pendingCount - 5} pengajuan lainnya
        </div>
      )}
    </div>
  )}
</div>

            <div className="w-8 h-8 rounded-full bg-[#3F51B5] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initial}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-[2px]" />
      )}
    </div>
  );
} 