import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Nuestras Marcas | BassOrilla',
    description: 'Conoce todas las marcas de prestigio mundial con las que trabajamos en BassOrilla.',
};

export default function MarcasPage() {
    const brands = [
        // --- GIGANTES DE CARRETES Y CAÑAS ---
        { name: 'Shimano', src: '/marcas/shimano.png' },
        { name: 'Okuma', src: '/marcas/okuma-logo.png' },
        { name: '13 Fishing', src: '/marcas/13-fishing.png' },

        // --- LÍDERES EN SEÑUELOS Y PLÁSTICOS ---
        { name: 'Rapala', src: '/marcas/Rapala-logo.png' },
        { name: 'Strike King', src: '/marcas/strike-king.png' },
        { name: 'Zoom', src: '/marcas/zoom_logo.jpg' },
        { name: 'Yum', src: '/marcas/logo_yum.png' },
        { name: 'Z-Man', src: '/marcas/zman-logo.png' },
        { name: 'Googan Baits', src: '/marcas/googan_logo.jpg' },
        { name: 'X-Zone', src: '/marcas/x-zone-logo.png' },
        { name: 'Rage Tail', src: '/marcas/rage-tail-logo.png' },
        { name: 'Jorca', src: '/marcas/jorca-logo.png' },

        // --- SEÑUELOS DUROS CLÁSICOS ---
        { name: 'Bomber', src: '/marcas/bomber-logo.png' },
        { name: 'Booyah', src: '/marcas/booyah-logo.png' },
        { name: 'Heddon', src: '/marcas/heddon-logo.png' },
        { name: 'Norman Lures', src: '/marcas/norman-lures.png' },
        { name: 'Storm', src: '/marcas/storm-logo.png' },
        { name: 'War Eagle', src: '/marcas/war-eagle.png' },

        // --- TERMINAL TACKLE (ANZUELOS Y PLOMOS) ---
        { name: 'Eagle Claw', src: '/marcas/eagle-claw.png' },
        { name: 'Trokar', src: '/marcas/trokar-logo.png' },
        { name: 'Lazer Sharp', src: '/marcas/lazer-sharp.png' },

        // --- LÍNEAS PARA PESCAR ---
        { name: 'Seaguar', src: '/marcas/seaguar-logo.png' },
        { name: 'Sufix', src: '/marcas/logo-sufix.png' },

        // --- ACCESORIOS Y LENTES ---
        { name: 'Costa', src: '/marcas/costa-logo.png' },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] transition-colors duration-300">

            {/* HEADER DE LA PÁGINA CON FONDO DE IMAGEN */}
            <div className="relative pt-10 pb-16 overflow-hidden">

                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 z-0 bg-[url('/fondo-carretes.png')] bg-cover bg-center bg-no-repeat"
                />

                {/* Overlay oscuro para garantizar que el texto blanco sea 100% legible */}
                <div className="absolute inset-0 z-0 bg-black/70 dark:bg-[#111110]/80" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    {/* Breadcrumb (Actualizado a tonos claros) */}
                    <nav className="flex items-center text-sm text-gray-300 mb-6 font-medium">
                        <Link href="/" className="hover:text-action-yellow transition-colors drop-shadow-sm">Inicio</Link>
                        <ChevronRight size={14} className="mx-2 shrink-0 opacity-70" />
                        <span className="text-white font-bold drop-shadow-sm">Marcas</span>
                    </nav>

                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto mt-4">
                        <div className="w-16 h-16 bg-action-yellow/20 text-action-yellow rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-action-yellow/30 shadow-lg">
                            <Award size={32} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tight uppercase mb-4 drop-shadow-lg">
                            Nuestras Marcas
                        </h1>
                        <p className="text-lg text-gray-200 drop-shadow-md font-medium leading-relaxed">
                            Trabajamos exclusivamente con fabricantes de prestigio mundial para garantizar que tu equipo nunca te falle en el agua. Selecciona una marca para explorar sus productos.
                        </p>
                    </div>
                </div>
            </div>

            {/* CUADRÍCULA DE MARCAS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                    {brands.map((brand, index) => (
                        <Link
                            key={index}
                            href={`/catalogo?q=${encodeURIComponent(brand.name)}`}
                            className="group bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center aspect-square shadow-sm hover:shadow-xl border border-gray-100 dark:border-transparent transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                            title={`Ver productos de ${brand.name}`}
                        >
                            {/* Efecto de destello en el fondo al pasar el mouse */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-action-yellow/0 to-action-yellow/0 group-hover:from-action-yellow/5 group-hover:to-transparent transition-colors duration-300"></div>

                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={brand.src}
                                    alt={brand.name}
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}