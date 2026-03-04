import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext'; // <-- 1. Importamos el Provider
import CartDrawer from '@/components/cart/CartDrawer'; // <-- 2. Importamos el Drawer (Panel lateral)

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BassOrilla - Rifas y Articulos',
  description: '“Las mejores marcas en equipo de pesca, disponibles en nuestras rifas.”',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-bone-white dark:bg-carbon-black text-carbon-black dark:text-bone-white transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            {/* 3. Envolvemos la app con el CartProvider */}
            <CartProvider>
              
              {/* AQUÍ YA NO HAY NAVBAR NI FOOTER, SOLO LOS HIJOS */}
              {children}
              
              {/* 4. Colocamos el Drawer aquí para que viva en todas partes y salga por encima de todo */}
              <CartDrawer />
              
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}