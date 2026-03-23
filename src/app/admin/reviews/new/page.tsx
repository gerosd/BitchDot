import Container from '@/components/ui/Container';
import ReviewForm from '@/components/admin/ReviewForm';
import Link from 'next/link';

export default function NewReviewPage() {
    return (
        <Container className="py-12">
            <Link href="/admin/reviews" className="text-gray-500 hover:text-gray-900 mb-6 inline-block">
                &larr; Назад к обзорам
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                Новый обзор
            </h1>
            <ReviewForm />
        </Container>
    );
}
