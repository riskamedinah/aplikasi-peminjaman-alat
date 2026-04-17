import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './views/admin/Dashboard';
import Users from './views/admin/Users';
import Alat from './views/admin/Alat';
import Kategori from './views/admin/Kategori';
import Peminjaman from './views/admin/Peminjaman';
import LogAktivitas from './views/admin/LogAktivitas';
import Login from './views/auth/Login';
import { DataProvider } from './contexts/DataContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const handlePageshow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener('pageshow', handlePageshow);
    return () => window.removeEventListener('pageshow', handlePageshow);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DataProvider>
                <AdminLayout />
              </DataProvider>
            </ProtectedRoute>
          }
        >
          {/* Index otomatis ke dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="alat" element={<Alat />} />
          <Route path="kategori" element={<Kategori />} />
          <Route path="peminjaman" element={<Peminjaman />} />
          <Route path="log" element={<LogAktivitas />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;