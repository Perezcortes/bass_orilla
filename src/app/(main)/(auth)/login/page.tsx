'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [ready, setReady] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Efecto de entrada suave
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Credenciales incorrectas.");
      setLoading(false);
    } else {
      const role = data.user?.user_metadata?.role;
      router.refresh();
      // Pequeño delay para que se sienta la transición
      setTimeout(() => {
        if (role === 'admin') router.push('/dashboard');
        else router.push('/');
      }, 500);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAFAF8] dark:bg-[#111110]"
      style={{ fontFamily: "'DM Sans',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes shakeX  { 0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1}50%{opacity:.6} }

        .login-ready { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }

        .bo-input {
          width: 100%;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          background: #fff;
          border: 1.5px solid #e5e5e2;
          border-radius: 12px;
          color: #111;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-sizing: border-box;
        }
        .bo-input::placeholder { color: #bbb; }
        .bo-input:focus {
          border-color: #F9B824;
          box-shadow: 0 0 0 3px rgba(249,184,36,.1);
        }
        .bo-input.with-icon { padding-right: 44px; }

        .dark .bo-input {
          background: rgba(255,255,255,.04);
          border-color: rgba(255,255,255,.1);
          color: #f0ece4;
        }
        .dark .bo-input::placeholder { color: #444; }
        .dark .bo-input:focus {
          border-color: #F9B824;
          box-shadow: 0 0 0 3px rgba(249,184,36,.1);
        }

        .bo-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 7px;
          transition: color .2s;
        }
        .bo-field:focus-within .bo-label { color: #F9B824; }

        .bo-btn-yellow {
          width: 100%;
          padding: 14px;
          background: #F9B824;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: .04em;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 2px 18px rgba(249,184,36,.3);
        }
        .bo-btn-yellow:hover:not(:disabled) {
          background: #f0ae18;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(249,184,36,.4);
        }
        .bo-btn-yellow:active:not(:disabled) { transform: translateY(0); }
        .bo-btn-yellow:disabled { opacity: .5; cursor: not-allowed; }

        .bo-btn-ghost {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 1.5px solid #e5e5e2;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #777;
          text-decoration: none;
          transition: border-color .2s, color .2s, background .2s;
        }
        .dark .bo-btn-ghost { border-color: rgba(255,255,255,.1); color: #888; }
        .bo-btn-ghost:hover { border-color: #F9B824; color: #F9B824; background: rgba(249,184,36,.03); }

        .bo-link-sm {
           font-size: 12px;
           color: #888;
           text-decoration: none;
           transition: color .2s;
           font-weight: 500;
        }
        .bo-link-sm:hover { color: #F9B824; }
      `}</style>

      <div className={`w-full max-w-[390px] ${ready ? 'login-ready' : 'opacity-0'}`}>

        {/* Header - Ligeramente diferente al registro para distinguir */}
        <div className="mb-10">
          {/* Pill Verde para Login (indica Acceso) */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(45,90,39,.08)', border: '1px solid rgba(45,90,39,.15)',
            borderRadius: 100, padding: '4px 12px', marginBottom: 20
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2D5A27', display: 'inline-block' }} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2D5A27' }}>
              Acceso a miembros
            </span>
          </div>

          <h1
            className="text-gray-900 dark:text-[#f0ece4]"
            style={{ fontFamily: 'DM Serif Display,serif', fontSize: '2.25rem', lineHeight: 1.1, margin: '0 0 8px' }}
          >
            Hola de<br /><em style={{ fontStyle: 'italic', color: '#2D5A27' }}>nuevo.</em>
          </h1>
          <p className="text-sm text-gray-400">Introduce tus credenciales para continuar.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
            style={{ animation: 'shakeX .35s ease' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
              <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M7.5 4.5v3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="7.5" cy="10.5" r=".75" fill="currentColor" />
            </svg>
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div className="bo-field">
            <label className="bo-label" htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bo-input"
              placeholder="tu@correo.com"
            />
          </div>

          <div className="bo-field">
            <div className="flex justify-between items-end mb-[7px]">
              <label className="bo-label" style={{ marginBottom: 0 }} htmlFor="login-password">Contraseña</label>
            </div>

            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bo-input with-icon"
                placeholder="••••••••"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="bo-btn-yellow">
              {loading ? <Loader2 size={15} className="animate-spin" /> : (
                <>
                  Entrar ahora <ArrowRight size={15} style={{ opacity: 0.6 }} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-6">
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.07]" />
            <span className="text-[11px] tracking-widest uppercase text-gray-400">Nuevo aquí</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.07]" />
          </div>

          <Link href="/registro" className="bo-btn-ghost">
            Crear una cuenta gratis
          </Link>

          <div>
            <Link href="/recuperar" className="bo-link-sm">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}