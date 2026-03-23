import Container from '@/components/ui/Container';
import Link from 'next/link';

export default async function AdminPage() {
    return (
        <Container className="py-12">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
                Панель управления
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold mb-2">Товары</h2>
                    <p className="text-gray-500 text-sm mb-6">Управление каталогом продукции, добавление новых товаров и изменение цен.</p>
                    <Link href="/admin/products" className="text-blue-600 font-medium hover:underline mt-auto">
                        Управление товарами &rarr;
                    </Link>
                </div>

                <div className="bg-white p-6 flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold mb-2">Обзоры</h2>
                    <p className="text-gray-500 text-sm mb-6">Управление видео-обзорами на главной и отдельной странице.</p>
                    <Link href="/admin/reviews" className="text-blue-600 font-medium hover:underline mt-auto">
                        Управление обзорами &rarr;
                    </Link>
                </div>

                <div className="bg-white p-6 flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold mb-2">Категории</h2>
                    <p className="text-gray-500 text-sm mb-6">Управление структурой каталога, добавление новых категорий и подкатегорий.</p>
                    <Link href="/admin/categories" className="text-blue-600 font-medium hover:underline mt-auto">
                        Настроить категории &rarr;
                    </Link>
                </div>

                <div className="bg-white p-6 flex flex-col rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-bold mb-2">Настройки сайта</h2>
                    <p className="text-gray-500 text-sm mb-6">Главный баннер, видео секция, общая информация.</p>
                    <Link href="/admin/settings" className="text-blue-600 font-medium hover:underline mt-auto">
                        Настройки главной &rarr;
                    </Link>
                </div>
            </div>
        </Container>
    );
}
