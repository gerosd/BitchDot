import Container from '@/components/ui/Container';
import ReviewForm from '@/components/admin/ReviewForm';
import { getReviewByIdAction } from '@/lib/actions/review-actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditReviewPage({ params }: { params: { id: string } }) {
    const review = await getReviewByIdAction(params.id);

    if (!review) {
        notFound();
    }

    return (
        <Container className="py-12">
            <Link href="/admin/reviews" className="text-gray-500 hover:text-gray-900 mb-6 inline-block">
                &larr; Назад к обзорам
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                Редактировать обзор
            </h1>
            <ReviewForm initialData={review} />
        </Container>
    );
}
