import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { username, password } = await request.json();

    if (username === 'saad' && password === '#saad#2005') {
        // Set a cookie (simplified for this demo)
        const cookieStore = await cookies();
        cookieStore.set('admin_token', 'authenticated', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
