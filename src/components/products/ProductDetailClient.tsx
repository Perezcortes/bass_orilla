'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    Star, Minus, Plus, ShoppingCart,
    Truck, Shield, RotateCcw, CheckCircle, Ticket, PackageX,
    Package, CreditCard
} from 'lucide-react';
import ZoomableImage from '@/components/ui/ZoomableImage';
import ShareButton from '@/components/ui/ShareButton';
import { useCart } from '@/context/CartContext'; // <-- Importación agregada

type Variant = { colorName: string; imageUrl: string; inStock: boolean; };
type Product = {
    id: string; title: string; slug: string; brand: string; description: string;
    department: string; category: string; subcategory: string;
    price: number; discount_price: number | null; variants: Variant[];
    specs?: string;
};

export default function ProductDetailClient({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[0]);

    // Obtenemos la función para agregar al carrito
    const { addToCart } = useCart();

    // === LÓGICA DE SPECS INTELIGENTES ===
    const specsText = product.specs || "";

    const parseVariantOptions = (text: string, keys: string[]) => {
        const line = text.split('\n').find(l => {
            if (!l.includes(':')) return false;
            const key = l.split(':')[0].toLowerCase().trim();
            return keys.includes(key);
        });
        if (!line) return { label: '', options: [] };

        const parts = line.split(':');
        const label = parts[0].trim();
        const options = parts.slice(1).join(':').split(',').map(s => s.trim());
        return { label, options };
    };

    // 1. Manivela
    const manivelaData = parseVariantOptions(specsText, ['manivela']);
    const [selectedManivela, setSelectedManivela] = useState<string>(manivelaData.options[0] || '');

    // 2. Medidas / Tallas / Pesos
    const sizeData = parseVariantOptions(specsText, ['talla', 'tallas', 'medida', 'medidas', 'tamaño', 'tamaños', 'peso', 'pesos']);
    const [selectedSize, setSelectedSize] = useState<string>(sizeData.options[0] || '');

    // 3. Resistencia 
    const resistenciaData = parseVariantOptions(specsText, ['resistencia', 'resistencias', 'libraje']);
    const [selectedResistencia, setSelectedResistencia] = useState<string>(resistenciaData.options[0] || '');

    const formatPrice = (amount: number) => {
        if (amount < 1000) {
            return `$ ${amount.toFixed(2)}`;
        } else {
            const integerPart = Math.floor(amount).toString();
            const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return `$ ${formattedInteger}`;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* IZQUIERDA: GALERÍA */}
            <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-8 relative">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                        <ZoomableImage src={selectedVariant.imageUrl} alt={product.title} />
                    </div>
                </div>

                {product.variants.length > 1 && (
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 sm:gap-3">
                        {product.variants.map((v, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedVariant(v)}
                                className={`aspect-square rounded-xl border-2 transition-all relative overflow-hidden p-1 bg-white ${selectedVariant.colorName === v.colorName ? 'border-action-yellow scale-105 shadow-sm' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                title={v.colorName}
                            >
                                <Image src={v.imageUrl} alt={v.colorName} fill className="object-contain p-1" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* DERECHA: INFO */}
            <div className="lg:col-span-5 flex flex-col">
                <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{product.brand}</p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-gray-900 dark:text-white uppercase leading-tight">{product.title}</h1>
                        </div>
                        <ShareButton title={product.title} url={`https://bass-orilla.vercel.app/catalogo/${product.slug}`} text={product.description} showText={false} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-full hover:text-action-yellow ml-4 shrink-0" />
                    </div>
                    <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center text-action-yellow">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                        </div>
                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                        <span className={selectedVariant.inStock ? "text-green-600 font-bold flex items-center gap-1 text-sm" : "text-red-500 font-bold flex items-center gap-1 text-sm"}>
                            {selectedVariant.inStock ? <><CheckCircle size={16} /> En Stock</> : <><PackageX size={16} /> Agotado</>}
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-xl p-4 mb-8 flex justify-between items-center border border-gray-100 dark:border-gray-800 font-display">
                    <div>
                        {product.discount_price ? (
                            <>
                                <span className="block text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                                <span className="block text-3xl font-black text-red-500">{formatPrice(product.discount_price)}</span>
                            </>
                        ) : (
                            <span className="block text-3xl font-black text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                        )}
                    </div>
                </div>

                {/* SELECTORES DINÁMICOS */}
                <div className="space-y-5 mb-8">
                    {product.variants.length > 1 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-1">Color:</h3>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedVariant.colorName}</p>
                        </div>
                    )}

                    {/* Generador del Selector de Manivela */}
                    {manivelaData.options.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{manivelaData.label}:</h3>
                            <div className="flex gap-2">
                                {manivelaData.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedManivela(opt)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${selectedManivela === opt ? 'border-action-yellow bg-action-yellow text-black' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Generador del Selector de Tallas/Medidas/Pesos */}
                    {sizeData.options.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{sizeData.label}:</h3>
                            <div className="flex flex-wrap gap-2">
                                {sizeData.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedSize(opt)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${selectedSize === opt ? 'border-action-yellow bg-action-yellow text-black' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Generador del Selector de Resistencia */}
                    {resistenciaData.options.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{resistenciaData.label}:</h3>
                            <div className="flex flex-wrap gap-2">
                                {resistenciaData.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedResistencia(opt)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${selectedResistencia === opt ? 'border-action-yellow bg-action-yellow text-black' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ACCIONES COMPRA */}
                <div className="mt-auto">
                    <div className="flex flex-row gap-3 mb-6">
                        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black overflow-hidden h-12">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 h-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><Minus size={16} /></button>
                            <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-3 h-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"><Plus size={16} /></button>
                        </div>

                        {/* BOTÓN AGREGAR AL CARRITO */}
                        <button
                            onClick={() => {
                                if (!selectedVariant.inStock) return;
                                addToCart({
                                    productId: product.id,
                                    slug: product.slug,
                                    title: product.title,
                                    price: product.discount_price || product.price,
                                    image: selectedVariant.imageUrl,
                                    quantity: quantity,
                                    color: selectedVariant.colorName,
                                    manivela: selectedManivela,
                                    size: selectedSize,
                                    resistencia: selectedResistencia
                                });
                            }}
                            disabled={!selectedVariant.inStock}
                            className={`flex-1 font-bold text-sm sm:text-base uppercase h-12 rounded-lg shadow-sm flex justify-center items-center gap-2 transition-all ${selectedVariant.inStock ? 'bg-action-yellow hover:bg-yellow-400 text-black hover:shadow-md cursor-pointer' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                        >
                            <ShoppingCart size={18} /> {selectedVariant.inStock ? 'Agregar al Carrito' : 'Agotado'}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] sm:text-xs font-medium text-center text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-5">
                        <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-gray-400" /><span>Envíos Nacionales</span></div>
                        <div className="flex flex-col items-center gap-1"><Shield size={18} className="text-gray-400" /><span>Compra Segura</span></div>
                        <div className="flex flex-col items-center gap-1"><RotateCcw size={18} className="text-gray-400" /><span>Atención Personal</span></div>
                    </div>
                </div>
            </div>

            {/* PESTAÑAS Y TABLA DE ESPECIFICACIONES */}
            <div className="lg:col-span-12 mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
                <div className="flex gap-6 sm:gap-10 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar">
                    {['description', 'specs', 'shipping'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 border-b-2 transition-colors whitespace-nowrap text-xs sm:text-sm font-bold uppercase tracking-widest ${activeTab === tab ? 'border-action-yellow text-gray-900 dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            {tab === 'description' ? 'Descripción' : tab === 'specs' ? 'Ficha Técnica' : 'Envíos'}
                        </button>
                    ))}
                </div>
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {activeTab === 'description' && <div className="whitespace-pre-wrap leading-relaxed">{product.description || "Sin descripción disponible."}</div>}

                    {activeTab === 'specs' && (
                        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left"><tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {specsText.split('\n').map((line, i) => {
                                    if (!line.includes(':')) return null;
                                    const [key, ...val] = line.split(':');
                                    return (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 font-bold uppercase bg-gray-50 dark:bg-[#111110] w-1/3 md:w-1/4 text-xs sm:text-sm">{key.trim()}</th>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{val.join(':').trim()}</td>
                                        </tr>
                                    );
                                })}
                                {/* Si no escribiste nada, por lo menos muestra la marca */}
                                {!specsText && (
                                    <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 font-bold uppercase bg-gray-50 dark:bg-[#111110] w-1/3 md:w-1/4 text-xs sm:text-sm">Marca</th>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{product.brand}</td>
                                    </tr>
                                )}
                            </tbody></table>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-6 mt-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 dark:bg-[#111110] p-3 rounded-xl text-gray-500 dark:text-gray-400 shrink-0 border border-gray-200 dark:border-gray-800">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">Envíos Nacionales</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        El costo de envío se cotiza directamente por WhatsApp dependiendo de tu código postal. Trabajamos con paqueterías seguras para garantizar que tu equipo llegue en perfectas condiciones.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 dark:bg-[#111110] p-3 rounded-xl text-gray-500 dark:text-gray-400 shrink-0 border border-gray-200 dark:border-gray-800">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">Métodos de Pago</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Aceptamos pagos mediante Transferencia Interbancaria (SPEI), depósitos en tiendas OXXO y pagos en efectivo para entregas personales locales.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}