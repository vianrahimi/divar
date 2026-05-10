"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import SortDropdown from '../components/SortDropdown';
import { fetchProducts } from '../services/api';

export default function HomePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);


    const currentCat = searchParams.get('cat');
    const selectedCategory = currentCat ? Number(currentCat) : null;
    const currentCity = searchParams.get('city');
    const searchQuery = searchParams.get('q')?.toLowerCase();
    const currentSort = searchParams.get('sort') || 'newest';

    const updateSearchParams = (key, value) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (value) {
            current.set(key, value);
        } else {
            current.delete(key);
        }
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${window.location.pathname}${query}`);
    };

    const handleSelectCategory = (id) => {
        updateSearchParams('cat', id);
    };

    // Advanced Filters
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const hasPhoto = searchParams.get('hasPhoto') === 'true';
    const hasVideo = searchParams.get('hasVideo') === 'true';
    const postTime = searchParams.get('postTime');

    const handleSortChange = (newSort) => {
        updateSearchParams('sort', newSort);
    };

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const filters = {
                    q: searchQuery || '',
                    cat: selectedCategory || '',
                    city: currentCity || '',
                    minPrice: priceMin || '',
                    maxPrice: priceMax || ''
                };
                const data = await fetchProducts(filters);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [searchQuery, selectedCategory, currentCity, priceMin, priceMax]);

    // Apply client-side filters not handled by DB (like photo, video, time, sort)
    let filteredProducts = products.filter(p => {
        let match = true;

        // Photo & Video Filter
        if (hasPhoto && (!p.image || p.image === '')) match = false;
        if (hasVideo && !p.hasVideo) match = false;

        // Time Filter (Numeric comparison)
        if (postTime) {
            const timeLimitMap = {
                '3h': 3,
                '12h': 12,
                '1d': 24,
                '3d': 72,
                '7d': 168
            };
            const limit = timeLimitMap[postTime];
            if (limit && p.timeHours > limit) {
                match = false;
            }
        }

        return match;
    });

    // Apply sorting
    if (currentSort === 'cheapest') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'expensive') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else {
        // newest
        filteredProducts.sort((a, b) => (a.timeHours || 0) - (b.timeHours || 0));
    }

    // Fetch city and category names for breadcrumbs
    const [breadcrumbText, setBreadcrumbText] = useState('همه آگهی‌ها در ایران');

    useEffect(() => {
        const fetchNames = async () => {
            try {
                const [cats, cities] = await Promise.all([
                    fetch('/api/categories').then(r => r.json()),
                    fetch('/api/cities').then(r => r.json())
                ]);

                const catName = cats.find(c => Number(c.id) === Number(selectedCategory))?.name || 'همه آگهی‌ها';
                const cityName = cities.find(c => Number(c.id) === Number(currentCity))?.name || 'ایران';

                setBreadcrumbText(`خرید و فروش ${catName} در ${cityName}`);
            } catch (e) {
                console.error(e);
            }
        };
        fetchNames();
    }, [selectedCategory, currentCity]);

    return (
        <div className="home-layout">

            {/* Sidebar */}
            <Sidebar
                selectedCategoryId={selectedCategory}
                onSelectCategory={handleSelectCategory}
            />

            {/* Main Content */}
            <div className="home-main">
                <div className="page-header-actions">
                    <div className="breadcrumbs">
                        {breadcrumbText}
                    </div>
                </div>

                <div className="sort-bar desktop-only">
                    <SortDropdown currentSort={currentSort} onSortChange={handleSortChange} />
                </div>


                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>در حال بارگذاری...</div>
                ) : (
                    <>
                        <div className="products-container">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="product-item">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="empty-state">
                                برای این فیلتر آگهی یافت نشد.
                            </div>
                        )}
                    </>
                )}
            </div>


        </div>
    );
}

