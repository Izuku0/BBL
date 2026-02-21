import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Banjara Bigg Bash League',
  description: 'Player registration for BBL Cricket',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-[100dvh] flex flex-col bg-[#050B14] text-white overflow-x-hidden antialiased bg-fixed`}>
        <Navbar />
        <main className="flex-grow flex flex-col pt-0 pb-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
