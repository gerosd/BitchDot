import { getReviewsAction } from '@/lib/actions/review-actions';
import Container from '@/components/ui/Container';
import ReviewModal from '@/components/reviews/ReviewModal';
import Link from 'next/link';

export default async function ReviewsPage() {
    const reviews = await getReviewsAction();

    return (
        <main className="py-24 bg-gray-50 min-h-screen">
            <Container>
                <div className="mb-12">
                    <Link href="/" className="text-gray-500 hover:text-gray-900 mb-6 inline-block">
                        &larr; На главную
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                        Обзоры и рекомендации
                    </h1>
                </div>

                {reviews.length > 0 ? (
                    <ReviewModal reviews={reviews} />
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                        <p className="text-xl text-gray-500 font-medium">Обзоров пока нет, но скоро они появятся!</p>
                    </div>
                )}
            </Container>
        </main>
    );
}
