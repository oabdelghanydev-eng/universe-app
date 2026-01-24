// ListingsFeed - Searchable listings grid
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { algoliaClient, searchIndexName } from '@/lib/algolia/client';
import ListingCard, { ListingCardSkeleton } from './ListingCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, Package, Wrench, LayoutGrid, X, SearchX, Inbox } from 'lucide-react';

// ============================================
// Types
// ============================================

interface AlgoliaHit {
    objectID: string;
    title: string;
    description: string;
    type: 'product' | 'service';
    price: number | null;
    imagePaths: string[];
    userName: string;
    userId: string;
    isDeleted: boolean;
    isFlagged: boolean;
    createdAt: number;
    updatedAt: number;
}

interface ListingsFeedProps {
    initialQuery?: string;
    initialType?: 'product' | 'service' | 'all';
}

type TypeFilter = 'product' | 'service' | 'all';

// ============================================
// Constants
// ============================================

const HITS_PER_PAGE = 12;
const DEBOUNCE_MS = 300;

const FILTER_CONFIG: Record<TypeFilter, { label: string; Icon: React.ComponentType<{ className?: string }>; color: string }> = {
    all: { label: 'الكل', Icon: LayoutGrid, color: 'text-slate-400' },
    product: { label: 'منتجات', Icon: Package, color: 'text-cyan-400' },
    service: { label: 'خدمات', Icon: Wrench, color: 'text-rose-400' },
};

// ============================================
// Custom Hook: useDebounce
// ============================================

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// ============================================
// Component
// ============================================

export default function ListingsFeed({
    initialQuery = '',
    initialType = 'all',
}: ListingsFeedProps) {
    // Search state
    const [query, setQuery] = useState(initialQuery);
    const [typeFilter, setTypeFilter] = useState<TypeFilter>(initialType);
    const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

    // Results state
    const [hits, setHits] = useState<AlgoliaHit[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalHits, setTotalHits] = useState(0);

    // Loading state
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isSearchingRef = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // ============================================
    // Build Algolia filters
    // ============================================

    const buildFilters = useCallback((type: TypeFilter): string => {
        const filters: string[] = ['isDeleted:false', 'isFlagged:false'];
        if (type !== 'all') {
            filters.push(`type:${type}`);
        }
        return filters.join(' AND ');
    }, []);

    // ============================================
    // Search function
    // ============================================

    const searchListings = useCallback(
        async (searchQuery: string, filter: TypeFilter, pageNum: number) => {
            if (isSearchingRef.current && pageNum === 0) return;
            isSearchingRef.current = true;

            const isNewSearch = pageNum === 0;

            try {
                if (isNewSearch) {
                    setIsLoading(true);
                    setError(null);
                } else {
                    setIsLoadingMore(true);
                }

                const result = await algoliaClient.searchSingleIndex<AlgoliaHit>({
                    indexName: searchIndexName,
                    searchParams: {
                        query: searchQuery,
                        filters: buildFilters(filter),
                        hitsPerPage: HITS_PER_PAGE,
                        page: pageNum,
                        attributesToRetrieve: [
                            'objectID',
                            'title',
                            'description',
                            'type',
                            'price',
                            'imagePaths',
                            'userName',
                            'createdAt',
                        ],
                    },
                });

                const newHits = result.hits;
                const nbPages = result.nbPages ?? 1;
                const nbHits = result.nbHits ?? 0;

                if (isNewSearch) {
                    setHits(newHits);
                } else {
                    setHits(prev => [...prev, ...newHits]);
                }

                setTotalHits(nbHits);
                setHasMore(pageNum < nbPages - 1);
                setPage(pageNum);
            } catch (err) {
                console.error('Search error:', err);
                setError('فشل في تحميل الإعلانات');
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
                isSearchingRef.current = false;
            }
        },
        [buildFilters]
    );

    // ============================================
    // Effects
    // ============================================

    useEffect(() => {
        setPage(0);
        setHasMore(true);
        searchListings(debouncedQuery, typeFilter, 0);
    }, [debouncedQuery, typeFilter, searchListings]);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        if (isLoading || isLoadingMore || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
                    searchListings(debouncedQuery, typeFilter, page + 1);
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasMore, isLoading, isLoadingMore, page, debouncedQuery, typeFilter, searchListings]);

    // ============================================
    // Handlers
    // ============================================

    const handleRetry = () => {
        setError(null);
        searchListings(debouncedQuery, typeFilter, 0);
    };

    const clearSearch = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    // ============================================
    // Render
    // ============================================

    return (
        <div className="space-y-6">
            {/* Search & Filter Section */}
            <div className="card p-4 rounded-2xl space-y-4">
                {/* Search Bar */}
                <div className="relative group">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ابحث عن منتجات أو خدمات..."
                        className="w-full py-3 px-12 rounded-xl bg-[var(--space-800)] border border-[var(--glass-border)] text-white placeholder:text-[var(--text-muted)] focus:text-white focus:outline-none focus:ring-2 focus:ring-[var(--nebula-500)] focus:border-transparent transition-all"
                        dir="rtl"
                        aria-label="البحث في الإعلانات"
                    />

                    {/* Search Icon */}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-cyan-400 transition-colors">
                        <Search className="w-5 h-5" />
                    </span>

                    {/* Clear / Loading */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        {isLoading && query ? (
                            <LoadingSpinner size="sm" variant="primary" />
                        ) : query ? (
                            <button
                                onClick={clearSearch}
                                className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
                                aria-label="مسح البحث"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-3 justify-center" role="group" aria-label="تصفية حسب النوع">
                    {(Object.keys(FILTER_CONFIG) as TypeFilter[]).map((filter) => {
                        const config = FILTER_CONFIG[filter];
                        const isActive = typeFilter === filter;

                        return (
                            <button
                                key={filter}
                                onClick={() => setTypeFilter(filter)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${isActive
                                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50'
                                    }`}
                                aria-pressed={isActive}
                            >
                                <config.Icon className={`w-4 h-4 ${isActive ? 'text-white' : config.color}`} />
                                {config.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Results Count */}
            {!isLoading && totalHits > 0 && (
                <p className="text-sm text-[var(--text-muted)]">
                    {totalHits.toLocaleString('en-US')} نتيجة
                </p>
            )}

            {/* Error State */}
            {error && (
                <div className="card p-4 border border-[var(--aurora-danger)]/30 bg-[var(--aurora-danger-muted)] rounded-xl flex items-center justify-between">
                    <span className="text-[var(--aurora-danger)]">{error}</span>
                    <button
                        onClick={handleRetry}
                        className="btn btn-ghost btn-sm text-[var(--aurora-danger)] hover:bg-[var(--aurora-danger)]/10"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}

            {/* Loading State (Initial) */}
            {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ListingCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && hits.length === 0 && (
                <div className="card p-12 rounded-2xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-6">
                        {debouncedQuery ? (
                            <SearchX className="w-10 h-10 text-slate-500" />
                        ) : (
                            <Inbox className="w-10 h-10 text-slate-500" />
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                        {debouncedQuery ? 'لا توجد نتائج' : 'لا توجد إعلانات بعد'}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        {debouncedQuery
                            ? 'جرب كلمات بحث مختلفة أو غير الفلتر'
                            : 'كن أول من ينشر إعلاناً!'}
                    </p>
                    {!debouncedQuery && (
                        <Link
                            href="/listing/new"
                            className="btn btn-primary btn-md"
                        >
                            انشر إعلان جديد
                        </Link>
                    )}
                </div>
            )}

            {/* Listings Grid */}
            {!isLoading && hits.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hits.map((hit) => (
                        <ListingCard
                            key={hit.objectID}
                            id={hit.objectID}
                            title={hit.title}
                            description={hit.description}
                            type={hit.type}
                            price={hit.price}
                            imagePaths={hit.imagePaths || []}
                            userName={hit.userName}
                            createdAt={hit.createdAt}
                        />
                    ))}
                </div>
            )}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="py-4">
                {isLoadingMore && (
                    <div className="flex items-center justify-center gap-3 text-[var(--text-muted)]">
                        <LoadingSpinner size="sm" variant="primary" />
                        <span>جاري التحميل...</span>
                    </div>
                )}
            </div>

            {/* End of Results */}
            {!isLoading && !hasMore && hits.length > 0 && (
                <div className="text-center text-[var(--text-muted)] py-4 text-sm">
                    <span className="inline-block w-12 h-px bg-[var(--glass-border)] mx-4 align-middle" />
                    نهاية النتائج ({hits.length.toLocaleString('en-US')} من {totalHits.toLocaleString('en-US')})
                    <span className="inline-block w-12 h-px bg-[var(--glass-border)] mx-4 align-middle" />
                </div>
            )}
        </div>
    );
}

