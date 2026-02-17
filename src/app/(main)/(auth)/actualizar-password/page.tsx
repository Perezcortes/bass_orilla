'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const role = data.user?.user_metadata?.role;
      router.refresh(); 
      
      if (role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6 bg-[#FAFAF8] dark:bg-[#111110]" 
      style={{ fontFamily:"'DM Sans',sans-serif" }}
    >
      <style>{`
        .bo-input { 
          width: 100%; 
          padding: 13px 16px; /* Padding base */
          font-family: 'DM Sans', sans-serif; 
          font-size: 14px; 
          background: #fff; 
          border: 1.5px solid #e5e5e2; 
          border-radius: 12px; 
          color: #111; 
          outline: none; 
          transition: border-color .2s; 
        }
        /* CLASES NUEVAS PARA CORREGIR EL ENCIMADO */
        /* Fuerzan el padding necesario para los iconos */
        .bo-input-pl { padding-left: 44px !important; }
        .bo-input-pr { padding-right: 44px !important; }

        .dark .bo-input { 
          background: rgba(255,255,255,.04); 
          border-color: rgba(255,255,255,.1); 
          color: #f0ece4; 
        }
        .bo-input:focus {
          border-color: #F9B824;
        }
        .bo-btn-yellow { 
          width: 100%; 
          padding: 14px; 
          background: #F9B824; 
          color: #1a1a1a; 
          font-weight: 600; 
          border: none; 
          border-radius: 12px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 8px; 
          transition: background .2s, transform .1s; 
        }
        .bo-btn-yellow:hover:not(:disabled) { background: #f0ae18; transform: translateY(-1px); }
        .bo-btn-yellow:active:not(:disabled) { transform: translateY(0); }
        .bo-btn-yellow:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div className="w-full max-w-[390px]">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
            <Lock size={20} />
          </div>
          <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">
            Nueva Contraseña
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Ingresa tu nueva contraseña para asegurar tu cuenta.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Nueva Contraseña
            </label>
            
            <div className="relative">
              {/* Icono Candado (Izquierda) */}
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Lock size={16} />
              </div>

              <input 
                type={showPass ? 'text' : 'password'} 
                required 
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)} 
                // AQUÍ USAMOS LAS NUEVAS CLASES CSS
                className="bo-input bo-input-pl bo-input-pr" 
                placeholder="Mínimo 6 caracteres"
              />

              {/* Botón Ojo (Derecha) */}
              <button 
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
               <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="bo-btn-yellow">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}