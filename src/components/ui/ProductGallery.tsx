'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    title: string;
    isBestseller?: boolean;
}

export default function ProductGallery({ images, title, isBestseller }: ProductGalleryProps) {
    const validImages = images?.length > 0 ? images : [];
    const [activeIndex, setActiveIndex] = useState(0);

    if (validImages.length === 0) {
        return (
            <div className="relative aspect-square w-full bg-surface rounded-3xl overflow-hidden border border-border">
                <div className="w-full h-full flex items-center justify-center text-surface-content-muted">
                    Нет фото
                </div>
                {isBestseller && (
                    <div className="absolute top-6 left-6 z-10 bg-primary text-primary-content text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                        Хит
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-surface rounded-3xl overflow-hidden border border-border">
                <Image
                    src={validImages[activeIndex]}
                    alt={`${title} - вид ${activeIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                />
                {isBestseller && (
                    <div className="absolute top-6 left-6 z-10 bg-primary text-primary-content text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                        Хит
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide py-1">
                    {validImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeIndex === idx
                                    ? 'border-primary shadow-md'
                                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Миниатюра ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
