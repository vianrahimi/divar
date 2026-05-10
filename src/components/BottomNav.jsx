'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BiHome, BiListUl, BiPlusCircle, BiChat, BiUser, BiChevronLeft, BiCar, BiWrench, BiRun, BiGroup, BiBriefcase } from 'react-icons/bi';

import { MdOutlinePhoneIphone, MdOutlineKitchen, MdOutlinePrecisionManufacturing } from 'react-icons/md';
import { usePathname, useRouter } from 'next/navigation';
import Drawer from './Drawer';
import { fetchCategories } from '../services/api';
import MobileUserMenu from './MobileUserMenu';

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
    return Icon ? <Icon size={20} /> : <BiListUl size={20} />;
};

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCatDrawerOpen, setIsCatDrawerOpen] = useState(false);
    const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };
        loadCategories();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
    };

    const handleCategorySelect = (id) => {
        const params = new URLSearchParams(window.location.search);
        if (id) params.set('cat', id);
        else params.delete('cat');
        router.push(`/?${params.toString()}`);
        setIsCatDrawerOpen(false);
    };

    return (
        <>
            <nav className="bottom-nav">
                <Link href="/" className={`bottom-nav-item ${pathname === '/' && !isCatDrawerOpen && !isUserDrawerOpen ? 'active' : ''}`}>
                    <BiHome size={24} />
                    <span>آگهی‌ها</span>
                </Link>
                <button 
                    className={`bottom-nav-item ${isCatDrawerOpen ? 'active' : ''}`}
                    onClick={() => { setIsCatDrawerOpen(true); setIsUserDrawerOpen(false); }}
                >
                    <BiListUl size={24} />
                    <span>دسته‌ها</span>
                </button>
                <Link href="#" className="bottom-nav-item">
                    <BiPlusCircle size={24} />
                    <span>ثبت آگهی</span>
                </Link>
                <Link href="#" className="bottom-nav-item">
                    <BiChat size={24} />
                    <span>چت</span>
                </Link>
                <button 
                    className={`bottom-nav-item ${isUserDrawerOpen ? 'active' : ''}`}
                    onClick={() => { setIsUserDrawerOpen(true); setIsCatDrawerOpen(false); }}
                >
                    <BiUser size={24} />
                    <span>دیوار من</span>
                </button>
            </nav>

            <Drawer 
                isOpen={isCatDrawerOpen} 
                onClose={() => setIsCatDrawerOpen(false)} 
                title="دسته‌بندی‌ها"
                isFullScreen={true}
            >
                <div className="mobile-category-list">
                    <div className="mobile-category-item" onClick={() => handleCategorySelect(null)}>
                        <div className="cat-item-main">
                            <BiListUl size={20} className="menu-icon" />
                            <span>همه آگهی‌ها</span>
                        </div>
                        <BiChevronLeft size={20} className="menu-icon" />
                    </div>
                    {categories.map(cat => (
                        <div key={cat.id} className="mobile-category-item" onClick={() => handleCategorySelect(cat.id)}>
                            <div className="cat-item-main">
                                <span className="menu-icon">{getCategoryIcon(cat.id)}</span>
                                <span>{cat.name}</span>
                            </div>
                            <BiChevronLeft size={20} className="menu-icon" />
                        </div>
                    ))}
                </div>
            </Drawer>

            <Drawer 
                isOpen={isUserDrawerOpen} 
                onClose={() => setIsUserDrawerOpen(false)} 
                title="دیوار من"
                isFullScreen={true}
            >
                <MobileUserMenu 
                    user={user} 
                    onLogin={handleLogin} 
                    onLogout={handleLogout} 
                />
            </Drawer>
        </>
    );
}


