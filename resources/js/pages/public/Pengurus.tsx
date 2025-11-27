import { Bidang, Pengurus, Posisi } from '@/types';
import PublicLayout from '@/layouts/public/PublicLayout';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Globe, Link as LinkIcon, Mail } from 'lucide-react';

interface BidangWithPengurus extends Bidang {
    pengurus: (Pengurus & {
        posisi: Posisi;
        sosmeds?: Array<{
            id?: number;
            platform: string;
            icon: string;
            url: string;
        }>;
    })[];
}

interface Props {
    bidangs: BidangWithPengurus[];
}

export default function PengurusPublic({ bidangs }: Props) {
    const getSocialIcon = (iconName: string) => {
        const icons: { [key: string]: any } = {
            Facebook,
            Instagram,
            Twitter,
            Linkedin,
            Youtube,
            Globe,
            Link: LinkIcon,
            Mail,
        };
        return icons[iconName] || LinkIcon;
    };

    const getSocialLabel = (platform: string) => {
        const labels: { [key: string]: string } = {
            Instagram: 'Instagram',
            Facebook: 'Facebook',
            Twitter: 'Twitter',
            Linkedin: 'LinkedIn',
            Youtube: 'YouTube',
            Globe: 'Website',
            Mail: 'Email',
        };
        return labels[platform] || platform;
    };

    return (
        <PublicLayout title="Pengurus - UKM Robotika" navbarTransparent={false}>
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
                            Pengurus UKM Robotika
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                            Tim solid yang berdedikasi memajukan robotika di kampus
                        </p>
                    </div>
                </div>
            </section>

            {/* Pengurus Section */}
            <section className="py-20 bg-slate-950">
                <div className="container mx-auto px-4">
                    {bidangs.length > 0 ? (
                        <div className="space-y-20">
                            {bidangs.map((bidang) => {
                                if (!bidang.pengurus || bidang.pengurus.length === 0) {
                                    return null;
                                }

                                return (
                                    <div key={bidang.id} className="space-y-12">
                                        {/* Bidang Header */}
                                        <div className="text-center">
                                            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-wider">
                                                {bidang.nama}
                                            </h3>
                                            {bidang.deskripsi && (
                                                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                                    {bidang.deskripsi}
                                                </p>
                                            )}
                                        </div>

                                        {/* Pengurus Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {bidang.pengurus.map((pengurus) => (
                                                <div key={pengurus.id} className="group relative">
                                                    {/* Card Container */}
                                                    <div className="relative bg-gradient-to-b from-slate-800 via-slate-900 to-zinc-900 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/30">

                                                        {/* Position Badge */}
                                                        <div className="relative pt-8 pb-4 flex justify-center z-20">
                                                            <div className="bg-blue-600 px-8 py-2.5 rounded-full shadow-lg">
                                                                <span className="text-white font-bold text-sm uppercase tracking-wider">
                                                                    {pengurus.posisi?.nama || 'Anggota'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Main Image Section */}
                                                        <div className="relative bg-slate-200 mx-6 rounded-xl overflow-hidden shadow-xl">
                                                            <div className="aspect-[3/4] flex items-center justify-center">
                                                                {pengurus.image ? (
                                                                    <img
                                                                        src={`/storage/${pengurus.image}`}
                                                                        alt={pengurus.nama}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                                                        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Bottom Info Section */}
                                                        <div className="relative z-10 px-6 pt-6 pb-8">
                                                            <div className="text-center space-y-3">
                                                                {/* Name */}
                                                                <h4 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow-lg">
                                                                    {pengurus.nama}
                                                                </h4>

                                                                {/* Social Media */}
                                                                {pengurus.sosmeds && pengurus.sosmeds.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 justify-center items-center">
                                                                        {pengurus.sosmeds.map((sosmed, idx) => {
                                                                            const Icon = getSocialIcon(sosmed.icon);
                                                                            return (
                                                                                <a
                                                                                    key={idx}
                                                                                    href={sosmed.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center gap-2 px-3 py-2 bg-slate-700/80 hover:bg-slate-600 backdrop-blur-sm rounded-lg text-white transition-all duration-300 hover:scale-105 shadow-lg"
                                                                                    title={sosmed.platform}
                                                                                >
                                                                                    <Icon className="w-4 h-4" />
                                                                                    <span className="text-xs font-semibold">{sosmed.platform}</span>
                                                                                </a>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 inline-block">
                                <p className="text-2xl font-bold text-gray-800 mb-4">
                                    Belum ada data pengurus yang tersedia
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
