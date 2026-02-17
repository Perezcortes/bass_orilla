'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ZoomIn,
  CheckCircle,
  Ticket,
} from 'lucide-react';

export default function ProductoPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Watermelon Seed');
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(
    'https://images.unsplash.com/photo-1590872241989-c5d9c221c2e9?q=80&w=2070'
  );

  const product = {
    id: '1',
    brand: 'Zoom Bait Company',
    name: 'Magnum Trick Worm',
    price: 6.99,
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description:
      "The Zoom Magnum Trick Worm is a beefed-up version of the original Trick Worm, designed to tempt larger bass. It's a straight-tailed floating worm that is deadly for topwater worming or twitching.",
    features: [
      'Super soft plastic body for realistic texture',
      'Salt-impregnated to make fish hold on longer',
      'Versatile rigging: Texas, Carolina, or Wacky style',
    ],
    specs: {
      length: '6.5 inches',
      type: 'Floating Worm',
      packQty: '20 Count',
      feature: 'Salt Impregnated',
    },
    colors: [
      { name: 'Watermelon Seed', color: '#2f5e38' },
      { name: 'Green Pumpkin', color: '#a05e2b' },
      { name: 'Chartreuse Pepper', color: '#d9f99d' },
      { name: 'Pearl White', color: '#f3f4f6' },
      { name: 'Black & Blue', color: '#1e3a8a' },
      { name: 'Bubblegum', color: '#fbcfe8' },
    ],
    images: [
      'https://images.unsplash.com/photo-1590872241989-c5d9c221c2e9?q=80&w=2070',
      'https://images.unsplash.com/photo-1564701148948-15adf2c41d2c?q=80&w=2070',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
    ],
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#1A1A1A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-action-yellow">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/catalogo" className="hover:text-action-yellow">
            Catálogo
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Section */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 relative group">
              <div className="absolute top-6 left-6 z-10 opacity-50">
                <span className="font-display text-4xl font-black italic tracking-tighter text-red-600">
                  ZOOM
                </span>
              </div>

              <div className="relative w-full aspect-[4/3] flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 flex items-center gap-1 pointer-events-none">
                  <ZoomIn size={14} />
                  Hover para zoom
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-xl border-2 ${
                    mainImage === img
                      ? 'border-action-yellow'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  } bg-white dark:bg-gray-900 overflow-hidden p-2 transition-all`}
                >
                  <Image
                    src={img}
                    alt={`View ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-red-600 uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                  <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white uppercase leading-tight">
                    {product.name}
                  </h1>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition">
                  <Heart size={24} />
                </button>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center mt-3 space-x-4">
                <div className="flex items-center text-action-yellow">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? 'fill-current' : ''}
                    />
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 font-medium">
                    ({product.reviews} reseñas)
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  En Stock
                </span>
              </div>
            </div>

            {/* Price & Raffle */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 flex justify-between items-center border border-gray-200 dark:border-gray-700">
              <div>
                <span className="block text-3xl font-display font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  por paquete (20 unidades)
                </span>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center bg-action-yellow/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-action-yellow/40 mb-1">
                  <Ticket size={14} className="mr-1" />1 Boleto Gratis
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Gana una lancha
                </p>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Selecciona Color
                </h3>
                <span className="text-sm font-bold text-action-yellow">
                  {selectedColor}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {product.colors.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    onClick={() => setSelectedColor(colorOption.name)}
                    className={`w-10 h-10 rounded-full shadow-sm hover:scale-110 transition-all ${
                      selectedColor === colorOption.name
                        ? 'ring-2 ring-action-yellow ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                        : ''
                    }`}
                    style={{ backgroundColor: colorOption.color }}
                    aria-label={colorOption.name}
                  />
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">
                  Longitud
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.specs.length}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">
                  Tipo
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.specs.type}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">
                  Cantidad
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.specs.packQty}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase mb-1">
                  Característica
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {product.specs.feature}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="px-3 py-2 text-gray-900 dark:text-white font-bold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button className="flex-1 bg-action-yellow hover:bg-yellow-500 text-[#1A1A1A] font-display font-bold text-lg uppercase tracking-wide py-3 rounded-lg shadow-md hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 group">
                  <ShoppingCart
                    size={20}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Agregar al Carrito
                  <span className="bg-[#1A1A1A] text-white text-[10px] px-2 py-0.5 rounded-full">
                    +1 Boleto
                  </span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 text-xs text-center">
                <div className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Truck size={20} className="text-splash-blue" />
                  <span>Envío Gratis</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Shield size={20} className="text-bass-green" />
                  <span>Pago Seguro</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400">
                  <RotateCcw size={20} className="text-action-yellow" />
                  <span>Devoluciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-6">
            {['description', 'techniques', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-action-yellow text-gray-900 dark:text-white font-bold'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium'
                }`}
              >
                {tab === 'description' && 'Descripción'}
                {tab === 'techniques' && 'Técnicas'}
                {tab === 'shipping' && 'Envíos'}
              </button>
            ))}
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            {activeTab === 'description' && (
              <>
                <p>{product.description}</p>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
            {activeTab === 'techniques' && (
              <p>
                Ideal para pesca con técnica wacky rig, Texas rig o Carolina
                rig. Excelente para lobinas en aguas claras.
              </p>
            )}
            {activeTab === 'shipping' && (
              <p>
                Envío gratis en compras mayores a $500 MXN. Entregas en 3-5 días
                hábiles.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}