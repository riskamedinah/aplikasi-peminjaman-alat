import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api';
import { useLocation } from 'react-router-dom';
import { useDataContext } from '../../contexts/DataContext';

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
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
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
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
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
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
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
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
      style={{ background: type === 'success' ? '#10B981' : '#ef4444', color: '#fff', minWidth: 280 }}
    >
      <span className="flex-none">{type === 'success' ? <CheckIcon /> : <AlertIcon />}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity"><XIcon /></button>
    </div>
  );
};

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  menunggu:     { label: 'Menunggu',     bg: '#FFF8E1', color: '#F59E0B', dot: '#F59E0B' },
  disetujui:    { label: 'Disetujui',    bg: '#E8EAF6', color: '#3F51B5', dot: '#3F51B5' },
  ditolak:      { label: 'Ditolak',      bg: '#FEF2F2', color: '#EF4444', dot: '#EF4444' },
  dipinjam:     { label: 'Dipinjam',     bg: '#EDE9FE', color: '#7C3AED', dot: '#7C3AED' },
  dikembalikan: { label: 'Dikembalikan', bg: '#ECFDF5', color: '#10B981', dot: '#10B981' },
};

// Status transitions yang diizinkan untuk petugas
const STATUS_TRANSITIONS = {
  menunggu:     ['disetujui', 'ditolak'],
  disetujui:    ['dipinjam', 'ditolak'],
  ditolak:      [],
  dipinjam:     ['dikembalikan'],
  dikembalikan: [],
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? { label: status, bg: '#F3F4F6', color: '#6B7280', dot: '#9CA3AF' };
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
    {[4, 18, 22, 12, 12, 10, 8].map((w, i) => (
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
          <ClipboardIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            {hasFilter ? 'Tidak ada peminjaman yang cocok' : 'Belum ada data peminjaman'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {hasFilter ? 'Coba ubah filter atau kata kunci pencarian' : 'Data peminjaman akan muncul di sini'}
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <ClipboardIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Detail Peminjaman</h2>
              <p className="text-xs text-gray-400">ID: #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
            <StatusBadge status={item.status} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Peminjam',        value: item.user?.name },
              { label: 'Email',           value: item.user?.email },
              { label: 'Tgl Pinjam',      value: fmt(item.tanggal_pinjam) },
              { label: 'Rencana Kembali', value: fmt(item.tanggal_kembali_rencana) },
              { label: 'Aktual Kembali',  value: fmt(item.tanggal_kembali_actual) },
              { label: 'Petugas',         value: item.petugas_approval?.name ?? '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-700 break-all">{value || '—'}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Keperluan</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{item.keperluan || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Daftar Alat</p>
            <div className="space-y-2">
              {item.details?.map(d => (
                <div key={d.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{d.alat?.nama_alat}</p>
                    <p className="text-xs text-gray-400">{d.alat?.kode_alat}</p>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#3F51B5' }}>×{d.jumlah}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Approval / Status Change Modal ────────────────────────────────────────────
const ApprovalModal = ({ item, onClose, onSaved, currentUser }) => {
  const transitions = STATUS_TRANSITIONS[item?.status] ?? [];
  const [newStatus, setNewStatus] = useState(transitions[0] ?? '');
  const [tanggalKembaliActual, setTanggalKembaliActual] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!newStatus) return;
    if (newStatus === 'dikembalikan' && !tanggalKembaliActual) {
      setError('Tanggal kembali aktual wajib diisi saat mengembalikan alat.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.put(`/petugas/peminjaman/${item.id}`, {
        user_id: item.user?.id,
        tanggal_pinjam: item.tanggal_pinjam,
        tanggal_kembali_rencana: item.tanggal_kembali_rencana,
        ...(newStatus === 'dikembalikan' ? { tanggal_kembali_actual: tanggalKembaliActual } : {}),
        status: newStatus,
        keperluan: item.keperluan,
        details: item.details?.map(d => ({ alat_id: d.alat?.id, jumlah: d.jumlah })) ?? [],
      });
      onSaved(`Status berhasil diubah ke "${STATUS_CONFIG[newStatus]?.label}"`);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  const statusColors = {
    disetujui:    { bg: '#10B981', hover: '#059669' },
    ditolak:      { bg: '#EF4444', hover: '#DC2626' },
    dipinjam:     { bg: '#7C3AED', hover: '#6D28D9' },
    dikembalikan: { bg: '#3F51B5', hover: '#3949AB' },
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <ShieldCheckIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Update Status</h2>
              <p className="text-xs text-gray-400">Peminjaman #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <XIcon />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Current status */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Status Sekarang</p>
              <StatusBadge status={item.status} />
            </div>
            <ArrowRightIcon />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Ubah ke</p>
              {newStatus ? <StatusBadge status={newStatus} /> : <span className="text-xs text-gray-400">—</span>}
            </div>
          </div>

          {/* Target status buttons */}
          {transitions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pilih Status Baru</p>
              <div className="flex flex-col gap-2">
                {transitions.map(s => (
                  <button
                    key={s}
                    onClick={() => setNewStatus(s)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                    style={{
                      borderColor: newStatus === s ? (statusColors[s]?.bg ?? '#3F51B5') : '#E5E7EB',
                      background: newStatus === s ? (statusColors[s]?.bg + '15') : 'white',
                      color: newStatus === s ? (statusColors[s]?.bg ?? '#3F51B5') : '#6B7280',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: STATUS_CONFIG[s]?.dot }} />
                    {STATUS_CONFIG[s]?.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-50 text-center text-sm text-gray-500">
              Status ini sudah final dan tidak dapat diubah.
            </div>
          )}

          {/* Tanggal kembali aktual jika dikembalikan */}
          {newStatus === 'dikembalikan' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Tanggal Kembali Aktual *
              </label>
              <input
                type="date"
                value={tanggalKembaliActual}
                onChange={e => setTanggalKembaliActual(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 outline-none"
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          {transitions.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading || !newStatus}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: statusColors[newStatus]?.bg ?? '#3F51B5' }}
            >
              {loading && <Spinner />}
              Konfirmasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Edit Modal (Petugas version — only for 'menunggu') ─────────────────────────
const EditModal = ({ item, onClose, onSaved }) => {
  const [form, setForm] = useState({
    user_id:                 item?.user?.id ?? '',
    tanggal_pinjam:          item?.tanggal_pinjam ?? '',
    tanggal_kembali_rencana: item?.tanggal_kembali_rencana ?? '',
    status:                  item?.status ?? 'menunggu',
    keperluan:               item?.keperluan ?? '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null, general: null }));
  };

  const [details, setDetails] = useState(() => {
    if (!item?.details) return [];
    return item.details.map(d => ({ alat_id: d.alat?.id, jumlah: d.jumlah, alat: d.alat }));
  });
  const [selectedAlat, setSelectedAlat] = useState('');
  const [selectedJumlah, setSelectedJumlah] = useState('1');
  const [alats, setAlats] = useState([]);

  useEffect(() => {
    api.get('/alat', { params: { limit: 100 } })
      .then(res => setAlats(res.data.data ?? []))
      .catch(() => {});
  }, []);

  const addDetail = () => {
    if (!selectedAlat) return;
    const alatObj = alats.find(a => a.id === parseInt(selectedAlat));
    if (!alatObj) return;
    if (details.some(d => d.alat_id === parseInt(selectedAlat))) {
      alert('Alat sudah ditambahkan'); return;
    }
    setDetails([...details, { alat_id: parseInt(selectedAlat), jumlah: parseInt(selectedJumlah), alat: alatObj }]);
    setSelectedAlat(''); setSelectedJumlah('1');
  };

  const removeDetail = idx => setDetails(details.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    setLoading(true); setErrors({});
    try {
      await api.put(`/petugas/peminjaman/${item.id}`, {
        ...form,
        details: details.map(d => ({ alat_id: d.alat_id, jumlah: d.jumlah })),
      });
      onSaved('Peminjaman berhasil diperbarui');
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
  const inp = k => errors[k] ? inputError : inputNormal;

  if (!item) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <EditIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Edit Peminjaman</h2>
              <p className="text-xs text-gray-400">ID: #{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {errors.general}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tanggal Pinjam</label>
            <input type="date" className={inp('tanggal_pinjam')} value={form.tanggal_pinjam} onChange={e => set('tanggal_pinjam', e.target.value)} />
            {errors.tanggal_pinjam && <p className="text-xs text-red-500 mt-1">{errors.tanggal_pinjam[0]}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Rencana Kembali</label>
            <input type="date" className={inp('tanggal_kembali_rencana')} value={form.tanggal_kembali_rencana} onChange={e => set('tanggal_kembali_rencana', e.target.value)} />
            {errors.tanggal_kembali_rencana && <p className="text-xs text-red-500 mt-1">{errors.tanggal_kembali_rencana[0]}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Keperluan</label>
            <textarea rows={3} className={inp('keperluan')} value={form.keperluan} onChange={e => set('keperluan', e.target.value)} placeholder="Keperluan peminjaman..." />
            {errors.keperluan && <p className="text-xs text-red-500 mt-1">{errors.keperluan[0]}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Alat Dipinjam</label>
            <div className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
              <div className="grid grid-cols-3 gap-2">
                <select value={selectedAlat} onChange={e => setSelectedAlat(e.target.value)}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5] bg-white">
                  <option value="">Pilih Alat</option>
                  {alats.map(a => (
                    <option key={a.id} value={a.id} disabled={details.some(d => d.alat_id === a.id)}>
                      {a.nama_alat} (Stok: {a.stok_total})
                    </option>
                  ))}
                </select>
                <input type="number" min="1"
                  max={alats.find(a => a.id === parseInt(selectedAlat))?.stok_total || 1}
                  value={selectedJumlah}
                  onChange={e => setSelectedJumlah(Math.min(parseInt(e.target.value) || 1, alats.find(a => a.id === parseInt(selectedAlat))?.stok_total || 1))}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5]"
                />
                <button type="button" onClick={addDetail}
                  className="px-3 py-2 text-sm font-medium rounded-xl text-white flex items-center justify-center gap-1.5"
                  style={{ background: '#3F51B5' }}>
                  <PlusIcon /> Tambah
                </button>
              </div>
            </div>
            {details.length > 0 ? (
              <div className="space-y-2">
                {details.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{d.alat?.nama_alat}</p>
                      <p className="text-xs text-gray-400">{d.alat?.kode_alat}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="number" min="1" max={d.alat?.stok_total}
                        value={d.jumlah}
                        onChange={e => {
                          const v = Math.min(Math.max(parseInt(e.target.value) || 1, 1), d.alat?.stok_total || 1);
                          const nd = [...details]; nd[idx].jumlah = v; setDetails(nd);
                        }}
                        className="w-20 px-2 py-1 text-sm rounded-lg border border-gray-200 text-center"
                      />
                      <button type="button" onClick={() => removeDetail(idx)}
                        className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        ✕ Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
                Belum ada alat. Pilih alat di atas untuk menambahkan.
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#3F51B5' }}>
            {loading && <Spinner />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Add Peminjaman Modal ───────────────────────────────────────────────────────
const AddPeminjamanModal = ({ users, alats, currentUser, onClose, onSaved }) => {
  const [form, setForm] = useState({
    user_id: '', tanggal_pinjam: '', tanggal_kembali_rencana: '', status: 'menunggu', keperluan: '',
  });
  const [details, setDetails] = useState([]);
  const [selectedAlat, setSelectedAlat] = useState('');
  const [selectedJumlah, setSelectedJumlah] = useState('1');
  const [searchPeminjam, setSearchPeminjam] = useState('');
  const [peminjamDropdownOpen, setPeminjamDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null, general: null })); };

  const selectedPeminjam = users.find(u => u.id === parseInt(form.user_id));
  const peminjamanList = users.filter(u =>
    u.role === 'peminjam' &&
    (searchPeminjam === '' ||
      u.name.toLowerCase().includes(searchPeminjam.toLowerCase()) ||
      u.email.toLowerCase().includes(searchPeminjam.toLowerCase()))
  );

  useEffect(() => {
    const handler = e => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setPeminjamDropdownOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const addDetail = () => {
    if (!selectedAlat) return;
    const alatObj = alats.find(a => a.id === parseInt(selectedAlat));
    if (!alatObj) return;
    if (details.some(d => d.alat_id === parseInt(selectedAlat))) { alert('Alat sudah ditambahkan'); return; }
    setDetails([...details, { alat_id: parseInt(selectedAlat), jumlah: parseInt(selectedJumlah), alat: alatObj }]);
    setSelectedAlat(''); setSelectedJumlah('1');
  };

  const removeDetail = idx => setDetails(details.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    const errs = {};
    if (!form.user_id) errs.user_id = ['User wajib dipilih'];
    if (!form.tanggal_pinjam) errs.tanggal_pinjam = ['Tanggal pinjam wajib diisi'];
    if (!form.tanggal_kembali_rencana) errs.tanggal_kembali_rencana = ['Tanggal kembali wajib diisi'];
    if (form.tanggal_pinjam && form.tanggal_kembali_rencana && form.tanggal_kembali_rencana < form.tanggal_pinjam)
      errs.tanggal_kembali_rencana = ['Tanggal kembali harus setelah tanggal pinjam'];
    if (!form.keperluan.trim()) errs.keperluan = ['Keperluan wajib diisi'];
    if (details.length === 0) errs.details = ['Tambahkan minimal 1 alat'];
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true); setErrors({});
    try {
      await api.post('/petugas/peminjaman', {
        ...form, user_id: parseInt(form.user_id),
        details: details.map(d => ({ alat_id: d.alat_id, jumlah: d.jumlah })),
      });
      onSaved('Peminjaman berhasil ditambahkan');
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
  const inp = k => errors[k] ? inputError : inputNormal;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <ClipboardIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Tambah Peminjaman Baru</h2>
              <p className="text-xs text-gray-400">Isi data peminjaman dengan lengkap</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {errors.general}
            </div>
          )}
          {errors.details && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {errors.details[0]}
            </div>
          )}

          {/* Peminjam */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Peminjam *</label>
            <button type="button" onClick={() => setPeminjamDropdownOpen(o => !o)}
              className={`${inp('user_id')} flex items-center justify-between w-full bg-white`}>
              <span className={selectedPeminjam ? 'text-gray-900' : 'text-gray-400'}>
                {selectedPeminjam ? `${selectedPeminjam.name} (${selectedPeminjam.email})` : 'Pilih Peminjam'}
              </span>
              <ChevronDownIcon />
            </button>
            {peminjamDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-2xl border border-gray-200 bg-white shadow-2xl">
                <div className="px-3 py-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none"><SearchIcon /></div>
                    <input type="text" value={searchPeminjam} onChange={e => setSearchPeminjam(e.target.value)}
                      placeholder="Cari nama atau email..."
                      className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#3F51B5] outline-none" />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                  {peminjamanList.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">Tidak ditemukan peminjam</div>
                  ) : peminjamanList.map(u => (
                    <button key={u.id} type="button" onClick={() => { set('user_id', u.id.toString()); setPeminjamDropdownOpen(false); }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50">
                      <p className="text-sm text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {errors.user_id && <p className="text-xs text-red-500 mt-1">{errors.user_id[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tanggal Pinjam *</label>
              <input type="date" className={inp('tanggal_pinjam')} value={form.tanggal_pinjam} onChange={e => set('tanggal_pinjam', e.target.value)} />
              {errors.tanggal_pinjam && <p className="text-xs text-red-500 mt-1">{errors.tanggal_pinjam[0]}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Rencana Kembali *</label>
              <input type="date" className={inp('tanggal_kembali_rencana')} value={form.tanggal_kembali_rencana} onChange={e => set('tanggal_kembali_rencana', e.target.value)} />
              {errors.tanggal_kembali_rencana && <p className="text-xs text-red-500 mt-1">{errors.tanggal_kembali_rencana[0]}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status Awal</label>
            <select className={inp('status')} value={form.status} onChange={e => set('status', e.target.value)} style={{ background: 'white' }}>
  {Object.entries(STATUS_CONFIG)
    .filter(([val]) => val !== 'menunggu')
    .map(([val, { label }]) => (
      <option key={val} value={val}>{label}</option>
    ))}
</select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Keperluan *</label>
            <textarea rows={2} className={inp('keperluan')} value={form.keperluan}
              onChange={e => set('keperluan', e.target.value)} placeholder="Sebutkan keperluan peminjaman..." />
            {errors.keperluan && <p className="text-xs text-red-500 mt-1">{errors.keperluan[0]}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Alat Dipinjam *</label>
            <div className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
              <div className="grid grid-cols-3 gap-2">
                <select value={selectedAlat} onChange={e => setSelectedAlat(e.target.value)} style={{ background: 'white' }}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5]">
                  <option value="">Pilih Alat</option>
                  {alats.map(a => (
                    <option key={a.id} value={a.id} disabled={details.some(d => d.alat_id === a.id)}>
                      {a.nama_alat} (Stok: {a.stok_total})
                    </option>
                  ))}
                </select>
                <input type="number" min="1" max={alats.find(a => a.id === parseInt(selectedAlat))?.stok_total || 1}
                  value={selectedJumlah}
                  onChange={e => setSelectedJumlah(Math.min(Math.max(parseInt(e.target.value) || 1, 1), alats.find(a => a.id === parseInt(selectedAlat))?.stok_total || 1))}
                  className="px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5]"
                />
                <button type="button" onClick={addDetail}
                  className="px-3 py-2 text-sm font-medium rounded-xl text-white flex items-center justify-center gap-1.5"
                  style={{ background: '#3F51B5' }}>
                  <PlusIcon /> Tambah
                </button>
              </div>
            </div>
            {details.length > 0 ? (
              <div className="space-y-2">
                {details.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{d.alat.nama_alat}</p>
                      <p className="text-xs text-gray-400">{d.alat.kode_alat}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">×{d.jumlah}</span>
                      <button type="button" onClick={() => removeDetail(idx)}
                        className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        ✕ Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-center text-sm text-gray-500">
                Belum ada alat. Pilih alat di atas untuk menambahkan.
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#3F51B5' }}>
            {loading && <Spinner />}
            Tambah Peminjaman
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete Modal ──────────────────────────────────────────────────────────────
const DeleteModal = ({ item, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <AlertIcon />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Hapus Peminjaman?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Peminjaman <span className="font-semibold text-gray-800">#{item?.id}</span> atas nama{' '}
          <span className="font-semibold text-gray-800">"{item?.user?.name}"</span> akan dihapus secara
          permanen. Tindakan ini tidak dapat dibatalkan.
        </p>
        {item?.status === 'dipinjam' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 flex items-center gap-2">
            <AlertIcon /> Peminjaman yang sedang berlangsung tidak dapat dihapus.
          </div>
        )}
      </div>
      <div className="flex gap-3 px-6 pb-6">
        <button onClick={onCancel} disabled={loading}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
          Batal
        </button>
        <button onClick={onConfirm} disabled={loading || item?.status === 'dipinjam'}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Spinner />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

// ── Export Dropdown ───────────────────────────────────────────────────────────
const ExportDropdown = ({ onExport, loading }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-none">
      <button onClick={() => setOpen(o => !o)} disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50">
        {loading ? <Spinner /> : <DownloadIcon />}
        Export <ChevronDownIcon />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
            <button onClick={() => { setOpen(false); onExport('excel'); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-none">XLS</span>
              Export Excel
            </button>
            <button onClick={() => { setOpen(false); onExport('pdf'); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-none">PDF</span>
              Export PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE — PETUGAS
// ══════════════════════════════════════════════════════════════════════════════
function Peminjaman() {
  const location = useLocation();
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [meta, setMeta]                     = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading]               = useState(false);
  const [exportLoading, setExportLoading]   = useState(false);

  const [searchInput, setSearchInput]   = useState('');
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [tanggal, setTanggal]           = useState('');
  const [sortBy, setSortBy]             = useState('created_at');
  const [sortOrder, setSortOrder]       = useState('desc');
  const [page, setPage]                 = useState(1);

  const [detailItem, setDetailItem]       = useState(null);
  const [editItem, setEditItem]           = useState(null);
  const [approvalItem, setApprovalItem]   = useState(null);
  const [addItem, setAddItem]             = useState(false);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { users: usersList, alat: alatList, currentUser } = useDataContext();
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, sort_by: sortBy, sort_order: sortOrder };
      if (search)       params.search = search;
      if (filterStatus) params['filter[status]'] = filterStatus;
      if (tanggal)      params['filter[tanggal_pinjam]'] = tanggal;

      const res = await api.get('/petugas/peminjaman', { params });
      setPeminjamanList(res.data.data ?? []);
      setMeta(res.data.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 });
    } catch {
      showToast('Gagal memuat data peminjaman.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus, tanggal, sortBy, sortOrder, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [search, filterStatus, tanggal, sortBy, sortOrder]);
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = async (format) => {
    setExportLoading(true);
    try {
      const params = { format, sort_by: sortBy, sort_order: sortOrder };
      if (search)       params.search = search;
      if (filterStatus) params['filter[status]'] = filterStatus;
      if (tanggal) {
        params['filter[tanggal_pinjam_from]'] = tanggal;
        params['filter[tanggal_pinjam_to]'] = tanggal;
      }
      const res = await api.get('/petugas/peminjaman/export', { params, responseType: 'blob' });
      const ext  = format === 'excel' ? 'xlsx' : 'pdf';
      const mime = format === 'excel'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement('a');
      a.href = url; a.download = `laporan-peminjaman-${Date.now()}.${ext}`; a.click();
      URL.revokeObjectURL(url);
      showToast(`Export ${format.toUpperCase()} berhasil diunduh.`);
    } catch {
      showToast('Gagal mengekspor data.', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/petugas/peminjaman/${deleteTarget.id}`);
      setDeleteTarget(null);
      showToast('Peminjaman berhasil dihapus.');
      fetchData();
    } catch (err) {
      setDeleteTarget(null);
      showToast(err.response?.data?.message ?? 'Gagal menghapus peminjaman.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasFilter   = !!(search || filterStatus || tanggal);
  const totalPages  = meta.last_page ?? 1;
  const currentPage = meta.current_page ?? 1;

  const resetFilters = () => {
    setSearchInput(''); setSearch(''); setFilterStatus(''); setTanggal('');
    setSortBy('created_at'); setSortOrder('desc'); setPage(1);
  };

  const pageNumbers = () => {
    const pages = [], delta = 2;
    const left = Math.max(1, currentPage - delta), right = Math.min(totalPages, currentPage + delta);
    if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    return pages;
  };

  useEffect(() => {
  if (location.state?.openApprovalId && peminjamanList.length > 0) {
    const target = peminjamanList.find(p => p.id === location.state.openApprovalId);
    if (target) setApprovalItem(target);
  }
}, [location.state, peminjamanList]);

  const selectClass = 'py-2.5 px-3 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50 text-gray-600';
  const tableHeaders = ['No', 'Peminjam', 'Alat Dipinjam', 'Tgl Pinjam', 'Rencana Kembali', 'Status', 'Aksi'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {detailItem   && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
      {approvalItem && (
        <ApprovalModal
          item={approvalItem}
          currentUser={currentUser}
          onClose={() => setApprovalItem(null)}
          onSaved={(msg) => { setApprovalItem(null); showToast(msg); fetchData(); }}
        />
      )}
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={(msg) => { setEditItem(null); showToast(msg); fetchData(); }}
        />
      )}
      {addItem && (
        <AddPeminjamanModal
          users={usersList}
          alats={alatList}
          currentUser={currentUser}
          onClose={() => setAddItem(false)}
          onSaved={(msg) => { setAddItem(false); showToast(msg); fetchData(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Peminjaman</h1>
        <p className="text-sm text-gray-500 mt-0.5">Proses, setujui, dan kelola seluruh transaksi peminjaman alat</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"><SearchIcon /></div>
            <input type="text" placeholder="Cari nama peminjam atau alat..."
              value={searchInput} onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50" />
          </div>
          <div className="flex items-center gap-2 sm:w-48">
            <div className="text-gray-400 flex-none"><FilterIcon /></div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`flex-1 ${selectClass}`}>
              <option value="">Semua Status</option>
              {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-none">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
              <option value="created_at">Tgl Dibuat</option>
              <option value="tanggal_pinjam">Tgl Pinjam</option>
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className={selectClass}>
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>
          <ExportDropdown onExport={handleExport} loading={exportLoading} />
          <button onClick={() => setAddItem(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#3F51B5' }}>
            <PlusIcon /> Tambah
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <CalendarIcon /><span>Filter tanggal pinjam:</span>
          </div>
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-[#3F51B5] text-gray-600" />
          {tanggal && (
            <button onClick={() => setTanggal('')} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              × Hapus
            </button>
          )}
        </div>

        {hasFilter && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-400">Filter aktif:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                "{search}" <button onClick={() => { setSearch(''); setSearchInput(''); }} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            {filterStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {STATUS_CONFIG[filterStatus]?.label}
                <button onClick={() => setFilterStatus('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            {tanggal && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {fmt(tanggal)} <button onClick={() => setTanggal('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1">Reset semua</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Daftar Peminjaman</h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                Total <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> peminjaman ditemukan
              </p>
            )}
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Spinner /> Memuat...
            </div>
          )}
        </div>

        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                {tableHeaders.map(h => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                : peminjamanList.length === 0
                  ? <EmptyState hasFilter={hasFilter} />
                  : peminjamanList.map((row, idx) => {
                    const no = (currentPage - 1) * (meta.per_page ?? 10) + idx + 1;
                    const canApprove = STATUS_TRANSITIONS[row.status]?.length > 0;
                    const canEdit    = row.status === 'menunggu';
                    const canDelete  = row.status !== 'dipinjam';
                    return (
                      <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-3 py-3 text-gray-400 text-xs font-mono w-8">{no}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-none text-xs font-bold text-white"
                              style={{ background: avatarColor(row.user?.name) }}>
                              {row.user?.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-xs leading-tight truncate">{row.user?.name}</p>
                              <p className="text-xs text-gray-400 truncate">{row.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            {row.details?.slice(0, 1).map(d => (
                              <span key={d.id} className="inline-block text-xs px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                                {d.alat?.nama_alat} ×{d.jumlah}
                              </span>
                            ))}
                            {(row.details?.length ?? 0) > 1 && (
                              <span className="inline-block text-xs px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-400">
                                +{row.details.length - 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-500">{fmt(row.tanggal_pinjam)}</span>
                        </td>
                        <td className="px-3 py-3">
                          <span className="text-xs text-gray-500">{fmt(row.tanggal_kembali_rencana)}</span>
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            {/* Detail */}
                            <button onClick={() => setDetailItem(row)} title="Detail"
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[#3F51B5]/10 text-[#3F51B5]">
                              <EyeIcon />
                            </button>

                            {/* Approval */}
                            <button
                              onClick={() => canApprove && setApprovalItem(row)}
                              disabled={!canApprove}
                              title={canApprove ? (row.status === 'menunggu' ? 'Proses' : row.status === 'disetujui' ? 'Pinjam' : 'Kembali') : 'Status sudah final'}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                                ${canApprove ? 'hover:bg-emerald-50 text-emerald-600' : 'opacity-30 cursor-not-allowed text-gray-400'}`}
                            >
                              <ShieldCheckIcon />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => canEdit && setEditItem(row)}
                              disabled={!canEdit}
                              title={canEdit ? 'Edit' : 'Hanya status menunggu yang bisa diedit'}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                                ${canEdit ? 'hover:bg-amber-50 text-amber-600' : 'opacity-30 cursor-not-allowed text-gray-400'}`}
                            >
                              <EditIcon />
                            </button>

                            {/* Hapus */}
                            <button
                              onClick={() => setDeleteTarget(row)}
                              disabled={!canDelete}
                              title={!canDelete ? 'Tidak dapat menghapus peminjaman yang sedang berlangsung' : 'Hapus'}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                                ${canDelete ? 'hover:bg-red-50 text-red-500' : 'opacity-30 cursor-not-allowed text-gray-400'}`}
                            >
                              <TrashIcon />
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
        {!loading && peminjamanList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 gap-3">
            <p className="text-xs text-gray-400">
              Menampilkan{' '}
              <span className="font-semibold text-gray-600">{((currentPage - 1) * (meta.per_page ?? 10)) + 1}</span>–
              <span className="font-semibold text-gray-600">{Math.min(currentPage * (meta.per_page ?? 10), meta.total ?? 0)}</span>
              {' '}dari{' '}
              <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> peminjaman
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:pointer-events-none">
                <ChevronLeftIcon />
              </button>
              {pageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                    style={p === currentPage ? { background: '#3F51B5', color: '#fff' } : { color: '#6b7280' }}
                    onMouseEnter={e => { if (p !== currentPage) e.currentTarget.style.background = '#f3f4f6'; }}
                    onMouseLeave={e => { if (p !== currentPage) e.currentTarget.style.background = 'transparent'; }}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-30 disabled:pointer-events-none">
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Peminjaman;