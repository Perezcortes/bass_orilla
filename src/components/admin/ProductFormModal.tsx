'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Loader2, Upload, PlusCircle, MinusCircle, DollarSign, Store, Settings } from 'lucide-react';
import { uploadProductImageAction, deleteCloudinaryImage } from '@/app/actions/cloudinary';
import { createClient } from '@/utils/supabase/client';

const CATALOG_STRUCTURE: Record<string, Record<string, string[]>> = {
    "Agua Dulce": {
        "Carretes": ["Spinning", "Casting", "Spincast"],
        "Cañas": ["Spinning", "Casting"],
        "Combos": ["Combos Spinning", "Combos Casting", "Combos Spincast"],
        "Señuelos": ["Plásticos", "Curricanes", "Swimbaits", "Spinnerbaits y Buzzbaits", "Jigs y Chatterbaits", "Cucharillas"],
        "Terminal Tackle": ["Anzuelos y Tercias", "Plomos y Tungstenos", "Jigheads", "Esencias", "Accesorios Varios"]
    },
    "Ropa y Accesorios": {
        "Ropa": ["Buff", "Camisas y jerseys", "Gorras y Sombreros", "Guantes", "Chalecos Salvavidas", "Pantalones y Shorts"],
        "Accesorios Varios": ["Básculas", "Herramientas", "Red de Pesca", "Cuchillos y Navajas", "Otros Accesorios"],
        "Almacenaje": ["Almacenaje para Señuelos", "Almacenaje para Cañas", "Almacenaje para Carretes"],
        "Lentes Polarizados": ["General"]
    },
    "Líneas para Pescar": {
        "Monofilamento": ["General"],
        "Fluorocarbono": ["General"],
        "Trenzado": ["General"],
        "Líderes": ["General"]
    }
};

type Variant = {
    colorName: string;
    imageUrl: string;
    inStock: boolean;
    file?: File | null;
    previewUrl?: string;
};

type ProductFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit: any | null;
};

export default function ProductFormModal({ isOpen, onClose, onSuccess, productToEdit }: ProductFormModalProps) {
    const supabase = createClient();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        title: '', brand: '', description: '', price: 0, discount_price: 0 as number | null,
        department: 'Agua Dulce', category: 'Señuelos', subcategory: 'Plásticos',
        specs: '' // Cambiado a string para el textarea
    });

    const [variants, setVariants] = useState<Variant[]>([{ colorName: '', imageUrl: '', inStock: true, file: null, previewUrl: '' }]);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                title: productToEdit.title, brand: productToEdit.brand, description: productToEdit.description,
                price: productToEdit.price, discount_price: productToEdit.discount_price,
                department: productToEdit.department, category: productToEdit.category, subcategory: productToEdit.subcategory,
                specs: typeof productToEdit.specs === 'string' ? productToEdit.specs : '' 
            });
            setVariants(productToEdit.variants.map((v: any) => ({ ...v, file: null, previewUrl: v.imageUrl })));
        } else {
            setFormData({ title: '', brand: '', description: '', price: 0, discount_price: null, department: 'Agua Dulce', category: 'Señuelos', subcategory: 'Plásticos', specs: '' });
            setVariants([{ colorName: '', imageUrl: '', inStock: true, file: null, previewUrl: '' }]);
        }
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const handleVariantImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newVariants = [...variants];
            newVariants[index].file = file;
            newVariants[index].previewUrl = URL.createObjectURL(file);
            setVariants(newVariants);
        }
    };

    const addVariant = () => setVariants([...variants, { colorName: '', imageUrl: '', inStock: true, file: null, previewUrl: '' }]);
    const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

    const handleDepartmentChange = (dept: string) => {
        const firstCat = Object.keys(CATALOG_STRUCTURE[dept])[0];
        const firstSub = CATALOG_STRUCTURE[dept][firstCat][0];
        setFormData({ ...formData, department: dept, category: firstCat, subcategory: firstSub });
    };

    const handleCategoryChange = (cat: string) => {
        const firstSub = CATALOG_STRUCTURE[formData.department][cat][0];
        setFormData({ ...formData, category: cat, subcategory: firstSub });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        const generatedSlug = formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        const sanitizeForFolder = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
        const dynamicFolder = `bassorilla/productos/${sanitizeForFolder(formData.department)}/${sanitizeForFolder(formData.category)}`;

        const finalVariants = await Promise.all(variants.map(async (v) => {
            let finalUrl = v.imageUrl;
            if (v.file) {
                const form = new FormData();
                form.append('image', v.file);
                const uploadResult = await uploadProductImageAction(form, dynamicFolder);
                if (uploadResult.success && uploadResult.url) {
                    if (v.imageUrl && v.imageUrl !== uploadResult.url) await deleteCloudinaryImage(v.imageUrl);
                    finalUrl = uploadResult.url;
                }
            }
            return { colorName: v.colorName, imageUrl: finalUrl, inStock: v.inStock };
        }));

        const payload = { ...formData, slug: generatedSlug, variants: finalVariants };

        if (productToEdit) {
            await supabase.from('products').update(payload).eq('id', productToEdit.id);
        } else {
            await supabase.from('products').insert([{ ...payload, is_active: true }]);
        }

        setIsProcessing(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Store className="text-action-yellow" /> {productToEdit ? 'Editar Producto' : 'Crear Producto'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form id="productForm" onSubmit={handleFormSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Información Principal</h4>
                                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:border-action-yellow outline-none" placeholder="Nombre del Producto" />
                                <input required type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:border-action-yellow outline-none" placeholder="Marca" />
                                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:border-action-yellow outline-none resize-none" placeholder="Descripción corta" />
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Precios y Categoría</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input required type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full pl-8 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:border-action-yellow outline-none" placeholder="Precio" />
                                    </div>
                                    <div className="relative">
                                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                                        <input type="number" step="0.01" value={formData.discount_price || ''} onChange={(e) => setFormData({ ...formData, discount_price: e.target.value ? parseFloat(e.target.value) : null })} className="w-full pl-8 pr-4 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-900 dark:text-red-400 focus:border-red-500 outline-none" placeholder="Oferta" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <select value={formData.department} onChange={(e) => handleDepartmentChange(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                                        {Object.keys(CATALOG_STRUCTURE).map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    <select value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                                        {Object.keys(CATALOG_STRUCTURE[formData.department]).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <select value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
                                        {CATALOG_STRUCTURE[formData.department][formData.category].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

                        {/* ESPECIFICACIONES (TEXTAREA) */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2"><Settings size={18}/> Especificaciones Técnicas</h4>
                            <p className="text-xs text-gray-500 mb-2">Pega aquí la ficha técnica. Formato: <b>Nombre: Valor</b> (una por línea). Para la manivela usa: <b>Manivela: Derecha, Izquierda</b></p>
                            <textarea rows={6} value={formData.specs} onChange={(e) => setFormData({ ...formData, specs: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:border-action-yellow outline-none resize-none font-mono" placeholder="Marca: Shimano&#10;Relación: 6.3:1&#10;Manivela: Derecha, Izquierda" />
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 my-6"></div>

                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Colores / Variantes</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {variants.map((variant, index) => (
                                    <div key={index} className="flex gap-3 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 p-3 rounded-xl relative group">
                                        <div className="w-20 h-20 shrink-0 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden flex items-center justify-center">
                                            {variant.previewUrl ? <Image src={variant.previewUrl} alt="preview" fill className="object-contain p-1" /> : <Upload className="text-gray-400" size={20} />}
                                            <input type="file" accept="image/*" onChange={(e) => handleVariantImageChange(index, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input required type="text" placeholder="Nombre del color" value={variant.colorName} onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded text-xs text-gray-900 dark:text-white outline-none focus:border-action-yellow" />
                                            <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                                                <input type="checkbox" checked={variant.inStock} onChange={(e) => handleVariantChange(index, 'inStock', e.target.checked)} className="accent-action-yellow w-4 h-4 rounded" /> En Stock
                                            </label>
                                        </div>
                                        {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><MinusCircle size={14} /></button>}
                                    </div>
                                ))}
                                <button type="button" onClick={addVariant} className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 hover:text-action-yellow hover:border-action-yellow transition-all"><PlusCircle size={20} /> Añadir Color</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-[#1A1A1A] flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-white transition-colors">Cancelar</button>
                    <button type="submit" form="productForm" disabled={isProcessing} className="flex-[2] px-4 py-3 bg-action-yellow text-[#1A1A1A] rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors flex justify-center items-center">
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Producto'}
                    </button>
                </div>
            </div>
        </div>
    );
}