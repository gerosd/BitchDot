'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export default function MultiSelect({ options, selected, onChange, placeholder = 'Выберите...' }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = inputValue.trim()
        ? options.filter(o => o.toLowerCase().includes(inputValue.toLowerCase()))
        : options;

    const addOption = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed || selected.includes(trimmed)) return;
        onChange([...selected, trimmed]);
        setInputValue('');
    };

    const toggleOption = (option: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
            setInputValue('');
        }
    };

    const removeOption = (option: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter(item => item !== option));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredOptions.length === 1 && !selected.includes(filteredOptions[0])) {
                addOption(filteredOptions[0]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setInputValue('');
        } else if (e.key === 'Backspace' && inputValue === '' && selected.length > 0) {
            onChange(selected.slice(0, -1));
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div
                className="min-h-[42px] w-full px-3 py-1.5 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 bg-white flex items-center gap-2 cursor-text"
                onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
            >
                <div className="flex flex-wrap gap-1.5 flex-1 items-center">
                    {selected.map(item => (
                        <span key={item} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-100/80 shadow-sm shrink-0">
                            {item}
                            <button
                                type="button"
                                onClick={(e) => removeOption(item, e)}
                                className="text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-full p-0.5 focus:outline-none transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); setIsOpen(true); }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleInputKeyDown}
                        placeholder={selected.length === 0 ? placeholder : 'Добавить...'}
                        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-0.5 px-1 text-gray-700 placeholder:text-gray-400"
                    />
                </div>
                <div className="text-gray-400 shrink-0 pr-1 pointer-events-none">
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (filteredOptions.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] py-1.5 max-h-60 overflow-y-auto"
                    >
                        {filteredOptions.map(option => {
                            const isSelected = selected.includes(option);
                            return (
                                <div
                                    key={option}
                                    className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'}`}
                                    onMouseDown={(e) => toggleOption(option, e)}
                                >
                                    <span className={isSelected ? 'font-semibold text-blue-700' : 'font-medium text-gray-700'}>
                                        {option}
                                    </span>
                                    {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0" />}
                                </div>
                            );
                        })}

                        {filteredOptions.length === 0 && (
                            <div className="px-4 py-4 text-sm text-gray-500 text-center">
                                Ничего не найдено
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
