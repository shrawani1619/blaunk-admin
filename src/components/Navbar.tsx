import React from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

function getAuthHeaders(): HeadersInit {
  const token = window.localStorage.getItem('authToken');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [loginLabel, setLoginLabel] = React.useState<string>('');

  React.useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.user) return;
        const username = data.user.username;
        const isAdmin = username && String(username).toLowerCase() === 'admin';
        setLoginLabel(isAdmin ? 'Admin' : `Login: ${data.user.employeeCode || username || ''}`);
      })
      .catch(() => setLoginLabel(''));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-primary px-4 shadow-navbar sm:px-6 lg:px-10">
      <div className="flex items-center gap-2">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 sm:hidden"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        ) : null}
        <span className="text-xl font-extrabold tracking-wide text-white">
          BLAUNK
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-white/90">
        <span>{loginLabel || 'Login'}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-white/70 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white transition hover:bg-white/15"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

