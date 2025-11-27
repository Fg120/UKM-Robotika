import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/layouts/public/Navbar';
import Footer from '@/layouts/public/Footer';
import { motion, AnimatePresence } from 'motion/react';
import GlassSurface from '@/components/GlassSurface';
import Pagination from '@/components/Pagination';
import { X, ZoomIn, Calendar } from 'lucide-react';

interface Galeri {
    id: number;
    judul: string;
    tanggal: string;
    image: string;
    image_url: string;
    created_at: string;
}

interface Props {
    galeris: {
        data: Galeri[];
        links: any[];
    };
}

export default function Galeri({ galeris }: Props) {
    const [selectedImage, setSelectedImage] = useState<Galeri | null>(null);

    return (
        <>
            <Head title="Galeri Kegiatan" />
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
                            Galeri Kegiatan
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"
                        >
                            Menjelajahi jejak inovasi dan momen berharga dalam perjalanan kami membangun masa depan robotika.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galeris.data.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedImage(item)}
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
                                                alt={item.judul}
                                                className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ZoomIn className="w-12 h-12 text-slate-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Hover Overlay for Zoom Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                                        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-full">
                                            <ZoomIn className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Text Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10">
                                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                            {item.judul}
                                        </h3>
                                        <p className="text-gray-300 text-xs flex items-center gap-2">
                                            <Calendar className="w-3 h-3 flex-shrink-0" />
                                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </GlassSurface>
                            </motion.div>
                        ))}
                    </div>

                    {galeris.data.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <GlassSurface className="inline-block px-8 py-4">
                                <p className="text-gray-400 text-lg">Belum ada galeri kegiatan yang ditambahkan.</p>
                            </GlassSurface>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    <div className="mt-12">
                        <Pagination links={galeris.links} />
                    </div>
                </div>
            </main>

            <Footer />

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <img
                                src={selectedImage.image_url}
                                alt={selectedImage.judul}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                            />

                            <div className="mt-4 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.judul}</h3>
                                <p className="text-gray-300">
                                    {new Date(selectedImage.tanggal).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

