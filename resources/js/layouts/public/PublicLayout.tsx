import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from './Navbar';
import Footer from './Footer';
import GradualBlur from '@/components/GradualBlur';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
    navbarTransparent?: boolean;
}

export default function PublicLayout({ children, title = 'UKM Robotika', navbarTransparent = true }: PublicLayoutProps) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white">
                <Navbar transparent={navbarTransparent} />

                <main className="min-h-screen">
                    {children}
                </main>

                <Footer />

                {/* Gradual Blur at bottom of viewport */}
                <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-40">
                    {/* <GradualBlur
                        position="bottom"
                        height="6rem"
                        strength={2}
                        divCount={5}
                        curve="bezier"
                        exponential={true}
                        opacity={1}
                    /> */}
                </div>
            </div>
        </>
    );
}
