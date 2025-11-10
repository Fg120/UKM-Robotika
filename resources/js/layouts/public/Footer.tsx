import { Link } from '@inertiajs/react';
import Silk from '@/components/Silk';

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 overflow-hidden">
            {/* Silk Background di Footer */}
            <div className="absolute inset-0 opacity-50">
                <Silk
                    speed={10}
                    scale={0.8}
                    color="#1A3D6D"
                    noiseIntensity={1}
                    rotation={0}
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="h-10 mb-4 bg-white rounded-md px-2 w-fit">
                            <img src="/asset/logo-panjang.png" alt="Logo Robotika" className="h-full w-auto" />
                        </div>
                        <p className="text-gray-300 text-sm">
                            Unit Kegiatan Mahasiswa Robotika - Wadah bagi mahasiswa untuk belajar dan berinovasi di bidang robotika.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Navigasi</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><a href="/#about" className="hover:text-blue-400 transition-colors">Tentang</a></li>
                            <li><Link href="/artikel" className="hover:text-blue-400 transition-colors">Artikel</Link></li>
                            <li><a href="/#products" className="hover:text-blue-400 transition-colors">Produk</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Kontak</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Email: info@ukmrobotika.ac.id</li>
                            <li>Telp: (021) 12345678</li>
                            <li>Alamat: Kampus Universitas</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Media Sosial</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <span className="text-sm font-semibold">IG</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <span className="text-sm font-semibold">YT</span>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-blue-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                <span className="text-sm font-semibold">TW</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-300">
                    <p>&copy; {new Date().getFullYear()} UKM Robotika. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
