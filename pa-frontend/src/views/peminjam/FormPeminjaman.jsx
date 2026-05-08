import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, RotateCcw, FileText, Wrench, Package,
  Plus, X, CheckCircle2, ClipboardList, ArrowLeft
} from 'lucide-react';
import api from '../../services/api';

export default function FormPeminjaman() {
  const { id: alatId } = useParams();
  const navigate = useNavigate();

  const [katalog, setKatalog] = useState([]);
  const [loadingKatalog, setLoadingKatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    tanggal_pinjam: '',
    tanggal_kembali_rencana: '',
    keperluan: '',
    items: [],
  });

  useEffect(() => {
    api.get('/katalog?limit=999')
      .then(res => {
        const data = (res.data.data ?? []).filter(a => a.stok_total > 0 && a.kondisi !== 'rusak');
        setKatalog(data);
        if (alatId) {
          setForm(f => ({ ...f, items: [{ alat_id: parseInt(alatId), jumlah: 1 }] }));
        }
      })
      .finally(() => setLoadingKatalog(false));
  }, [alatId]);

  const today = new Date().toISOString().split('T')[0];

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { alat_id: '', jumlah: 1 }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx, field, value) => setForm(f => ({
    ...f,
    items: f.items.map((item, i) => i === idx ? { ...item, [field]: value } : item),
  }));

  const validate = () => {
    const e = {};
    if (!form.tanggal_pinjam) e.tanggal_pinjam = 'Tanggal pinjam wajib diisi';
    if (!form.tanggal_kembali_rencana) e.tanggal_kembali_rencana = 'Tanggal kembali wajib diisi';
    if (form.tanggal_kembali_rencana && form.tanggal_pinjam && form.tanggal_kembali_rencana <= form.tanggal_pinjam) {
      e.tanggal_kembali_rencana = 'Tanggal kembali harus setelah tanggal pinjam';
    }
    if (!form.keperluan.trim()) e.keperluan = 'Keperluan wajib diisi';
    if (form.items.length === 0) e.items = 'Pilih minimal 1 alat';
    else {
      form.items.forEach((item, i) => {
        if (!item.alat_id) e[`item_${i}_alat`] = 'Pilih alat';
        if (!item.jumlah || item.jumlah < 1) e[`item_${i}_jumlah`] = 'Jumlah minimal 1';
        const alatData = katalog.find(a => a.id === parseInt(item.alat_id));
        if (alatData && item.jumlah > alatData.stok_total) {
          e[`item_${i}_jumlah`] = `Maks stok: ${alatData.stok_total}`;
        }
      });
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const payload = {
        tanggal_pinjam: form.tanggal_pinjam,
        tanggal_kembali_rencana: form.tanggal_kembali_rencana,
        keperluan: form.keperluan,
        details: form.items.map(item => ({
          alat_id: parseInt(item.alat_id),
          jumlah: parseInt(item.jumlah),
        })),
      };
      await api.post('/peminjaman', payload);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Gagal mengajukan peminjaman';
      setErrors({ general: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <div style={{
          backgroundColor: '#fff', borderRadius: 20,
          border: '1px solid #E8EAF6',
          padding: '48px 40px', maxWidth: 440, width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(63,81,181,0.08)',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            backgroundColor: '#E8F5E9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <CheckCircle2 size={32} color="#2E7D32" />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#1A1A2E' }}>
            Pengajuan Terkirim
          </h2>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: '0 0 32px' }}>
            Permintaan peminjaman kamu sudah dikirim dan sedang menunggu persetujuan petugas.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/peminjam/riwayat')} style={btnPrimary}>
              <ClipboardList size={15} /> Lihat Riwayat
            </button>
            <button onClick={() => navigate('/peminjam/katalog')} style={btnOutline}>
              Kembali ke Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#3F51B5', fontWeight: 600, fontSize: 14,
          padding: 0, marginBottom: 12,
        }}>
          <ArrowLeft size={15} /> Kembali
        </button>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1A1A2E' }}>Ajukan Peminjaman</h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>Isi form berikut untuk mengajukan peminjaman alat</p>
      </div>

      {errors.general && (
        <div style={{
          padding: '12px 16px', backgroundColor: '#FFEBEE',
          borderRadius: 10, border: '1px solid #EF9A9A',
          color: '#C62828', marginBottom: 20, fontSize: 14,
        }}>
          {errors.general}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #E8EAF6', overflow: 'hidden' }}>

        {/* Section 1: Jadwal */}
        <div style={sectionStyle}>
          <h3 style={sectionTitle}>
            <Calendar size={16} color="#3F51B5" /> Jadwal Peminjaman
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Tanggal Pinjam *</label>
              <input type="date" min={today} value={form.tanggal_pinjam}
                onChange={e => setForm(f => ({ ...f, tanggal_pinjam: e.target.value }))}
                style={{ ...inputStyle, borderColor: errors.tanggal_pinjam ? '#F44336' : '#E0E0E0' }}
              />
              {errors.tanggal_pinjam && <p style={errorText}>{errors.tanggal_pinjam}</p>}
            </div>
            <div>
              <label style={labelStyle}>Rencana Tanggal Kembali *</label>
              <input type="date" min={form.tanggal_pinjam || today} value={form.tanggal_kembali_rencana}
                onChange={e => setForm(f => ({ ...f, tanggal_kembali_rencana: e.target.value }))}
                style={{ ...inputStyle, borderColor: errors.tanggal_kembali_rencana ? '#F44336' : '#E0E0E0' }}
              />
              {errors.tanggal_kembali_rencana && <p style={errorText}>{errors.tanggal_kembali_rencana}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Keperluan */}
        <div style={sectionStyle}>
          <h3 style={sectionTitle}>
            <FileText size={16} color="#3F51B5" /> Keperluan
          </h3>
          <textarea
            rows={3}
            placeholder="Jelaskan keperluan peminjaman alat ini..."
            value={form.keperluan}
            onChange={e => setForm(f => ({ ...f, keperluan: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical', borderColor: errors.keperluan ? '#F44336' : '#E0E0E0' }}
          />
          {errors.keperluan && <p style={errorText}>{errors.keperluan}</p>}
        </div>

        {/* Section 3: Alat */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ ...sectionTitle, marginBottom: 0 }}>
              <Wrench size={16} color="#3F51B5" /> Pilih Alat
            </h3>
            <button onClick={addItem} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', borderRadius: 8,
              border: '1.5px solid #3F51B5',
              backgroundColor: 'transparent', color: '#3F51B5',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
              <Plus size={14} /> Tambah Alat
            </button>
          </div>

          {errors.items && <p style={{ ...errorText, marginBottom: 12 }}>{errors.items}</p>}

          {form.items.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px',
              backgroundColor: '#F5F6FA', borderRadius: 12, color: '#888',
            }}>
              <p style={{ margin: 0, fontSize: 13 }}>Belum ada alat dipilih. Klik "+ Tambah Alat"</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.items.map((item, idx) => {
                const selected = katalog.find(a => a.id === parseInt(item.alat_id));
                return (
                  <div key={idx} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto',
                    gap: 10, alignItems: 'start',
                    padding: 14, backgroundColor: '#F5F6FA',
                    borderRadius: 12, border: '1px solid #E8EAF6',
                  }}>
                    <div>
                      <select
                        value={item.alat_id}
                        onChange={e => updateItem(idx, 'alat_id', e.target.value)}
                        style={{ ...inputStyle, borderColor: errors[`item_${idx}_alat`] ? '#F44336' : '#E0E0E0' }}
                      >
                        <option value="">-- Pilih Alat --</option>
                        {katalog.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.nama_alat} (Stok: {a.stok_total})
                          </option>
                        ))}
                      </select>
                      {errors[`item_${idx}_alat`] && <p style={errorText}>{errors[`item_${idx}_alat`]}</p>}
                      {selected && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                          <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>
                            Stok tersedia: {selected.stok_total}
                          </span>
                          <span style={{ fontSize: 11, color: '#888' }}>• {selected.kategori?.nama_kategori}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="number" min={1}
                        max={selected?.stok_total ?? 999}
                        value={item.jumlah}
                        onChange={e => updateItem(idx, 'jumlah', parseInt(e.target.value) || 1)}
                        style={{ ...inputStyle, width: 72, textAlign: 'center', borderColor: errors[`item_${idx}_jumlah`] ? '#F44336' : '#E0E0E0' }}
                        placeholder="Jml"
                      />
                      {errors[`item_${idx}_jumlah`] && <p style={{ ...errorText, width: 80 }}>{errors[`item_${idx}_jumlah`]}</p>}
                    </div>
                    <button onClick={() => removeItem(idx)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '10px 12px', borderRadius: 8,
                      border: '1px solid #EF9A9A',
                      backgroundColor: '#FFEBEE', color: '#F44336',
                      cursor: 'pointer', marginTop: 1,
                    }}>
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ ...sectionStyle, borderTop: '1px solid #E8EAF6', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/peminjam/katalog')} style={btnOutline}>Batal</button>
          <button
            onClick={handleSubmit}
            disabled={submitting || loadingKatalog}
            style={{ ...btnPrimary, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionStyle = { padding: '24px', borderBottom: '1px solid #F0F0F0' };
const sectionTitle = {
  margin: '0 0 16px', fontSize: 15, fontWeight: 700,
  color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: 8,
};
const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#555' };
const inputStyle = {
  width: '100%', padding: '10px 12px',
  borderRadius: 8, border: '1.5px solid #E0E0E0',
  fontSize: 14, color: '#1A1A2E',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', backgroundColor: '#fff',
};
const errorText = { margin: '4px 0 0', fontSize: 12, color: '#F44336' };
const btnPrimary = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '12px 28px', borderRadius: 10, border: 'none',
  backgroundColor: '#3F51B5', color: '#fff',
  fontSize: 14, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
};
const btnOutline = {
  padding: '12px 28px', borderRadius: 10,
  border: '2px solid #3F51B5',
  backgroundColor: 'transparent', color: '#3F51B5',
  fontSize: 14, fontWeight: 700, cursor: 'pointer',
};