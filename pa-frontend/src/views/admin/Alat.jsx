import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api';

// ── Icons ────────────────────────────────────────────────────────────────────
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
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

// ── Spinner ──────────────────────────────────────────────────────────────────
const Spinner = ({ size = 'sm' }) => (
  <svg className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);

// ── Tambahkan Icons untuk Canvas ────────────────────────────────────────────
const DrawIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
);
const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

// ── Kondisi Badge ────────────────────────────────────────────────────────────
const KondisiBadge = ({ kondisi }) => {
  const cfg = {
    baik:      { label: 'Baik',      bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    rusak:     { label: 'Rusak',     bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500'     },
    perbaikan: { label: 'Perbaikan', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  };
  const c = cfg[kondisi] ?? { label: kondisi, bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ── Gambar Alat (thumbnail dengan fallback) ──────────────────────────────────
const GambarAlat = ({ gambar, nama }) => {
  const [error, setError] = useState(false);
  const BASE_URL = 'http://127.0.0.1:8000/storage/';

  // Reset error state ketika gambar berubah
  useEffect(() => {
    setError(false);
  }, [gambar]);

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
      className="w-16 h-16 object-cover flex-none border border-gray-100"
    />
  );
};

// ── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium"
      style={{ background: type === 'success' ? '#3F51B5' : '#ef4444', color: '#fff', minWidth: 280 }}>
      <span className="flex-none">
        {type === 'success' ? <CheckIcon /> : <AlertIcon />}
      </span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity"><XIcon /></button>
    </div>
  );
};

// ── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ alat, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="p-6">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-4">
          <AlertIcon />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Hapus Alat?</h3>
        <p className="text-sm text-gray-500 mb-4">
          Alat <span className="font-semibold text-gray-800">"{alat?.nama_alat}"</span> akan dihapus secara permanen.
          Tindakan ini tidak dapat dibatalkan.
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

// ── Form Modal dengan Canvas (untuk COMPRESS gambar) ─────────────────────────
const AlatModal = ({ mode, initialData, kategoriList, onSave, onClose }) => {
  const isEdit = mode === 'edit';
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    kategori_id: '',
    nama_alat:   '',
    deskripsi:   '',
    gambar_data: null,
    stok_total:  '',
    kondisi:     'baik',
    ...(isEdit && initialData ? {
      kategori_id: initialData.kategori?.id ?? '',
      nama_alat:   initialData.nama_alat ?? '',
      deskripsi:   initialData.deskripsi ?? '',
      gambar_data: null,
      stok_total:  initialData.stok_total ?? '',
      kondisi:     initialData.kondisi ?? 'baik',
    } : {})
  });
  const [existingGambar, setExistingGambar] = useState(initialData?.gambar || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null, general: null }));
  };

// ── FUNGSI COMPRESS GAMBAR DENGAN CANVAS ─────────────────────────────────
const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // ✅ CEK APAKAH CANVAS TERSEDIA
    if (!canvasRef.current) {
      reject(new Error('Canvas tidak tersedia. Silakan refresh halaman.'));
      return;
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = () => {
        // Hitung dimensi baru (mempertahankan aspect ratio)
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // ✅ CEK LAGI SEBELUM PAKAI CANVAS
        const canvas = canvasRef.current;
        if (!canvas) {
          reject(new Error('Canvas tidak tersedia'));
          return;
        }
        
        // Setup canvas
        canvas.width = width;
        canvas.height = height;
        
        // Draw image ke canvas (resize otomatis)
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Tidak dapat mengakses canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert ke base64 dengan kualitas yang ditentukan
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
    };
    
    reader.onerror = () => reject(new Error('Gagal membaca file'));
  });
};

  // ── HANDLE PILIH FILE ────────────────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, gambar: ['Format gambar harus JPG, JPEG, PNG, atau WEBP'] });
      return;
    }
    
    // Validasi ukuran (max 5MB sebelum compress)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, gambar: ['Ukuran gambar maksimal 5MB'] });
      return;
    }
    
    setIsCompressing(true);
    
    try {
      // Compress gambar
      const compressedBase64 = await compressImage(file, 800, 800, 0.7);
      
      // Update state
      setForm(f => ({ ...f, gambar_data: compressedBase64 }));
      setImagePreview(compressedBase64);
      
      // Tampilkan informasi ukuran
      const originalSizeKB = (file.size / 1024).toFixed(2);
      const compressedSizeKB = ((compressedBase64.length * 0.75) / 1024).toFixed(2);
      console.log(`Original: ${originalSizeKB}KB → Compressed: ${compressedSizeKB}KB`);
      
    } catch (error) {
      setErrors({ ...errors, gambar: ['Gagal mengkompres gambar'] });
    } finally {
      setIsCompressing(false);
    }
  };

  const removeGambar = () => {
    setForm(f => ({ ...f, gambar_data: null }));
    setImagePreview(null);
    setExistingGambar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ── Submit Handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      const payload = {
        kategori_id: Number(form.kategori_id),
        nama_alat: form.nama_alat,
        deskripsi: form.deskripsi || '',
        stok_total: Number(form.stok_total),
        kondisi: form.kondisi,
      };
      
      // Handle gambar yang sudah di-compress (base64)
      if (form.gambar_data) {
        payload.gambar_data = form.gambar_data;
      }
      
      if (isEdit) {
        await api.put(`/alat/${initialData.id}`, payload);
      } else {
        await api.post('/alat', payload);
      }
      
      onSave(isEdit ? 'Alat berhasil diperbarui' : 'Alat berhasil ditambahkan');
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

  const inputBase = 'w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all';
  const inputNormal = `${inputBase} border-gray-200 focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10`;
  const inputError  = `${inputBase} border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100`;
  const inp = (k) => errors[k] ? inputError : inputNormal;

  // Get preview source
  const getPreviewSrc = () => {
    if (imagePreview) return imagePreview;
    if (existingGambar && !form.gambar_data) {
      return `http://127.0.0.1:8000/storage/${existingGambar}`;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: '#3F51B5' }}>
              <ImageIcon />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">{isEdit ? 'Edit Alat' : 'Tambah Alat Baru'}</h2>
              <p className="text-xs text-gray-400">{isEdit ? `ID: ${initialData?.id}` : 'Isi data alat dengan lengkap'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {errors.general && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <AlertIcon /> {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Row 1: Kode + Kategori */}
            <div className="grid grid-cols-1 gap-3">

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kategori *</label>
                <select className={inp('kategori_id')} value={form.kategori_id}
                  onChange={e => set('kategori_id', e.target.value)}>
                  <option value="">Pilih kategori</option>
                  {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                </select>
                {errors.kategori_id && <p className="text-xs text-red-500 mt-1">{errors.kategori_id[0]}</p>}
              </div>
            </div>

            {/* Nama Alat */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nama Alat *</label>
              <input className={inp('nama_alat')} value={form.nama_alat}
                onChange={e => set('nama_alat', e.target.value)} placeholder="Contoh: Multimeter Digital" />
              {errors.nama_alat && <p className="text-xs text-red-500 mt-1">{errors.nama_alat[0]}</p>}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deskripsi</label>
              <textarea className={inp('deskripsi')} rows={3} value={form.deskripsi}
                onChange={e => set('deskripsi', e.target.value)} placeholder="Deskripsi singkat fungsi alat..." />
              {errors.deskripsi && <p className="text-xs text-red-500 mt-1">{errors.deskripsi[0]}</p>}
            </div>

            {/* Row: Stok + Kondisi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Stok Total *</label>
                <input type="number" min={0} className={inp('stok_total')} value={form.stok_total}
                  onChange={e => set('stok_total', e.target.value)} placeholder="0" />
                {errors.stok_total && <p className="text-xs text-red-500 mt-1">{errors.stok_total[0]}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kondisi *</label>
                <select className={inp('kondisi')} value={form.kondisi}
                  onChange={e => set('kondisi', e.target.value)}>
                  <option value="baik">Baik</option>
                  <option value="rusak">Rusak</option>
                  <option value="perbaikan">Perbaikan</option>
                </select>
                {errors.kondisi && <p className="text-xs text-red-500 mt-1">{errors.kondisi[0]}</p>}
              </div>
            </div>

            {/* Upload & Compress Gambar */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Gambar Alat
              </label>
              
              {/* Preview area */}
              {getPreviewSrc() && (
                <div className="mb-3 relative inline-block">
                  <img
                    src={getPreviewSrc()}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeGambar}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <XIcon />
                  </button>
                </div>
              )}
              
              {/* File input */}
              <div className={`relative ${inputNormal} p-0 overflow-hidden cursor-pointer hover:bg-gray-50`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isCompressing}
                />
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <ImageIcon />
                  <span className="text-sm text-gray-500">
                    {isCompressing ? 'Mengompres gambar...' : (form.gambar_data ? 'Gambar sudah dipilih' : 'Klik untuk pilih gambar (max 5MB)')}
                  </span>
                </div>
              </div>
              
              {isCompressing && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#3F51B5]">
                  <Spinner /> Mengompres gambar...
                </div>
              )}
              
              <p className="text-xs text-gray-400 mt-1.5">
                Format: JPG, JPEG, PNG, WEBP. Maksimal 5MB. Gambar akan dikompres otomatis menjadi max 800x800px.
              </p>
              {errors.gambar && <p className="text-xs text-red-500 mt-1">{errors.gambar[0]}</p>}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={loading || isCompressing}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#3F51B5' }}>
            {loading && <Spinner />}
            {isEdit ? 'Simpan Perubahan' : 'Tambah Alat'}
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

    </div>
  );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 bg-gray-100 rounded-lg" style={{ width: `${60 + Math.random() * 30}%` }} />
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
            {hasFilter ? 'Coba ubah filter pencarian' : 'Tambah alat pertama dengan klik tombol di atas'}
          </p>
        </div>
      </div>
    </td>
  </tr>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
function Alat() {
  const [alatList, setAlatList]         = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [meta, setMeta]                 = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading]           = useState(false);

  // Filter state
  const [search, setSearch]             = useState('');
  const [searchInput, setSearchInput]   = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterKondisi, setFilterKondisi]   = useState('');
  const [page, setPage]                 = useState(1);

  // Modal state
  const [modal, setModal]               = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // ── Fetch kategori (once) ──────────────────────────────────────────────────
  useEffect(() => {
    api.get('/kategori', { params: { limit: 100 } })
      .then(res => setKategoriList(res.data.data ?? []))
      .catch(() => {});
  }, []);

  // ── Fetch alat ─────────────────────────────────────────────────────────────
  const fetchAlat = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(filterKategori && { 'filter[kategori_id]': filterKategori }),
        ...(filterKondisi  && { 'filter[kondisi]':     filterKondisi  }),
      };
      const res = await api.get('/alat', { params });
      setAlatList(res.data.data ?? []);
      setMeta(res.data.meta ?? { current_page: 1, last_page: 1, total: 0, per_page: 10 });
    } catch {
      showToast('Gagal memuat data alat.', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterKategori, filterKondisi, showToast]);

  useEffect(() => { fetchAlat(); }, [fetchAlat]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, filterKategori, filterKondisi]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/alat/${deleteTarget.id}`);
      setDeleteTarget(null);
      showToast('Alat berhasil dihapus.');
      fetchAlat();
    } catch (err) {
      setDeleteTarget(null);
      showToast(err.response?.data?.message ?? 'Gagal menghapus alat.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const hasFilter    = !!search || !!filterKategori || !!filterKondisi;
  const totalPages   = meta.last_page ?? 1;
  const currentPage  = meta.current_page ?? 1;

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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      {modal && (
        <AlatModal
          mode={modal.mode}
          initialData={modal.data}
          kategoriList={kategoriList}
          onClose={() => setModal(null)}
          onSave={(msg) => { setModal(null); showToast(msg); fetchAlat(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          alat={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Alat</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola inventaris alat yang tersedia untuk dipinjam</p>
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
          <div className="sm:w-40">
            <select
              value={filterKondisi}
              onChange={e => setFilterKondisi(e.target.value)}
              className="w-full py-2.5 px-3 text-sm rounded-xl border border-gray-200 outline-none transition-all focus:border-[#3F51B5] focus:ring-2 focus:ring-[#3F51B5]/10 bg-gray-50 text-gray-600"
            >
              <option value="">Semua Kondisi</option>
              <option value="baik">Baik</option>
              <option value="rusak">Rusak</option>
              <option value="perbaikan">Perbaikan</option>
            </select>
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 flex-none"
            style={{ background: '#3F51B5' }}
          >
            <PlusIcon />
            Tambah Alat
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
            {filterKategori && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {kategoriList.find(k => String(k.id) === String(filterKategori))?.nama_kategori ?? 'Kategori'}
                <button onClick={() => setFilterKategori('')} className="hover:opacity-70 ml-0.5">×</button>
              </span>
            )}
            {filterKondisi && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3F51B5]/10 text-[#3F51B5]">
                {filterKondisi.charAt(0).toUpperCase() + filterKondisi.slice(1)}
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

                      {/* ── Kolom Gambar ── */}
                      <td className="px-4 py-3.5">
                        <GambarAlat gambar={alat.gambar} nama={alat.nama_alat} />
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
                          {alat.kode_alat}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{alat.nama_alat}</p>
                          {alat.deskripsi && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{alat.deskripsi}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-600">{alat.kategori?.nama_kategori ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-gray-800">{alat.stok_total}</span>
                        <span className="text-gray-400 text-xs ml-1">unit</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <KondisiBadge kondisi={alat.kondisi} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setModal({ mode: 'edit', data: alat })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#3F51B5]/10 text-[#3F51B5]"
                          >
                            <EditIcon /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(alat)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-50 text-red-500"
                          >
                            <TrashIcon /> Hapus
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
              Menampilkan <span className="font-semibold text-gray-600">{((currentPage - 1) * (meta.per_page ?? 10)) + 1}</span>–
              <span className="font-semibold text-gray-600">{Math.min(currentPage * (meta.per_page ?? 10), meta.total ?? 0)}</span> dari{' '}
              <span className="font-semibold text-gray-600">{meta.total ?? 0}</span> alat
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

export default Alat;