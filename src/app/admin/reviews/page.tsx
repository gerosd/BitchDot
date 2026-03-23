import Container from '@/components/ui/Container';
import Link from 'next/link';
import { getReviewsAction } from '@/lib/actions/review-actions';

export default async function AdminReviewsPage() {
    const reviews = await getReviewsAction();

    return (
        <Container className="py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/admin" className="text-gray-500 hover:text-gray-900 mb-2 inline-block">
                        &larr; Назад в панель
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Обзоры
                    </h1>
                </div>
                <Link href="/admin/reviews/new" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors shadow-sm">
                    + Добавить обзор
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 font-semibold text-gray-600 text-sm">Видео</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm w-1/3">Название</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Статус</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        Обзоров пока нет
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review._id?.toString()} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            {review.videoUrl ? (
                                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative bg-black">
                                                    <video 
                                                        src={review.videoUrl} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                        <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center pl-0.5 shadow-sm">
                                                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-black border-b-[4px] border-b-transparent"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                                                    Нет видео
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{review.title}</div>
                                            {review.text && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{review.text}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link href={`/admin/reviews/${review._id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                                                Редактировать
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Container>
    );
}
