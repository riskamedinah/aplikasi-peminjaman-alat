import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CalendarClock,
  CheckCircle,
  ClipboardList,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Plus,
} from 'lucide-react';
import api from '../../services/api';

const STATUS_CONFIG = {
  menunggu: { label: 'Menunggu', color: '#F57C00', bg: '#FFF3E0', border: '#FFB74D' },
  disetujui: { label: 'Disetujui', color: '#1565C0', bg: '#E3F2FD', border: '#64B5F6' },
  dipinjam: { label: 'Sedang Dipinjam', color: '#2E7D32', bg: '#E8F5E9', border: '#81C784' },
  dikembalikan: { label: 'Dikembalikan', color: '#555', bg: '#F5F5F5', border: '#BDBDBD' },
  ditolak: { label: 'Ditolak', color: '#C62828', bg: '#FFEBEE', border: '#EF9A9A' },
  dibatalkan: { label: 'Dibatalkan', color: '#888', bg: '#F5F5F5', border: '#E0E0E0' },
};

export default function RiwayatPeminjaman() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [reapplyingId, setReapplyingId] = useState(null);

  const fetchRiwayat = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', 10);
      if (filterStatus) params.set('filter[status]', filterStatus);
      const res = await api.get(`/peminjaman-saya?${params}`);
      setData(res.data.data ?? []);
      setPagination(res.data.meta ?? res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchRiwayat(); }, [fetchRiwayat]);
  useEffect(() => { setPage(1); }, [filterStatus]);

  const handleReapply = async (id) => {
    if (!window.confirm('Ajukan kembali peminjaman ini?')) return;
    setReapplyingId(id);
    try {
      await api.put(`/peminjaman/${id}/ajukan-kembali`);
      fetchRiwayat();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Gagal mengajukan kembali');
    } finally {
      setReapplyingId(null);
    }
  };

  const formatDate = (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const totalPages = pagination?.last_page ?? 1;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1A1A2E' }}>Riwayat Peminjaman</h1>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>Lihat semua pengajuan dan status peminjaman kamu</p>
        </div>
        <button
          onClick={() => navigate('/peminjam/pinjam')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 10, border: 'none',
            backgroundColor: '#3F51B5', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(63,81,181,0.25)',
          }}
        >
          <Plus size={15} /> Ajukan Baru
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        <FilterTab active={filterStatus === ''} onClick={() => setFilterStatus('')}>Semua</FilterTab>
        {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
          <FilterTab key={val} active={filterStatus === val} onClick={() => setFilterStatus(val)}>
            {label}
          </FilterTab>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ height: 100, borderRadius: 14, backgroundColor: '#E8EAF6', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          backgroundColor: '#fff', borderRadius: 16,
          border: '1px solid #E8EAF6',
        }}>
          <h3 style={{ margin: 0, color: '#1A1A2E', fontSize: 18, fontWeight: 700 }}>Belum ada riwayat</h3>
          <p style={{ color: '#888', marginTop: 8, marginBottom: 20 }}>
            {filterStatus ? 'Tidak ada peminjaman dengan status ini' : 'Kamu belum pernah mengajukan peminjaman'}
          </p>
          {!filterStatus && (
            <button onClick={() => navigate('/peminjam/katalog')} style={{
              padding: '10px 24px', borderRadius: 8, border: 'none',
              backgroundColor: '#3F51B5', color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              Lihat Katalog
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map(item => {
            const st = STATUS_CONFIG[item.status] ?? { label: item.status, color: '#888', bg: '#F5F5F5', border: '#E0E0E0' };
            const isExpanded = expandedId === item.id;
            const isLate = item.status === 'dipinjam' &&
  item.tanggal_kembali_rencana &&
  new Date(item.tanggal_kembali_rencana) < new Date(new Date().toDateString());

            return (
              <div key={item.id} style={{
                backgroundColor: '#fff', borderRadius: 16,
                border: `1px solid ${isExpanded ? '#7986CB' : '#E8EAF6'}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                {/* Main Row */}
                <div
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                 {/* Status */}
<div style={{
  backgroundColor: st.bg, border: `1px solid ${st.border}`,
  borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap',
}}>
  <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{st.label}</span>
</div>

{/* Tambah ini setelah badge status */}
{isLate && (
  <div style={{
    backgroundColor: '#FFEBEE', border: '1px solid #EF9A9A',
    borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: 4,
  }}>
    <span style={{ fontSize: 12, fontWeight: 700, color: '#C62828' }}>
      Terlambat {Math.floor((new Date() - new Date(item.tanggal_kembali_rencana)) / (1000 * 60 * 60 * 24))} hari
    </span>
  </div>
)}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A2E', marginBottom: 4 }}>
                      Peminjaman #{item.id}
                      {item.details?.length > 0 && (
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#888', fontWeight: 400 }}>
                          {item.details.length} alat
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {formatDate(item.tanggal_pinjam)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarClock size={12} /> Rencana: {formatDate(item.tanggal_kembali_rencana)}
                      </span>
                      {item.tanggal_kembali_actual && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={12} color="#2E7D32" /> Kembali: {formatDate(item.tanggal_kembali_actual)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Keperluan */}
                  <div style={{ fontSize: 13, color: '#555', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.keperluan}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {(item.status === 'ditolak' || item.status === 'dibatalkan') && (
                      <button
                        onClick={e => { e.stopPropagation(); handleReapply(item.id); }}
                        disabled={reapplyingId === item.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '6px 12px', borderRadius: 8,
                          border: '1.5px solid #3F51B5',
                          backgroundColor: 'transparent', color: '#3F51B5',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        <RefreshCw size={12} />
                        {reapplyingId === item.id ? '...' : 'Ajukan Ulang'}
                      </button>
                    )}
                    {isExpanded
                      ? <ChevronUp size={16} color="#999" />
                      : <ChevronDown size={16} color="#999" />
                    }
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #E8EAF6', padding: '16px 20px', backgroundColor: '#FAFBFF' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      {/* Alat List */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Detail Alat
                        </div>
                        {item.details?.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {item.details.map(d => (
                              <div key={d.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '8px 12px', backgroundColor: '#fff',
                                borderRadius: 8, border: '1px solid #E8EAF6',
                              }}>
                                <span style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 500 }}>{d.alat?.nama_alat}</span>
                                <span style={{ fontSize: 12, color: '#3F51B5', fontWeight: 700 }}>×{d.jumlah}</span>
                              </div>
                            ))}
                          </div>
                        ) : <p style={{ fontSize: 13, color: '#888' }}>Tidak ada detail</p>}
                      </div>

                      {/* Info */}
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Informasi
                        </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
  {isLate && (
    <div style={{
      padding: '8px 12px', backgroundColor: '#FFEBEE',
      borderRadius: 8, border: '1px solid #EF9A9A',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#C62828', marginBottom: 4 }}>
        TERLAMBAT DIKEMBALIKAN
      </div>
      <div style={{ fontSize: 13, color: '#C62828' }}>
        Sudah melewati deadline {Math.floor((new Date() - new Date(item.tanggal_kembali_rencana)) / (1000 * 60 * 60 * 24))} hari.
        Segera kembalikan alat ke petugas.
      </div>
    </div>
  )}
                          
                          <InfoRow label="Keperluan" value={item.keperluan} />
                          {item.petugas_approval && <InfoRow label="Disetujui oleh" value={item.petugas_approval.name} />}
                          {item.catatan_petugas && (
                            <div style={{ padding: '8px 12px', backgroundColor: '#FFF8E1', borderRadius: 8, border: '1px solid #FFD54F' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#F57F17', marginBottom: 4 }}>CATATAN PETUGAS</div>
                              <div style={{ fontSize: 13, color: '#333' }}>{item.catatan_petugas}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={paginationBtn(page === 1)}>←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={paginationBtn(false, p === page)}>{p}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={paginationBtn(page === totalPages)}>→</button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

function FilterTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 20,
        border: `1.5px solid ${active ? '#3F51B5' : '#E0E0E0'}`,
        backgroundColor: active ? '#3F51B5' : '#fff',
        color: active ? '#fff' : '#555',
        fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 12, color: '#888', minWidth: 100, paddingTop: 1 }}>{label}:</span>
      <span style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 500 }}>{value || '-'}</span>
    </div>
  );
}

const paginationBtn = (disabled, active = false) => ({
  padding: '8px 14px', borderRadius: 8,
  border: `1.5px solid ${active ? '#3F51B5' : '#E0E0E0'}`,
  backgroundColor: active ? '#3F51B5' : '#fff',
  color: active ? '#fff' : disabled ? '#ccc' : '#333',
  fontSize: 14, cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: active ? 700 : 400,
});