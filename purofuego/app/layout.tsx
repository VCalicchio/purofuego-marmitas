import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Puro Fuego Marmitas Congeladas',
  description: 'Marmitas congeladas artesanais com sabor, praticidade e qualidade.',
  openGraph: {
    title: 'Puro Fuego Marmitas Congeladas',
    description: 'Marmitas congeladas artesanais com sabor, praticidade e qualidade.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
