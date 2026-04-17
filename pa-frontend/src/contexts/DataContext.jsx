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

  // ── Load all initial data once
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, alatsRes, meRes, kategoriRes] = await Promise.all([
        api.get('/users?limit=999'),
        api.get('/alat?limit=999'),
        api.get('/me'),
        api.get('/kategori?limit=999'),
      ]);

      setUsers(usersRes.data.data ?? []);
      setAlat(alatsRes.data.data ?? []);
      setCurrentUser(meRes.data);
      setKategori(kategoriRes.data.data ?? []);
      setLastUpdated(new Date());

      console.log('✅ Global data cache loaded', {
        users: usersRes.data.data?.length,
        alat: alatsRes.data.data?.length,
        kategori: kategoriRes.data.data?.length,
      });
    } catch (error) {
      console.error('❌ Failed to load global data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Refresh specific data (optional)
  const refreshUsers = useCallback(async () => {
    try {
      const res = await api.get('/users?limit=999');
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

  // ── Load data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const value = {
    // Data
    users,
    alat,
    currentUser,
    kategori,
    isLoading,
    lastUpdated,

    // Refresh methods
    refreshUsers,
    refreshAlat,
    refreshKategori,
    loadInitialData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
