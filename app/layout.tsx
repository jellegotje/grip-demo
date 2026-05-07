import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grip op Gegevenskwaliteit – Native Consulting',
  description:
    'Meet de datakwaliteitsvolwassenheid van uw organisatie in 5 minuten. Gratis demo van Native Consulting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
            <span className="font-bold text-lg" style={{ color: '#1E3A5F' }}>
              Native Consulting
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-gray-600 text-sm">Grip op Gegevenskwaliteit</span>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Native Consulting – Grip op Gegevenskwaliteit Demo
          </div>
        </footer>
      </body>
    </html>
  );
}
