import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const BASE_URL = 'http://127.0.0.1:8000/storage/';

export default function DetailAlat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alat, setAlat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/katalog/${id}`)
      .then(res => setAlat(res.data.data ?? res.data))
      .catch(() => navigate('/peminjam/katalog'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <div style={spinnerStyle} />
    </div>
  );

  if (!alat) return null;

  const isAvailable = alat.stok_total > 0 && alat.kondisi !== 'rusak';
  const kondisiMap = { baik: { label: 'Baik', color: '#4CAF50', bg: '#E8F5E9' }, rusak: { label: 'Rusak', color: '#F44336', bg: '#FFEBEE' }, perbaikan: { label: 'Dalam Perbaikan', color: '#FF9800', bg: '#FFF3E0' } };
  const kondisi = kondisiMap[alat.kondisi] ?? { label: alat.kondisi, color: '#666', bg: '#F5F5F5' };

  return (
    <div>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, fontSize: 13, color: '#888' }}>
        <span
          onClick={() => navigate('/peminjam/katalog')}
          style={{ cursor: 'pointer', color: '#3F51B5', fontWeight: 500 }}
        >← Katalog</span>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#1A1A2E' }}>{alat.nama_alat}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32 }}>
        {/* Image */}
        <div>
          <div style={{
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#E8EAF6',
            aspectRatio: '4/3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E8EAF6',
          }}>
            {alat.gambar ? (
              <img src={`${BASE_URL}${alat.gambar}`} alt={alat.nama_alat}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 80, opacity: 0.3 }}>🔧</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          {alat.kategori && (
            <span style={{
              fontSize: 12, fontWeight: 600, color: '#3F51B5',
              backgroundColor: '#E8EAF6', padding: '3px 10px',
              borderRadius: 6, letterSpacing: '0.3px',
            }}>
              {alat.kategori.nama_kategori}
            </span>
          )}

          <h1 style={{ margin: '12px 0 4px', fontSize: 28, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>
            {alat.nama_alat}
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#888' }}>Kode: {alat.kode_alat}</p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <div style={statCard}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#3F51B5' }}>{alat.stok_total}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Total Stok</div>
            </div>
            <div style={{ ...statCard, backgroundColor: kondisi.bg }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: kondisi.color }}>{kondisi.label}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Kondisi</div>
            </div>
            <div style={{ ...statCard, backgroundColor: isAvailable ? '#E8F5E9' : '#FFEBEE' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isAvailable ? '#2E7D32' : '#C62828' }}>
                {isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Status</div>
            </div>
          </div>

          {/* Description */}
          {alat.deskripsi && (
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Deskripsi
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: '#444', lineHeight: 1.7 }}>
                {alat.deskripsi}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/peminjam/katalog')}
              style={{
                flex: 1, padding: '14px 0',
                borderRadius: 12, border: '2px solid #3F51B5',
                backgroundColor: 'transparent', color: '#3F51B5',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ← Kembali
            </button>
            <button
              onClick={() => isAvailable && navigate(`/peminjam/pinjam/${alat.id}`)}
              disabled={!isAvailable}
              style={{
                flex: 2, padding: '14px 0',
                borderRadius: 12, border: 'none',
                backgroundColor: isAvailable ? '#3F51B5' : '#E0E0E0',
                color: isAvailable ? '#fff' : '#9E9E9E',
                fontSize: 15, fontWeight: 700,
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                boxShadow: isAvailable ? '0 4px 16px rgba(63,81,181,0.35)' : 'none',
              }}
            >
              {isAvailable ? ' Ajukan Peminjaman' : 'Tidak Dapat Dipinjam'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const statCard = {
  flex: 1, padding: '14px 16px',
  backgroundColor: '#F5F6FA',
  borderRadius: 12,
  border: '1px solid #E8EAF6',
  textAlign: 'center',
};

const spinnerStyle = {
  width: 40, height: 40,
  border: '3px solid #E8EAF6',
  borderTopColor: '#3F51B5',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};