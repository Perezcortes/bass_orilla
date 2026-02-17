'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // URL a la que redirigirá el correo (la crearemos en el paso 2)
    const redirectTo = `${window.location.origin}/auth/callback?next=/actualizar-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Te hemos enviado un enlace de recuperación a tu correo.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAFAF8] dark:bg-[#111110]" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      {/* Reutilizamos tus estilos globales o inline para consistencia */}
      <style>{`
        .bo-input { width: 100%; padding: 13px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; background: #fff; border: 1.5px solid #e5e5e2; border-radius: 12px; color: #111; outline: none; transition: border-color .2s; }
        .dark .bo-input { background: rgba(255,255,255,.04); border-color: rgba(255,255,255,.1); color: #f0ece4; }
        .bo-btn-yellow { width: 100%; padding: 14px; background: #F9B824; color: #1a1a1a; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .2s; }
        .bo-btn-yellow:hover { background: #f0ae18; }
      `}</style>

      <div className="w-full max-w-[390px]">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Volver al login
        </Link>

        <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-3">Recuperar acceso</h1>
        <p className="text-gray-500 mb-8 text-sm">Ingresa tu correo y te enviaremos las instrucciones.</p>

        {message ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-200">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-green-800 dark:text-green-200 font-bold mb-2">¡Correo enviado!</h3>
            <p className="text-green-700 dark:text-green-300 text-sm">Revisa tu bandeja de entrada (y spam) para continuar.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Correo electrónico</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)} 
                className="bo-input"
                placeholder="tu@correo.com"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="bo-btn-yellow">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Enviar enlace'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}