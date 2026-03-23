import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductByIdAction } from '@/lib/actions/product-actions';
import Container from '@/components/ui/Container';
import ProductGallery from '@/components/ui/ProductGallery';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const product = await getProductByIdAction((await params).id);

    if (!product) {
        notFound();
    }

    return (
        <Container className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                {/* Product Image Gallery */}
                <ProductGallery
                    images={product.images || (product.image ? [product.image] : [])}
                    title={product.title}
                    isBestseller={product.isBestseller}
                />

                {/* Product Info */}
                <div className="flex flex-col">
                    <p className="text-sm text-surface-content-muted uppercase tracking-wider mb-2 font-medium">
                        {product.categories?.join(', ') || (product as any).category}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-base-content mb-6">
                        {product.title}
                    </h1>

                    <div className="mb-8">
                        {product.discPrice ? (
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl md:text-4xl font-bold text-red-500">
                                    {product.discPrice.toLocaleString('ru-RU')} ₽
                                </span>
                                <span className="text-xl line-through text-surface-content-muted">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold text-base-content">
                                {product.price.toLocaleString('ru-RU')} ₽
                            </div>
                        )}
                    </div>

                    <div className="prose mb-10 text-surface-content leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    {/* Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="mb-10 p-6 bg-surface rounded-2xl border border-border">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content mb-4">Характеристики</h3>
                            <dl className="space-y-4 text-sm">
                                {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex border-b border-border-light pb-2 last:border-0 last:pb-0">
                                        <dt className="text-surface-content-muted w-1/3">{key}</dt>
                                        <dd className="text-base-content font-medium w-2/3">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Where to buy links */}
                    {product.whereToBuy && product.whereToBuy.length > 0 && (
                        <div className="mt-auto">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-base-content mb-4">Где купить</h3>
                            <div className="flex flex-wrap gap-4">
                                {product.whereToBuy.map((store, i) => (
                                    <a
                                        key={i}
                                        href={store.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border bg-base hover:border-primary hover:bg-surface text-sm font-semibold transition-all shadow-sm text-base-content"
                                    >
                                        {store.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}
