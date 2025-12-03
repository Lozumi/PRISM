'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    return (
        <>
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200"
                    >
                        <div className="flex gap-4">
                            {pub.preview && (
                                <div 
                                    className="flex-shrink-0 bg-neutral-100 dark:bg-neutral-700 rounded overflow-hidden border border-neutral-200 dark:border-neutral-600 cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{
                                        width: '128px',
                                        aspectRatio: pub.aspectRatio || '3/4'
                                    }}
                                    onClick={() => setLightboxImage(pub.preview!)}
                                >
                                    <img 
                                        src={pub.preview} 
                                        alt={pub.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-primary mb-2 leading-tight">
                                    {pub.title}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2">
                                    {pub.journal || pub.conference}
                                </p>
                                {pub.description && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                        {pub.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}            </div>
        </motion.section>

        {/* Image Lightbox */}
        <AnimatePresence>
            {lightboxImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <motion.img
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        src={lightboxImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
