import Link from 'next/link';
import { getProductsAction } from '@/lib/actions/product-actions';
import { getCategoriesAction } from '@/lib/actions/category-actions';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/ui/ProductCard';
import CatalogFilter from '@/components/catalog/CatalogFilter';

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    const query = typeof params.q === 'string' ? params.q : undefined;

    let categories: string[] = [];
    if (params.category) {
        categories = Array.isArray(params.category) ? params.category : [params.category];
    }

    let subcategories: string[] = [];
    if (params.subcategory) {
        subcategories = Array.isArray(params.subcategory) ? params.subcategory : [params.subcategory];
    }

    const sortParam = typeof params.sort === 'string' ? params.sort : 'newest';
    let sortQuery: Record<string, 1 | -1> | undefined;

    if (sortParam === 'price_asc') sortQuery = { price: 1 };
    else if (sortParam === 'price_desc') sortQuery = { price: -1 };
    else sortQuery = { createdAt: -1 };

    const [products, categoriesData] = await Promise.all([
        getProductsAction({
            category: categories.length > 0 ? categories : undefined,
            subcategory: subcategories.length > 0 ? subcategories : undefined,
            q: query,
            sort: sortQuery
        }),
        getCategoriesAction()
    ]);

    // Формируем URL параметры для ссылок сортировки (с сохранением других фильтров)
    const searchObj = new URLSearchParams();
    if (query) searchObj.append('q', query);
    categories.forEach(c => searchObj.append('category', c));
    subcategories.forEach(s => searchObj.append('subcategory', s));
    const qsWithoutSort = searchObj.toString() ? `&${searchObj.toString()}` : '';

    return (
        <Container className="py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-base-content mb-4">
                    {query
                        ? `Результаты поиска: "${query}"`
                        : categories.length === 1 && subcategories.length === 0
                            ? `Каталог: ${categories[0]}`
                            : (categories.length === 0 && subcategories.length === 1)
                                ? `Каталог: ${subcategories[0]}`
                                : (categories.length > 0 || subcategories.length > 0)
                                    ? 'Каталог: Отфильтрованные товары'
                                    : 'Весь каталог'}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-y border-border justify-between">
                    <div className="flex items-center gap-3">
                        <CatalogFilter categories={categoriesData} />

                        {(categories.length > 0 || subcategories.length > 0) && (
                            <Link href="/catalog" className="text-sm font-medium text-surface-content-muted hover:text-black">
                                Очистить
                            </Link>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-surface-content-muted">Сортировка:</span>
                        <Link href={`/catalog?sort=newest${qsWithoutSort}`} className={`text-sm ${sortParam === 'newest' ? 'font-bold text-primary' : 'text-surface-content-muted hover:text-base-content'}`}>Сначала новые</Link>
                        <Link href={`/catalog?sort=price_asc${qsWithoutSort}`} className={`text-sm ${sortParam === 'price_asc' ? 'font-bold text-primary' : 'text-surface-content-muted hover:text-base-content'}`}>Сначала дешевле</Link>
                        <Link href={`/catalog?sort=price_desc${qsWithoutSort}`} className={`text-sm ${sortParam === 'price_desc' ? 'font-bold text-primary' : 'text-surface-content-muted hover:text-base-content'}`}>Сначала дороже</Link>
                    </div>
                </div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard key={product._id?.toString()} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-base-content mb-2">Товары не найдены</h2>
                    <p className="text-surface-content-muted mb-6">Попробуйте изменить параметры {query ? 'поиска или ' : ''}фильтрации.</p>
                    {query && (
                        <Link href="/catalog" className="inline-flex items-center justify-center px-6 py-3 bg-base-content text-base font-medium rounded hover:bg-base-content/90 transition-colors">
                            Сбросить поиск
                        </Link>
                    )}
                </div>
            )}
        </Container>
    );
}
