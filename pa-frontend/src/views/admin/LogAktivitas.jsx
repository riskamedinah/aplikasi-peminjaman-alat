import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
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
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
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
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const LogInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const CheckSquareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
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

// ── Aksi Config ───────────────────────────────────────────────────────────────
const AKSI_CONFIG = {
  create:   { label: 'Create',   bg: '#ECFDF5', color: '#10B981', dot: '#10B981' },
  update:   { label: 'Update',   bg: '#FFF8E1', color: '#F59E0B', dot: '#F59E0B' },
  delete:   { label: 'Delete',   bg: '#FEF2F2', color: '#EF4444', dot: '#EF4444' },
  approve:  { label: 'Approve',  bg: '#E8EAF6', color: '#3F51B5', dot: '#3F51B5' },
  reject:   { label: 'Reject',   bg: '#FFF1F2', color: '#E11D48', dot: '#E11D48' },
  return:   { label: 'Return',   bg: '#F0FDF4', color: '#16A34A', dot: '#16A34A' },
};

const AksiBadge = ({ aksi }) => {
  const cfg = AKSI_CONFIG[aksi] ?? { label: aksi, bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' };
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

// ── Role Config ───────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin:    { label: 'Admin',    bg: '#FEF3C7', color: '#D97706' },
  petugas:  { label: 'Petugas',  bg: '#E8EAF6', color: '#3F51B5' },
  peminjam: { label: 'Peminjam', bg: '#ECFDF5', color: '#10B981' },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] ?? { label: role, bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-none"
      style={{ background: accent + '18', color: accent }}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5 leading-none">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

// ── Export Dropdown ───────────────────────────────────────────────────────────
const ExportDropdown = ({ onExport, loading }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-none">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
      >
        {loading ? <Spinner /> : <DownloadIcon />}
        Export
        <ChevronDownIcon />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => { setOpen(false); onExport('excel'); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
            >
              <span className="w-6 h-6 rounded-md bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-none">XLS</span>
              Export Excel
            </button>
            <button
              onClick={() => { setOpen(false); onExport('pdf'); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
            >
              <span className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-none">PDF</span>
              Export PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// avatar color
const AVATAR_COLORS = ['#3F51B5', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'];
const avatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '—';

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[4, 20, 12, 10, 40, 12, 8].map((w, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 bg-gray-100 rounded-lg" style={{ width: `${w}%` }} />
      </td>
    ))}
  </tr>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilter }) => (
  <tr>
    <td colSpan={7} className="py-16 text-center">
      <div className="inline-flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
          <ActivityIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            {hasFilter ? 'Tidak ada log yang cocok' : 'Belum ada aktivitas tercatat'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {hasFilter ? 'Coba ubah filter atau kata kunci pencarian' : 'Aktivitas pengguna akan muncul di sini'}
          </p>
        </div>
      </div>
    </td>
  </tr>
);

// ── Detail Modal ──────────────────────────────────────────────────────────────
const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <ActivityIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Detail Aktivitas</h2>
              <p className="text-xs text-gray-400">Log ID: #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Aksi</span>
            <AksiBadge aksi={item.aksi} />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Pengguna</p>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-none text-xs font-bold text-white"
                style={{ background: avatarColor(item.user?.name) }}
              >
                {item.user?.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.user?.name}</p>
                <p className="text-xs text-gray-400">{item.user?.email}</p>
              </div>
              <div className="ml-auto">
                <RoleBadge role={item.user?.role} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Keterangan</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">
              {item.keterangan || '—'}
            </p>
          </div>

          {item.peminjaman && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Peminjaman Terkait</p>
              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">ID #{item.peminjaman.id}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#E8EAF6', color: '#3F51B5' }}>
                  {item.peminjaman.status}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Tanggal</p>
              <p className="text-sm font-medium text-gray-700">{fmt(item.created_at)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Waktu</p>
              <p className="text-sm font-medium text-gray-700">{fmtTime(item.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function LogAktivitas() {
  const [logList, setLogList] = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Quick stats derived from full total + current page data
  const [statsByAksi, setStatsByAksi] = useState({});

  // filters
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]           = useState('');
  const [filterRole, setFilterRole]   = useState('');
  const [filterAksi, setFilterAksi]   = useState('');
  const [tanggalFrom, setTanggalFrom] = useState('');
  const [tanggalTo, setTanggalTo]     = useState('');
  const [page, setPage]               = useState(1);

  // modal
  const [detailItem, setDetailItem] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  // Get user data for role-based UI
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

  // ── Fetch Logs ─────────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort_by: 'created_at', sort_order: 'desc' };
      if (search)      params.search = search;
      if (filterRole)  params['filter[role]'] = filterRole;
      if (filterAksi)  params['filter[aksi]'] = filterAksi;
      if (tanggalFrom) params['filter[tanggal_from]'] = tanggalFrom;
      if (tanggalTo)   params['filter[tanggal_to]'] = tanggalTo;

      const res = await api.get('/logs', { params });
      const data = res.data.data ?? [];
      setLogList(data);
      setMeta(res.data.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 });

      // Compute quick stat counts from current page data
      const byAksi = {};
      data.forEach(log => {
        const a = log.aksi ?? 'unknown';
        byAksi[a] = (byAksi[a] ?? 0) + 1;
      });
      setStatsByAksi(byAksi);
    } catch {
      showToast('Gagal memuat data log aktivitas.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRole, filterAksi, tanggalFrom, tanggalTo, showToast]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { setPage(1); }, [search, filterRole, filterAksi, tanggalFrom, tanggalTo]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async (format) => {
    setExportLoading(true);
    try {
      const params = { format, sort_by: 'created_at', sort_order: 'desc' };
      if (search)      params.search = search;
      if (filterRole)  params['filter[role]'] = filterRole;
      if (filterAksi)  params['filter[aksi]'] = filterAksi;
      if (tanggalFrom) params['filter[tanggal_from]'] = tanggalFrom;
      if (tanggalTo)   params['filter[tanggal_to]'] = tanggalTo;

      const res = await api.get('/logs/export', { params, responseType: 'blob' });

      const ext  = format === 'excel' ? 'xlsx' : 'pdf';
      const mime = format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
      const url  = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `log-aktivitas.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Export ${format.toUpperCase()} berhasil diunduh.`);
    } catch {
      showToast('Gagal mengekspor data.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasFilter   = !!(search || filterRole || filterAksi || tanggalFrom || tanggalTo);
  const totalPages  = meta.last_page ?? 1;
  const currentPage = meta.current_page ?? 1;

  const resetFilters = () => {
    setSearchInput(''); setSearch('');
    setFilterRole(''); setFilterAksi('');
    setTanggalFrom(''); setTanggalTo('');
    setPage(1);
  };

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

  const selectClass = 'py-2.5 px-3 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50 text-gray-600';

  const tableHeaders = ['No', 'Pengguna', 'Aksi', 'Role', 'Keterangan', 'Waktu', 'Detail'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Detail Modal */}
      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Log Aktivitas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Rekam jejak seluruh aktivitas pengguna dalam sistem</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total Log"
          value={(meta.total ?? 0).toLocaleString('id-ID')}
          icon={<ActivityIcon />}
          accent="#3F51B5"
          sub="Semua aktivitas"
        />
        <StatCard
          label="Perubahan Data"
          value={(statsByAksi.create ?? 0) + (statsByAksi.update ?? 0) + (statsByAksi.delete ?? 0)}
          icon={<EditIcon />}
          accent="#F59E0B"
          sub="Tambah/Ubah/Hapus"
        />
        <StatCard
          label="Aksi Peminjaman"
          value={(statsByAksi.approve ?? 0) + (statsByAksi.reject ?? 0) + (statsByAksi.return ?? 0)}
          icon={<CheckSquareIcon />}
          accent="#10B981"
          sub="Approve / Reject / Return"
        />
        <StatCard
          label="Petugas"
          value={logList.filter(l => l.user?.role === 'petugas').length}
          icon={<UsersIcon />}
          accent="#3F51B5"
          sub="Aktivitas petugas"
        />
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
              placeholder="Cari aksi, keterangan, atau nama pengguna..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50"
            />
          </div>

          {/* Filter Role */}
          {userData.role === 'admin' && (
            <div className="flex items-center gap-2 sm:w-44">
              <div className="text-gray-400 flex-none"><FilterIcon /></div>
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className={`flex-1 ${selectClass}`}
              >
                <option value="">Semua Role</option>
                {Object.entries(ROLE_CONFIG).map(([val, { label }]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Aksi */}
          <div className="sm:w-44">
            <select
              value={filterAksi}
              onChange={e => setFilterAksi(e.target.value)}
              className={`w-full ${selectClass}`}
            >
              <option value="">Semua Aksi</option>
              {Object.entries(AKSI_CONFIG).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Export */}
          <ExportDropdown onExport={handleExport} loading={exportLoading} />
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarIcon />
            <span>Rentang tanggal:</span>
          </div>
          <input
            type="date"
            value={tanggalFrom}
            onChange={e => setTanggalFrom(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 text-gray-600"
          />
          <span className="text-xs text-gray-400">s/d</span>
          <input
            type="date"
            value={tanggalTo}
            min={tanggalFrom}
            onChange={e => setTanggalTo(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 text-gray-600"
          />
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
            {filterAksi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {AKSI_CONFIG[filterAksi]?.label}
                <button onClick={() => setFilterAksi('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            {(tanggalFrom || tanggalTo) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {tanggalFrom || '...'} → {tanggalTo || '...'}
                <button onClick={() => { setTanggalFrom(''); setTanggalTo(''); }} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1">
              Reset semua
            </button>
          </div>
        )}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Riwayat Aktivitas</h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                Total <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> log ditemukan
              </p>
            )}
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Spinner /> Memuat...
            </div>
          )}
        </div>

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
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : logList.length === 0
                  ? <EmptyState hasFilter={hasFilter} />
                  : logList.map((log, idx) => {
                    const no = (currentPage - 1) * (meta.per_page ?? 10) + idx + 1;
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">

                        <td className="px-4 py-3.5 text-gray-400 text-xs font-mono w-10">{no}</td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-none text-xs font-bold text-white"
                              style={{ background: avatarColor(log.user?.name) }}
                            >
                              {log.user?.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <span className="font-medium text-gray-800 text-sm whitespace-nowrap">{log.user?.name}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <AksiBadge aksi={log.aksi} />
                        </td>

                        <td className="px-4 py-3.5">
                          <RoleBadge role={log.user?.role} />
                        </td>

                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="text-xs text-gray-500 truncate">{log.keterangan}</p>
                          {log.peminjaman && (
                            <span className="text-xs text-gray-400">Peminjaman #{log.peminjaman.id}</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="text-xs text-gray-500">{fmt(log.created_at)}</p>
                          <p className="text-xs text-gray-400">{fmtTime(log.created_at)}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => setDetailItem(log)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#3F51B5]/10 text-[#3F51B5] opacity-70 group-hover:opacity-100"
                          >
                            <EyeIcon /> Lihat
                          </button>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 gap-3">
            <p className="text-xs text-gray-400">
              Menampilkan{' '}
              <span className="font-semibold text-gray-600">{((currentPage - 1) * (meta.per_page ?? 10)) + 1}</span>–
              <span className="font-semibold text-gray-600">{Math.min(currentPage * (meta.per_page ?? 10), meta.total ?? 0)}</span>{' '}dari{' '}
              <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> log
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

export default LogAktivitas;