'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteSettings } from '@/lib/types';
import { updateSettingsAction } from '@/lib/actions/settings-actions';
import { uploadImageAction } from '@/lib/actions/upload-actions';
import Image from "next/image";

export default function SettingsForm({ initialData }: { initialData?: SiteSettings | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSiteEnabled, setIsSiteEnabled] = useState<boolean>(initialData?.isSiteEnabled ?? false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        let heroImageUrl = formData.get('existingHeroImage') as string;
        const heroImageFile = formData.get('heroImageFile') as File | null;
        if (heroImageFile && heroImageFile.size > 0) {
            const uploadData = new FormData();
            uploadData.append('file', heroImageFile);
            const uploadRes = await uploadImageAction(uploadData);
            if (uploadRes.success && uploadRes.url) {
                heroImageUrl = uploadRes.url;
            } else {
                alert('Ошибка загрузки фото баннера: ' + uploadRes.error);
                setLoading(false);
                return;
            }
        }

        const data: Omit<SiteSettings, '_id'> = {
            isSiteEnabled,
            heroBanner: {
                imageUrl: heroImageUrl,
                title: formData.get('heroTitle') as string,
                subtitle: formData.get('heroSubtitle') as string,
                buttonText: formData.get('heroButtonText') as string,
                buttonLink: formData.get('heroButtonLink') as string,
            },
            whereToBuy: {
                wildberriesUrl: formData.get('wbUrl') as string,
                ozonUrl: formData.get('ozonUrl') as string,
            },
            analyticsScripts: {
                head: formData.get('analyticsHead') as string,
                bodyStart: formData.get('analyticsBodyStart') as string,
                bodyEnd: formData.get('analyticsBodyEnd') as string,
            }
        };

        await updateSettingsAction(data);
        router.refresh();
        alert('Настройки успешно сохранены!');
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-gray-900">
            {/* Секция: Общие настройки сайта */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Общие настройки</h2>
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Включить сайт (доступ для всех)</label>
                            <p className="text-xs text-gray-500">
                                Если выключено, обычные пользователи видят заглушку. Администраторы видят сайт в обычном режиме.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={isSiteEnabled} 
                                onChange={(e) => setIsSiteEnabled(e.target.checked)} 
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
            {/* Секция: Главный баннер */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Главный баннер</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Фоновое изображение</label>
                        <input name="heroImageFile" type="file" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        <input type="hidden" name="existingHeroImage" value={initialData?.heroBanner?.imageUrl || ''} />
                        {initialData?.heroBanner?.imageUrl && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Текущее изображение:</p>
                                <Image
                                    src={initialData.heroBanner.imageUrl}
                                    alt="Preview"
                                    className="h-24 rounded-lg object-cover border border-gray-200"
                                    width={200}
                                    height={200}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Заголовок</label>
                        <input name="heroTitle" required defaultValue={initialData?.heroBanner?.title} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Инновации в уходе за кожей" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Подзаголовок</label>
                        <textarea name="heroSubtitle" required defaultValue={initialData?.heroBanner?.subtitle} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Откройте для себя новые формулы..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Текст кнопки</label>
                            <input name="heroButtonText" required defaultValue={initialData?.heroBanner?.buttonText} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="В каталог" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Ссылка кнопки</label>
                            <input name="heroButtonLink" required defaultValue={initialData?.heroBanner?.buttonLink} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="/catalog" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Секция: Маркетплейсы */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Где купить (Маркетплейсы)</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Ссылка на магазин Wildberries</label>
                        <input name="wbUrl" required defaultValue={initialData?.whereToBuy?.wildberriesUrl} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://wildberries.ru/brands/..." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Ссылка на магазин Ozon</label>
                        <input name="ozonUrl" required defaultValue={initialData?.whereToBuy?.ozonUrl} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://ozon.ru/brand/..." />
                    </div>
                </div>
            </div>
            {/* Секция: Аналитика */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Аналитика и скрипты</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Внутри &lt;head&gt;</label>
                        <textarea name="analyticsHead" defaultValue={initialData?.analyticsScripts?.head} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs" placeholder="<!-- Yandex.Metrika -->..." />
                        <p className="text-xs text-gray-400 mt-1">Обычно используется для Google Analytics, Yandex Metrica (основной код), Pixel и т.д.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Начало &lt;body&gt;</label>
                        <textarea name="analyticsBodyStart" defaultValue={initialData?.analyticsScripts?.bodyStart} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs" placeholder="<noscript>...</noscript>" />
                        <p className="text-xs text-gray-400 mt-1">Используется редко, например для &lt;noscript&gt; тегов.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Конец &lt;body&gt;</label>
                        <textarea name="analyticsBodyEnd" defaultValue={initialData?.analyticsScripts?.bodyEnd} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs" placeholder="<!-- Chat widget or custom script -->" />
                        <p className="text-xs text-gray-400 mt-1">Для виджетов чата и тяжелых скриптов, которые не должны блокировать рендеринг.</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
                    {loading ? 'Сохранение...' : 'Сохранить настройки'}
                </button>
            </div>
        </form>
    );
}
