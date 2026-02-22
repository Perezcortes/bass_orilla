'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { deleteCloudinaryImage } from '@/app/actions/cloudinary';
import { Store, Plus, Search, Edit, Trash2, Eye, EyeOff, AlertTriangle, Loader2, Filter, Tag } from 'lucide-react';
import ProductFormModal from '@/components/admin/ProductFormModal';

// Categorías para los filtros del Dashboard
const DEPARTMENTS = ["Todos", "Agua Dulce", "Ropa y Accesorios", "Líneas para Pescar", "Ofertas"];
const CATEGORIES: Record<string, string[]> = {
    "Agua Dulce": ["Todas", "Carretes", "Cañas", "Combos", "Señuelos", "Terminal Tackle"],
    "Ropa y Accesorios": ["Todas", "Ropa", "Accesorios Varios", "Almacenaje", "Lentes Polarizados"],
    "Líneas para Pescar": ["Todas", "Monofilamento", "Fluorocarbono", "Trenzado", "Líderes"]
};

type Product = {
    id: string; title: string; slug: string; brand: string; description: string;
    department: string; category: string; subcategory: string;
    price: number; discount_price: number | null; variants: any[]; specs?: Record<string, string>;
    is_active: boolean; created_at: string;
};

export default function CatalogoModule() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDept, setActiveDept] = useState('Todos');
    const [activeCategory, setActiveCategory] = useState('Todas');
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProd, setSelectedProd] = useState<Product | null>(null);

    const supabase = createClient();

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    // Cuando cambias de departamento, resetea la categoría y la página
    const handleDeptChange = (dept: string) => {
        setActiveDept(dept);
        setActiveCategory('Todas');
        setCurrentPage(1);
    };

    // Lógica de Filtrado Completa
    let filteredProds = products.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.brand.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeDept === 'Ofertas') {
            return matchesSearch && p.discount_price !== null;
        }
        
        const matchesDept = activeDept === 'Todos' || p.department === activeDept;
        const matchesCat = activeCategory === 'Todas' || p.category === activeCategory;
        
        return matchesSearch && matchesDept && matchesCat;
    });

    // Lógica de Paginación
    const totalPages = Math.ceil(filteredProds.length / itemsPerPage);
    const paginatedProds = filteredProds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleActiveStatus = async (prod: Product) => {
        setIsProcessing(true);
        await supabase.from('products').update({ is_active: !prod.is_active }).eq('id', prod.id);
        await fetchProducts();
        setIsProcessing(false);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProd) return;
        setIsProcessing(true);
        for (const variant of selectedProd.variants) {
            if (variant.imageUrl) await deleteCloudinaryImage(variant.imageUrl);
        }
        await supabase.from('products').delete().eq('id', selectedProd.id);
        setIsProcessing(false); setIsDeleteModalOpen(false); fetchProducts();
    };

    return (
        <div className="animate-fade-in-up pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl"><Store size={28} /></div>
                    <div>
                        <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white">Catálogo</h1>
                        <p className="text-gray-500 text-sm mt-1">{products.length} productos en total.</p>
                    </div>
                </div>
                <button onClick={() => { setSelectedProd(null); setIsFormModalOpen(true); }} className="flex items-center justify-center gap-2 bg-action-yellow text-[#1A1A1A] px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-sm">
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            {/* ZONA DE FILTROS */}
            <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 space-y-4">
                
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Pestañas de Departamento */}
                    <div className="flex gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
                        {DEPARTMENTS.map(dept => (
                            <button 
                                key={dept} 
                                onClick={() => handleDeptChange(dept)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${activeDept === dept ? (dept === 'Ofertas' ? 'bg-red-500 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-black') : 'bg-gray-50 dark:bg-[#111110] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                {dept === 'Ofertas' && <Tag size={14} />} {dept}
                            </button>
                        ))}
                    </div>

                    {/* Buscador */}
                    <div className="relative w-full md:w-72 shrink-0">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-action-yellow text-gray-900 dark:text-white" />
                    </div>
                </div>

                {/* Sub-filtros de Categoría (Aparecen si eliges un departamento principal) */}
                {activeDept !== 'Todos' && activeDept !== 'Ofertas' && CATEGORIES[activeDept] && (
                    <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-4 overflow-x-auto pb-1 scrollbar-hide">
                        <Filter size={16} className="text-gray-400 shrink-0" />
                        {CATEGORIES[activeDept].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => {setActiveCategory(cat); setCurrentPage(1);}}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${activeCategory === cat ? 'border-action-yellow bg-action-yellow/10 text-action-yellow' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* GRID DE PRODUCTOS */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-400" size={40} /></div>
            ) : paginatedProds.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-100 dark:border-gray-800 text-gray-500">
                    No se encontraron productos para esta búsqueda.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedProds.map((prod) => (
                            <div key={prod.id} className={`bg-white dark:bg-[#1A1A1A] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group flex flex-col transition-all ${!prod.is_active ? 'opacity-60 grayscale-[50%]' : ''}`}>
                                <div className="relative h-48 w-full bg-white dark:bg-black p-4">
                                    <Image src={prod.variants[0]?.imageUrl || '/placeholder.png'} alt={prod.title} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                                    
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {prod.discount_price && <div className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded shadow-sm">OFERTA</div>}
                                        {!prod.is_active && <div className="px-2 py-1 bg-gray-800 text-white text-[10px] font-bold rounded shadow-sm flex items-center gap-1"><EyeOff size={10}/> OCULTO</div>}
                                    </div>

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                        <button onClick={() => toggleActiveStatus(prod)} className="p-2 bg-gray-700 text-white rounded-full hover:scale-110" title={prod.is_active ? "Ocultar" : "Mostrar"}>{prod.is_active ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                        <button onClick={() => { setSelectedProd(prod); setIsFormModalOpen(true); }} className="p-2 bg-blue-500 text-white rounded-full hover:scale-110" title="Editar"><Edit size={16} /></button>
                                        <button onClick={() => { setSelectedProd(prod); setIsDeleteModalOpen(true); }} className="p-2 bg-red-500 text-white rounded-full hover:scale-110" title="Eliminar"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                
                                <div className="p-4 flex-1 flex flex-col border-t border-gray-100 dark:border-gray-800">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{prod.brand}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-tight mt-1">{prod.title}</h3>
                                    
                                    <div className="mt-auto pt-3 flex items-end justify-between">
                                        <div>
                                            {prod.discount_price ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 line-through">${prod.price.toFixed(2)}</span>
                                                    <span className="font-black text-red-500">${prod.discount_price.toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <span className="font-black text-gray-900 dark:text-white">${prod.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                                            {prod.category}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* PAGINACIÓN (Solo aparece si hay más de 1 página) */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-[#1A1A1A] rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50 transition-colors hover:bg-gray-50"
                            >
                                Anterior
                            </button>
                            <span className="text-sm font-medium text-gray-500">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-[#1A1A1A] rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-50 transition-colors hover:bg-gray-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Renderizamos el Modal Externo */}
            <ProductFormModal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)} 
                onSuccess={() => { setIsFormModalOpen(false); fetchProducts(); }} 
                productToEdit={selectedProd} 
            />

            {/* MODAL ELIMINAR */}
            {isDeleteModalOpen && selectedProd && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">¿Eliminar producto?</h3>
                        <p className="text-gray-500 text-sm mb-6">Se borrará <strong className="text-gray-900 dark:text-white">"{selectedProd.title}"</strong> y se eliminarán todas las fotos de tu nube.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400">Cancelar</button>
                            <button onClick={handleDeleteConfirm} disabled={isProcessing} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex justify-center items-center">
                                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Eliminar Todo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}