'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PlayerDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [player, setPlayer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/players/${id}`);
                setPlayer(res.data);
            } catch (err) {
                toast.error('Player not found');
                router.push('/players');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPlayer();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center flex-grow py-20 bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    if (!player) return null;

    return (
        <div className="flex-grow bg-[#050B14] py-8 sm:py-16 px-4 md:px-6 lg:px-8 relative">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden border border-blue-50/50"
                >
                    <div className="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('${player.photoPath}')`, filter: 'blur(10px)' }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1526] via-[#0a1526]/80 to-transparent"></div>
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white/95"></div>
                    </div>

                    <div className="px-6 py-8 sm:px-10 sm:py-10 relative -mt-32 m-4 bg-transparent rounded-xl">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="flex-shrink-0 z-20"
                            >
                                <img
                                    className="h-40 w-40 sm:h-48 sm:w-48 object-cover rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-[6px] border-white bg-white"
                                    src={player.photoPath}
                                    alt={player.fullName}
                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Photo' }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex-grow text-center md:text-left z-20 pb-2"
                            >
                                <h1 className="text-4xl sm:text-5xl font-black text-blue-950 tracking-tight drop-shadow-sm">{player.fullName}</h1>
                                <p className="text-lg text-slate-500 font-bold mt-2 flex items-center justify-center md:justify-start gap-2">
                                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    {player.address}
                                </p>
                                <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="bg-gradient-to-br from-blue-900 to-blue-950 text-white text-sm font-black px-5 py-2 rounded-xl shadow-lg border border-blue-800 tracking-wider">
                                        JERSEY: {player.jerseyNumber}
                                    </span>
                                    <span className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-blue-950 text-sm font-black px-5 py-2 rounded-xl shadow-lg border border-yellow-300 tracking-wider">
                                        SIZE: {player.jerseySize}
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
                        >
                            {/* Info Block */}
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-slate-300"></span> Contact Info
                                </h3>
                                <dl className="space-y-6">
                                    <div>
                                        <dt className="text-sm font-bold text-slate-500">WhatsApp / Phone</dt>
                                        <dd className="mt-1 text-xl text-blue-950 font-black">{player.phoneNumber}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-bold text-slate-500">Travel Cost (Train) Estimate</dt>
                                        <dd className="mt-1 text-xl text-blue-950 font-black">₹{player.travelCost}</dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Info Block */}
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-slate-300"></span> Cricket Profile
                                </h3>
                                <dl className="space-y-6">
                                    <div>
                                        <dt className="text-sm font-bold text-slate-500 mb-3">Preferred Formats</dt>
                                        <dd className="flex flex-wrap gap-2">
                                            {player.cricketFormat.map((f: string) => (
                                                <span key={f} className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold bg-white text-slate-700 border border-slate-200 shadow-sm">{f}</span>
                                            ))}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-bold text-slate-500 mb-3">Player Roles</dt>
                                        <dd className="flex flex-wrap gap-2">
                                            {player.role.map((r: string) => (
                                                <span key={r} className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-800 border border-blue-100 shadow-sm">{r}</span>
                                            ))}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-slate-300"></span> Profile Details & Stats
                                </h3>
                                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 shadow-inner">
                                    <span className="break-all text-blue-600 font-semibold text-lg">{player.profileLink}</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
                            <Link href="/players" className="w-full sm:w-auto px-8 py-4 border border-slate-200 rounded-xl shadow-sm text-sm font-black text-slate-600 bg-white hover:bg-slate-50 text-center transition-all hover:scale-[1.02]">
                                BACK TO LIST
                            </Link>
                            <Link href={`/players/${player._id}/edit`} className="w-full sm:w-auto px-8 py-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-center transition-all hover:scale-[1.02]">
                                EDIT DETAILS
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
