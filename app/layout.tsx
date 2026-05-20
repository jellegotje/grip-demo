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
        {/* Skip-link voor toetsenbordgebruikers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
          style={{ backgroundColor: '#1E3A5F' }}
        >
          Ga naar hoofdinhoud
        </a>

        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Native Consulting logo"
              width={120}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
            <span className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
              Grip op Gegevenskwaliteit
            </span>
          </div>
        </header>

        <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-gray-100 mt-12">
          <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Image
              src="/logo.png"
              alt="Native Consulting logo"
              width={100}
              height={28}
              style={{ objectFit: 'contain', opacity: 0.6 }}
            />
            <p className="text-sm text-gray-600">© 2026 Native Consulting</p>
            <p className="text-sm italic" style={{ color: '#5BC4A0' }}>Voel je verbonden</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
