import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Silk from '@/Components/Silk';
import GradualBlur from '@/Components/GradualBlur';
import BlurText from '@/Components/BlurText';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            {/* Page-level Gradual Blur */}
            <GradualBlur
                target="page"
                position="bottom"
                height="6rem"
                strength={2}
                divCount={5}
                curve="bezier"
                exponential={true}
                opacity={1}
            />

            {/* Hero Section with Silk Background */}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
                {/* Silk Background */}
                <div className="absolute inset-0">
                    <Silk
                        speed={5}
                        scale={1}
                        color="#1A3D6D"
                        noiseIntensity={1.5}
                        rotation={0}
                    />
                </div>

                {/* Glass Navigation */}
                <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">R</span>
                                </div>
                                <span className="text-white font-bold text-xl">UKM Robotika</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#home" className="text-gray-300 hover:text-white transition-colors font-medium">Home</a>
                                <a href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">About</a>
                                <a href="#projects" className="text-gray-300 hover:text-white transition-colors font-medium">Projects</a>
                                <a href="#contact" className="text-gray-300 hover:text-white transition-colors font-medium">Contact</a>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="backdrop-blur-sm bg-white/10 border border-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-gray-300 hover:text-white transition-colors font-medium"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-medium"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="flex items-center justify-center min-h-screen px-6 pt-24">
                    <div className="text-center max-w-5xl relative z-10">
                        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl">
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6 leading-tight">
                                Selamat Datang di<br />
                                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    UKM Robotika
                                </span>
                            </h1>
                            <BlurText
                                text="Isn't this so cool?!"
                                delay={150}
                                animateBy="words"
                                direction="top"
                                className="text-2xl mb-8"
                            />
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                                Jelajahi dunia robotika bersama kami. Temukan inovasi, kreativitas, dan teknologi masa depan dalam setiap proyek yang kami kembangkan.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                                    Mulai Eksplorasi
                                </button>
                                <button className="backdrop-blur-sm bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Us Section - Separate from Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-64" id="about">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-6">Tentang Kami</h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Kami adalah komunitas yang berdedikasi untuk mengembangkan
                        inovasi dalam bidang robotika. Dengan semangat kolaborasi dan
                        kreativitas, kami menciptakan solusi yang menginspirasi dan
                        memberdayakan.
                    </p>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                        Bergabunglah dengan Kami
                    </button>
                </div>
            </div>
        </>
    );
}