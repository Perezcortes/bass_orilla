import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

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
  title: 'BassOrilla - Rifas y Sorteos de Pesca',
  description: 'La plataforma líder en rifas y sorteos de equipo de pesca deportiva.',
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
             {/* AQUÍ YA NO HAY NAVBAR NI FOOTER, SOLO LOS HIJOS */}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}