import { Raleway } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import FloatingBottomNav from '@/app/components/FloatingBottomNav';
import type { Metadata } from 'next';

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
});

export const metadata: Metadata = {
  title: {
    default: 'Cerita Batik – Marketplace Batik Lokal, Edukasi, & Komunitas',
    template: '%s | Cerita Batik',
  },
  description:
    'Temukan, pelajari, dan dukung batik asli Indonesia. Marketplace batik, cerita pengrajin, edukasi budaya, dan komunitas batik dalam satu platform.',
  keywords: [
    'batik',
    'marketplace batik',
    'batik cirebon',
    'batik tulis',
    'batik cap',
    'cerita batik',
    'edukasi batik',
    'komunitas batik',
    'budaya indonesia',
    'kerajinan tradisional',
    'pengrajin lokal',
    'motif batik',
    'filosofi batik',
    'produk lokal',
    'cerita pengrajin',
  ],
  openGraph: {
    title: 'Cerita Batik – Marketplace Batik Lokal, Edukasi, & Komunitas',
    description:
      'Temukan, pelajari, dan dukung batik asli Indonesia. Marketplace batik, cerita pengrajin, edukasi budaya, dan komunitas batik dalam satu platform.',
    url: 'https://cerita-batik.vercel.app/',
    siteName: 'Cerita Batik',
    images: [
      {
        url: '/images/logo/cerita-batik-logo.png',
        width: 512,
        height: 512,
        alt: 'Cerita Batik Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cerita Batik – Marketplace Batik Lokal, Edukasi, & Komunitas',
    description:
      'Temukan, pelajari, dan dukung batik asli Indonesia. Marketplace batik, cerita pengrajin, edukasi budaya, dan komunitas batik dalam satu platform.',
    images: ['/images/logo/cerita-batik-logo.png'],
    creator: '@ceritabatik',
  },
  icons: {
    icon: '/images/logo/cerita-batik-logo.png',
    shortcut: '/images/logo/cerita-batik-logo.png',
    apple: '/images/logo/cerita-batik-logo.png',
  },
  metadataBase: new URL('https://cerita-batik.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head />
      <body className={`${raleway.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <FloatingBottomNav />
        <Footer />
      </body>
    </html>
  );
}
