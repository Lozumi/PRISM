'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { CardPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { generateAreaColor } from '@/lib/bibtexParser';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Group items by category if categories exist
    const categories = config.categories || [];
    const hasCategories = categories.length > 0;

    // Extract unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        config.items.forEach(item => {
            item.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [config.items]);

    // Filter items
    const filteredItems = useMemo(() => {
        return config.items.filter(item => {
            const matchesSearch = 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesTag = selectedTag === 'all' || item.tags?.includes(selectedTag);

            return matchesSearch && matchesCategory && matchesTag;
        });
    }, [config.items, searchQuery, selectedCategory, selectedTag]);

    const getItemsByCategory = (category: string) => {
        return filteredItems.filter(item => item.category === category);
    };

    const uncategorizedItems = hasCategories 
        ? filteredItems.filter(item => !item.category || !categories.includes(item.category))
        : filteredItems;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200",
                            showFilters
                                ? "bg-accent text-white border-accent"
                                : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-accent"
                        )}
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        Filters
                    </button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-4 space-y-4">
                                {hasCategories && (
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Category
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedCategory('all')}
                                                className={cn(
                                                    "px-3 py-1 rounded-md text-sm transition-all duration-200",
                                                    selectedCategory === 'all'
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                All
                                            </button>
                                            {categories.map(category => (
                                                <button
                                                    key={category}
                                                    onClick={() => setSelectedCategory(category)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-md text-sm transition-all duration-200",
                                                        selectedCategory === category
                                                            ? "bg-accent text-white"
                                                            : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                    )}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {allTags.length > 0 && (
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            <TagIcon className="h-4 w-4 mr-2" />
                                            Tag
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedTag('all')}
                                                className={cn(
                                                    "px-3 py-1 rounded-md text-sm transition-all duration-200",
                                                    selectedTag === 'all'
                                                        ? "bg-accent text-white"
                                                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                )}
                                            >
                                                All
                                            </button>
                                            {allTags.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setSelectedTag(tag)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-md text-sm transition-all duration-200",
                                                        selectedTag === tag
                                                            ? "bg-accent text-white"
                                                            : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                                    )}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                    No items found matching your criteria.
                </div>
            )}

            {/* Results */}
            {filteredItems.length > 0 && (
                <>{hasCategories ? (
                <>
                    {categories.map((category, categoryIndex) => {
                        const categoryItems = getItemsByCategory(category);
                        if (categoryItems.length === 0) return null;
                        
                        return (
                            <div key={category} className={categoryIndex > 0 ? "mt-12" : ""}>
                                <h2 className="text-2xl font-serif font-bold text-primary mb-6 border-b border-neutral-200 dark:border-neutral-700 pb-2">
                                    {category}
                                </h2>
                                <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                                    {categoryItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.1 * index }}
                                            className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                                                {item.date && (
                                                    <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                        {item.date}
                                                    </span>
                                                )}
                                            </div>
                                            {item.subtitle && (
                                                <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                                            )}
                                            {item.content && (
                                                <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                                    {item.content}
                                                </p>
                                            )}
                                            {item.tags && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {item.tags.map(tag => {
                                                        const colors = generateAreaColor(tag);
                                                        return (
                                                            <span 
                                                                key={tag} 
                                                                className={`text-xs font-medium ${colors.text} ${colors.darkText} ${colors.light} ${colors.dark} px-2 py-1 rounded border ${colors.border} ${colors.darkBorder}`}
                                                            >
                                                                {tag}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                    {config.items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                                {item.date && (
                                    <span className="text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                        {item.date}
                                    </span>
                                )}
                            </div>
                            {item.subtitle && (
                                <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                            )}
                            {item.content && (
                                <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                    {item.content}
                                </p>
                            )}
                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.tags.map(tag => {
                                        const colors = generateAreaColor(tag);
                                        return (
                                            <span 
                                                key={tag} 
                                                className={`text-xs font-medium ${colors.text} ${colors.darkText} ${colors.light} ${colors.dark} px-2 py-1 rounded border ${colors.border} ${colors.darkBorder}`}
                                            >
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
                )}</>
            )}
        </motion.div>
    );
}
