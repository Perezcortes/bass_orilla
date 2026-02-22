'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { uploadBannerAction, deleteCloudinaryImage } from '@/app/actions/cloudinary';
import {
    Megaphone, Plus, Search, Edit, Trash2, Eye, EyeOff,
    X, AlertTriangle, Loader2, Upload, Ticket, MessageCircle
} from 'lucide-react';

type Publication = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    type: 'anuncio' | 'sorteo';
    is_active: boolean; // Agregamos el nuevo campo
    created_at: string;
};

export default function PublicidadModule() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('todos');

    // Modales
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    // Estado del Formulario
    const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', type: 'anuncio' as 'anuncio' | 'sorteo', image_url: '' });
    const [file, setFile] = useState<File | null>(null);
    const [previewFileUrl, setPreviewFileUrl] = useState<string | null>(null);

    const supabase = createClient();
    const WHATSAPP_NUMBER = "529531447499";

    // 1. CARGAR PUBLICACIONES
    const fetchPublications = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('publications')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) setPublications(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    // 2. FILTRAR
    const filteredPubs = publications.filter((pub) => {
        const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'todos' || pub.type === typeFilter;
        return matchesSearch && matchesType;
    });

    // 3. MANEJADORES DE ESTADO (MOSTRAR / OCULTAR)
    const toggleActiveStatus = async (pub: Publication) => {
        setIsProcessing(true);
        await supabase.from('publications').update({ is_active: !pub.is_active }).eq('id', pub.id);
        await fetchPublications();
        setIsProcessing(false);
    };

    // 4. MANEJADORES DE MODALES
    const openCreateModal = () => {
        setSelectedPub(null);
        setFormData({ title: '', description: '', type: 'anuncio', image_url: '' });
        setFile(null);
        setPreviewFileUrl(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (pub: Publication) => {
        setSelectedPub(pub);
        setFormData({ title: pub.title, description: pub.description, type: pub.type, image_url: pub.image_url });
        setFile(null);
        setPreviewFileUrl(pub.image_url);
        setIsFormModalOpen(true);
    };

    const openDeleteModal = (pub: Publication) => {
        setSelectedPub(pub);
        setIsDeleteModalOpen(true);
    };

    const openPreviewModal = (pub: Publication) => {
        setSelectedPub(pub);
        setIsPreviewModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewFileUrl(URL.createObjectURL(selectedFile));
        }
    };

    // 5. GUARDAR (CREAR / EDITAR)
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        let finalImageUrl = formData.image_url;

        const generatedSlug = formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (file) {
            const form = new FormData();
            form.append('image', file);
            const uploadResult = await uploadBannerAction(form);
            if (uploadResult.success && uploadResult.url) {
                // Si estamos editando y subimos una foto NUEVA, borramos la VIEJA de Cloudinary para ahorrar espacio
                if (selectedPub && selectedPub.image_url) {
                    await deleteCloudinaryImage(selectedPub.image_url);
                }
                finalImageUrl = uploadResult.url;
            } else {
                alert('Error al subir imagen: ' + uploadResult.error);
                setIsProcessing(false);
                return;
            }
        }

        if (!finalImageUrl) {
            alert('Debes subir una imagen.');
            setIsProcessing(false);
            return;
        }

        if (selectedPub) {
            await supabase.from('publications').update({
                title: formData.title, description: formData.description, type: formData.type, image_url: finalImageUrl, slug: generatedSlug
            }).eq('id', selectedPub.id);
        } else {
            // Por defecto, al crear una nueva publicación, is_active es true
            await supabase.from('publications').insert([{
                title: formData.title, description: formData.description, type: formData.type, image_url: finalImageUrl, slug: generatedSlug, is_active: true
            }]);
        }

        setIsProcessing(false);
        setIsFormModalOpen(false);
        fetchPublications();
    };

    // 6. ELIMINAR (BASE DE DATOS Y CLOUDINARY)
    const handleDeleteConfirm = async () => {
        if (!selectedPub) return;
        setIsProcessing(true);
        
        // 1. Borramos la imagen de Cloudinary primero
        await deleteCloudinaryImage(selectedPub.image_url);

        // 2. Borramos la publicación de Supabase
        await supabase.from('publications').delete().eq('id', selectedPub.id);
        
        setIsProcessing(false);
        setIsDeleteModalOpen(false);
        fetchPublications(); 
    };

    return (
        <div className="animate-fade-in-up">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white">Publicidad y Sorteos</h1>
                        <p className="text-gray-500 text-sm mt-1">Gestiona los banners, anuncios y rifas activas.</p>
                    </div>
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-action-yellow text-[#1A1A1A] px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Nueva Publicación
                </button>
            </div>

            {/* FILTROS */}
            <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar publicación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow transition-colors"
                    />
                </div>
                <div className="sm:w-48">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow transition-colors appearance-none"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="sorteo">Rifas / Sorteos</option>
                        <option value="anuncio">Anuncios Generales</option>
                    </select>
                </div>
            </div>

            {/* GRID DE PUBLICACIONES */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400" size={40} />
                </div>
            ) : filteredPubs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-100 dark:border-gray-800 text-gray-500">
                    No hay publicaciones que coincidan con tu búsqueda.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPubs.map((pub) => (
                        <div key={pub.id} className={`bg-white dark:bg-[#1A1A1A] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group flex flex-col transition-all ${!pub.is_active ? 'opacity-60 grayscale-[50%]' : ''}`}>
                            <div className="relative h-48 w-full bg-gray-100 dark:bg-black overflow-hidden">
                                <Image src={pub.image_url} alt={pub.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />

                                <div className="absolute top-3 left-3 flex gap-2">
                                    <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                        {pub.type === 'sorteo' ? <><Ticket size={12} className="text-action-yellow" /> Sorteo</> : <><Megaphone size={12} /> Anuncio</>}
                                    </div>
                                    {/* Etiqueta de Oculto */}
                                    {!pub.is_active && (
                                        <div className="px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                            <EyeOff size={12} /> Oculto
                                        </div>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <button onClick={() => toggleActiveStatus(pub)} className="p-2 bg-gray-700 text-white rounded-full hover:scale-110 transition-transform" title={pub.is_active ? "Ocultar" : "Mostrar"}>
                                        {pub.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <button onClick={() => openEditModal(pub)} className="p-2 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform" title="Editar"><Edit size={18} /></button>
                                    <button onClick={() => openDeleteModal(pub)} className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform" title="Eliminar"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{pub.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">{pub.description}</p>
                                <div className="text-xs text-gray-400 font-medium flex justify-between">
                                    <span>Publicado: {new Date(pub.created_at).toLocaleDateString('es-MX')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL FORMULARIO */}
            {isFormModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                                {selectedPub ? 'Editar Publicación' : 'Nueva Publicación'}
                            </h3>
                            <button onClick={() => setIsFormModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Imagen (Banner / Producto)</label>
                                <div className="relative">
                                    {!previewFileUrl ? (
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500 font-medium">Clic para subir imagen</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <Image src={previewFileUrl} alt="Preview" fill className="object-cover" />
                                            <button type="button" onClick={() => { setFile(null); setPreviewFileUrl(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"><X size={16} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Título</label>
                                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Descripción Corta</label>
                                <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tipo de Publicación</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.type === 'anuncio' ? 'border-action-yellow bg-action-yellow/10 text-action-yellow' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                                        <input type="radio" name="type" value="anuncio" checked={formData.type === 'anuncio'} onChange={() => setFormData({ ...formData, type: 'anuncio' })} className="hidden" />
                                        <Megaphone size={18} /> Anuncio
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.type === 'sorteo' ? 'border-action-yellow bg-action-yellow/10 text-action-yellow' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                                        <input type="radio" name="type" value="sorteo" checked={formData.type === 'sorteo'} onChange={() => setFormData({ ...formData, type: 'sorteo' })} className="hidden" />
                                        <Ticket size={18} /> Sorteo
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="flex-1 px-4 py-3 bg-action-yellow text-[#1A1A1A] rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors flex justify-center items-center">
                                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Publicación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR */}
            {isDeleteModalOpen && selectedPub && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">¿Eliminar publicación?</h3>
                        <p className="text-gray-500 text-sm mb-6">Estás a punto de eliminar <strong className="text-gray-900 dark:text-white">"{selectedPub.title}"</strong>. Se borrará también la imagen de tu nube.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400">Cancelar</button>
                            <button onClick={handleDeleteConfirm} disabled={isProcessing} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex justify-center items-center">
                                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Eliminar y Borrar Foto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PREVIEW */}
            {isPreviewModalOpen && selectedPub && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md animate-fade-in-up">
                        <button onClick={() => setIsPreviewModalOpen(false)} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
                            <X size={20} /> Cerrar vista previa
                        </button>
                        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                            <div className="relative h-64 w-full">
                                <Image src={selectedPub.image_url} alt={selectedPub.title} fill className="object-cover" />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-3">{selectedPub.title}</h2>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{selectedPub.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}