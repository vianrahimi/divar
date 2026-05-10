import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, code } = body;

        if (!phone || !code) {
            return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
        }

        const otpRecord = db.prepare('SELECT * FROM otps WHERE phone = ? ORDER BY id DESC LIMIT 1').get(phone);

        if (!otpRecord) {
            return NextResponse.json({ error: 'No OTP found for this phone number' }, { status: 400 });
        }

        if (otpRecord.code !== code) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        if (Date.now() > otpRecord.expires_at) {
            return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
        }

        let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
        if (!user) {
            const insertUser = db.prepare('INSERT INTO users (phone) VALUES (?)');
            const result = insertUser.run(phone);
            user = { id: result.lastInsertRowid, phone };
        }

        db.prepare('DELETE FROM otps WHERE id = ?').run(otpRecord.id);

        return NextResponse.json({ message: 'Login successful', user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
