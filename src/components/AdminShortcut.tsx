'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AdminShortcut() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Press Ctrl+Shift+D to access dashboard
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                router.push('/dashboard');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [router]);

    return null;
}
