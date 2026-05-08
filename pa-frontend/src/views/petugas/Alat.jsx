import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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
const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
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
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14"/>
  </svg>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ size = 'sm' }) => (
  <svg className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);

// ── KondisiBadge ──────────────────────────────────────────────────────────────
const KondisiBadge = ({ kondisi }) => {
  const cfg = {
    baik:         { label: 'Baik',         bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rusak_ringan: { label: 'Rusak Ringan',  bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    rusak_berat:  { label: 'Rusak Berat',   bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
    rusak:        { label: 'Rusak',         bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
    perbaikan:    { label: 'Perbaikan',     bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  };
  const c = cfg[kondisi] ?? { label: kondisi, bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ── GambarAlat ────────────────────────────────────────────────────────────────
const GambarAlat = ({ gambar, nama }) => {
  const [error, setError] = useState(false);
  const BASE_URL = 'http://127.0.0.1:8000/storage/';
  useEffect(() => { setError(false); }, [gambar]);
  if (!gambar || error) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 flex-none">
        <ImageIcon />
      </div>
    );
  }
  return (
    <img
      src={`${BASE_URL}${gambar}`}
      alt={nama}
      onError={() => setError(true)}
      className="w-16 h-16 object-cover flex-none border border-gray-100 rounded-xl"
    />
  );
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium"
      style={{ background: type === 'success' ? '#3F51B5' : '#ef4444', color: '#fff', minWidth: 280 }}>
      <span className="flex-none">{type === 'success' ? <CheckIcon /> : <AlertIcon />}</span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity"><XIcon /></button>
    </div>
  );
};

// ── Modal Update Stok ─────────────────────────────────────────────────────────
const StokModal = ({ alat, onSave, onClose }) => {
  const [mode, setMode]       = useState('set');   // 'set' | 'tambah' | 'kurangi'
  const [jumlah, setJumlah]   = useState('');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!jumlah || isNaN(jumlah) || Number(jumlah) < 0) {
      setError('Masukkan jumlah yang valid');
      return;
    }
    if (mode !== 'set' && Number(jumlah) < 1) {
      setError('Jumlah minimal 1');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (mode === 'set') {
        await api.put(`/petugas/alat/${alat.id}/stok`, { stok_total: Number(jumlah), catatan });
      } else if (mode === 'tambah') {
        await api.post(`/petugas/alat/${alat.id}/tambah-stok`, { jumlah: Number(jumlah), catatan });
      } else {
        await api.post(`/petugas/alat/${alat.id}/kurangi-stok`, { jumlah: Number(jumlah), catatan });
      }
      onSave('Stok berhasil diperbarui');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengupdate stok');
    } finally {
      setLoading(false);
    }
  };

  const modeLabel = { set: 'Set Stok', tambah: 'Tambah Stok', kurangi: 'Kurangi Stok' };
  const inputBase = 'w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <PackageIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Update Stok</h2>
              <p className="text-xs text-gray-400">{alat.nama_alat} · Stok saat ini: <b>{alat.stok_total}</b></p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipe Update</label>
            <div className="grid grid-cols-3 gap-2">
              {['set', 'tambah', 'kurangi'].map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setJumlah(''); setError(''); }}
                  className="py-2 rounded-xl text-xs font-semibold transition-all border"
                  style={mode === m
                    ? { background: '#3F51B5', color: '#fff', borderColor: '#3F51B5' }
                    : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }}
                >
                  {modeLabel[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Input Jumlah */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              {mode === 'set' ? 'Stok Baru' : mode === 'tambah' ? 'Jumlah Ditambah' : 'Jumlah Dikurangi'} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                {mode === 'tambah' ? <PlusIcon /> : mode === 'kurangi' ? <MinusIcon /> : <PackageIcon />}
              </div>
              <input
                type="number"
                min={mode === 'set' ? 0 : 1}
                className={`${inputBase} pl-9`}
                placeholder={mode === 'set' ? 'Masukkan stok baru...' : 'Masukkan jumlah...'}
                value={jumlah}
                onChange={e => { setJumlah(e.target.value); setError(''); }}
              />
            </div>
            {/* Preview hasil */}
            {jumlah && !isNaN(jumlah) && Number(jumlah) >= 0 && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: '#3F51B5' }}>
                {mode === 'set' && `Stok akan menjadi: ${jumlah} unit`}
                {mode === 'tambah' && `Stok akan menjadi: ${alat.stok_total + Number(jumlah)} unit (+${jumlah})`}
                {mode === 'kurangi' && `Stok akan menjadi: ${Math.max(0, alat.stok_total - Number(jumlah))} unit (-${jumlah})`}
              </p>
            )}
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Catatan (opsional)</label>
            <input
              type="text"
              className={inputBase}
              placeholder="Alasan perubahan stok..."
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#3F51B5' }}>
            {loading && <Spinner />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal Update Kondisi ──────────────────────────────────────────────────────
const KondisiModal = ({ alat, onSave, onClose }) => {
  const [kondisi, setKondisi] = useState(alat.kondisi ?? 'baik');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/petugas/alat/${alat.id}/kondisi`, { kondisi, catatan });
      onSave('Kondisi berhasil diperbarui');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal mengupdate kondisi');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10';

  const kondisiOptions = [
    { value: 'baik',         label: 'Baik',         color: '#10B981', bg: '#D1FAE5' },
    { value: 'rusak_ringan', label: 'Rusak Ringan',  color: '#F59E0B', bg: '#FEF3C7' },
    { value: 'rusak_berat',  label: 'Rusak Berat',   color: '#EF4444', bg: '#FEE2E2' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#7C3AED' }}>
              <ShieldIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Update Kondisi</h2>
              <p className="text-xs text-gray-400">{alat.nama_alat} · Kondisi saat ini: <b>{alat.kondisi}</b></p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Pilih kondisi */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kondisi Baru *</label>
            <div className="grid grid-cols-3 gap-2">
              {kondisiOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setKondisi(opt.value)}
                  className="py-3 rounded-xl text-xs font-semibold transition-all border flex flex-col items-center gap-1.5"
                  style={kondisi === opt.value
                    ? { background: opt.bg, color: opt.color, borderColor: opt.color }
                    : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: kondisi === opt.value ? opt.color : '#d1d5db' }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Catatan (opsional)</label>
            <input
              type="text"
              className={inputBase}
              placeholder="Keterangan kondisi alat..."
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#7C3AED' }}>
            {loading && <Spinner />}
            Simpan Kondisi
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 bg-gray-100 rounded-lg" style={{ width: `${60 + (i * 13) % 35}%` }} />
      </td>
    ))}
  </tr>
);

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilter }) => (
  <tr>
    <td colSpan={8} className="py-16 text-center">
      <div className="inline-flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
          <WrenchIcon />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">
            {hasFilter ? 'Tidak ada alat yang cocok' : 'Belum ada data alat'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {hasFilter ? 'Coba ubah filter pencarian' : 'Data alat belum tersedia'}
          </p>
        </div>
      </div>
    </td>
  </tr>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function PetugasAlat() {
  const [alatList, setAlatList]         = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [meta, setMeta]                 = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading]           = useState(false);

  // Filter state
  const [search, setSearch]                 = useState('');
  const [searchInput, setSearchInput]       = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterKondisi, setFilterKondisi]   = useState('');
  const [page, setPage]                     = useState(1);

  // Modal state
  const [stokModal, setStokModal]       = useState(null); // alat object
  const [kondisiModal, setKondisiModal] = useState(null); // alat object

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // ── Fetch kategori (sekali) ───────────────────────────────────────────────
  useEffect(() => {
    api.get('/kategori', { params: { limit: 100 } })
      .then(res => setKategoriList(res.data.data ?? []))
      .catch(() => {});
  }, []);

  // ── Fetch alat ────────────────────────────────────────────────────────────
  const fetchAlat = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(filterKategori && { 'filter[kategori_id]': filterKategori }),
        ...(filterKondisi  && { 'filter[kondisi]': filterKondisi }),
      };
      // Petugas pakai endpoint /petugas/alat
      const res = await api.get('/petugas/alat', { params });
      setAlatList(res.data.data ?? []);
      setMeta(res.data.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 });
    } catch {
      showToast('Gagal memuat data alat.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterKategori, filterKondisi, showToast]);

  useEffect(() => { fetchAlat(); }, [fetchAlat]);

  // Reset page saat filter berubah
  useEffect(() => { setPage(1); }, [search, filterKategori, filterKondisi]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasFilter   = !!search || !!filterKategori || !!filterKondisi;
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

  const tableHeaders = ['No', 'Gambar', 'Kode Alat', 'Nama Alat', 'Kategori', 'Stok', 'Kondisi', 'Aksi'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Sora']">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      {stokModal && (
        <StokModal
          alat={stokModal}
          onClose={() => setStokModal(null)}
          onSave={(msg) => { setStokModal(null); showToast(msg); fetchAlat(); }}
        />
      )}
      {kondisiModal && (
        <KondisiModal
          alat={kondisiModal}
          onClose={() => setKondisiModal(null)}
          onSave={(msg) => { setKondisiModal(null); showToast(msg); fetchAlat(); }}
        />
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Alat</h1>
        <p className="text-sm text-gray-500 mt-0.5">Lihat inventaris dan kelola stok serta kondisi alat</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari nama alat..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50"
            />
          </div>

          {/* Filter Kategori */}
          <div className="flex items-center gap-2 sm:w-48">
            <div className="text-gray-400 flex-none"><FilterIcon /></div>
            <select
              value={filterKategori}
              onChange={e => setFilterKategori(e.target.value)}
              className="flex-1 py-2.5 px-3 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50 text-gray-600"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
            </select>
          </div>

          {/* Filter Kondisi */}
          <div className="sm:w-44">
            <select
              value={filterKondisi}
              onChange={e => setFilterKondisi(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50 text-gray-600"
            >
              <option value="">Semua Kondisi</option>
              <option value="baik">Baik</option>
              <option value="rusak_ringan">Rusak Ringan</option>
              <option value="rusak_berat">Rusak Berat</option>
            </select>
          </div>
          {/* NOTE: Tidak ada tombol "Tambah Alat" — petugas tidak punya akses */}
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
            {filterKategori && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {kategoriList.find(k => String(k.id) === String(filterKategori))?.nama_kategori ?? 'Kategori'}
                <button onClick={() => setFilterKategori('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            {filterKondisi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {filterKondisi.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                <button onClick={() => setFilterKondisi('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            <button
              onClick={() => { setSearch(''); setSearchInput(''); setFilterKategori(''); setFilterKondisi(''); }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
            >
              Reset semua
            </button>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Daftar Alat</h2>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                Total <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> alat ditemukan
              </p>
            )}
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Spinner /> Memuat...
            </div>
          )}
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
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : alatList.length === 0 ? (
                <EmptyState hasFilter={hasFilter} />
              ) : (
                alatList.map((alat, idx) => {
                  const no = (currentPage - 1) * (meta.per_page ?? 10) + idx + 1;
                  return (
                    <tr key={alat.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-4 py-3.5 text-gray-400 text-xs font-mono">{no}</td>

                      {/* Gambar */}
                      <td className="px-4 py-3.5">
                        <GambarAlat gambar={alat.gambar} nama={alat.nama_alat} />
                      </td>

                      {/* Kode */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                          {alat.kode_alat}
                        </span>
                      </td>

                      {/* Nama */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{alat.nama_alat}</p>
                          {alat.deskripsi && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{alat.deskripsi}</p>
                          )}
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-600">{alat.kategori?.nama_kategori ?? '—'}</span>
                      </td>

                      {/* Stok */}
                      <td className="px-4 py-3.5">
                        <span className={`font-semibold ${alat.stok_total <= 2 ? 'text-red-600' : 'text-gray-800'}`}>
                          {alat.stok_total}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">unit</span>
                        {alat.stok_total <= 2 && (
                          <span className="block text-[10px] text-red-500 font-medium mt-0.5">Stok rendah!</span>
                        )}
                      </td>

                      {/* Kondisi */}
                      <td className="px-4 py-3.5">
                        <KondisiBadge kondisi={alat.kondisi} />
                      </td>

                      {/* Aksi — hanya Update Stok & Update Kondisi */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setStokModal(alat)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#3F51B5]/10 text-[#3F51B5]"
                          >
                            <PackageIcon /> Stok
                          </button>
                          <button
                            onClick={() => setKondisiModal(alat)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-purple-50 text-purple-600"
                          >
                            <ShieldIcon /> Kondisi
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && alatList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 gap-3">
            <p className="text-xs text-gray-400">
              Menampilkan{' '}
              <span className="font-semibold text-gray-600">{((currentPage - 1) * (meta.per_page ?? 10)) + 1}</span>–
              <span className="font-semibold text-gray-600">{Math.min(currentPage * (meta.per_page ?? 10), meta.total ?? 0)}</span>{' '}
              dari <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> alat
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
                      : { color: '#6b7280' }}
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

export default PetugasAlat;