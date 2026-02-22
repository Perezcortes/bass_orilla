import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import ProductDetailClient from '@/components/products/ProductDetailClient';

// 1. GENERADOR DE METADATOS (SEO y WhatsApp)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('slug', resolvedParams.slug).single();

  if (!product) return { title: 'Producto no encontrado' };

  return {
    title: `${product.title} - ${product.brand} | BassOrilla`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      // Usamos la imagen de la primera variante (color) como miniatura
      images: [product.variants[0]?.imageUrl], 
    },
  };
}

// 2. PÁGINA PRINCIPAL (Server Component)
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  // Buscamos el producto
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb de Navegación */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-action-yellow transition-colors">Inicio</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href="/catalogo" className="hover:text-action-yellow transition-colors">Catálogo</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href={`/catalogo?dept=${product.department}`} className="hover:text-action-yellow transition-colors">{product.department}</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href={`/catalogo?dept=${product.department}&cat=${product.category}`} className="hover:text-action-yellow transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <span className="text-gray-900 dark:text-white font-bold max-w-[200px] truncate" title={product.title}>
            {product.title}
          </span>
        </nav>

        {/* Carga del componente interactivo pasando el producto desde la BD */}
        <ProductDetailClient product={product} />

      </div>
    </div>
  );
}