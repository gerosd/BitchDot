'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { createProductAction, updateProductAction, deleteProductAction } from '@/lib/actions/product-actions';
import { uploadImageAction } from '@/lib/actions/upload-actions';
import { Category } from '@/lib/types';
import Link from 'next/link';
import MultiSelect from '../ui/MultiSelect';

export default function ProductForm({ initialData, categories }: { initialData?: Product, categories: Category[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const defaultSpecs = initialData?.specifications
        ? Object.entries(initialData.specifications).map(([k, v]) => ({ key: k, value: v }))
        : [];

    const [specs, setSpecs] = useState(defaultSpecs);

    const extractArticle = (name: string) => {
        const entry = initialData?.whereToBuy?.find(w => w.name.toLowerCase().includes(name.toLowerCase()));
        if (!entry) return '';
        const wbMatch = entry.url.match(/\/catalog\/(\d+)\//);
        const ozonMatch = entry.url.match(/\/product\/[^/]*-(\d+)\/?$/);
        return wbMatch?.[1] || ozonMatch?.[1] || '';
    };

    const [wbArticle, setWbArticle] = useState(extractArticle('wildberries') || extractArticle('wb'));
    const [ozonArticle, setOzonArticle] = useState(extractArticle('ozon'));

    const initialImages = initialData?.images || (initialData?.image ? [initialData.image] : []);
    const [currentImages, setCurrentImages] = useState<string[]>(initialImages);

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialData?.categories || ((initialData as any)?.category ? [(initialData as any).category as string] : [])
    );

    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
        initialData?.subcategories || ((initialData as any)?.subcategory ? [(initialData as any).subcategory as string] : [])
    );

    const availableSubcategories = categories
        .filter(c => selectedCategories.includes(c.name))
        .flatMap(c => c.subcategories);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const specifications: Record<string, string> = {};
        specs.forEach(s => {
            if (s.key && s.value) specifications[s.key] = s.value;
        });

        // Загрузка новых изображений
        const imageFiles = formData.getAll('imageFiles') as File[];
        const uploadedUrls: string[] = [];

        for (const file of imageFiles) {
            if (file.size > 0) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const uploadRes = await uploadImageAction(uploadData);
                if (uploadRes.success && uploadRes.url) {
                    uploadedUrls.push(uploadRes.url);
                } else {
                    alert(`Ошибка загрузки изображения ${file.name}: ` + uploadRes.error);
                }
            }
        }

        const finalImages = [...currentImages, ...uploadedUrls];
        const primaryImage = finalImages.length > 0 ? finalImages[0] : '';

        const data = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            discPrice: formData.get('discPrice') ? Number(formData.get('discPrice')) : undefined,
            categories: selectedCategories,
            subcategories: selectedSubcategories,
            image: primaryImage,
            images: finalImages,
            isBestseller: formData.get('isBestseller') === 'on',
            specifications,
            whereToBuy: [
                ...(wbArticle.trim() ? [{ name: 'Wildberries', url: `https://www.wildberries.ru/catalog/${wbArticle.trim()}/detail.aspx` }] : []),
                ...(ozonArticle.trim() ? [{ name: 'Ozon', url: `https://www.ozon.ru/product/${ozonArticle.trim()}/` }] : []),
            ]
        };

        if (initialData?._id) {
            await updateProductAction(initialData._id.toString(), data);
        } else {
            await createProductAction(data);
        }

        router.push('/admin/products');
        router.refresh();
    }

    async function handleDelete() {
        if (!initialData?._id || !confirm('Удалить этот товар навсегда?')) return;
        setLoading(true);
        await deleteProductAction(initialData._id.toString());
        router.push('/admin/products');
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Название</label>
                        <input name="title" required defaultValue={initialData?.title} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Увлажняющий крем" />
                    </div>

                    <div className="relative z-50">
                        <label className="block text-sm font-semibold mb-2">Категории</label>
                        <MultiSelect
                            options={categories.map(c => c.name)}
                            selected={selectedCategories}
                            onChange={setSelectedCategories}
                            placeholder="Выберите категории..."
                        />
                    </div>

                    <div className="relative z-40">
                        <label className="block text-sm font-semibold mb-2">Подкатегория</label>
                        <MultiSelect
                            options={availableSubcategories.map(as => as.name)}
                            selected={selectedSubcategories}
                            onChange={setSelectedSubcategories}
                            placeholder="Выберите подкатегории..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Цена (₽)</label>
                            <input name="price" type="number" required defaultValue={initialData?.price}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                   placeholder="1200"/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Цена со скидкой (₽)</label>
                            <input name="discPrice" type="number" defaultValue={initialData?.discPrice}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                   placeholder="1000"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Изображения товара (можно выбрать
                            несколько)</label>
                        <input name="imageFiles" type="file" multiple accept="image/*"
                               className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />

                        {currentImages.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Текущие изображения ({currentImages.length}):</p>
                                <div className="flex flex-wrap gap-3">
                                    {currentImages.map((imgUrl, index) => (
                                        <div key={index} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={imgUrl} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                            {index === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-[9px] text-white text-center py-0.5 font-bold uppercase z-10">Главное</div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentImages(currentImages.filter((_, i) => i !== index))}
                                                className="absolute top-1 right-1 bg-white/90 text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-50"
                                                title="Удалить"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <input name="isBestseller" type="checkbox" id="isBestseller" defaultChecked={initialData?.isBestseller} className="w-5 h-5 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                        <label htmlFor="isBestseller" className="text-sm font-semibold">Хит продаж</label>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Описание</label>
                        <textarea name="description" required defaultValue={initialData?.description} rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Подробное описание товара"></textarea>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-semibold">Характеристики</label>
                            <button type="button" onClick={() => setSpecs([...specs, { key: '', value: '' }])} className="text-xs font-semibold text-blue-600 hover:text-blue-700 font-medium">
                                + Добавить
                            </button>
                        </div>
                        <div className="space-y-3">
                            {specs.map((spec, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        value={spec.key}
                                        onChange={e => { const s = [...specs]; s[i].key = e.target.value; setSpecs(s); }}
                                        className="w-1/3 px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none" placeholder="Ключ (Объем)"
                                    />
                                    <input
                                        value={spec.value}
                                        onChange={e => { const s = [...specs]; s[i].value = e.target.value; setSpecs(s); }}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none" placeholder="Значение (50 мл)"
                                    />
                                    <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="text-red-500 px-2 font-bold hover:bg-red-50 rounded-lg">&times;</button>
                                </div>
                            ))}
                            {specs.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Нет характеристик</p>}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-semibold mb-4">Где купить</label>
                        <div className="space-y-3">
                            {/* Wildberries */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 w-36 shrink-0">
                                    <span className="inline-block w-3 h-3 rounded-full bg-[#CB11AB] shrink-0"></span>
                                    <span className="text-sm font-semibold text-gray-700">Wildberries</span>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={wbArticle}
                                        onChange={e => setWbArticle(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Артикул WB"
                                    />
                                </div>
                            </div>
                            {wbArticle.trim() && (
                                <p className="text-xs text-gray-400 pl-[152px] -mt-1 truncate">
                                    → https://www.wildberries.ru/catalog/{wbArticle.trim()}/detail.aspx
                                </p>
                            )}

                            {/* Ozon */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 w-36 shrink-0">
                                    <span className="inline-block w-3 h-3 rounded-full bg-[#005BFF] shrink-0"></span>
                                    <span className="text-sm font-semibold text-gray-700">Ozon</span>
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={ozonArticle}
                                        onChange={e => setOzonArticle(e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="ID товара"
                                    />
                                </div>
                            </div>
                            {ozonArticle.trim() && (
                                <p className="text-xs text-gray-400 pl-[152px] -mt-1 truncate">
                                    → https://www.ozon.ru/product/{ozonArticle.trim()}/
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <Link href="/admin/products" className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                    Отмена
                </Link>
                <div className="flex gap-3">
                    {initialData && (
                        <button type="button" onClick={handleDelete} disabled={loading} className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50">
                            Удалить товар
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </form>
    );
}
