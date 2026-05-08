import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../services/api';
import { useNotifications } from '../hooks/useNotifications';

const TIPE_CONFIG = {
  menunggu:     { color: '#F57C00', bg: '#FFF3E0' },
  disetujui:    { color: '#1565C0', bg: '#E3F2FD' },
  dipinjam:     { color: '#2E7D32', bg: '#E8F5E9' },
  dikembalikan: { color: '#555',    bg: '#F5F5F5' },
  ditolak:      { color: '#C62828', bg: '#FFEBEE' },
  dibatalkan:   { color: '#888',    bg: '#F5F5F5' },
  deadline:     { color: '#F59E0B', bg: '#FEF3C7' },
};

export default function PeminjamLayout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userName = userData.name || 'Peminjam';
  const { notifications, unreadCount, open, setOpen, markAllRead, markOneRead } = useNotifications();
  const bellRef = useRef(null);
  const menuRef = useRef(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setOpen]);

  const handleLogout = async () => {
    try { await api.post('/logout'); } catch (_) {}
    localStorage.clear();
    navigate('/login');
  };

  const formatTime = (str) => {
    if (!str) return '';
    const d = new Date(str);
    const diff = Math.floor((new Date() - d) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <nav style={{
        backgroundColor: '#1A1F3C',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-grafika.webp" alt="Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>
              Sarana Prasarana
            </span>
          </div>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { to: '/peminjam/katalog', label: 'Katalog Alat' },
              { to: '/peminjam/riwayat', label: 'Riwayat Pinjam' },
            ].map(({ to, label }) => (
              <NavLink key={to} to={to} style={({ isActive }) => ({
                color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none', padding: '8px 16px', borderRadius: 8,
                fontSize: 14, fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'all 0.15s',
              })}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right: Bell + User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            {/* Bell */}
            <div ref={bellRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpen(o => !o)}
                style={{
                  position: 'relative',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10, width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 7, right: 7,
                    width: 7, height: 7, borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    border: '1.5px solid #1A1F3C',
                  }} />
                )}
              </button>

              {/* Dropdown Notifikasi */}
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
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>Notifikasi</span>
                      {unreadCount > 0 && (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          backgroundColor: '#EF4444', color: '#fff',
                          padding: '2px 7px', borderRadius: 10,
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 12, color: '#3F51B5', fontWeight: 600,
                      }}>
                        <CheckCheck size={14} /> Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '40px 20px', textAlign: 'center',
                        color: '#888', fontSize: 13,
                      }}>
                        <Bell size={28} color="#E0E0E0" style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                        <p style={{ margin: 0 }}>Belum ada notifikasi</p>
                      </div>
                    ) : (
                      notifications.map(n => {
                        const cfg = TIPE_CONFIG[n.tipe] ?? { color: '#888', bg: '#F5F5F5' };
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (!n.is_read) markOneRead(n.id);
                              if (n.peminjaman_id) navigate('/peminjam/riwayat');
                              setOpen(false);
                            }}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid #F5F5F5',
                              backgroundColor: n.is_read ? '#fff' : '#F8F9FF',
                              cursor: 'pointer',
                              display: 'flex', gap: 12, alignItems: 'flex-start',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F0F4FF'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = n.is_read ? '#fff' : '#F8F9FF'}
                          >
                            {/* Tipe dot */}
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%',
                              backgroundColor: cfg.color,
                              marginTop: 5, flexShrink: 0,
                            }} />

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'flex-start', gap: 8,
                              }}>
                                <span style={{
                                  fontSize: 13,
                                  fontWeight: n.is_read ? 500 : 700,
                                  color: '#1A1A2E',
                                }}>
                                  {n.judul}
                                </span>
                                <span style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  {formatTime(n.created_at)}
                                </span>
                              </div>
                              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                                {n.pesan}
                              </p>
                            </div>

                            {/* Unread indicator */}
                            {!n.is_read && (
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
                </div>
              )}
            </div>

            {/* User Menu */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, padding: '6px 12px',
                  cursor: 'pointer', color: '#fff', fontSize: 14,
                }}
              >
                <div style={{
                  width: 28, height: 28, backgroundColor: '#3F51B5',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 700,
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span>{userName}</span>
                <span style={{ fontSize: 10, opacity: 0.8 }}>▼</span>
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 48, right: 0,
                  backgroundColor: '#fff', borderRadius: 12,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  minWidth: 160, overflow: 'hidden',
                  border: '1px solid #E8EAF6',
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8EAF6' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{userName}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Peminjam</div>
                  </div>
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '12px 16px',
                    background: 'none', border: 'none',
                    textAlign: 'left', cursor: 'pointer',
                    fontSize: 14, color: '#E53935', fontWeight: 500,
                  }}>
                    Keluar
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Outlet />
      </main>

      <footer style={{
        textAlign: 'center', padding: '24px',
        color: '#9E9E9E', fontSize: 13,
        borderTop: '1px solid #E8EAF6', marginTop: 48,
      }}>
        © 2026 Sarana Prasarana — SMKN 4 Malang
      </footer>
    </div>
  );
}