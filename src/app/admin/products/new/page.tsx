import Container from '@/components/ui/Container';
import ProductForm from '@/components/admin/ProductForm';
import { getCategoriesAction } from '@/lib/actions/category-actions';

export default async function NewProductPage() {
    const categories = await getCategoriesAction();

    return (
        <Container className="py-12 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Новый товар</h1>
            <ProductForm categories={categories} />
        </Container>
    );
}
