'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@/lib/types';

export default function CatalogFilter({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(false);

    const appliedCategories = searchParams.getAll('category');
    const appliedSubcategories = searchParams.getAll('subcategory');

    const [selectedCategories, setSelectedCategories] = useState<string[]>(appliedCategories);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(appliedSubcategories);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.name));

    useEffect(() => {
        setSelectedCategories(searchParams.getAll('category'));
        setSelectedSubcategories(searchParams.getAll('subcategory'));
    }, [searchParams]);

    const handleCategoryChange = (categoryName: string, checked: boolean) => {
        if (checked) {
            setSelectedCategories(prev => [...prev, categoryName]);
        } else {
            setSelectedCategories(prev => prev.filter(c => c !== categoryName));
            const categoryObj = categories.find(c => c.name === categoryName);
            if (categoryObj) {
                const subNames = categoryObj.subcategories.map(s => s.name);
                setSelectedSubcategories(prev => prev.filter(s => !subNames.includes(s)));
            }
        }
    };

    const handleSubcategoryChange = (subcategoryName: string, checked: boolean) => {
        if (checked) {
            setSelectedSubcategories(prev => [...prev, subcategoryName]);
        } else {
            setSelectedSubcategories(prev => prev.filter(s => s !== subcategoryName));
        }
    };

    const toggleExpand = (categoryName: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete('category');
        params.delete('subcategory');

        selectedCategories.forEach(c => params.append('category', c));
        selectedSubcategories.forEach(s => params.append('subcategory', s));

        router.push(`/catalog?${params.toString()}`);
        setIsOpen(false);
    };

    const handleReset = () => {
        setSelectedCategories([]);
        setSelectedSubcategories([]);
        const params = new URLSearchParams(searchParams.toString());
        params.delete('category');
        params.delete('subcategory');
        router.push(`/catalog?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-surface text-base-content rounded-xl border border-border font-medium transition-colors hover:border-gray-300"
            >
                <Filter className="h-4 w-4" />
                Фильтры
                {(appliedCategories.length > 0 || appliedSubcategories.length > 0) && (
                    <span className="ml-1 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {appliedCategories.length + appliedSubcategories.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-70 flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-black">Категории</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    {categories.map(category => {
                                        const isExpanded = expandedCategories.includes(category.name);
                                        const isCategoryChecked = selectedCategories.includes(category.name);

                                        return (
                                            <div key={category._id?.toString() || category.name} className="border-b border-gray-100 pb-4 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => toggleExpand(category.name)}
                                                        className="p-1 text-gray-400 hover:text-black transition-colors"
                                                    >
                                                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </button>
                                                    <label className="flex items-center gap-3 cursor-pointer flex-1 py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={isCategoryChecked}
                                                            onChange={(e) => handleCategoryChange(category.name, e.target.checked)}
                                                            className="w-4 h-4 rounded text-black focus:ring-black border-gray-300"
                                                        />
                                                        <span className="font-semibold text-gray-900 select-none">{category.name}</span>
                                                    </label>
                                                </div>

                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden ml-9 mt-2 pl-2 border-l-2 border-gray-100 space-y-3"
                                                        >
                                                            {category.subcategories.map(sub => (
                                                                <label key={sub.id} className="flex items-center gap-3 cursor-pointer group">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedSubcategories.includes(sub.name)}
                                                                        onChange={(e) => handleSubcategoryChange(sub.name, e.target.checked)}
                                                                        className="w-4 h-4 rounded text-gray-600 focus:ring-black border-gray-300"
                                                                    />
                                                                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors select-none">{sub.name}</span>
                                                                </label>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        Сбросить
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        className="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        Применить
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
