import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/login', { email, password });
      const { token, role, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user_data', JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'petugas') {
        navigate('/petugas/dashboard', { replace: true });
      } else {
        navigate('/peminjam/dashboard', { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan pada server. Coba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #F7F7F5;
        }

        .login-left {
          display: none;
          flex: 0 0 480px;
          background: #111110;
          position: relative;
          overflow: hidden;
          padding: 56px 48px;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 1024px) { .login-left { display: flex; } }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(99,102,241,.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 80% 20%, rgba(168,85,247,.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
       .brand-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
        .brand-icon svg { width: 20px; height: 20px; color: #fff; }
        .brand-name {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .left-body { position: relative; z-index: 1; }

        .left-tagline {
          font-size: 36px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }
        .left-tagline span { color: #6366F1; }

        .left-sub {
          font-size: 15px;
          color: rgba(255,255,255,.45);
          line-height: 1.6;
          max-width: 300px;
        }

        .left-badges {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 10px;
          padding: 12px 16px;
          backdrop-filter: blur(8px);
        }
        .badge-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .badge-text { font-size: 13px; color: rgba(255,255,255,.6); font-weight: 400; }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .login-card { width: 100%; max-width: 420px; }

        .card-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          color: #6366F1;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .card-title {
          font-size: 30px;
          font-weight: 700;
          color: #111110;
          letter-spacing: -0.8px;
          line-height: 1.15;
          margin-bottom: 8px;
        }
        .card-subtitle {
          font-size: 14px;
          color: #888;
          margin-bottom: 36px;
          line-height: 1.5;
        }

        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #FFF1F0;
          border: 1px solid #FFCDD2;
          border-radius: 10px;
          padding: 12px 14px;
          margin-bottom: 24px;
          animation: slideIn .2s ease;
        }
        .error-box svg { flex-shrink: 0; margin-top: 1px; color: #E53E3E; }
        .error-text { font-size: 13px; color: #C53030; line-height: 1.5; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .field-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; }
        .field-wrap { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 13px; font-weight: 500; color: #444; letter-spacing: -0.1px; }

        .field-inner { position: relative; display: flex; align-items: center; }
        .field-icon {
          position: absolute; left: 14px;
          display: flex; color: #bbb;
          pointer-events: none; transition: color .2s;
        }
        .field-icon svg { width: 16px; height: 16px; }

        .field-input {
          width: 100%;
          padding: 13px 44px;
          background: #fff;
          border: 1.5px solid #E8E8E4;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          color: #111110;
          transition: border-color .2s, box-shadow .2s;
          outline: none;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: #ccc; }
        .field-input:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99,102,241,.1);
        }
        .field-inner:focus-within .field-icon { color: #6366F1; }

        .field-icon-right {
          position: absolute; right: 14px;
          display: flex; color: #bbb;
          cursor: pointer; background: none; border: none;
          padding: 4px; border-radius: 4px; transition: color .2s;
        }
        .field-icon-right:hover { color: #6366F1; }
        .field-icon-right svg { width: 16px; height: 16px; }

        .btn-submit {
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; padding: 14px 24px;
          background: #111110; color: #fff;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 600; letter-spacing: -0.2px;
          border: none; border-radius: 10px; cursor: pointer;
          transition: background .2s, transform .15s, box-shadow .2s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #222;
          box-shadow: 0 4px 20px rgba(0,0,0,.18);
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
        .btn-submit .btn-arrow { display: flex; align-items: center; transition: transform .2s; }
        .btn-submit:hover:not(:disabled) .btn-arrow { transform: translateX(3px); }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-note {
          text-align: center; font-size: 12px;
          color: #aaa; line-height: 1.6; margin-top: 28px;
        }
        .footer-note a { color: #6366F1; text-decoration: none; font-weight: 500; }
        .footer-note a:hover { text-decoration: underline; }
      `}</style>

      <div className="login-root">

        <div className="login-left">
          <div className="left-grid" />

         <div className="brand-mark">
  <div className="brand-icon">
    <img src="/logo-grafika.webp" alt="Logo Sekolah" className="school-logo" />
  </div>
  <span className="brand-name">Sarana Prasarana</span>
</div>

          <div className="left-body">
  <h1 className="left-tagline">
    Peminjaman alat<br />lebih <span>efisien.</span>
  </h1>
  <p className="left-sub">
    Memudahkan pengajuan, pencatatan, dan pemantauan penggunaan alat pembelajaran di sekolah.
  </p>
</div>

          <div className="left-badges">
            {
              [
  { color: '#34D399', text: 'Peminjaman alat tercatat otomatis' },
  { color: '#60A5FA', text: 'Ketersediaan alat terpantau' },
  { color: '#F59E0B', text: 'Riwayat penggunaan tersimpan' },
]
            .map((b) => (
              <div className="badge" key={b.text}>
                <div className="badge-dot" style={{ background: b.color }} />
                <span className="badge-text">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">

            <p className="card-eyebrow">Portal Masuk</p>
            <h2 className="card-title">Selamat datang</h2>
            <p className="card-subtitle">Masuk untuk mengakses layanan peminjaman alat</p>

            {error && (
              <div className="error-box">
                <AlertCircle size={16} />
                <p className="error-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field-group">
                <div className="field-wrap">
                  <label className="field-label">Alamat Email</label>
                  <div className="field-inner">
                    <span className="field-icon"><Mail /></span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="field-input"
                      placeholder="Masukan email"
                    />
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Kata Sandi</label>
                  <div className="field-inner">
                    <span className="field-icon"><Lock /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="field-input"
                      placeholder="Masukkan kata sandi"
                    />
                    <button
                      type="button"
                      className="field-icon-right"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? (
                  <><span className="spinner" />Memproses...</>
                ) : (
                  <>Masuk Sekarang<span className="btn-arrow"><ArrowRight size={16} /></span></>
                )}
              </button>
            </form>

            <p className="footer-note">
              Lupa kata sandi? <a href="#">Reset password</a>
            </p>

          </div>
        </div>

      </div>
    </>
  );
};

export default Login;