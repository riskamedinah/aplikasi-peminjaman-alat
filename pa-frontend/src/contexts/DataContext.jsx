import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

// ── Context ───────────────────────────────────────────────────────────────────
const DataContext = createContext(null);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
};

// ── Provider ──────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [alat, setAlat] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [kategori, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardPetugasData, setDashboardPetugasData] = useState(null);

  // ── Load all initial data once
  const loadInitialData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Load current user dulu untuk tahu role
      const meRes = await api.get('/me');
    const userRole = meRes.data?.role ?? meRes.data?.user?.role;
console.log('Full ME response:', JSON.stringify(meRes.data));
console.log('Role detected:', userRole);
    setCurrentUser(meRes.data?.user ?? meRes.data);

      // 2. Load data berdasarkan role
      // - Alat dan Kategori bisa diakses semua role
      // - Users hanya untuk admin
      
  const alatEndpoint = userRole === 'admin' ? '/alat?limit=999' 
  : userRole === 'petugas' ? '/petugas/alat?limit=999' 
  : '/katalog?limit=999';

const promises = [api.get(alatEndpoint)];

if (userRole === 'admin' || userRole === 'petugas') {
  promises.push(api.get('/kategori?limit=999'));
  promises.push(api.get('/users?limit=999'));
}

const results = await Promise.all(promises);
setAlat(results[0].data.data ?? []);
      
      setLastUpdated(new Date());

if (userRole === 'admin') {
  try {
    const dashboardRes = await api.get('/dashboard/admin');
    if (dashboardRes.data.status === 'success') {
      setDashboardData(dashboardRes.data.data);
    }
  } catch (err) {
    console.error('Failed to load admin dashboard:', err);
  }
  
  try {
    const dashboardRes = await api.get('/dashboard/petugas');
    if (dashboardRes.data.status === 'success') {
      setDashboardPetugasData(dashboardRes.data.data);
    }
  } catch (err) {
    console.error('Failed to load petugas dashboard:', err);
  }
} else if (userRole === 'petugas') {  // 👈 Hapus "&& !dashboardPetugasData"
  try {
    const dashboardRes = await api.get('/dashboard/petugas');
    if (dashboardRes.data.status === 'success') {
      setDashboardPetugasData(dashboardRes.data.data);
    }
  } catch (err) {
    console.error('Failed to load petugas dashboard:', err);
  }
}

    } catch (error) {
      console.error('❌ Failed to load global data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Refresh specific data (optional)
const refreshUsers = useCallback(async () => {
  // Cek dari localStorage langsung, bukan dari state
  const role = localStorage.getItem('role');
  if (role !== 'admin' && role !== 'petugas') {
    console.warn('Only admin or petugas can refresh users');
    return false;
  }
  try {
    const endpoint = '/users?limit=999';
    const res = await api.get(endpoint);
    setUsers(res.data.data ?? []);
    return true;
  } catch (error) {
    console.error('Failed to refresh users:', error);
    return false;
  }
}, []);

  const refreshAlat = useCallback(async () => {
    try {
      const res = await api.get('/alat?limit=999');
      setAlat(res.data.data ?? []);
      return true;
    } catch (error) {
      console.error('Failed to refresh alat:', error);
      return false;
    }
  }, []);

  const refreshKategori = useCallback(async () => {
    try {
      const res = await api.get('/kategori?limit=999');
      setKategori(res.data.data ?? []);
      return true;
    } catch (error) {
      console.error('Failed to refresh kategori:', error);
      return false;
    }
  }, []);

  const refreshDashboardPetugas = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/petugas');
      if (res.data.status === 'success') {
        setDashboardPetugasData(res.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh petugas dashboard:', error);
      return false;
    }
  }, []);

  const refreshDashboardAdmin = useCallback(async () => {
    try {
      const res = await api.get('/dashboard/admin');
      if (res.data.status === 'success') {
        setDashboardData(res.data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh admin dashboard:', error);
      return false;
    }
  }, []);

  const clearData = useCallback(() => {
    setUsers([]);
    setAlat([]);
    setKategori([]);
    setCurrentUser(null);
    setDashboardData(null);
    setDashboardPetugasData(null);
    setLastUpdated(null);
  }, []);

  // ── Load data on mount
useEffect(() => {
  loadInitialData();
}, []);

  const value = {
    // Data
    users,
    alat,
    currentUser,
    kategori,
    isLoading,
    lastUpdated,
    
    // Dashboard Data
    dashboardData,
    setDashboardData,
    dashboardPetugasData,
    setDashboardPetugasData,

    // Refresh methods
    refreshUsers,
    refreshAlat,
    refreshKategori,
    refreshDashboardAdmin,
    refreshDashboardPetugas,
    loadInitialData,
    clearData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};