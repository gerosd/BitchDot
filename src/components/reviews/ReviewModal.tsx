'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ui/ReviewCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewModal({ reviews }: { reviews: Review[] }) {
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {reviews.map(review => (
                    <div 
                        key={review._id?.toString()} 
                        onClick={() => setSelectedReview(review)}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                        <ReviewCard review={review} />
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedReview && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8">
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedReview(null)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-[80%] aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <button 
                                onClick={() => setSelectedReview(null)}
                                className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors backdrop-blur-md border border-white/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <video
                                src={selectedReview.videoUrl}
                                className="w-full h-full object-contain"
                                autoPlay
                                controls
                                playsInline
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent pointer-events-none">
                                <h2 className="text-white text-2xl font-bold mb-2">{selectedReview.title}</h2>
                                {selectedReview.text && (
                                    <p className="text-white/70 text-sm max-w-2xl">{selectedReview.text}</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
