import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
    try {
        const body = await request.json();
        const { phone } = body;
        
        if (!phone || !phone.match(/^09\d{9}$/)) {
            return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000;

        const insertOtp = db.prepare('INSERT INTO otps (phone, code, expires_at) VALUES (?, ?, ?)');
        insertOtp.run(phone, otp, expiresAt);

        console.log(`\n=========================================\n[SMS MOCK] Sent OTP ${otp} to phone ${phone}\n=========================================\n`);

        return NextResponse.json({ message: 'OTP generated and logged to server console.' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
