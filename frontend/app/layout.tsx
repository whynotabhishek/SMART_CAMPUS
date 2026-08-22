import type { Metadata, Viewport } from 'next';
import { Permanent_Marker, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import RegisterSW from '@/components/RegisterSW';

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CampusFind — Campus Lost & Found',
  description: 'AI-powered campus Lost & Found system for IIT Delhi',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#D4A574',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${permanentMarker.variable} ${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="font-body text-ink-dark min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-ink-dark/60 mt-auto border-t border-cork/20">
          CampusFind · IIT Delhi
        </footer>
        <RegisterSW />
      </body>
    </html>
  );
}
