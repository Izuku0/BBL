'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex-grow bg-[#050B14] relative overflow-hidden flex flex-col justify-center items-center min-h-[calc(100vh-4rem)]">
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 sm:mb-8 inline-block bg-white/5 backdrop-blur-xl px-5 py-2 rounded-full border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          >
            <span className="text-yellow-400 font-black tracking-[0.2em] uppercase text-[10px] sm:text-xs">Banjara Cricket Association</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 uppercase tracking-tighter drop-shadow-2xl mb-1 leading-none">
            Banjara
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 uppercase tracking-tighter drop-shadow-2xl mb-4 sm:mb-8 leading-tight">
            Bigg Bash
          </h1>
          <p className="max-w-md text-gray-400 font-bold text-sm sm:text-lg mb-10 sm:mb-16 tracking-wide px-4">
            The premier league stage for elite Banjara cricket talent. Join the movement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4"
        >
          <Link href="/register" className="group relative w-full sm:w-auto min-w-[200px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center px-10 py-5 bg-gradient-to-br from-yellow-400 to-yellow-500 text-blue-950 font-black text-lg rounded-2xl shadow-xl transform transition-transform duration-300 group-hover:scale-[1.03] active:scale-95">
              JOIN LEAGUE
            </div>
          </Link>

          <Link href="/players" className="group relative w-full sm:w-auto min-w-[200px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center px-10 py-5 bg-[#0a1526]/80 border border-white/10 text-white font-black text-lg rounded-2xl shadow-xl transform transition-transform duration-300 group-hover:scale-[1.03] active:scale-95 backdrop-blur-md">
              VIEW ROSTER
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
