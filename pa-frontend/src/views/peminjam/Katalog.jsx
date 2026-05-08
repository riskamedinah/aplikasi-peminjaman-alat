import { useState, useEffect, useCallback } from 'react';
import AlatCard from '../../components/AlatCard';
import api from '../../services/api';

export default function Katalog() {
  const [alat, setAlat] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('');
  const [filterStok, setFilterStok] = useState(''); // 'tersedia' | 'habis' | ''
  const [sortBy, setSortBy] = useState('nama_alat');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

useEffect(() => {
  api.get('/katalog?limit=999').then(res => {
    const data = res.data.data ?? [];
    const uniqueKategori = [];
    const seen = new Set();
    data.forEach(a => {
      if (a.kategori && !seen.has(a.kategori.id)) {
        seen.add(a.kategori.id);
        uniqueKategori.push(a.kategori);
      }
    });
    setKategoriList(uniqueKategori);
  }).catch(() => {});
}, []);

  const fetchAlat = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('limit', '12');
      params.set('page', page);
      if (search) params.set('search', search);
      if (filterKategori) params.set('filter[kategori_id]', filterKategori);
      if (filterKondisi) params.set('filter[kondisi]', filterKondisi);
      params.set('sort_by', sortBy);
      params.set('sort_order', sortOrder);

      const res = await api.get(`/katalog?${params.toString()}`);
      let data = res.data.data ?? [];

      // client-side filter stok (karena backend mungkin belum ada filter ini)
      if (filterStok === 'tersedia') {
        data = data.filter(a => a.stok_total > 0 && a.kondisi !== 'rusak');
      } else if (filterStok === 'habis') {
        data = data.filter(a => a.stok_total === 0 || a.kondisi === 'rusak');
      }

      setAlat(data);
      setPagination(res.data.meta ?? res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filterKategori, filterKondisi, filterStok, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchAlat();
  }, [fetchAlat]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, filterKategori, filterKondisi, filterStok, sortBy, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setSearch('');
    setSearchInput('');
    setFilterKategori('');
    setFilterKondisi('');
    setFilterStok('');
    setSortBy('nama_alat');
    setSortOrder('asc');
  };

  const hasActiveFilter = search || filterKategori || filterKondisi || filterStok;

  const totalPages = pagination?.last_page ?? 1;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.5px' }}>
          Katalog Alat
        </h1>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
          Temukan dan pinjam alat yang kamu butuhkan
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex', gap: 8,
          backgroundColor: '#fff',
          borderRadius: 14,
          border: '2px solid #E8EAF6',
          padding: '6px 6px 6px 16px',
          boxShadow: '0 2px 12px rgba(63,81,181,0.08)',
          transition: 'border-color 0.2s',
        }}
          onFocus={() => {}}
        >
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Cari nama alat..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, color: '#1A1A2E',
              backgroundColor: 'transparent',
            }}
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); setSearch(''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#999', padding: '0 4px' }}>
              ✕
            </button>
          )}
          <button type="submit" style={{
            backgroundColor: '#3F51B5', color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Cari
          </button>
        </div>
      </form>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24, alignItems: 'center' }}>
        {/* Kategori */}
        <select
          value={filterKategori}
          onChange={e => setFilterKategori(e.target.value)}
          style={selectStyle}
        >
          <option value="">Semua Kategori</option>
          {kategoriList.map(k => (
            <option key={k.id} value={k.id}>{k.nama_kategori}</option>
          ))}
        </select>

        {/* Kondisi */}
        <select value={filterKondisi} onChange={e => setFilterKondisi(e.target.value)} style={selectStyle}>
          <option value="">Semua Kondisi</option>
          <option value="baik">Kondisi Baik</option>
          <option value="rusak">Rusak</option>
          <option value="perbaikan">Dalam Perbaikan</option>
        </select>

        {/* Stok */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { val: '', label: 'Semua' },
            { val: 'tersedia', label: '✓ Tersedia' },
            { val: 'habis', label: '✕ Habis' },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setFilterStok(val)}
              style={{
                padding: '8px 14px',
                borderRadius: 20,
                border: `1.5px solid ${filterStok === val ? '#3F51B5' : '#E0E0E0'}`,
                backgroundColor: filterStok === val ? '#3F51B5' : '#fff',
                color: filterStok === val ? '#fff' : '#555',
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={`${sortBy}_${sortOrder}`} onChange={e => {
  const val = e.target.value;
  const lastUnderscore = val.lastIndexOf('_');
  setSortBy(val.substring(0, lastUnderscore));
  setSortOrder(val.substring(lastUnderscore + 1));
          }} style={selectStyle}>
            <option value="nama_alat_asc">Nama A–Z</option>
            <option value="nama_alat_desc">Nama Z–A</option>
            <option value="stok_total_desc">Stok Terbanyak</option>
            <option value="stok_total_asc">Stok Tersedikit</option>
          </select>

          {hasActiveFilter && (
            <button onClick={clearFilters} style={{
              padding: '8px 14px', borderRadius: 8,
              border: '1.5px solid #EF9A9A',
              backgroundColor: '#FFEBEE', color: '#C62828',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Result Info */}
      {!loading && (
        <div style={{ marginBottom: 16, fontSize: 13, color: '#888' }}>
          Menampilkan <strong style={{ color: '#3F51B5' }}>{alat.length}</strong> alat
          {search && <> untuk "<strong>{search}</strong>"</>}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{
              height: 320, borderRadius: 16,
              backgroundColor: '#E8EAF6',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      ) : alat.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          backgroundColor: '#fff', borderRadius: 16,
          border: '1px solid #E8EAF6',
        }}>
          <h3 style={{ margin: 0, color: '#1A1A2E', fontSize: 18, fontWeight: 700 }}>
            Tidak ada alat ditemukan
          </h3>
          <p style={{ color: '#888', marginTop: 8 }}>
            Coba ubah kata kunci pencarian atau reset filter
          </p>
          <button onClick={clearFilters} style={{
            marginTop: 16, padding: '10px 24px',
            backgroundColor: '#3F51B5', color: '#fff',
            border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Reset Filter
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {alat.map(a => <AlatCard key={a.id} alat={a} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            style={paginationBtn(page === 1)}
          >← Sebelumnya</button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) => p === '...' ? (
              <span key={`dots-${i}`} style={{ padding: '8px 4px', color: '#888' }}>…</span>
            ) : (
              <button key={p} onClick={() => setPage(p)} style={paginationBtn(false, p === page)}>
                {p}
              </button>
            ))
          }

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            style={paginationBtn(page === totalPages)}
          >Berikutnya →</button>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

const selectStyle = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1.5px solid #E0E0E0',
  backgroundColor: '#fff',
  fontSize: 13,
  color: '#333',
  cursor: 'pointer',
  outline: 'none',
};

const paginationBtn = (disabled, active = false) => ({
  padding: '8px 14px',
  borderRadius: 8,
  border: `1.5px solid ${active ? '#3F51B5' : '#E0E0E0'}`,
  backgroundColor: active ? '#3F51B5' : '#fff',
  color: active ? '#fff' : disabled ? '#ccc' : '#333',
  fontSize: 14,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: active ? 700 : 400,
});