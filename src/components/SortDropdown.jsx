'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MdSort } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';

const SORT_OPTIONS = [
    { value: 'newest', label: 'جدیدترین' },
    { value: 'cheapest', label: 'ارزان‌ترین' },
    { value: 'expensive', label: 'گران‌ترین' },
];

export default function SortDropdown({ currentSort, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Default to newest if currentSort is empty/invalid
    const activeSortValue = currentSort || 'newest';
    const activeSortLabel = SORT_OPTIONS.find(opt => opt.value === activeSortValue)?.label || 'جدیدترین';

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (value) => {
        onSortChange(value);
        setIsOpen(false);
    };

    return (
        <div className="sort-dropdown-container" ref={dropdownRef}>
            <button
                className={`sort-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <MdSort className="sort-icon" />
                <span className="sort-label">{activeSortLabel}</span>
                <IoIosArrowDown className={`sort-arrow ${isOpen ? 'rotate' : ''}`} />
            </button>

            {isOpen && (
                <ul className="sort-menu">
                    {SORT_OPTIONS.map(option => (
                        <li
                            key={option.value}
                            className={`sort-menu-item ${option.value === activeSortValue ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
