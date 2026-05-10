import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const cities = db.prepare('SELECT * FROM cities').all();
        return NextResponse.json(cities);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
