import { Review } from '@/lib/types';

export default function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="group relative aspect-4/5 sm:aspect-square rounded-3xl overflow-hidden text-center z-10 w-full h-full bg-black shadow-lg">
            {review.videoUrl ? (
                <video
                    src={review.videoUrl}
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 w-full h-full absolute inset-0"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">Нет видео</span>
                </div>
            )}
            
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none group-hover:from-black/95 transition-colors z-20" />
            <div className="absolute bottom-8 left-8 right-8 z-30 pointer-events-none text-left flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-xl sm:text-2xl font-bold tracking-wide drop-shadow-md mb-2 line-clamp-2">
                    {review.title}
                </h3>
                {review.text && (
                    <p className="text-white/70 text-sm drop-shadow-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {review.text}
                    </p>
                )}
            </div>
        </div>
    );
}
