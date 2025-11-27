import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/layouts/public/Navbar';
import Footer from '@/layouts/public/Footer';
import { motion, AnimatePresence } from 'motion/react';
import GlassSurface from '@/components/GlassSurface';
import Pagination from '@/components/Pagination';
import { X, Package, ExternalLink } from 'lucide-react';

interface Produk {
    id: number;
    nama: string;
    keterangan: string | null;
    image: string | null;
    image_url?: string;
    url: string | null;
    aktif: boolean;
    created_at: string;
}

interface Props {
    produks: {
        data: Produk[];
        links: any[];
    };
}

export default function Produk({ produks }: Props) {
    const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);

    return (
        <>
            <Head title="Produk Kami" />
            <Navbar />

            <main className="min-h-screen bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6"
                        >
                            Produk Kami
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
                        >
                            Eksplorasi karya dan inovasi robotika hasil dedikasi dan kreativitas tim kami.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {produks.data.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer will-change-transform"
                                onClick={() => setSelectedProduk(item)}
                            >
                                <GlassSurface
                                    borderRadius={24}
                                    opacity={0.15}
                                    borderWidth={1.5}
                                    brightness={30}
                                    width="100%"
                                    height="auto"
                                    className="overflow-hidden w-full relative group"
                                    style={{ aspectRatio: '4/3' }}
                                >
                                    {/* Background for the card to define 4:3 shape */}
                                    <div className="absolute inset-0 bg-slate-900/80" />

                                    {/* Image Container */}
                                    <div className="absolute inset-0 w-full h-full p-2">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.nama}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800/50 rounded-xl">
                                                <Package className="w-16 h-16 text-slate-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full">
                                            <Package className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Text Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10">
                                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {item.nama}
                                        </h3>
                                        {item.keterangan && (
                                            <p className="text-gray-300 text-sm line-clamp-2">
                                                {item.keterangan}
                                            </p>
                                        )}
                                    </div>
                                </GlassSurface>
                            </motion.div>
                        ))}
                    </div>

                    {produks.data.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <GlassSurface className="inline-block px-8 py-4">
                                <p className="text-gray-400 text-lg">Belum ada produk yang ditambahkan.</p>
                            </GlassSurface>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12">
                        <Pagination links={produks.links} />
                    </div>
                </div>
            </main>

            <Footer />

            {/* Detail Modal/Popup */}
            <AnimatePresence>
                {selectedProduk && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                        onClick={() => setSelectedProduk(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="relative w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                <button
                                    onClick={() => setSelectedProduk(null)}
                                    className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 z-10"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="space-y-8 relative z-10">
                                    {/* Image */}
                                    {selectedProduk.image_url && (
                                        <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                                            <img
                                                src={selectedProduk.image_url}
                                                alt={selectedProduk.nama}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Title */}
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
                                            {selectedProduk.nama}
                                        </h2>
                                    </div>

                                    {/* Description */}
                                    {selectedProduk.keterangan && (
                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                                                <Package className="w-6 h-6 text-blue-400" />
                                                Deskripsi Produk
                                            </h3>
                                            <p className="text-gray-200 leading-relaxed whitespace-pre-line text-lg">
                                                {selectedProduk.keterangan}
                                            </p>
                                        </div>
                                    )}

                                    {/* External Link Button */}
                                    {selectedProduk.url && (
                                        <div className="pt-6 border-t border-white/10 flex justify-center">
                                            <a
                                                href={selectedProduk.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
                                            >
                                                <ExternalLink className="w-6 h-6" />
                                                Lihat Detail Lebih Lanjut
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
