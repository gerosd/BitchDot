'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/types';
import { createCategoryActions, updateCategoryAction, deleteCategoryAction } from '@/lib/actions/category-actions';
import Link from 'next/link';

export default function CategoryForm({ initialData }: { initialData?: Category }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Подкатегории
    const defaultSubcategories = initialData?.subcategories || [];
    const [subcategories, setSubcategories] = useState(defaultSubcategories);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Очищаем пустые подкатегории перед сохранением
        const cleanedSubcategories = subcategories.filter(s => s.name.trim() !== '');

        const data = {
            name: formData.get('name') as string,
            subcategories: cleanedSubcategories
        };

        let result;
        if (initialData?._id) {
            result = await updateCategoryAction(initialData._id.toString(), data);
        } else {
            result = await createCategoryActions(data);
        }

        if (result.success) {
            router.push('/admin/categories');
            router.refresh();
        } else {
            alert('Ошибка: ' + result.error);
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!initialData?._id || !confirm('Удалить эту категорию навсегда? Это может сломать товары, которые её используют.')) return;
        setLoading(true);
        const result = await deleteCategoryAction(initialData._id.toString());
        if (result.success) {
            router.push('/admin/categories');
            router.refresh();
        } else {
            alert('Ошибка удаления: ' + result.error);
            setLoading(false);
        }
    }

    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    const addSubcategory = () => {
        setSubcategories([...subcategories, { id: generateId(), name: '' }]);
    };

    const removeSubcategory = (index: number) => {
        setSubcategories(subcategories.filter((_, idx) => idx !== index));
    };

    const updateSubcategoryName = (index: number, name: string) => {
        const newSubs = [...subcategories];
        newSubs[index].name = name;
        if (!newSubs[index].id || newSubs[index].id.includes('temp-')) {
            newSubs[index].id = generateId();
        }
        setSubcategories(newSubs);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Название категории</label>
                        <input
                            name="name"
                            required
                            defaultValue={initialData?.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            placeholder="Например: Уход за волосами"
                        />
                        <p className="text-sm text-gray-500 mt-2">Это название будет отображаться в главном меню и фильтрах каталога.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <label className="block text-sm font-semibold">Подкатегории</label>
                                <p className="text-xs text-gray-500 mt-1">Добавьте дочерние разделы (например: Шампуни, Маски)</p>
                            </div>
                            <button
                                type="button"
                                onClick={addSubcategory}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 font-medium"
                            >
                                + Добавить
                            </button>
                        </div>

                        <div className="space-y-3">
                            {subcategories.map((sub, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        value={sub.name}
                                        onChange={e => updateSubcategoryName(i, e.target.value)}
                                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none font-medium text-gray-900"
                                        placeholder="Название подкатегории"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubcategory(i)}
                                        className="text-red-500 px-2 font-bold hover:bg-red-50 rounded-lg"
                                        title="Удалить"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {subcategories.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Нет подкатегорий</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <Link href="/admin/categories" className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors">
                    Отмена
                </Link>
                <div className="flex gap-3">
                    {initialData && (
                        <button type="button" onClick={handleDelete} disabled={loading} className="px-5 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50">
                            Удалить
                        </button>
                    )}
                    <button type="submit" disabled={loading} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-sm">
                        {loading ? 'Сохранение...' : 'Сохранить категорию'}
                    </button>
                </div>
            </div>
        </form >
    );
}
