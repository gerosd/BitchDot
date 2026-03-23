import CategoryForm from '@/components/admin/CategoryForm';
import { getCategoryByIdAction } from '@/lib/actions/category-actions';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const category = await getCategoryByIdAction((await params).id);

    if (!category) {
        notFound();
    }

    return (
        <Container className="py-12 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Редактирование категории</h1>
            <CategoryForm initialData={category} />
        </Container>
    );
}
