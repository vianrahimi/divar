const API_URL = '/api';

export const fetchProducts = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.q) queryParams.append('q', filters.q);
    if (filters.cat) queryParams.append('cat', filters.cat);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.condition) queryParams.append('condition', filters.condition);

    const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
};

export const fetchCities = async () => {
    const res = await fetch(`${API_URL}/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
};

export const requestOtp = async (phone) => {
    const res = await fetch(`${API_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to request OTP');
    }
    return res.json();
};

export const verifyOtp = async (phone, code) => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to verify OTP');
    }
    return res.json();
};
