'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import {useRouter} from "next/navigation";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group flex flex-col h-full rounded-2xl bg-base border border-border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/catalog/${product._id}`)}
        >
            <div className="block relative aspect-square bg-surface overflow-hidden shrink-0">
                {product.isBestseller && (
                    <div className="absolute top-4 left-4 z-10 bg-primary text-primary-content text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        Хит
                    </div>
                )}

                {product.images?.[0] || product.image ? (
                    <Image
                        src={product.images?.[0] || product.image!}
                        alt={product.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-content-muted">
                        Нет фото
                    </div>
                )}
            </div>

            <div className="flex flex-col grow p-6">
                <p className="text-xs text-surface-content uppercase tracking-wider mb-2 font-medium">
                    {product.categories?.join(', ') || (product as any).category}
                </p>
                <Link href={`/catalog/${product._id}`} className="block group-hover:text-primary-hover transition-colors">
                    <h3 className="font-semibold text-base-content text-lg leading-tight line-clamp-2">
                        {product.title}
                    </h3>
                </Link>

                <div className="mt-auto pt-6 flex flex-col justify-end">
                    {product.discPrice && product.discPrice > 0 ? (
                        <div className="flex flex-col">
                            <span className="text-sm line-through text-surface-content-muted">
                                {product.price.toLocaleString('ru-RU')} ₽
                            </span>
                            <span className="font-bold text-xl text-red-500">
                                {product.discPrice.toLocaleString('ru-RU')} ₽
                            </span>
                        </div>
                    ) : (
                        <span className="font-bold text-xl text-base-content">
                            {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
