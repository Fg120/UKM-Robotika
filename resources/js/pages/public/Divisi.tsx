import { Divisi } from '@/types';
import PublicLayout from '@/layouts/public/PublicLayout';

interface Props {
    divisis: Divisi[];
}

export default function DivisiPublic({ divisis }: Props) {
    const getGradientColors = (index: number) => {
        const colors = [
            { gradient: 'from-blue-500 to-cyan-500', accent: 'bg-blue-500' },
            { gradient: 'from-purple-500 to-pink-500', accent: 'bg-purple-500' },
            { gradient: 'from-orange-500 to-red-500', accent: 'bg-orange-500' },
            { gradient: 'from-green-500 to-emerald-500', accent: 'bg-green-500' },
            { gradient: 'from-indigo-500 to-blue-500', accent: 'bg-indigo-500' },
            { gradient: 'from-fuchsia-500 to-rose-500', accent: 'bg-fuchsia-500' },
        ];
        return colors[index % colors.length];
    };

    return (
        <PublicLayout title="Divisi - UKM Robotika" navbarTransparent={false}>
            {/* Hero Section */}
            <section className="relative py-20 pt-40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Divisi Kompetisi
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                            Jelajahi berbagai divisi kompetisi robotika Indonesia (KRI) yang penuh inovasi
                        </p>
                    </div>
                </div>
            </section>

            {/* Divisi Section */}
            <section className="py-20 bg-gradient-to-b from-white via-blue-50 to-indigo-50">
                <div className="container mx-auto px-4">
                    {divisis.length > 0 ? (
                        <div className="space-y-8">
                            {divisis.map((divisi, index) => {
                                const colors = getGradientColors(index);
                                return (
                                    <div key={divisi.id} className="group relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
                                        <div className="relative flex flex-col md:flex-row gap-8 p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                                            {divisi.image ? (
                                                <div className={`w-full md:w-56 h-56 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                                                    <img
                                                        src={`/storage/${divisi.image}`}
                                                        alt={divisi.nama}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`w-full md:w-56 h-56 flex-shrink-0 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                                                    <div className="text-white opacity-50">
                                                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`w-1 h-12 ${colors.accent} rounded-full`}></div>
                                                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                                                        {divisi.nama}
                                                    </h3>
                                                </div>
                                                {divisi.deskripsi && (
                                                    <p className="text-gray-700 text-lg leading-relaxed">
                                                        {divisi.deskripsi}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 inline-block">
                                <p className="text-2xl font-bold text-gray-800 mb-4">
                                    Belum ada divisi yang tersedia
                                </p>
                                <a href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    Kembali ke Beranda
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
