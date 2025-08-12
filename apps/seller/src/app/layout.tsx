import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { SellerShell } from '../components/layout/seller-shell';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'TradyGo Seller Portal',
    template: '%s | TradyGo Seller',
  },
  description: 'Seller portal for TradyGo multi-vendor marketplace',
  keywords: [
    'seller',
    'vendor',
    'dashboard',
    'ecommerce',
    'marketplace',
    'multi-vendor',
    'tradygo',
  ],
  authors: [
    {
      name: 'TradyGo Team',
      url: 'https://tradygo.in',
    },
  ],
  creator: 'TradyGo',
  publisher: 'TradyGo',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SellerShell>{children}</SellerShell>
        </Providers>
      </body>
    </html>
  );
}