import Container from '@/components/ui/Container';
import Link from 'next/link';
import { getProductsAction } from '@/lib/actions/product-actions';
import Image from 'next/image';

export default async function AdminProductsPage() {
    const products = await getProductsAction();

    return (
        <Container className="py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <Link href="/admin" className="text-gray-500 hover:text-gray-900 mb-2 inline-block">
                        &larr; Назад в админку
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Управление товарами
                    </h1>
                </div>
                <Link href="/admin/products/new" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm">
                    + Добавить товар
                </Link>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Название</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Категория</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Цена</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Цена с учетом скидки</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-900">
                            {products.map((product) => (
                                <tr key={product._id?.toString()} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <Image
                                                    src={product.image}
                                                    alt="Product image"
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                    width={40}
                                                    height={40}
                                                />
                                            )}
                                            {product.title}
                                            {product.isBestseller && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">Хит</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{product.categories.join(', ') || []}</td>
                                    <td className="px-6 py-4 font-medium">{product.price} ₽</td>
                                    <td className="px-6 py-4 font-medium">{product.discPrice || product.price} ₽</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <Link href={`/admin/products/${product._id}`} className="text-blue-600 font-medium hover:underline">
                                                Редактировать
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <span className="text-gray-400">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </span>
                                            <p className="text-lg font-medium">Товаров пока нет</p>
                                            <p className="text-sm">Нажмите &#34;Добавить товар&#34;, чтобы создать первый.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    );
}
