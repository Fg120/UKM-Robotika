import { useState, useEffect } from 'react';

interface HeroCarouselProps {
    images?: string[];
    interval?: number;
}

export default function HeroCarousel({ images = [
    '/asset/hero/1.jpg',
    '/asset/hero/2.jpg',
    '/asset/hero/3.jpg',
], interval = 5000 }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setIsTransitioning(false);
            }, 500);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval]);

    return (
        <div className="relative w-full bg-black overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
            {/* Images Container */}
            <div className="relative w-full h-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentIndex
                            ? 'opacity-100 blur-0'
                            : index === (currentIndex - 1 + images.length) % images.length
                                ? 'opacity-0 blur-lg'
                                : 'opacity-0 blur-lg'
                            }`}
                    >
                        <img
                            src={image}
                            alt={`Hero ${index + 1}`}
                            loading={index === currentIndex ? 'eager' : 'lazy'}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsTransitioning(true);
                            setTimeout(() => {
                                setCurrentIndex(index);
                                setIsTransitioning(false);
                            }, 500);
                        }}
                        className={`transition-all duration-300 rounded-full ${index === currentIndex
                            ? 'bg-white w-12 h-3'
                            : 'bg-white/50 w-3 h-3 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Left Arrow */}
            <button
                onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
                        setIsTransitioning(false);
                    }, 500);
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow */}
            <button
                onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                        setIsTransitioning(false);
                    }, 500);
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Image Counter */}
            {/* <div className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white text-sm">
                {currentIndex + 1} / {images.length}
            </div> */}
        </div>
    );
}
