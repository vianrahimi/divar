'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { BiUser, BiSupport, BiHome, BiCar, BiMobile, BiWrench, BiRun, BiGroup, BiBriefcase, BiStar, BiCheckShield, BiListUl, BiCreditCard, BiBookmark, BiNote, BiHistory, BiShieldAlt2, BiCog, BiLogOut } from 'react-icons/bi';
import { BsChatSquareText } from 'react-icons/bs';
import { IoIosSearch, IoIosArrowDown, IoIosArrowBack, IoIosClose } from 'react-icons/io';
import { MdOutlinePhoneIphone, MdOutlineKitchen, MdOutlinePrecisionManufacturing } from 'react-icons/md';
import LocationSelector from './LocationSelector';
import AuthModal from './AuthModal';
import Drawer from './Drawer';
import { fetchCategories } from '../services/api';

const getCategoryIcon = (id, size = 18) => {
    const iconMap = {
        1: BiHome,
        2: BiCar,
        3: MdOutlinePhoneIphone,
        4: MdOutlineKitchen,
        5: BiWrench,
        6: BiRun,
        7: BiGroup,
        8: BiGroup,
        9: MdOutlinePrecisionManufacturing,
        10: BiBriefcase,
    };
    const Icon = iconMap[id];
    return Icon ? <Icon size={size} /> : null;
};

export default function Header() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [showCatMenu, setShowCatMenu] = useState(false);
    const [showCityMenu, setShowCityMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSearchDrawer, setShowSearchDrawer] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);

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

    const updateSearchParams = (paramsObj) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(paramsObj).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`/?${params.toString()}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams({ q: searchTerm.trim() || null });
        setShowSearchDrawer(false);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        setShowCatMenu(false);
        setShowCityMenu(false);
    };

    const activeCatData = categories.find(c => c.id === activeCategory);

    return (
        <header className="header">
            <div className="header-container">
                {/* Right Area: Logo, City, Categories, Search (Desktop) */}
                <div className="header-right">
                    <Link href="/" className="logo">
                        <img src="/image/logo.svg" alt="دیوار" />
                    </Link>
                    <div className="header-divider"></div>
                    <LocationSelector
                        isOpen={showCityMenu}
                        onToggle={() => setShowCityMenu(!showCityMenu)}
                        onClose={() => setShowCityMenu(false)}
                    />
                    <div style={{ position: 'relative' }}>
                        <button
                            className="header-btn cat-btn"
                            onClick={() => {
                                setShowCatMenu(!showCatMenu);
                                if (!showCatMenu && categories.length > 0) {
                                    setActiveCategory(categories[0].id);
                                }
                                setShowCityMenu(false);
                                setShowUserMenu(false);
                            }}
                        >
                            دسته‌ها <IoIosArrowDown className={`arrow-icon ${showCatMenu ? 'open' : ''}`} />
                        </button>

                        {/* Mega Menu (Desktop Only) */}
                        {showCatMenu && (
                            <div className="modal-backdrop" onClick={() => setShowCatMenu(false)}>
                                <div className="mega-menu" onClick={(e) => e.stopPropagation()}>
                                    <div className="mega-menu-panel-right">
                                        {categories.map(cat => (
                                            <div
                                                key={cat.id}
                                                className={`mega-menu-item ${activeCategory === cat.id ? 'active' : ''}`}
                                                onMouseEnter={() => setActiveCategory(cat.id)}
                                                onClick={() => {
                                                    updateSearchParams({ cat: cat.id });
                                                    setShowCatMenu(false);
                                                }}
                                            >
                                                <div className="mega-menu-item-label">
                                                    <span className="mega-menu-item-icon">{getCategoryIcon(cat.id)}</span>
                                                    <span>{cat.name}</span>
                                                </div>
                                                <IoIosArrowBack className="mega-menu-chevron" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mega-menu-panel-left">
                                        {activeCatData ? (
                                            <>
                                                <div className="mega-menu-cat-header">
                                                    <span className="mega-menu-cat-title">{activeCatData.name}</span>
                                                </div>
                                                <div className="mega-menu-sub-grid">
                                                    <div 
                                                        className="mega-menu-subitem"
                                                        onClick={() => {
                                                            updateSearchParams({ cat: activeCatData.id });
                                                            setShowCatMenu(false);
                                                        }}
                                                    >
                                                        همه آگهی‌های {activeCatData.name}
                                                    </div>
                                                    {/* Subcategories could go here if available in API */}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mega-menu-empty">
                                                <span>برای مشاهده زیردسته، یک دسته را انتخاب کنید</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearch} className="header-search-form">
                        <button type="submit" className="search-submit">
                            <IoIosSearch size={20} />
                        </button>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="جستجو در همۀ آگهی‌ها"
                            className="search-input"
                        />
                    </form>
                </div>

                {/* Mobile Search Icon (Only visible on mobile) */}
                <button className="mobile-search-btn" onClick={() => setShowSearchDrawer(true)}>
                    <IoIosSearch size={24} />
                </button>

                {/* Left Area: User Menu, Chat, Support, Post Ad */}
                <div className="header-left">
                    <div style={{ position: 'relative' }}>
                        <button
                            className="header-icon-btn"
                            onClick={toggleUserMenu}
                        >
                            <BiUser size={20} />
                            <span>دیوار من</span>
                        </button>

                        {/* User Menu Modal (Desktop) */}
                        {showUserMenu && (
                            <div className="modal-backdrop" onClick={() => setShowUserMenu(false)}>
                                <div className="user-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                    <div className="user-dropdown-list">
                                        {user ? (
                                            <>
                                                <div className="user-dropdown-header">
                                                    <BiUser size={24} />
                                                    <div className="user-info">
                                                        <div className="user-name">کاربر دیوار</div>
                                                        <div className="user-phone">تلفن {user.phone}</div>
                                                    </div>
                                                </div>
                                                <div className="user-dropdown-divider"></div>
                                                <button className="user-dropdown-item" onClick={() => setUser(null)}>
                                                    <BiLogOut size={20} /> خروج
                                                </button>
                                            </>
                                        ) : (
                                            <button className="user-dropdown-item" onClick={() => { setShowAuthModal(true); setShowUserMenu(false); }}>
                                                <BiUser size={20} /> ورود به حساب
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="#" className="header-icon-btn">
                        <BsChatSquareText size={18} />
                        <span>چت</span>
                    </Link>

                    <Link href="#" className="header-icon-btn">
                        <BiSupport size={20} />
                        <span>پشتیبانی</span>
                    </Link>

                    <button className="post-ad-btn">ثبت آگهی</button>
                </div>
            </div>

            {/* Mobile Search Drawer */}
            <Drawer 
                isOpen={showSearchDrawer} 
                onClose={() => setShowSearchDrawer(false)} 
                title="جستجو"
                isFullScreen={true}
            >
                <div className="search-drawer-content">
                    <form onSubmit={handleSearch} className="search-drawer-input-wrapper">
                        <IoIosSearch size={24} className="menu-icon" />
                        <input 
                            type="text" 
                            className="search-drawer-input" 
                            placeholder="جستجو در همۀ آگهی‌ها" 
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                    <div className="recent-searches">
                        <div className="recent-search-item">
                            <BiHistory size={20} />
                            <span>جستجوهای اخیر</span>
                        </div>
                    </div>
                </div>
            </Drawer>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={(u) => setUser(u)} />
        </header>
    );
}
