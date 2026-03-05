'use client';

import { useState } from 'react';
import { subscribeToNewsletter } from '../../app/actions/newsletter';

export default function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    
    const result = await subscribeToNewsletter(formData);

    if (result?.error) {
      setStatus('error');
      setMessage(result.error);
    } else if (result?.success) {
      setStatus('success');
      setMessage('¡Gracias por suscribirte! Revisa tu correo.');
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-lg mx-auto p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-100 font-medium backdrop-blur-md">
        {message}
      </div>
    );
  }

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto relative">
        <input 
          name="email"
          required
          className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-action-yellow focus:bg-black/50 backdrop-blur-md transition-all shadow-inner disabled:opacity-50" 
          placeholder="Tu correo electrónico" 
          type="email" 
          disabled={status === 'loading'}
        />
        <button 
          className="bg-action-yellow text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-action-yellow/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100" 
          type="submit"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Cargando...' : 'Suscribirse'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3 font-medium drop-shadow-md">
          {message}
        </p>
      )}
    </div>
  );
}