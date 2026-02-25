'use client';

import { useState } from 'react';
import { Search, MessageCircle, X, Anchor } from 'lucide-react';

export default function SpecialOrderBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [requestText, setRequestText] = useState('');

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529531447499";

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const text = `*Consulta de Pedido Especial* 🎣🌊\n\nHola equipo de BassOrilla. No encontré este producto en el catálogo y me gustaría saber si me lo pueden conseguir:\n\n*Detalles:* ${requestText}`;
    const encodedText = encodeURIComponent(text);
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
    
    setIsOpen(false);
    setRequestText('');
  };

  return (
    <>
      {/* BANNER EN EL CATÁLOGO */}
      <div className="mt-12 mb-8 bg-[#1A1A1A] dark:bg-[#111110] rounded-3xl overflow-hidden relative shadow-2xl border border-gray-800">
        {/* Decoración de fondo */}
        <div className="absolute -right-10 -top-10 text-white/5 rotate-12 pointer-events-none">
          <Anchor size={200} />
        </div>
        
        <div className="relative p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-400 max-w-xl text-sm sm:text-base">
              Si buscas equipo para <span className="text-action-yellow font-bold">Agua Salada</span>, una marca en específico, o un modelo raro, nosotros te lo conseguimos.
            </p>
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="shrink-0 bg-[#2d5a27] hover:bg-[#1e3c1a] text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 transform hover:-translate-y-1"
          >
            <Search size={20} /> Solicitar Cotización
          </button>
        </div>
      </div>

      {/* MODAL DE SOLICITUD */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up border border-gray-100 dark:border-gray-800">
            
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <Anchor className="text-action-yellow" size={24} /> Pedido Especial
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleWhatsAppSubmit} className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Descríbenos qué estás buscando (marca, modelo, talla o color). Revisaremos con nuestros proveedores y te mandaremos el precio y tiempo de entrega.
              </p>
              
              <textarea
                required
                rows={4}
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Ej. Estoy buscando un carrete Penn Battle III tamaño 4000 para agua salada..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:border-action-yellow focus:ring-1 focus:ring-action-yellow outline-none transition-all resize-none mb-6"
              />

              <button 
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#1EBE57] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95"
              >
                <MessageCircle size={20} /> Enviar a WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}