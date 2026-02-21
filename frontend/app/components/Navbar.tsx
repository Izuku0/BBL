'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        {
            name: 'Home', href: '/', icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-yellow-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'Players', href: '/players', icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-yellow-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            name: 'Register', href: '/register', icon: (active: boolean) => (
                <svg className={`w-6 h-6 ${active ? 'text-yellow-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            )
        }
    ];

    return (
        <>
            {/* Top Desktop/Branding Bar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="bg-[#050B14]/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 w-full"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2 group">
                                <span className="text-white text-2xl font-black tracking-tighter group-hover:text-yellow-400 transition-colors">
                                    BBL <span className="text-yellow-500 group-hover:text-white transition-colors uppercase">Cricket</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-8">
                            <Link href="/" className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all uppercase ${pathname === '/' ? 'text-yellow-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                                Home
                            </Link>
                            <Link href="/players" className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all uppercase ${pathname.startsWith('/players') ? 'text-yellow-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
                                View Players
                            </Link>
                            <Link href="/register" className="ml-4 bg-gradient-to-r from-yellow-400 to-yellow-600 font-bold text-blue-950 px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_40px_rgba(250,204,21,0.5)] transform hover:-translate-y-0.5 transition-all uppercase text-sm">
                                Register Now
                            </Link>
                        </div>

                        {/* Mobile Top Right (Secondary) */}
                        <div className="sm:hidden flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></div>
                            <span className="text-[10px] font-black text-white uppercase tracking-tighter opacity-50">Live Season 2026</span>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Bottom Navigation Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
            >
                <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-between items-center">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                            <Link key={link.name} href={link.href} className="flex flex-col items-center gap-1 group">
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`relative p-2 rounded-2xl transition-all ${isActive ? 'bg-yellow-400/10' : 'group-hover:bg-white/5'}`}
                                >
                                    {link.icon(isActive)}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"
                                        />
                                    )}
                                </motion.div>
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-yellow-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {link.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </>
    );
}

