import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function usePetugasNotifications() {
  const [pending, setPending] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem('petugas_read_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (_) { return []; }
  });

  const fetchPending = useCallback(async () => {
    try {
      const res = await api.get('/petugas/peminjaman/pending-count');
      const newPending = res.data.data ?? [];
      setPendingCount(res.data.pending_count ?? 0);
      setPending(newPending);

      const activeIds = newPending.map(p => Number(p.id));
      setReadIds(prev => {
        const cleaned = prev.filter(id => activeIds.includes(Number(id)));
        localStorage.setItem('petugas_read_ids', JSON.stringify(cleaned));
        return cleaned;
      });
    } catch (_) {}
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 15000);
    const onFocus = () => fetchPending();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchPending]);

  const unseenCount = pending.filter(
    p => !readIds.map(Number).includes(Number(p.id))
  ).length;

  const markAllRead = () => {
    const allIds = pending.map(p => Number(p.id));
    const merged = [...new Set([...readIds.map(Number), ...allIds])];
    localStorage.setItem('petugas_read_ids', JSON.stringify(merged));
    setReadIds(merged);
  };

  const markOneRead = (id) => {
    const merged = [...new Set([...readIds.map(Number), Number(id)])];
    localStorage.setItem('petugas_read_ids', JSON.stringify(merged));
    setReadIds(merged);
  };

  const deleteAllRead = () => {
    const unreadPending = pending.filter(
      p => !readIds.map(Number).includes(Number(p.id))
    );
    setPending(unreadPending);
    const remainingIds = unreadPending.map(p => Number(p.id));
    const cleanedReadIds = readIds.filter(id => remainingIds.includes(Number(id)));
    localStorage.setItem('petugas_read_ids', JSON.stringify(cleanedReadIds));
    setReadIds(cleanedReadIds);
  };

  const formatTime = (str) => {
    if (!str) return '';
    const d = new Date(str);
    const diff = Math.floor((new Date() - d) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  return {
    pending, pendingCount, unseenCount,
    open, setOpen, loading,
    markAllRead, markOneRead, deleteAllRead,
    formatTime, readIds,
    refresh: fetchPending,
  };
}