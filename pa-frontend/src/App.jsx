import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './views/admin/Dashboard';
import Users from './views/admin/Users';
import Alat from './views/admin/Alat';
import Kategori from './views/admin/Kategori';
import Peminjaman from './views/admin/Peminjaman';
import LogAktivitas from './views/admin/LogAktivitas';
import Login from './views/auth/Login';
import PetugasLayout from './layouts/PetugasLayout';
import PetugasDashboard from './views/petugas/Dashboard';
import PetugasPeminjaman from './views/petugas/Peminjaman';
import PetugasAlat from './views/petugas/Alat';

// ── Peminjam ──────────────────────────────────────────────
import PeminjamLayout from './layouts/PeminjamLayout';
import Katalog from './views/peminjam/Katalog';
import DetailAlat from './views/peminjam/DetailAlat';
import FormPeminjaman from './views/peminjam/FormPeminjaman';
import RiwayatPeminjaman from './views/peminjam/RiwayatPeminjaman';

import { DataProvider } from './contexts/DataContext';

// ── Redirect by role after login ──────────────────────────
const roleHomeMap = {
  admin: '/admin/dashboard',
  petugas: '/petugas/dashboard',
  peminjam: '/peminjam/katalog',
};

// ── Guards ────────────────────────────────────────────────
// Hanya blokir jika benar-benar tidak ada token — tidak perlu cek isLoading
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

// Jika sudah login, redirect ke halaman sesuai role
const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token && role) {
    const home = roleHomeMap[role] ?? `/${role}/dashboard`;
    return <Navigate to={home} replace />;
  }
  return children;
};

// Redirect "/" ke halaman sesuai role, atau ke login
const RootRedirect = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token && role) {
    const home = roleHomeMap[role] ?? `/${role}/dashboard`;
    return <Navigate to={home} replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />

          {/* ADMIN */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="alat" element={<Alat />} />
            <Route path="kategori" element={<Kategori />} />
            <Route path="peminjaman" element={<Peminjaman />} />
            <Route path="log" element={<LogAktivitas />} />
          </Route>

          {/* PETUGAS */}
          <Route path="/petugas" element={<ProtectedRoute><PetugasLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/petugas/dashboard" replace />} />
            <Route path="dashboard" element={<PetugasDashboard />} />
            <Route path="peminjaman" element={<PetugasPeminjaman />} />
            <Route path="Alat" element={<PetugasAlat />} />
          </Route>

          {/* PEMINJAM */}
          <Route path="/peminjam" element={<ProtectedRoute><PeminjamLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/peminjam/katalog" replace />} />
            <Route path="katalog" element={<Katalog />} />
            <Route path="alat/:id" element={<DetailAlat />} />
            <Route path="pinjam" element={<FormPeminjaman />} />
            <Route path="pinjam/:id" element={<FormPeminjaman />} />
            <Route path="riwayat" element={<RiwayatPeminjaman />} />
          </Route>

          {/* Root & catch-all — JANGAN redirect semua ke /login,
              biarkan ProtectedRoute di atas yang handle akses */}
          <Route path="/" element={<RootRedirect />} />
          {/* Hapus catch-all <Route path="*"> karena ini yang menyebabkan
              loop: setiap navigate ke /peminjam/... di-catch lalu redirect ke
              /login, lalu DataProvider re-trigger, dst. */}
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;