import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const BASE_URL = 'http://127.0.0.1:8000/storage/';

export default function AlatCard({ alat }) {
  const navigate = useNavigate();

  const stokAvail = alat.stok_total ?? 0;
  const isAvailable = stokAvail > 0 && alat.kondisi !== 'rusak';

  const kondisiColor = {
    baik: '#4CAF50',
    rusak: '#F44336',
    perbaikan: '#FF9800',
  }[alat.kondisi] || '#9E9E9E';

  const kondisiLabel = {
    baik: 'Baik',
    rusak: 'Rusak',
    perbaikan: 'Perbaikan',
  }[alat.kondisi] || alat.kondisi;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #E8EAF6',
        transition: 'all 0.2s',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(63,81,181,0.15)';
        e.currentTarget.style.borderColor = '#7986CB';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#E8EAF6';
      }}
    >
      {/* Stock Badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 2,
        backgroundColor: isAvailable ? '#E8F5E9' : '#FFEBEE',
        color: isAvailable ? '#2E7D32' : '#C62828',
        fontSize: 11, fontWeight: 700,
        padding: '4px 10px',
        borderRadius: 20,
        border: `1px solid ${isAvailable ? '#A5D6A7' : '#EF9A9A'}`,
      }}>
        {isAvailable ? `Stok: ${stokAvail}` : 'Habis'}
      </div>

      {/* Image */}
      <div style={{
        height: 160,
        backgroundColor: '#E8EAF6',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {alat.gambar ? (
          <img
            src={`${BASE_URL}${alat.gambar}`}
            alt={alat.nama_alat}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        ) : (
          <Wrench size={36} color="#C5CAE9" />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        {/* Kategori */}
        {alat.kategori && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: '#3F51B5',
            backgroundColor: '#E8EAF6',
            padding: '2px 8px', borderRadius: 6,
            letterSpacing: '0.3px',
          }}>
            {alat.kategori.nama_kategori}
          </span>
        )}

        <h3 style={{
          margin: '8px 0 4px',
          fontSize: 15, fontWeight: 700,
          color: '#1A1A2E',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {alat.nama_alat}
        </h3>

        <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
          Kode: {alat.kode_alat}
        </div>

        {/* Kondisi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <span style={{
            display: 'inline-block',
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: kondisiColor,
          }} />
          <span style={{ fontSize: 12, color: '#666' }}>Kondisi: <strong style={{ color: kondisiColor }}>{kondisiLabel}</strong></span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate(`/peminjam/alat/${alat.id}`)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              border: '1.5px solid #3F51B5',
              backgroundColor: 'transparent',
              color: '#3F51B5',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E8EAF6'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Detail
          </button>
          <button
            onClick={() => isAvailable && navigate(`/peminjam/pinjam/${alat.id}`)}
            disabled={!isAvailable}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 8,
              border: 'none',
              backgroundColor: isAvailable ? '#3F51B5' : '#E0E0E0',
              color: isAvailable ? '#fff' : '#9E9E9E',
              fontSize: 13, fontWeight: 600,
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (isAvailable) e.currentTarget.style.backgroundColor = '#303F9F'; }}
            onMouseLeave={e => { if (isAvailable) e.currentTarget.style.backgroundColor = '#3F51B5'; }}
          >
            Pinjam
          </button>
        </div>
      </div>
    </div>
  );
}