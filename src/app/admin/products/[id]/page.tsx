import Container from '@/components/ui/Container';
import ProductForm from '@/components/admin/ProductForm';
import { getProductByIdAction } from '@/lib/actions/product-actions';
import { getCategoriesAction } from '@/lib/actions/category-actions';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        getProductByIdAction(id),
        getCategoriesAction()
    ]);

    if (!product) notFound();

    return (
        <Container className="py-12 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Редактирование товара</h1>
            <ProductForm initialData={product} categories={categories} />
        </Container>
    );
}
