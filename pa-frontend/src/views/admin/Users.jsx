import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api';

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ size = 'sm' }) => (
  <svg className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium"
      style={{ background: type === 'success' ? '#3F51B5' : '#ef4444', color: '#fff', minWidth: 280 }}
    >
      <span className="flex-none">{type === 'success' ? <CheckIcon /> : <AlertIcon />}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity"><XIcon /></button>
    </div>
  );
};

// ── Role Config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin:    { label: 'Admin',    bg: '#FEF3C7', color: '#D97706', dot: '#D97706' },
  petugas:  { label: 'Petugas',  bg: '#E8EAF6', color: '#3F51B5', dot: '#3F51B5' },
  peminjam: { label: 'Peminjam', bg: '#ECFDF5', color: '#10B981', dot: '#10B981' },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] ?? { label: role, bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-none" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

const AVATAR_COLORS = ['#3F51B5', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'];
const avatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[4, 22, 26, 12, 14, 12].map((w, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 bg-gray-100 rounded-lg" style={{ width: `${w}%` }} />
      </td>
    ))}
  </tr>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilter }) => (
  <tr>
    <td colSpan={6} className="py-16 text-center">
      <div className="inline-flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
          <UserIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            {hasFilter ? 'Tidak ada pengguna yang cocok' : 'Belum ada data pengguna'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {hasFilter ? 'Coba ubah kata kunci atau filter role' : 'Tambah pengguna pertama dengan klik tombol di atas'}
          </p>
        </div>
      </div>
    </td>
  </tr>
);

// ── Delete Modal ──────────────────────────────────────────────────────────────
const DeleteModal = ({ user, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <AlertIcon />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Hapus Pengguna?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Pengguna <span className="font-semibold text-gray-800">"{user?.name}"</span> akan
          dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
      <div className="flex gap-3 px-6 pb-6">
        <button onClick={onCancel} disabled={loading}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Batal
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Spinner />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

// ── User Modal (Add / Edit) ───────────────────────────────────────────────────
const UserModal = ({ mode, initialData, onSave, onClose }) => {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({
    name:                  isEdit ? (initialData?.name  ?? '') : '',
    email:                 isEdit ? (initialData?.email ?? '') : '',
    role:                  isEdit ? (initialData?.role  ?? 'peminjam') : 'peminjam',
    password:              '',
    password_confirmation: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null, general: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim())  errs.name  = ['Nama wajib diisi'];
    if (!form.email.trim()) errs.email = ['Email wajib diisi'];
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = ['Format email tidak valid'];
    if (!isEdit) {
      if (!form.password) errs.password = ['Password wajib diisi'];
      else if (form.password.length < 8) errs.password = ['Minimal 8 karakter'];
      if (form.password !== form.password_confirmation)
        errs.password_confirmation = ['Konfirmasi password tidak cocok'];
    } else if (form.password) {
      if (form.password.length < 8) errs.password = ['Minimal 8 karakter'];
      if (form.password !== form.password_confirmation)
        errs.password_confirmation = ['Konfirmasi password tidak cocok'];
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (!isEdit || form.password) {
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      if (isEdit) {
        await api.put(`/users/${initialData.id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      onSave(isEdit ? 'Pengguna berhasil diperbarui' : 'Pengguna berhasil ditambahkan');
    } catch (err) {
      if (err.response?.status === 422 || err.response?.status === 400) {
        setErrors(err.response.data.errors ?? {});
      } else {
        setErrors({ general: err.response?.data?.message ?? 'Terjadi kesalahan server.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase   = 'w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all';
  const inputNormal = `${inputBase} border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10`;
  const inputError  = `${inputBase} border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100`;
  const inp = (k) => errors[k] ? inputError : inputNormal;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <UserIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">
                {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <p className="text-xs text-gray-400">
                {isEdit ? `ID: ${initialData?.id}` : 'Isi data pengguna dengan lengkap'}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {errors.general}
            </div>
          )}

          {/* Nama */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nama Lengkap *</label>
            <input className={inp('name')} value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Contoh: Budi Santoso" autoFocus />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email *</label>
            <input type="email" className={inp('email')} value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="contoh@email.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role *</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLE_CONFIG).map(([val, { label, color, bg }]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('role', val)}
                  className="py-2.5 rounded-xl text-xs font-semibold border-2 transition-all"
                  style={form.role === val
                    ? { borderColor: color, background: bg, color }
                    : { borderColor: '#E5E7EB', background: '#fff', color: '#9CA3AF' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Password {isEdit && <span className="normal-case font-normal text-gray-400">(kosongkan jika tidak diubah)</span>}
              {!isEdit && '*'}
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className={inp('password')}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder={isEdit ? '••••••••' : 'Min. 8 karakter'}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeIcon />
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
          </div>

          {/* Konfirmasi Password */}
          {(!isEdit || form.password) && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Konfirmasi Password {!isEdit && '*'}
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                className={inp('password_confirmation')}
                value={form.password_confirmation}
                onChange={e => set('password_confirmation', e.target.value)}
                placeholder="Ulangi password"
              />
              {errors.password_confirmation && (
                <p className="text-xs text-red-500 mt-1">{errors.password_confirmation[0]}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#3F51B5' }}>
            {loading && <Spinner />}
            {isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function Users() {
  const [userList, setUserList] = useState([]);
  const [meta, setMeta]         = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading]   = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');
  const [filterRole, setFilterRole]   = useState('');
  const [page, setPage]               = useState(1);

  const [modal, setModal]                 = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  // ── Cache ref: hanya load data sekali di awal
  const hasLoadedOnce = useRef(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort_by: 'created_at', sort_order: 'desc' };
      if (search)     params.search = search;
      if (filterRole) params['filter[role]'] = filterRole;

      const res = await api.get('/users', { params });
      setUserList(res.data.data ?? []);
      setMeta(res.data.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 });
    } catch {
      showToast('Gagal memuat data pengguna.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRole, showToast]);

  // ── Load data hanya di awal pertama kali component mount
  useEffect(() => {
    if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      fetchUsers();
    }
  }, []);

  // ── Refetch saat search/filter/pagination berubah
  useEffect(() => {
    if (hasLoadedOnce.current) {
      fetchUsers();
    }
  }, [page, search, filterRole, fetchUsers]);

  useEffect(() => { setPage(1); }, [search, filterRole]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      showToast('Pengguna berhasil dihapus.');
      fetchUsers();
    } catch (err) {
      setDeleteTarget(null);
      showToast(err.response?.data?.message ?? 'Gagal menghapus pengguna.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasFilter   = !!(search || filterRole);
  const totalPages  = meta.last_page ?? 1;
  const currentPage = meta.current_page ?? 1;

  const pageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left  = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);
    if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  const tableHeaders = ['No', 'Pengguna', 'Email', 'Role', 'Terdaftar', 'Aksi'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      {modal && (
        <UserModal
          mode={modal.mode}
          initialData={modal.data}
          onClose={() => setModal(null)}
          onSave={(msg) => { setModal(null); showToast(msg); fetchUsers(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola akun pengguna yang terdaftar dalam sistem</p>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50"
            />
          </div>

          {/* Filter Role — konsisten dengan halaman lain */}
          <div className="flex items-center gap-2 sm:w-44">
            <div className="text-gray-400 flex-none"><FilterIcon /></div>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="flex-1 py-2.5 px-3 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50 text-gray-600"
            >
              <option value="">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="petugas">Petugas</option>
              <option value="peminjam">Peminjam</option>
            </select>
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 flex-none"
            style={{ background: '#3F51B5' }}
          >
            <PlusIcon />
            Tambah Pengguna
          </button>
        </div>

        {/* Active filter chips */}
        {hasFilter && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400">Filter aktif:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                "{search}"
                <button onClick={() => { setSearch(''); setSearchInput(''); }} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            {filterRole && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {ROLE_CONFIG[filterRole]?.label}
                <button onClick={() => setFilterRole('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setFilterRole(''); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
            >
              Reset semua
            </button>
          </div>
        )}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Table Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Daftar Pengguna</h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                Total <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> pengguna ditemukan
              </p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {tableHeaders.map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : userList.length === 0
                  ? <EmptyState hasFilter={hasFilter} />
                  : userList.map((user, idx) => {
                    const no = (currentPage - 1) * (meta.per_page ?? 10) + idx + 1;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">

                        {/* No */}
                        <td className="px-4 py-3.5 text-gray-400 text-xs font-mono w-10">{no}</td>

                        {/* Pengguna */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-none text-xs font-bold text-white"
                              style={{ background: avatarColor(user.name) }}
                            >
                              {user.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-gray-500">{user.email}</span>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          <RoleBadge role={user.role} />
                        </td>

                        {/* Terdaftar */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs text-gray-400">{fmt(user.created_at)}</span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setModal({ mode: 'edit', data: user })}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#3F51B5]/10 text-[#3F51B5]"
                            >
                              <EditIcon /> Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(user)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-50 text-red-500"
                            >
                              <TrashIcon /> Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && userList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 gap-3">
            <p className="text-xs text-gray-400">
              Menampilkan{' '}
              <span className="font-semibold text-gray-600">
                {((currentPage - 1) * (meta.per_page ?? 10)) + 1}
              </span>–
              <span className="font-semibold text-gray-600">
                {Math.min(currentPage * (meta.per_page ?? 10), meta.total ?? 0)}
              </span>{' '}dari{' '}
              <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> pengguna
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeftIcon />
              </button>

              {pageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                    style={p === currentPage
                      ? { background: '#3F51B5', color: '#fff' }
                      : { color: '#6b7280' }
                    }
                    onMouseEnter={e => { if (p !== currentPage) e.currentTarget.style.background = '#f3f4f6'; }}
                    onMouseLeave={e => { if (p !== currentPage) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;