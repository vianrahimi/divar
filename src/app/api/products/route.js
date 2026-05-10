import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const cat = searchParams.get('cat');
        const city = searchParams.get('city');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const condition = searchParams.get('condition');

        let query = `
            SELECT products.*, cities.name as cityName, categories.name as categoryName 
            FROM products 
            LEFT JOIN cities ON products.cityId = cities.id 
            LEFT JOIN categories ON products.categoryId = categories.id
            WHERE 1=1
        `;
        let params = [];

        if (q) {
            query += ' AND (title LIKE ? OR description LIKE ?)';
            params.push(`%${q}%`, `%${q}%`);
        }
        if (cat) {
            query += ' AND categoryId = ?';
            params.push(cat);
        }
        if (city) {
            query += ' AND cityId = ?';
            params.push(city);
        }
        if (minPrice) {
            query += ' AND price >= ?';
            params.push(minPrice);
        }
        if (maxPrice) {
            query += ' AND price <= ?';
            params.push(maxPrice);
        }
        if (condition) {
            query += ' AND condition = ?';
            params.push(condition);
        }

        const products = db.prepare(query).all(...params);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
