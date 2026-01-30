'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, AlertCircle, Shield } from 'lucide-react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const result = await response.json();

            if (response.ok) {
                router.push(redirectTo);
                router.refresh();
            } else {
                setError(result.error || 'Invalid password');
            }
        } catch (err) {
            setError('Failed to authenticate. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg">
            {/* Icon */}
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Admin Access
            </h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                Enter your password to access the dashboard
            </p>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter admin password"
                            required
                            autoFocus
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        'Access Dashboard'
                    )}
                </button>
            </form>

            {/* Back to portfolio */}
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <a href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                    ← Back to Portfolio
                </a>
            </p>
        </div>
    );
}

function LoginLoading() {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-lg flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <Suspense fallback={<LoginLoading />}>
                    <LoginForm />
                </Suspense>

                {/* Security note */}
                <p className="mt-4 text-center text-xs text-gray-400">
                    This area is for admin access only.
                    <br />
                    Unauthorized access is prohibited.
                </p>
            </div>
        </main>
    );
}
