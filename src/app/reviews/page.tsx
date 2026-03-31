import { getReviewsAction } from '@/lib/actions/review-actions';
import Container from '@/components/ui/Container';
import ReviewModal from '@/components/reviews/ReviewModal';
import Link from 'next/link';
import { getSettingsAction } from '@/lib/actions/settings-actions';
import { cookies } from 'next/headers';

export default async function ReviewsPage() {
    const settings = await getSettingsAction();
    const cookieStore = await cookies();
    const isAdmin = cookieStore.has('admin_session');
    const isSiteON = settings?.isSiteEnabled ?? false;
    const shouldLoadFromDB = isSiteON || isAdmin;

    if (!shouldLoadFromDB) {
        return (
            <Container className="py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Сайт находится на обслуживании</h1>
                <p className="text-gray-500 mt-4">В данный момент страница обзоров недоступна.</p>
                <Link href="/" className="px-6 py-3 mt-8 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors">
                    На главную
                </Link>
            </Container>
        );
    }
    const reviews = await getReviewsAction();

    return (
        <Container className="py-24     min-h-screen">
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
    );
}
