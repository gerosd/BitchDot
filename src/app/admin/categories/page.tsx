import Link from 'next/link';
import { getCategoriesAction } from '@/lib/actions/category-actions';
import { Pencil } from 'lucide-react';
import Container from '@/components/ui/Container';

export default async function AdminCategoriesPage() {
    const categories = await getCategoriesAction();

    return (
        <Container className="py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <Link href="/admin" className="text-gray-500 hover:text-gray-900 mb-2 inline-block">
                        &larr; Назад в админку
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Управление категориями
                    </h1>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                    + Добавить категорию
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                <th className="px-6 py-4 font-semibold text-gray-900">Название</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Подкатегории</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <tr key={category._id?.toString()} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">{category.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {category.subcategories.map(sub => (
                                                <span key={sub.id} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                                                    {sub.name}
                                                </span>
                                            ))}
                                            {category.subcategories.length === 0 && (
                                                <span className="text-gray-400 text-sm">Нет подкатегорий</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/categories/${category._id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Редактировать"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <span className="text-gray-400">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </span>
                                            <p className="text-lg font-medium">Категорий пока нет</p>
                                            <p className="text-sm">Нажмите "Добавить категорию", чтобы создать первую.</p>
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
