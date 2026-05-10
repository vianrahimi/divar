'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaTwitter, FaInstagram, FaLinkedin, FaPlay } from 'react-icons/fa';
import { BiHome, BiCar, BiMobileAlt, BiWrench, BiRun, BiGroup, BiBriefcase, BiDesktop, BiBody, BiFootball, BiGridAlt, BiBuildings } from 'react-icons/bi';
import { MdOutlinePhoneIphone, MdOutlineKitchen, MdOutlinePrecisionManufacturing } from 'react-icons/md';
import { fetchCategories } from '../services/api';

const getCategoryIcon = (id) => {
    const icons = {
        1: BiHome,
        2: BiCar,
        3: MdOutlinePhoneIphone,
        4: MdOutlineKitchen,
        5: BiWrench,
        6: BiRun,
        7: BiGroup,
        8: BiGroup,
        9: MdOutlinePrecisionManufacturing,
        10: BiBriefcase
    };
    const Icon = icons[id];
    return Icon ? <Icon /> : null;
};

export default function Sidebar({ selectedCategoryId, onSelectCategory }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [categories, setCategories] = useState([]);

    const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
    const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
    const [hasPhoto, setHasPhoto] = useState(searchParams.get('hasPhoto') === 'true');
    const [hasVideo, setHasVideo] = useState(searchParams.get('hasVideo') === 'true');
    const [postTime, setPostTime] = useState(searchParams.get('postTime') || '');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        setPriceMin(searchParams.get('priceMin') || '');
        setPriceMax(searchParams.get('priceMax') || '');
        setHasPhoto(searchParams.get('hasPhoto') === 'true');
        setHasVideo(searchParams.get('hasVideo') === 'true');
        setPostTime(searchParams.get('postTime') || '');
    }, [searchParams]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`/?${params.toString()}`);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (priceMin) params.set('priceMin', priceMin);
        else params.delete('priceMin');

        if (priceMax) params.set('priceMax', priceMax);
        else params.delete('priceMax');

        router.push(`/?${params.toString()}`);
    };

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">دسته‌ها</h2>
            <ul className="sidebar-menu">
                <li>
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={`sidebar-btn ${selectedCategoryId === null ? 'active' : ''}`}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', display: 'flex', color: selectedCategoryId === null ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {/* You could put an "all" icon here if wanted, else offset dummy */}
                            </span>
                            <span>همه آگهی‌ها</span>
                        </span>
                    </button>
                </li>
                {categories.map(cat => (
                    <li key={cat.id}>
                        <button
                            onClick={() => onSelectCategory(cat.id)}
                            className={`sidebar-btn ${selectedCategoryId === cat.id ? 'active' : ''}`}
                        >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '18px', display: 'flex', color: selectedCategoryId === cat.id ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                    {getCategoryIcon(cat.id)}
                                </span>
                                <span>{cat.name}</span>
                            </span>
                        </button>
                        {selectedCategoryId === cat.id && cat.subcategories && (
                            <ul className="sidebar-submenu">
                                {cat.subcategories.map(sub => (
                                    <li key={sub.id}>{sub.name}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            <div className="sidebar-filters">
                {/* Price Filter */}
                <div className="filter-group">
                    <h3 className="filter-title">قیمت (تومان)</h3>
                    <div className="filter-price-inputs">
                        <div className="price-input-wrapper">
                            <span className="price-label">از</span>
                            <input
                                type="text"
                                className="price-input"
                                placeholder="تومان"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                            />
                        </div>
                        <div className="price-input-wrapper">
                            <span className="price-label">تا</span>
                            <input
                                type="text"
                                className="price-input"
                                placeholder="تومان"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        onClick={applyPriceFilter}
                        className="btn-block-outline"
                        style={{ marginTop: '12px', width: '100%', maxWidth: 'none', padding: '6px 12px', fontSize: '13px' }}
                    >
                        اعمال فیلتر قیمت
                    </button>
                </div>

                {/* Video Filter */}
                <div className="filter-group toggle-group">
                    <span className="toggle-label">ویدیودار</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={hasVideo}
                            onChange={(e) => {
                                setHasVideo(e.target.checked);
                                updateFilter('hasVideo', e.target.checked ? 'true' : '');
                            }}
                        />
                        <span className="toggle-slider"></span>
                        
                    </label>
                </div>

                {/* Photo Filter */}
                <div className="filter-group toggle-group">
                    <span className="toggle-label">عکس‌دار</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={hasPhoto}
                            onChange={(e) => {
                                setHasPhoto(e.target.checked);
                                updateFilter('hasPhoto', e.target.checked ? 'true' : '');
                            }}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                {/* Post Time Filter */}
                <div className="filter-group">
                    <h3 className="filter-title">زمان انتشار آگهی</h3>
                    <select
                        className="filter-select"
                        value={postTime}
                        onChange={(e) => {
                            setPostTime(e.target.value);
                            updateFilter('postTime', e.target.value);
                        }}
                    >
                        <option value="">انتخاب</option>
                        <option value="3h">۳ ساعت پیش</option>
                        <option value="12h">۱۲ ساعت پیش</option>
                        <option value="1d">۱ روز پیش</option>
                        <option value="3d">۳ روز پیش</option>
                        <option value="7d">۷ روز پیش</option>
                    </select>
                </div>
            </div>

            {/* Sidebar Footer */}
            <div className="sidebar-footer">
                <div className="footer-links">
                    <a href="#">دربارهٔ دیوار</a>
                    <a href="#">دریافت برنامه</a>
                    <a href="#">اتاق خبر</a>
                    <a href="#">دیوار حرفه‌ای</a>
                    <a href="#">گزارش آسیب‌پذیری</a>
                    <a href="#">دیواری شو</a>
                    <a href="#">پشتیبانی و قوانین</a>
                </div>
                <div className="footer-socials">
                    <a href="#" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
                    <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
                    <a href="#" className="social-icon" aria-label="LinkedIn"><FaLinkedin /></a>
                    <a href="#" className="social-icon" aria-label="Aparat"><FaPlay /></a>
                </div>
            </div>
        </aside>
    );
}
