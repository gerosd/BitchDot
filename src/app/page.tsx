import Link from 'next/link';
import { getSettingsAction } from '@/lib/actions/settings-actions';
import { getProductsAction } from '@/lib/actions/product-actions';
import { getReviewsAction } from '@/lib/actions/review-actions';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/ui/ProductCard';
import ReviewCard from '@/components/ui/ReviewCard';
import Image from "next/image";

export default async function Home() {
    const settings = await getSettingsAction();
    const bestsellers = await getProductsAction({ isBestseller: true, limit: 4 });
    const reviews = await getReviewsAction({ limit: 3 });

    const heroBanner = settings?.heroBanner || {
        title: 'Инновации в уходе за кожей',
        subtitle: 'Откройте для себя новые формулы с пептидами и витамином С для сияющей и здоровой кожи.',
        imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2600&auto=format&fit=crop',
        buttonText: 'В каталог',
        buttonLink: '/catalog'
    };

    return (
        <>
            {/* hero секция */}
            <section className="relative h-[80vh] min-h-150 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={heroBanner.imageUrl}
                        alt="Hero Banner"
                        className="object-cover w-full h-full"
                        width={1920}
                        height={1080}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <Container className="relative z-10 text-center">
                    <div className="max-w-3xl mx-auto backdrop-blur-sm bg-white/10 p-8 rounded-2xl border border-white/20">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            {heroBanner.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
                            {heroBanner.subtitle}
                        </p>
                        <Link href={heroBanner.buttonLink}>
                            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 rounded-full font-bold shadow-lg">
                                {heroBanner.buttonText}
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>

            {/* хиты продаж */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Хиты продаж</h2>
                            <p className="text-gray-500 max-w-2xl text-lg">
                                Средства, которые выбирают наши покупатели каждый день. Проверенные формулы, видимый результат.
                            </p>
                        </div>
                        <Link href="/catalog?isBestseller=true" className="hidden sm:inline-block">
                            <Button variant="outline" className="rounded-full">Весь каталог &rarr;</Button>
                        </Link>
                    </div>

                    {bestsellers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {bestsellers.map(product => (
                                <ProductCard key={product._id?.toString()} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-3/4 bg-gray-100 animate-pulse rounded-2xl border border-gray-100 flex items-center justify-center flex-col gap-4">
                                    <div className="w-1/2 h-4 bg-gray-200 rounded-full"></div>
                                    <div className="w-1/3 h-4 bg-gray-200 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center sm:hidden">
                        <Link href="/catalog?isBestseller=true">
                            <Button variant="outline" className="rounded-full w-full">Весь каталог &rarr;</Button>
                        </Link>
                    </div>
                </Container>
            </section>

            {/* Обзоры */}
            <section className="py-24 bg-white" id="recommendations">
                <Container>
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-6 text-center sm:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Обзоры и рекомендации</h2>
                        {reviews.length >= 3 && (
                            <Link href="/reviews">
                                <Button variant="outline" className="rounded-full shrink-0">
                                    Показать еще &rarr;
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewCard key={review._id?.toString()} review={review} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-3xl border border-gray-100">
                                Обзоры пока не добавлены
                            </div>
                        )}
                    </div>

                    {reviews.length > 0 && reviews.length < 3 && (
                        <div className="mt-12 text-center">
                            <Link href="/reviews">
                                <Button variant="outline" className="rounded-full w-full sm:w-auto px-8">
                                    Все обзоры &rarr;
                                </Button>
                            </Link>
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
