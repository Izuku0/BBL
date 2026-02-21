'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PlayersPage() {
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/players`);
            setPlayers(res.data);
        } catch (err) {
            toast.error('Failed to fetch players');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setPlayerToDelete(id);
    };

    const confirmDelete = async () => {
        if (!playerToDelete) return;
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/players/${playerToDelete}`);
            toast.success('Player removed');
            fetchPlayers(); // Re-fetch players to update the list
            setPlayerToDelete(null);
        } catch (err) {
            toast.error('Delete failed');
            setPlayerToDelete(null);
        }
    };

    const filteredPlayers = players.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-grow bg-[#050B14] py-8 sm:py-16 px-4 md:px-6 lg:px-8 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 flex flex-col lg:flex-row justify-between items-center mb-10 gap-6"
                >
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">League Roster</h1>
                        <p className="text-blue-300/80 mt-2 font-medium">Browse and manage talented Banjara Cricketers</p>
                    </div>
                    <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search player or city..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 text-white px-5 py-3 rounded-xl focus:ring-2 focus:ring-yellow-500/50 outline-none placeholder-gray-500 transition-all font-medium"
                            />
                            <svg className="w-5 h-5 absolute right-4 top-3.5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <Link href="/register" className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 text-blue-950 font-black px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] text-center transition-all hover:-translate-y-0.5 whitespace-nowrap uppercase tracking-wider text-sm">
                            + Add Player
                        </Link>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                    </div>
                ) : filteredPlayers.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                        <p className="text-gray-400 text-xl font-medium mb-4">No players found matching your criteria.</p>
                        <button onClick={() => setSearchTerm('')} className="text-yellow-400 hover:text-yellow-300 font-bold underline transition-colors">Clear Search</button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
                    >
                        {filteredPlayers.map(player => (
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9, y: 30 },
                                    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
                                }}
                                key={player._id}
                                className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 hover:shadow-[0_0_40px_rgba(250,204,21,0.1)] transition-all flex flex-col group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none z-10"></div>
                                <div className="h-64 relative overflow-hidden bg-black/50">
                                    <img
                                        src={player.photoPath}
                                        alt={player.fullName}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Photo' }}
                                    />
                                    <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-xl tracking-wider">
                                        No. {player.jerseyNumber}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-yellow-400 transition-colors drop-shadow-md">{player.fullName}</h3>
                                        <p className="text-sm text-gray-300 font-medium flex items-center gap-1 mt-1">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {player.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col z-20 relative bg-black/60 backdrop-blur-md border-t border-white/10">
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {player.role.slice(0, 2).map((r: string) => (
                                                <span key={r} className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-blue-200 px-2.5 py-1 rounded-md border border-white/5 truncate max-w-[140px]">
                                                    {r}
                                                </span>
                                            ))}
                                            {player.role.length > 2 && <span className="text-[10px] font-bold text-gray-400 py-1 bg-white/5 px-2 rounded-md">+{player.role.length - 2}</span>}
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-2 pt-2">
                                        <Link href={`/players/${player._id}`} className="flex-1 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-white text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all">
                                            View
                                        </Link>
                                        <Link href={`/players/${player._id}/edit`} className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/30 text-yellow-500 text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer">
                                            Edit
                                        </Link>
                                        <button onClick={(e) => handleDeleteClick(player._id, e)} className="flex-none bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 text-red-500 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer hover:scale-105" title="Delete">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {playerToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#0a1526] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white">Delete Player?</h3>
                        </div>

                        <p className="text-gray-400 font-medium mb-8">This action cannot be undone. Are you sure you want to remove this player from the roster?</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPlayerToDelete(null)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all flex justify-center items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
