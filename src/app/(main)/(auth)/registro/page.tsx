'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Loader2, Eye, EyeOff, Check } from 'lucide-react';

const rules = [
  { id: 'len',   label: '6+ caracteres', test: (p: string) => p.length >= 6 },
  { id: 'upper', label: 'Mayúscula',      test: (p: string) => /[A-Z]/.test(p) },
  { id: 'num',   label: 'Número',         test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [pwTouched, setPwTouched] = useState(false);
  const [ready, setReady]       = useState(false);
  const [done, setDone]         = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const passed   = rules.filter(r => r.test(password));
  const pct      = Math.round((passed.length / rules.length) * 100);
  const pctColor = pct < 34 ? '#ef4444' : pct < 67 ? '#F9B824' : '#2D5A27';
  const pctLabel = pct < 34 ? 'Débil' : pct < 67 ? 'Regular' : 'Fuerte';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Registro en Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'client' },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // ÉXITO: Usuario creado en Supabase

      // 2. ENVIAR CORREO DE BIENVENIDA (Llamada silenciosa a nuestra API)
      try {
        await fetch('/api/send-welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email, 
            name: fullName 
          }),
        });
      } catch (err) {
        console.error("No se pudo enviar el correo de bienvenida", err);
        // No detenemos el flujo si falla el correo, el usuario ya está registrado
      }

      setDone(true); 
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAFAF8] dark:bg-[#111110]"
      style={{ fontFamily:"'DM Sans',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes shakeX  { 0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { 0%{transform:scale(0);opacity:0}80%{transform:scale(1.12)}100%{transform:scale(1);opacity:1} }
        @keyframes fillBar { from{width:0}to{width:100%} }
        @keyframes blink   { 0%,100%{opacity:1}50%{opacity:.25} }

        .reg-ready { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }

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
      `}</style>

      {/* ── Success ── */}
      {done ? (
        <div className="w-full max-w-[390px] text-center" style={{ animation:'fadeUp .5s ease' }}>
          <div
            className="w-14 h-14 rounded-full bg-bass-green mx-auto flex items-center justify-center mb-7"
            style={{ animation:'popIn .45s cubic-bezier(.34,1.56,.64,1) .05s both', boxShadow:'0 0 0 8px rgba(45,90,39,.1)' }}
          >
            <Check size={22} className="text-white" />
          </div>
          <h2
            className="text-gray-900 dark:text-[#f0ece4] mb-2"
            style={{ fontFamily:'DM Serif Display,serif', fontSize:'2rem', lineHeight:1.1 }}
          >
            ¡Listo!
          </h2>
          <p className="text-sm text-gray-400 mb-8">Cuenta creada. Redirigiendo al login…</p>
          <div className="h-[2px] bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-bass-green rounded-full" style={{ animation:'fillBar 3s linear forwards' }} />
          </div>
        </div>
      ) : (
        <div className={`w-full max-w-[390px] ${ready ? 'reg-ready' : 'opacity-0'}`}>

          {/* Heading */}
          <div className="mb-8">
            {/* Small accent pill */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(249,184,36,.1)', border:'1px solid rgba(249,184,36,.22)',
              borderRadius:100, padding:'4px 12px', marginBottom:20
            }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#F9B824', display:'inline-block', animation:'blink 2s ease infinite' }} />
              <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'#F9B824' }}>
                Únete al torneo
              </span>
            </div>

            <h1
              className="text-gray-900 dark:text-[#f0ece4]"
              style={{ fontFamily:'DM Serif Display,serif', fontSize:'2.25rem', lineHeight:1.1, margin:'0 0 8px' }}
            >
              Crea tu<br /><em style={{ fontStyle:'italic', color:'#F9B824' }}>cuenta.</em>
            </h1>
            <p className="text-sm text-gray-400">Únete a la comunidad de pescadores BassOrilla.</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
              style={{ animation:'shakeX .35s ease' }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M7.5 4.5v3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="7.5" cy="10.5" r=".75" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">

            <div className="bo-field">
              <label className="bo-label" htmlFor="reg-name">Nombre completo</label>
              <input id="reg-name" type="text" required value={fullName}
                onChange={e => setFullName(e.target.value)} className="bo-input" placeholder="Juan García" />
            </div>

            <div className="bo-field">
              <label className="bo-label" htmlFor="reg-email">Correo electrónico</label>
              <input id="reg-email" type="email" required value={email}
                onChange={e => setEmail(e.target.value)} className="bo-input" placeholder="tu@correo.com" />
            </div>

            <div className="bo-field">
              <label className="bo-label" htmlFor="reg-password">Contraseña</label>
              <div className="relative">
                <input id="reg-password" type={showPass ? 'text' : 'password'} required minLength={6}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if(!pwTouched) setPwTouched(true); }}
                  className="bo-input with-icon" placeholder="••••••••" />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Strength */}
              {pwTouched && password.length > 0 && (
                <div className="mt-3 space-y-2" style={{ animation:'fadeUp .25s ease' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-[2px] rounded-full overflow-hidden" style={{ background:'#e5e5e2' }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width:`${pct}%`, backgroundColor: pctColor }} />
                    </div>
                    <span className="text-[11px] font-semibold min-w-[44px] text-right transition-colors duration-300"
                      style={{ color: pctColor }}>
                      {pctLabel}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    {rules.map(rule => {
                      const ok = rule.test(password);
                      return (
                        <div key={rule.id} className="flex items-center gap-1.5 text-[11px] transition-colors duration-200"
                          style={{ color: ok ? '#2D5A27' : '#bbb' }}>
                          {ok
                            ? <Check size={9} />
                            : <span className="inline-block w-1.5 h-1.5 rounded-full border border-current" />}
                          {rule.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-1">
              <button type="submit" disabled={loading} className="bo-btn-yellow">
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.07]" />
            <span className="text-[11px] tracking-widest uppercase text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/[0.07]" />
          </div>

          <Link href="/login" className="bo-btn-ghost">
            Ya tengo cuenta — iniciar sesión
          </Link>
        </div>
      )}
    </div>
  );
}