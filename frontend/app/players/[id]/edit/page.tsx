'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import PlayerForm from '@/app/components/PlayerForm';
import toast from 'react-hot-toast';

export default function EditPlayerPage() {
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
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPlayer();
    }, [id]);

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
            <div className="max-w-4xl mx-auto relative z-10 w-full">
                <PlayerForm initialData={player} isEdit={true} />
            </div>
        </div>
    );
}
