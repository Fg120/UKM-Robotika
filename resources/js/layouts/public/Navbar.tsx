import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';
import GlassSurface from '@/components/GlassSurface';
import { rgba } from 'motion/react';

interface NavbarProps {
    transparent?: boolean;
}

export default function Navbar({ }: NavbarProps) {
    const { auth } = usePage<SharedData>().props;

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
                                href="/#home"
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
                                href="/artikel"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Artikel
                            </Link>
                            <Link
                                href="/#products"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Produk
                            </Link>
                            <Link
                                href="/#gallery"
                                className={`text-white hover:text-blue-500 transition-colors font-medium`}
                            >
                                Galeri
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button variant={"outline"} className={'border-white/20 text-white hover:bg-white/10'}>
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button variant={"ghost"} className={'text-white hover:bg-white/30'}>
                                            Login
                                        </Button>
                                    </Link>
                                    {/* <Link href={register()}>
                                        <Button className={'bg-gradient-to-r from-blue-500 to-purple-600'}>
                                            Daftar
                                        </Button>
                                    </Link> */}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </GlassSurface>
        </nav>
    );
}
