'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MdLocationOn } from 'react-icons/md';
import { IoIosSearch, IoIosArrowDown, IoIosClose } from 'react-icons/io';
import { fetchCities } from '../services/api';

export default function LocationSelector({ isOpen, onToggle, onClose }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchCity, setSearchCity] = useState('');
    const [cities, setCities] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadCities = async () => {
            try {
                const data = await fetchCities();
                setCities(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        loadCities();
    }, []);

    const currentUrlCityId = searchParams.get('city');
    const [tempSelectedCityId, setTempSelectedCityId] = useState(currentUrlCityId);

    useEffect(() => {
        if (isOpen) {
            setTempSelectedCityId(currentUrlCityId);
            setSearchCity('');
        }
    }, [isOpen, currentUrlCityId]);

    // Note: outside-click is now handled by the global overlay in Header

    const handleConfirm = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (tempSelectedCityId) {
            params.set('city', tempSelectedCityId);
        } else {
            params.delete('city');
        }
        router.push(`/?${params.toString()}`);
        onClose();
    };

    const handleClear = () => {
        setTempSelectedCityId(null);
    };

    const toggleCity = (cityId) => {
        setTempSelectedCityId(prev => prev === String(cityId) ? null : String(cityId));
    };

    const filteredCities = cities.filter(c => c.name.includes(searchCity));
    const currentCity = cities.find(c => c.id === Number(currentUrlCityId));
    const tempCity = cities.find(c => String(c.id) === String(tempSelectedCityId));

    return (
        <div className="city-selector-wrapper" ref={dropdownRef}>
            {/* Trigger button */}
            <button
                onClick={onToggle}
                className="header-btn city-selector-btn"
            >
                <MdLocationOn size={18} style={{ color: currentCity ? 'var(--brand-color)' : 'var(--text-muted)' }} />
                <span>{currentCity ? currentCity.name : 'سراسر ایران'}</span>
                <IoIosArrowDown
                    size={13}
                    style={{
                        marginRight: '2px',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        color: 'var(--text-muted)'
                    }}
                />
            </button>

            {/* Dropdown panel as Modal */}
            {isOpen && (
                <div className="modal-backdrop" onClick={onClose}>
                    <div className="city-dropdown" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="city-dropdown-header">
                            <span className="city-dropdown-title">انتخاب شهر</span>
                            {tempCity && (
                                <button className="city-dropdown-clear" onClick={handleClear}>
                                    <IoIosClose size={18} /> حذف
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="city-dropdown-search">
                            <IoIosSearch size={16} className="city-search-icon" />
                            <input
                                type="text"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                placeholder="جستجوی شهر..."
                                className="city-search-input"
                                autoFocus
                            />
                        </div>

                        {/* Selected tag */}
                        {tempCity && (
                            <div className="city-selected-tag">
                                <MdLocationOn size={14} />
                                {tempCity.name}
                                <button onClick={handleClear}><IoIosClose size={14} /></button>
                            </div>
                        )}

                        {/* "All Iran" option */}
                        <div className="city-dropdown-body">
                            <div
                                className={`city-list-item ${!tempSelectedCityId ? 'selected' : ''}`}
                                onClick={handleClear}
                            >
                                <span className="city-list-icon"><MdLocationOn size={16} /></span>
                                <span>کل ایران</span>
                                {!tempSelectedCityId && <span className="city-check">✓</span>}
                            </div>

                            {/* City items */}
                            <div className="city-grid">
                                {filteredCities.map(city => {
                                    const isActive = String(tempSelectedCityId) === String(city.id);
                                    return (
                                        <div
                                            key={city.id}
                                            className={`city-grid-item ${isActive ? 'selected' : ''}`}
                                            onClick={() => toggleCity(city.id)}
                                        >
                                            <MdLocationOn size={14} />
                                            {city.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="city-dropdown-footer">
                            <button className="city-btn-cancel" onClick={onClose}>انصراف</button>
                            <button
                                className={`city-btn-confirm ${tempSelectedCityId !== currentUrlCityId ? 'active' : ''}`}
                                onClick={handleConfirm}
                            >
                                تأیید
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
