import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        const isValid = verifyPassword(password);

        if (isValid) {
            // Create a simple session token (timestamp-based for simplicity)
            const sessionToken = Buffer.from(
                `${password}:${Date.now()}`
            ).toString('base64');

            const response = NextResponse.json({ success: true });
            
            // Set HTTP-only cookie for security
            response.cookies.set('admin_session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/'
            });

            return response;
        }

        return NextResponse.json(
            { error: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
