'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AboutBrandData } from '@/lib/types';
import { updateAboutAction } from '@/lib/actions/about-actions';
import { uploadImageAction } from '@/lib/actions/upload-actions';
import Image from "next/image";

export default function AboutForm({ initialData }: { initialData?: AboutBrandData | null }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
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
                alert('Ошибка загрузки фото: ' + uploadRes.error);
                setLoading(false);
                return;
            }
        }

        const philosophyTextRaw = formData.get('philosophyText') as string;
        const philosophyText = philosophyTextRaw.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);

        const values = [0, 1, 2].map((i) => ({
            title: formData.get(`valueTitle_${i}`) as string,
            description: formData.get(`valueDesc_${i}`) as string
        }));

        const data: Omit<AboutBrandData, '_id'> = {
            heroImage: heroImageUrl,
            title: formData.get('title') as string,
            subtitle: formData.get('subtitle') as string,
            philosophyText,
            valuesTitle: formData.get('valuesTitle') as string,
            values,
        };

        const res = await updateAboutAction(data);
        if (res.success) {
            router.refresh();
            alert('Данные страницы "О бренде" успешно сохранены!');
        } else {
            alert(res.error || 'Произошла ошибка');
        }
        setLoading(false);
    }

    const initialValues = initialData?.values?.length === 3
        ? initialData.values 
        : [
            { title: '', description: '' },
            { title: '', description: ''},
            { title: '', description: ''},
          ];

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-gray-900">
            {/* Секция: Главный баннер */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Изображение и Заголовки</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Фоновое изображение</label>
                        <input name="heroImageFile" type="file" accept="image/*" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        <input type="hidden" name="existingHeroImage" value={initialData?.heroImage || ''} />
                        {initialData?.heroImage && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Текущее изображение:</p>
                                <img
                                    src={initialData.heroImage}
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
                        <input name="title" required defaultValue={initialData?.title} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="О бренде BitchDot" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Подзаголовок</label>
                        <input name="subtitle" required defaultValue={initialData?.subtitle} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Научный подход к красоте с 2022 года" />
                    </div>
                </div>
            </div>

            {/* Секция: Философия */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Философия бренда</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Текст (разделение абзацев через двойной Enter)</label>
                        <textarea name="philosophyText" required defaultValue={initialData?.philosophyText?.join('\n\n')} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Абзац 1...&#10;&#10;Абзац 2..." />
                    </div>
                </div>
            </div>

            {/* Секция: Карточки */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">Карточки</h2>
                <div className="space-y-5 mb-8">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Заголовок блока карточек</label>
                        <input name="valuesTitle" required defaultValue={initialData?.valuesTitle} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Наши ценности" />
                    </div>
                </div>
                <div className="space-y-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-4">
                            <h3 className="font-semibold text-gray-700">Карточка {i + 1}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Заголовок</label>
                                    <input name={`valueTitle_${i}`} required defaultValue={initialValues[i]?.title} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Научный подход" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Описание</label>
                                <textarea name={`valueDesc_${i}`} required defaultValue={initialValues[i]?.description} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="..." />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>
        </form>
    );
}
