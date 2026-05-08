import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get('/notifikasi');
      setNotifications(res.data.data ?? []);
      setUnreadCount(res.data.unread_count ?? 0);
    } catch (_) {}
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [fetch]);

  const markAllRead = async () => {
    try {
      await api.post('/notifikasi/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (_) {}
  };

  const markOneRead = async (id) => {
    try {
      await api.post(`/notifikasi/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (_) {}
  };

  return {
    notifications,
    unreadCount,
    open,
    setOpen,
    loading,
    markAllRead,
    markOneRead,
    refresh: fetch,
  };
}