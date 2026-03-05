'use client';

import { useState, useMemo } from 'react';
import { X, Send, Search, Image as ImageIcon, XCircle, CheckCircle2 } from 'lucide-react';
import { sendCampaign } from '../../app/actions/campaign';
import Image from 'next/image';

export default function CampaignModal({ isOpen, onClose, products }: { isOpen: boolean, onClose: () => void, products: any[] }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  // Extraer marcas y categorías únicas para los selects
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).sort(), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))).sort(), [products]);

  if (!isOpen) return null;

  // Filtrar productos
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    // No mostrar los que ya están seleccionados en la lista de búsqueda
    const notSelected = !selectedProducts.some(sp => sp.id === p.id);
    return matchesSearch && matchesBrand && matchesCategory && notSelected;
  }).slice(0, 12); // Mostrar solo 12 para no saturar

  const toggleProduct = (product: any) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      if (selectedProducts.length >= 4) {
        alert("Máximo 4 productos por campaña para mantener el correo limpio y evitar spam.");
        return;
      }
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  // Función para extraer la primera imagen del JSON de variantes
  const getProductImage = (variants: any) => {
    try {
      const parsed = typeof variants === 'string' ? JSON.parse(variants) : variants;
      return parsed?.[0]?.imageUrl || '/logo-bass.png'; // Fallback a tu logo
    } catch {
      return '/logo-bass.png';
    }
  };

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    // Agregar los IDs de los objetos seleccionados al formData
    selectedProducts.forEach(p => formData.append('productIds', p.id));

    const result = await sendCampaign(formData);

    if (result.error) {
      setStatus('error');
      setMessage(result.error);
    } else {
      setStatus('success');
      setMessage(`¡Éxito! Campaña enviada a ${result.count} pescadores.`);
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setSelectedProducts([]);
      }, 3000);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-[#111110] w-full max-w-6xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Editor de Campaña</h2>
            <p className="text-sm text-gray-500 mt-1">Diseña el correo que llegará a toda tu comunidad.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* Body - Grid 2 Columnas */}
        <div className="flex-1 overflow-hidden">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">¡Campaña Lanzada!</h3>
              <p className="text-gray-400 text-center">{message}</p>
            </div>
          ) : (
            <form action={handleSubmit} id="campaignForm" className="h-full flex flex-col lg:flex-row">
              
              {/* COLUMNA IZQUIERDA: Texto e Imagen */}
              <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200 dark:border-gray-800 space-y-6">
                <h3 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">1. Contenido del Correo</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Asunto del Correo *</label>
                  <input name="subject" required className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:border-action-yellow outline-none" placeholder="Ej: ¡Llegó la nueva mercancía Googan!" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Banner / Imagen Principal (URL Opcional)</label>
                  <div className="relative">
                    <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input name="bannerUrl" type="url" className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:border-action-yellow outline-none text-sm" placeholder="https://ejemplo.com/banner.jpg" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Pega aquí el link de una imagen si quieres que encabece el correo.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Mensaje Principal *</label>
                  <textarea name="message" required rows={6} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:border-action-yellow outline-none resize-none" placeholder="Escribe aquí el texto principal de tu correo..." />
                </div>
              </div>

              {/* COLUMNA DERECHA: Productos */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-[#151515] flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2 mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">2. Adjuntar Equipo (Opcional)</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300">
                    {selectedProducts.length} / 4
                  </span>
                </div>

                {/* Zona de Productos Seleccionados */}
                {selectedProducts.length > 0 && (
                  <div className="mb-6 bg-white dark:bg-black border border-action-yellow/50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Equipo en el correo:</p>
                    <div className="space-y-2">
                      {selectedProducts.map(p => (
                        <div key={`sel-${p.id}`} className="flex items-center gap-3 bg-gray-50 dark:bg-[#1A1A1A] p-2 rounded-lg border border-gray-200 dark:border-gray-800">
                          <div className="relative w-10 h-10 bg-white rounded flex-shrink-0">
                             <Image src={getProductImage(p.variants)} alt="Prod" fill className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-action-yellow font-bold truncate">{p.brand}</p>
                            <p className="text-sm text-gray-900 dark:text-white truncate">{p.title}</p>
                          </div>
                          <button type="button" onClick={() => toggleProduct(p)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <XCircle size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buscador y Filtros */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none" placeholder="Buscar por nombre..." />
                  </div>
                  <div className="flex gap-2">
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-xs p-2 text-gray-900 dark:text-white outline-none">
                      <option value="">Todas las Marcas</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-xs p-2 text-gray-900 dark:text-white outline-none">
                      <option value="">Todas las Categorías</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Resultados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pb-4">
                  {filteredProducts.map(p => (
                    <div key={p.id} onClick={() => toggleProduct(p)} className="p-3 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-action-yellow transition-all flex gap-3 group">
                      <div className="relative w-12 h-12 bg-gray-50 rounded flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Image src={getProductImage(p.variants)} alt="img" fill className="object-contain p-1" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{p.brand}</span>
                        <span className="text-xs text-gray-900 dark:text-gray-300 line-clamp-2 leading-tight mt-0.5">{p.title}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-black/50">
          <p className="text-sm text-gray-500 hidden sm:block">
            Se enviará a todos los correos con estado <span className="text-green-500 font-bold">Activo</span>.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
            <button type="submit" form="campaignForm" disabled={status === 'loading' || status === 'success'} className="flex-1 sm:flex-none bg-action-yellow text-black px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-lg shadow-action-yellow/20">
              <Send size={18} /> {status === 'loading' ? 'Enviando...' : 'Lanzar Campaña'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}