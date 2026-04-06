import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { API_BASE } from '../config';

function getAuthHeaders(): HeadersInit {
  const token = window.localStorage.getItem('authToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetLink, setResetLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    if (!token) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/auth/me`, { headers: getAuthHeaders() })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.user?.email) {
          setEmail(String(data.user.email).trim());
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setResetLink(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Something went wrong.' });
        return;
      }
      setMessage({
        type: 'success',
        text: data.message || 'If an account exists with this email, you will receive a password reset link.',
      });
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {message && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              message.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {resetLink && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-slate-700">
            <p className="font-medium text-slate-800">Use this link to reset your password:</p>
            <a
              href={resetLink}
              className="mt-1 block break-all text-primary underline hover:no-underline"
            >
              {resetLink}
            </a>
            <p className="mt-2 text-xs text-slate-500">
              In production, this link would be sent to your email.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
};
