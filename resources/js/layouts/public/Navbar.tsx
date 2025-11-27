import { Link, usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { dashboard, login, logout } from '@/routes';
import GlassSurface from '@/components/GlassSurface';
import { rgba } from 'motion/react';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    transparent?: boolean;
}

export default function Navbar({ }: NavbarProps) {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 z-50 w-[98%] ml-[1%] mt-[1%] ">
            <GlassSurface
                height="60px"
                width="100%"
                displace={15}
                distortionScale={-150}
                redOffset={5}
                greenOffset={15}
                blueOffset={25}
                brightness={20}
                opacity={0.5}
                backgroundOpacity={0.3}
                mixBlendMode="screen"
            >
                <div className="container mx-auto px-4 h-12">
                    <div className="flex items-center justify-between h-full">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="h-10 flex items-center bg-white rounded-md px-2">
                                <img
                                    src="/asset/logo-panjang.png"
                                    alt="Logo Robotika"
                                    className={`h-full w-auto object-contain`}
                                />
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/divisi"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Divisi
                            </Link>
                            <Link
                                href="/pengurus"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Pengurus
                            </Link>
                            <Link
                                href="/artikel"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Artikel
                            </Link>
                            <Link
                                href="/produk"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Produk
                            </Link>
                            <Link
                                href="/galeri"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Galeri
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-4">
                                {auth.user ? (
                                    <>
                                        <Link href={dashboard()}>
                                            <Button variant={"outline"} className={'border-white/20 text-white hover:bg-white/10'}>
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={() => router.post(logout().url)}
                                            className="text-white hover:bg-white/30 transition-colors font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href={login()}>
                                            <Button variant={"ghost"} className={'text-white hover:bg-white/30'}>
                                                Login
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </GlassSurface>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                    <div className="md:hidden fixed top-[72px] left-[1%] right-[1%] bg-slate-900/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-40 animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col p-4 space-y-2">
                            <Link
                                href="/#home"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-blue-400 hover:bg-white/5 transition-colors font-medium px-4 py-3 rounded-lg"
                            >
                                Home
                            </Link>
                            <Link
                                href="/divisi"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-blue-400 hover:bg-white/5 transition-colors font-medium px-4 py-3 rounded-lg"
                            >
                                Divisi
                            </Link>
                            <Link
                                href="/pengurus"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-blue-400 hover:bg-white/5 transition-colors font-medium px-4 py-3 rounded-lg"
                            >
                                Pengurus
                            </Link>
                            <Link
                                href="/artikel"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-blue-400 hover:bg-white/5 transition-colors font-medium px-4 py-3 rounded-lg"
                            >
                                Artikel
                            </Link>
                            <Link
                                href="/produk"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-blue-400 hover:bg-white/5 transition-colors font-medium px-4 py-3 rounded-lg"
                            >
                                Produk
                            </Link>
                            <Link
                                href="/galeri"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-white hover:text-blue-400 hover:bg-white/5 transition-colors font-medium px-4 py-3 rounded-lg"
                            >
                                Galeri
                            </Link>

                            {/* Mobile Auth Buttons */}
                            <div className="pt-4 border-t border-white/10 space-y-2">
                                {auth.user ? (
                                    <>
                                        <Link href={dashboard()} onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant={"outline"} className="w-full border-white/20 text-white hover:bg-white/10">
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                router.post(logout().url);
                                            }}
                                            className="w-full text-white px-4 py-2 rounded-lg flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 transition-colors justify-center"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href={login()} onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant={"ghost"} className="w-full text-white hover:bg-white/10">
                                            Login
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
