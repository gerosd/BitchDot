import CategoryForm from '@/components/admin/CategoryForm';
import Container from '@/components/ui/Container';

export default function NewCategoryPage() {
    return (
        <Container className="py-12 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Новая категория</h1>
            <CategoryForm />
        </Container>
    );
}
