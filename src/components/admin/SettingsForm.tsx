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
            }
        };

        await updateSettingsAction(data);
        router.refresh();
        alert('Настройки успешно сохранены!');
        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-gray-900">
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

            <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
                    {loading ? 'Сохранение...' : 'Сохранить настройки'}
                </button>
            </div>
        </form>
    );
}
