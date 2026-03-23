'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, User, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { Category } from '@/lib/types';

export default function Header({ categories }: { categories: Category[] }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(categories[0] || null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-base shadow-sm">
            <Container>
                <div className="flex h-18 items-center justify-between border-b border-border-light">
                    <div className="w-1/3 flex items-center">
                        <button
                            className="md:hidden p-2 -ml-2 text-surface-content"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="w-1/3 flex justify-center">
                        <Link href="/" className="text-3xl md:text-4xl font-serif tracking-[0.2em] text-base-content">
                            BitchDot
                        </Link>
                    </div>

                    <div className="w-1/3 flex items-center justify-end gap-2 md:gap-4 text-base-content/80">
                        <div className="relative flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.form
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 220, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        onSubmit={handleSearch}
                                        className="absolute right-full mr-2 overflow-hidden flex"
                                    >
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Поиск..."
                                            className="w-full bg-surface text-sm px-4 py-1.5 rounded-full border border-border focus:outline-none focus:border-primary shrink-0"
                                            autoFocus
                                        />
                                    </motion.form>
                                )}
                            </AnimatePresence>
                            <button
                                className="hover:text-primary transition-colors p-2 flex items-center justify-center"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="h-5 w-5 md:h-5.5 md:w-5.5" strokeWidth={1.5} />
                            </button>
                        </div>
                        <Link href="/admin" className="hover:text-primary transition-colors p-2 hidden sm:flex items-center justify-center">
                            <User className="h-5 w-5 md:h-5.5 md:w-5.5" strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>

                <nav className="hidden md:flex h-14 items-center justify-center gap-10 lg:gap-14 relative">
                    <Link href="/about" className="text-[13px] font-medium tracking-wide text-gray-800 hover:text-black hover:opacity-70 transition-opacity uppercase">О бренде</Link>

                    <div
                        className="h-full flex items-center relative group"
                        onMouseEnter={() => setIsCatalogOpen(true)}
                        onMouseLeave={() => setIsCatalogOpen(false)}
                    >
                        <Link
                            href="/catalog"
                            className="text-[13px] font-medium tracking-wide text-gray-800 group-hover:text-black group-hover:opacity-70 transition-opacity uppercase"
                        >
                            Каталог
                        </Link>

                        <AnimatePresence>
                            {isCatalogOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-5xl bg-white shadow-2xl border border-gray-100 rounded-b-lg overflow-hidden flex z-50"
                                >
                                    <div className="w-1/3 bg-gray-50/50 py-4 border-r border-gray-100">
                                        {categories.map(category => (
                                            <button
                                                key={category._id?.toString() || category.name}
                                                className={`w-full text-left px-6 py-3 text-sm flex items-center justify-between transition-colors ${activeCategory?._id === category._id
                                                    ? 'bg-white font-semibold text-black shadow-[rgba(0,0,0,0.02)_0px_0px_10px_0px] relative z-10'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                    }`}
                                                onMouseEnter={() => setActiveCategory(category)}
                                            >
                                                {category.name}
                                                <ChevronRight className={`h-4 w-4 text-gray-400 transition-opacity ${activeCategory?._id === category._id ? 'opacity-100' : 'opacity-0'}`} strokeWidth={2} />
                                            </button>
                                        ))}
                                    </div>
                                    {activeCategory && (
                                        <div className="w-2/3 p-8 bg-white min-h-75 relative">
                                            <h3 className="text-[11px] font-bold tracking-[0.15em] text-gray-400 mb-6 uppercase">
                                                {activeCategory.name}
                                            </h3>
                                            <ul className="grid grid-cols-2 gap-y-4 gap-x-6">
                                                {activeCategory.subcategories?.map(sub => (
                                                    <li key={sub.id}>
                                                        <Link
                                                            href={`/catalog?category=${activeCategory.name}&subcategory=${sub.name}`}
                                                            className="text-[14px] text-gray-800 hover:text-black hover:underline underline-offset-4 transition-all block"
                                                            onClick={() => setIsCatalogOpen(false)}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-8 pt-6 border-t border-gray-100 absolute bottom-8 w-[calc(100%-4rem)]">
                                                <Link
                                                    href={`/catalog?category=${activeCategory.name}`}
                                                    className="text-[13px] font-medium text-black hover:underline underline-offset-4 inline-flex items-center gap-1 transition-all"
                                                    onClick={() => setIsCatalogOpen(false)}
                                                >
                                                    Смотреть все из раздела {activeCategory.name.toLowerCase()} <ChevronRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/#recommendations" className="text-[13px] font-medium tracking-wide text-gray-800 hover:text-black hover:opacity-70 transition-opacity uppercase">Обзоры и рекомендации</Link>

                    <Link href="/where-to-buy" className="text-[13px] font-medium tracking-wide text-gray-800 hover:text-black hover:opacity-70 transition-opacity uppercase">Где купить</Link>
                </nav>
            </Container>

            {/* Мобильное меню */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-base md:hidden overflow-y-auto"
                    >
                        <div className="flex h-18 items-center justify-between px-4 border-b border-border">
                            <Link href="/" className="text-2xl font-serif tracking-[0.2em] text-base-content" onClick={() => setIsMobileMenuOpen(false)}>
                                BitchDot
                            </Link>
                            <button
                                className="p-2 -mr-2 text-surface-content hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <X className="h-6 w-6" strokeWidth={1.5} />
                            </button>
                        </div>
                        <nav className="p-6 flex flex-col gap-6">
                            <form onSubmit={handleSearch} className="pb-6 border-b border-border-light flex items-center justify-between group">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ПОИСК ПО КАТАЛОГУ"
                                    className="w-full font-medium bg-transparent focus:outline-none uppercase tracking-wider placeholder:text-surface-content-muted placeholder:font-medium text-base-content"
                                />
                                <button type="submit" className="p-2 -mr-2">
                                    <Search className="h-5 w-5 text-surface-content-muted group-hover:text-primary transition-colors" strokeWidth={1.5} />
                                </button>
                            </form>
                            <Link href="/catalog" className="text-lg font-medium text-base-content uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Каталог</Link>
                            <Link href="/catalog?sort=newest" className="text-lg font-medium text-base-content uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Новинки</Link>
                            <Link href="/about" className="text-lg font-medium text-base-content uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>О бренде</Link>
                            <Link href="/where-to-buy" className="text-lg font-medium text-base-content uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Где купить</Link>

                            <div className="mt-8 pt-8 border-t border-border flex flex-col gap-4">
                                <Link href="/admin" className="text-surface-content hover:text-primary transition-colors flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User className="h-5 w-5" strokeWidth={1.5} />
                                    Админ
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
