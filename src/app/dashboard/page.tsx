import Link from 'next/link';
import { Home, Sparkles } from 'lucide-react';
import { getProjects, getPortfolioContent } from '@/lib/projects';
import { LogoutButton } from '@/components/LogoutButton';
import { DashboardClient } from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Dashboard | Portfolio Manager',
    description: 'Manage your portfolio content'
};

export default async function DashboardPage() {
    // Get local data as fallback
    const localProjects = await getProjects();
    const localPortfolio = await getPortfolioContent();

    return (
        <main className="min-h-screen bg-[#0a0a0f] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[rgba(0,243,255,0.1)] rounded-lg border border-[var(--neon-blue)]">
                                <Sparkles className="w-6 h-6 text-[var(--neon-blue)]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white neon-text">
                                    Portfolio Dashboard
                                </h1>
                                <p className="text-sm text-[var(--text-muted)]">
                                    Edit all your portfolio content from here
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">View Portfolio</span>
                            </Link>
                            <LogoutButton />
                        </div>
                    </div>
                </header>

                {/* Dashboard Client - Fetches from API */}
                <DashboardClient 
                    fallbackProjects={localProjects} 
                    fallbackPortfolio={localPortfolio} 
                />

                {/* Footer note */}
                <div className="mt-8 p-4 bg-[rgba(0,243,255,0.05)] border border-[var(--neon-blue)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">
                        <strong className="text-[var(--neon-blue)]">💡 How it works:</strong> When you save changes, 
                        they are automatically committed to GitHub. Vercel then detects the commit and redeploys your 
                        portfolio with the updated content.
                    </p>
                </div>
            </div>
        </main>
    );
}
