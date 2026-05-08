import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle, AlertCircle, UserCheck,
  TrendingUp, TrendingDown, ChevronRight,
  ClipboardList, Calendar, RefreshCw, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useDataContext } from '../../contexts/DataContext';

// ==================== STAT CARD (identik dengan Admin) ====================
function StatCard({ label, value, icon: Icon, accentColor, bgColor, trend, subtitle }) {
  const isPositive = trend >= 0;
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden bg-white border border-gray-100 shadow-sm">
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl" style={{ background: accentColor, opacity: 0.1 }} />
      <div className="flex items-start justify-between relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bgColor }}>
          <Icon size={18} style={{ color: accentColor }} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend >= 0 ? '+' : ''}{trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">{label}</p>
        {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ==================== SKELETON LOADERS (identik Admin) ====================
function SkeletonStatCard() {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="w-12 h-6 rounded-full bg-gray-100" />
      </div>
      <div>
        <div className="h-8 w-24 bg-gray-100 rounded-lg mb-2" />
        <div className="h-4 w-16 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
}

function SkeletonChartLoader() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="mb-4">
        <div className="h-6 w-48 bg-gray-100 rounded-lg mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
      <div className="h-48 bg-gray-50 rounded-2xl border border-dashed border-gray-200 animate-pulse" />
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-3">
        <div className="space-y-1">
          <div className="h-4 w-32 bg-gray-100 rounded-lg" />
          <div className="h-3 w-20 bg-gray-100 rounded-lg" />
        </div>
      </td>
      <td className="py-3"><div className="h-4 w-24 bg-gray-100 rounded-lg" /></td>
      <td className="py-3"><div className="h-6 w-16 bg-gray-100 rounded-lg" /></td>
      <td className="py-3"><div className="h-4 w-16 bg-gray-100 rounded-lg" /></td>
    </tr>
  );
}

function SkeletonTopAlatLoader() {
  return (
    <div className="space-y-5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="animate-pulse">
          <div className="flex justify-between text-sm mb-1.5">
            <div className="h-4 w-32 bg-gray-100 rounded-lg" />
            <div className="h-4 w-12 bg-gray-100 rounded-lg" />
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ==================== LINE CHART (identik Admin) ====================
function LineChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-400 text-sm italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
        <ClipboardList size={24} className="mb-2 opacity-20" />
        <p>Belum ada data tren peminjaman</p>
      </div>
    );
  }

  const W = 1000;
  const H = 300;
  const PAD_TOP = 40;
  const PAD_BTM = 60;
  const PAD_SIDE = 60;

  const maxVal = Math.max(...data.map(d => d.total || 0), 5);

  const pts = data.map((d, i) => ({
    x: PAD_SIDE + (i / (data.length - 1 || 1)) * (W - PAD_SIDE * 2),
    y: PAD_TOP + (1 - (d.total || 0) / maxVal) * (H - PAD_TOP - PAD_BTM),
    val: d.total,
    date: d.date,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PAD_BTM} L ${pts[0].x} ${H - PAD_BTM} Z`;

  return (
    <div className="w-full h-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="chartGradPetugas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3F51B5" stopOpacity=".25" />
            <stop offset="100%" stopColor="#3F51B5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((t, i) => {
          const yPos = PAD_TOP + t * (H - PAD_TOP - PAD_BTM);
          return (
            <g key={i}>
              <line x1={PAD_SIDE} y1={yPos} x2={W - PAD_SIDE} y2={yPos} stroke="#F1F5F9" strokeWidth="2" />
              <text x={PAD_SIDE - 15} y={yPos + 5} textAnchor="end" fontSize="14" fill="#94A3B8">
                {Math.round(maxVal * (1 - t))}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#chartGradPetugas)" />
        <path d={linePath} fill="none" stroke="#3F51B5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#3F51B5" strokeWidth="3" />
            <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize="14" fontWeight="800" fill="#3F51B5">
              {p.val}
            </text>
            <text x={p.x} y={H - 25} textAnchor="middle" fontSize="14" fill="#64748B">
              {p.date ? p.date.split('-').reverse().slice(0, 2).join('/') : ''}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ==================== STATUS BADGE ====================
function StatusBadge({ status, isLate }) {
  if (status === 'menunggu') {
    return (
      <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-amber-50 text-amber-600">
        Menunggu
      </span>
    );
  }
  if (status === 'dipinjam' || status === 'disetujui') {
    return isLate
      ? (
        <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-red-50 text-red-600 flex items-center gap-1">
          <AlertCircle size={10} /> Terlambat
        </span>
      ) : (
        <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-green-50 text-green-600">
          {status === 'dipinjam' ? 'Dipinjam' : 'Disetujui'}
        </span>
      );
  }
  if (status === 'dikembalikan') {
    return (
      <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-blue-50 text-blue-600">
        Dikembalikan
      </span>
    );
  }
  return (
    <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-gray-50 text-gray-600">
      {status}
    </span>
  );
}

// ==================== MAIN DASHBOARD PETUGAS ====================
export default function PetugasDashboard() {
  const navigate = useNavigate();
  const { dashboardPetugasData, setDashboardPetugasData } = useDataContext();
  const [loading, setLoading] = useState(!dashboardPetugasData);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard/petugas');
      if (res.data.status === 'success') {
        setDashboardPetugasData(res.data.data);
      }
    } catch (err) {
      console.error('Gagal load data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

useEffect(() => {
  fetchData();
}, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setDashboardPetugasData(null);
    fetchData();
  };

  const stats = dashboardPetugasData?.stats;

  const STAT_CARDS = [
     {
    label: 'Pending Verifikasi',
    value: stats?.pending,
    icon: Clock,
    accentColor: '#F59E0B',
    bgColor: '#FEF3C7',
    subtitle: 'Perlu diproses',
    trend: stats?.pending_growth ?? 0,
  },
  {
    label: 'Sedang Dipinjam',
    value: stats?.sedang_berlangsung,
    icon: UserCheck,
    accentColor: '#10B981',
    bgColor: '#D1FAE5',
    subtitle: 'Aktif saat ini',
    trend: stats?.berlangsung_growth ?? 0,
  },
  {
    label: 'Terlambat',
    value: stats?.terlambat,
    icon: AlertCircle,
    accentColor: '#EF4444',
    bgColor: '#FEE2E2',
    subtitle: 'Melewati deadline',
    trend: stats?.terlambat_growth ?? 0,
  },
  {
    label: 'Dikembalikan Hari Ini',
    value: stats?.dikembalikan_hari_ini,
    icon: CheckCircle,
    accentColor: '#3F51B5',
    bgColor: '#E8EAF6',
    trend: stats?.growth ?? 0,
  },
  ];

  return (
    <div className="space-y-6 font-['Sora']">

      {/* ── Stat Cards (identik layout Admin) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)
          : STAT_CARDS.map(c => <StatCard key={c.label} {...c} />)
        }
      </div>

      {/* ── Tren Chart (identik Admin) ── */}
      {loading ? (
        <SkeletonChartLoader />
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-base font-bold text-gray-800">Tren Peminjaman (7 Hari Terakhir)</p>
              <p className="text-xs text-gray-400">Statistik harian aktivitas peminjaman</p>
            </div>
          </div>
          <LineChart data={dashboardPetugasData?.trend || []} />
        </div>
      )}

      {/* ── Bottom Grid (identik layout Admin: 3+2 kolom) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Tabel Peminjaman Perlu Diproses — 3 kolom */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-800">Peminjaman Perlu Diproses</h3>
            <Link to="/petugas/peminjaman" className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
              Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-50">
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
                  : dashboardPetugasData?.peminjaman_terbaru?.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3">
                        <p className="text-sm font-semibold text-gray-700">{item.user?.name || 'User'}</p>
                        <p className="text-[10px] text-gray-400">ID: #{item.id}</p>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                        <p className="text-[10px] text-gray-400">
                          Rencana: {new Date(item.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                      <td className="py-3">
                        <StatusBadge status={item.status} isLate={item.is_late} />
                      </td>
                      <td className="py-3">
{item.status === 'menunggu' && (
  <button
    onClick={() => navigate('/petugas/peminjaman', { state: { openApprovalId: item.id } })}
    className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1"
  >
    Proses <ArrowRight size={12} />
  </button>
)}

{(item.status === 'dipinjam' || item.status === 'disetujui') && (
  <button
    onClick={() => navigate('/petugas/peminjaman', { state: { openApprovalId: item.id } })}
    className="text-green-600 hover:text-green-800 text-xs font-medium flex items-center gap-1"
  >
    Kembalikan <ArrowRight size={12} />
  </button>
)}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Kanan — 2 kolom */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top Alat Dipinjam (identik style Admin) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-5">Top Alat Dipinjam</h3>
            {loading ? (
              <SkeletonTopAlatLoader />
            ) : (
              <div className="space-y-5">
                {dashboardPetugasData?.top_alat_dipinjam?.length > 0
                  ? dashboardPetugasData.top_alat_dipinjam.map((alat, i) => {
                    const maxCount = dashboardPetugasData.top_alat_dipinjam[0]?.total_dipinjam || 1;
                    return (
                      <div key={alat.id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-gray-700 truncate mr-2">{i + 1}. {alat.nama_alat}</span>
                          <span className="text-indigo-600 font-bold flex-none">{alat.total_dipinjam}x</span>
                        </div>
                        <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(alat.total_dipinjam / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                  : (
                    <p className="text-center text-gray-400 text-sm py-4 italic">
                      Tidak ada alat yang sedang dipinjam
                    </p>
                  )
                }
              </div>
            )}
          </div>

          {/* Pinjaman Perlu Dikembalikan dan Terlambat */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-800">Pinjaman Perlu Dikembalikan dan Terlambat</h3>
              <Calendar size={16} className="text-gray-400" />
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardPetugasData?.segera_dikembalikan?.length > 0
                  ? dashboardPetugasData.segera_dikembalikan.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border ${item.hari_tersisa <= 0 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}
                    >
                      <p className="text-sm font-semibold text-gray-800">{item.user_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Deadline: {new Date(item.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                       <span className={`text-xs font-bold ${item.hari_tersisa <= 0 ? 'text-red-600' : 'text-amber-600'}`}>
  {item.hari_tersisa <= 0 
    ? `⚠ Terlambat ${Math.abs(item.hari_tersisa)} hari` 
    : `${item.hari_tersisa} hari tersisa`}
</span>
                       <button
  onClick={() => navigate('/petugas/peminjaman', { state: { openApprovalId: item.id } })}
  className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
>
  Proses <ArrowRight size={10} />
</button>
                      </div>
                    </div>
                  ))
                  : (
                    <p className="text-center text-gray-400 text-sm py-4 italic">
                      Tidak ada peminjaman yang akan segera berakhir
                    </p>
                  )
                }
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}