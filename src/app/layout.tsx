import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Anak Yesus Berbagi',
  description: 'Community orphanage charity drive',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <StoreProvider>
          {/* Navbar */}
          <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#F4AE52]/20 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="text-xl font-bold text-[#D4621A] flex items-center gap-2 transition-transform hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4621A] mt-0.5">
                        <path d="M12 3v18"/>
                        <path d="M7 8h10"/>
                      </svg>
                      Anak Yesus Berbagi
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/" className="text-[#2A1A0E] hover:text-[#D4621A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/rekap-barang" className="text-[#2A1A0E] hover:text-[#D4621A] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Rekap Barang
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="mt-auto py-6 text-center text-sm text-[#2A1A0E]/60">
            <p>© {new Date().getFullYear()} Anak Yesus Berbagi. Bersama kita berbagi kasih.</p>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
