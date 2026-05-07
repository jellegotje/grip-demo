import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grip op Gegevenskwaliteit – Native Consulting',
  description:
    'Meet de datakwaliteitsvolwassenheid van uw organisatie in 5 minuten. Gratis demo van Native Consulting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-white min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
            <Image src="/logo.png" alt="Native Consulting" width={120} height={40} style={{ objectFit: 'contain' }} priority />
            <span className="h-5 w-px bg-gray-200" />
            <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
              Grip op Gegevenskwaliteit
            </span>
          </div>
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">{children}</main>

        <footer className="border-t border-gray-100 mt-12">
          <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Image src="/logo.png" alt="Native Consulting" width={100} height={28} style={{ objectFit: 'contain', opacity: 0.6 }} />
            <p className="text-sm text-gray-400">© 2025 Native Consulting</p>
            <p className="text-sm italic" style={{ color: '#5BC4A0' }}>Voel je verbonden</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
