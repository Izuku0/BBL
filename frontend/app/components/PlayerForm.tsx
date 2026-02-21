'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const FORMATS = ['Leather Ball', 'Tennis Ball (Hard/Soft)'];
const ROLES = [
    'Left Hand Batter', 'Right Hand Batter', 'Wicket Keeper',
    'Left Hand Fast Bowler', 'Right Hand Fast Bowler',
    'Left Hand Spin Bowler', 'Right Hand Spin Bowler'
];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

type FormData = {
    fullName: string;
    phoneNumber: string;
    cricketFormat: string[];
    role: string[];
    address: string;
    jerseySize: string;
    jerseyNumber: string;
    travelCost: string;
    profileLink: string;
    photo: FileList | null;
};

interface PlayerFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function PlayerForm({ initialData, isEdit = false }: PlayerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialData ? initialData.photoPath : null);

    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<FormData>({
        defaultValues: initialData ? {
            fullName: initialData.fullName,
            phoneNumber: initialData.phoneNumber,
            cricketFormat: initialData.cricketFormat || [],
            role: initialData.role || [],
            address: initialData.address,
            jerseySize: initialData.jerseySize,
            jerseyNumber: initialData.jerseyNumber?.toString(),
            travelCost: initialData.travelCost?.toString(),
            profileLink: initialData.profileLink,
        } : {
            cricketFormat: [],
            role: [],
            jerseySize: 'L'
        }
    });

    const watchPhoto = watch('photo');

    useEffect(() => {
        if (watchPhoto && watchPhoto.length > 0) {
            const file = watchPhoto[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size exceeds 10 MB');
                setPreview(null);
            } else {
                const objectUrl = URL.createObjectURL(file);
                setPreview(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            }
        }
    }, [watchPhoto]);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append('fullName', data.fullName);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('address', data.address);
            formData.append('jerseySize', data.jerseySize);
            formData.append('jerseyNumber', data.jerseyNumber);
            formData.append('travelCost', data.travelCost);
            formData.append('profileLink', data.profileLink);

            data.cricketFormat.forEach(f => formData.append('cricketFormat', f));
            data.role.forEach(r => formData.append('role', r));

            if (data.photo && data.photo[0]) {
                formData.append('photo', data.photo[0]);
            }

            if (isEdit && initialData) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/players/${initialData._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Player updated successfully');
                router.push('/players');
                router.refresh();
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/players`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Player registered successfully');
                reset();
                setPreview(null);
                router.push('/players');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-black/40 backdrop-blur-3xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-4xl mx-auto border border-white/10 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-400 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 pb-6 border-b border-white/5 flex items-center gap-4">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-3 h-10 rounded-full inline-block shadow-[0_0_20px_rgba(250,204,21,0.3)]"></span>
                <span className="uppercase tracking-tighter">{isEdit ? 'Update Roster' : 'Player Entry'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Full Name */}
                <motion.div whileTap={{ scale: 0.99 }}>
                    <label className="form-label-premium text-gray-400">Full Name *</label>
                    <input
                        {...register('fullName', { required: 'Full name is required' })}
                        className="form-input-premium"
                        placeholder="e.g. Rahul Kumar"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-2 font-bold">{errors.fullName.message}</p>}
                </motion.div>

                {/* Phone Number */}
                <motion.div whileTap={{ scale: 0.99 }}>
                    <label className="form-label-premium text-gray-400">WhatsApp Number *</label>
                    <input
                        {...register('phoneNumber', { required: 'Phone number is required' })}
                        className="form-input-premium"
                        placeholder="+91 00000 00000"
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-2 font-bold">{errors.phoneNumber.message}</p>}
                </motion.div>

                {/* Cricket Format */}
                <div className="md:col-span-2 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl transition-all hover:border-yellow-500/30">
                    <label className="form-label-premium text-lg mb-6 text-white">Cricket Format *</label>
                    <div className="flex flex-wrap gap-4">
                        {FORMATS.map(f => (
                            <label key={f} className="flex items-center space-x-3 cursor-pointer bg-black/40 px-6 py-3 border border-white/5 rounded-2xl hover:border-yellow-500/50 hover:bg-white/5 transition-all group">
                                <input
                                    type="checkbox"
                                    value={f}
                                    {...register('cricketFormat', { required: 'Select at least one format' })}
                                    className="w-5 h-5 accent-yellow-500 rounded border-white/20 bg-transparent transition-all"
                                />
                                <span className="text-sm font-black text-gray-300 group-hover:text-white transition-colors uppercase tracking-wider">{f}</span>
                            </label>
                        ))}
                    </div>
                    {errors.cricketFormat && <p className="text-red-500 text-sm mt-3 font-bold">{errors.cricketFormat.message}</p>}
                </div>

                {/* Role Profile */}
                <div className="md:col-span-2 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl transition-all hover:border-blue-500/30">
                    <label className="form-label-premium text-lg mb-6 text-white">Role Profile *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ROLES.map(r => (
                            <label key={r} className="flex items-center space-x-3 cursor-pointer bg-black/40 px-5 py-4 border border-white/5 rounded-2xl hover:border-blue-400/50 hover:bg-white/5 transition-all group">
                                <input
                                    type="checkbox"
                                    value={r}
                                    {...register('role', { required: 'Select at least one role' })}
                                    className="w-5 h-5 accent-blue-500 rounded border-white/20 bg-transparent transition-all"
                                />
                                <span className="text-sm font-black text-gray-300 group-hover:text-white transition-colors uppercase tracking-tight">{r}</span>
                            </label>
                        ))}
                    </div>
                    {errors.role && <p className="text-red-500 text-sm mt-3 font-bold">{errors.role.message}</p>}
                </div>

                {/* Address */}
                <motion.div whileTap={{ scale: 0.99 }} className="md:col-span-2">
                    <label className="form-label-premium text-gray-400">Complete Address (City, State) *</label>
                    <textarea
                        {...register('address', { required: 'Address is required' })}
                        className="form-input-premium min-h-[120px]"
                        placeholder="e.g. Bengaluru, Karnataka"
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-2 font-bold">{errors.address.message}</p>}
                </motion.div>

                {/* Jersey Size & Number */}
                <motion.div whileTap={{ scale: 0.99 }}>
                    <label className="form-label-premium text-gray-400">Jersey Size *</label>
                    <select
                        {...register('jerseySize', { required: 'Jersey size required' })}
                        className="form-input-premium cursor-pointer !text-white"
                    >
                        <option value="" className="bg-[#0a1526] text-white">Select Size</option>
                        {SIZES.map(s => (
                            <option key={s} value={s} className="bg-[#0a1526] text-white">
                                {s}
                            </option>
                        ))}
                    </select>
                    {errors.jerseySize && <p className="text-red-500 text-sm mt-2 font-bold">{errors.jerseySize.message}</p>}
                </motion.div>

                <motion.div whileTap={{ scale: 0.99 }}>
                    <label className="form-label-premium text-gray-400">Jersey Number *</label>
                    <input
                        type="number"
                        {...register('jerseyNumber', { required: 'Jersey number is required' })}
                        className="form-input-premium"
                        placeholder="e.g. 07"
                    />
                    {errors.jerseyNumber && <p className="text-red-500 text-sm mt-2 font-bold">{errors.jerseyNumber.message}</p>}
                </motion.div>

                {/* Travel Cost */}
                <motion.div whileTap={{ scale: 0.99 }} className="md:col-span-2">
                    <label className="form-label-premium text-gray-400">Travel Cost to Bengaluru (Train in ₹) *</label>
                    <input
                        type="number"
                        {...register('travelCost', { required: 'Travel cost is required' })}
                        className="form-input-premium"
                        placeholder="e.g. 1500"
                    />
                    {errors.travelCost && <p className="text-red-500 text-sm mt-2 font-bold">{errors.travelCost.message}</p>}
                </motion.div>

                {/* Profile Link */}
                <motion.div whileTap={{ scale: 0.99 }} className="md:col-span-2">
                    <label className="form-label-premium text-gray-400">Cricheroes Profile / Bio *</label>
                    <input
                        {...register('profileLink', { required: 'Profile detail is required' })}
                        className="form-input-premium"
                        placeholder="Stats link or brief description"
                    />
                    {errors.profileLink && <p className="text-red-500 text-sm mt-2 font-bold">{errors.profileLink.message}</p>}
                </motion.div>

                {/* Photo Upload */}
                <div className="md:col-span-2 bg-white/5 p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-inner">
                    <label className="form-label-premium text-white text-lg mb-6">Highlight Photo * <span className="text-xs font-normal text-gray-500 tracking-normal normal-case">(Max 10 MB)</span></label>
                    <div className="mt-2 flex flex-col sm:flex-row items-center gap-8">
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative overflow-hidden inline-block border-2 border-dashed border-white/10 bg-black/20 rounded-2xl p-8 w-full cursor-pointer hover:border-yellow-500/50 transition-all group">
                            <input
                                type="file"
                                accept="image/*"
                                {...register('photo', { required: !isEdit ? 'Photo is required' : false })}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="text-center pointer-events-none group-hover:transform group-hover:scale-105 transition-transform duration-300">
                                <svg className="mx-auto h-12 w-12 text-gray-500 group-hover:text-yellow-500 transition-colors mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-base text-white font-black uppercase tracking-wider">Touch to Upload</span>
                                <span className="text-xs text-gray-500 mt-2 block uppercase tracking-widest font-bold">Image size limit 10MB</span>
                            </div>
                        </motion.div>
                        {preview && (
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-shrink-0 relative h-40 w-40 sm:h-48 sm:w-48 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Selected</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    {errors.photo && <p className="text-red-500 text-sm mt-4 font-bold">{errors.photo.message}</p>}
                </div>
            </div>

            <div className="mt-14 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] order-2 sm:order-1">Step into the spotlight of Banjara Cricket</p>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-16 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-blue-950 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.2)] font-black tracking-widest text-lg transition-all disabled:opacity-50 disabled:cursor-wait order-1 sm:order-2 uppercase"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="w-5 h-5 border-2 border-blue-950/30 border-t-blue-950 rounded-full animate-spin"></span>
                            Uploading...
                        </span>
                    ) : isEdit ? 'Submit Changes' : 'Confirm Registration'}
                </motion.button>
            </div>
        </motion.form>
    );
}
