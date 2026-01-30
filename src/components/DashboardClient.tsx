'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { DashboardTabs } from './DashboardTabs';
import { Project, PortfolioContent } from '@/lib/types';

interface DashboardClientProps {
    fallbackProjects: Project[];
    fallbackPortfolio: PortfolioContent | null;
}

export function DashboardClient({ fallbackProjects, fallbackPortfolio }: DashboardClientProps) {
    const [projects, setProjects] = useState<Project[]>(fallbackProjects);
    const [portfolio, setPortfolio] = useState<PortfolioContent | null>(fallbackPortfolio);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [configInfo, setConfigInfo] = useState<{ owner?: string; repo?: string; hasToken?: boolean } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch portfolio from API (which fetches from GitHub)
            const portfolioRes = await fetch('/api/portfolio', { cache: 'no-store' });
            const portfolioData = await portfolioRes.json();
            
            if (portfolioData.error) {
                setError(portfolioData.error);
                setConfigInfo(portfolioData.config);
            } else {
                setPortfolio(portfolioData);
            }

            // Fetch projects from API
            const projectsRes = await fetch('/api/projects', { cache: 'no-store' });
            const projectsData = await projectsRes.json();
            
            if (projectsData.error) {
                setError(prev => prev ? `${prev}\n${projectsData.error}` : projectsData.error);
            } else if (Array.isArray(projectsData)) {
                setProjects(projectsData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to connect to API');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[var(--neon-blue)] animate-spin mb-4" />
                <p className="text-[var(--text-secondary)]">Loading portfolio data from GitHub...</p>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-bold text-red-400 mb-1">GitHub Connection Error</h3>
                            <p className="text-red-300 text-sm whitespace-pre-wrap">{error}</p>
                            {configInfo && (
                                <div className="mt-2 text-xs text-red-300/70">
                                    <p>Config: Owner={configInfo.owner || 'NOT SET'}, Repo={configInfo.repo || 'NOT SET'}, Token={configInfo.hasToken ? 'Set' : 'NOT SET'}</p>
                                </div>
                            )}
                            <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/50 rounded text-yellow-300 text-sm">
                                <strong>Fix this in Vercel:</strong>
                                <ol className="list-decimal ml-4 mt-1 space-y-1">
                                    <li>Go to your Vercel project → Settings → Environment Variables</li>
                                    <li>Set <code className="bg-black/30 px-1 rounded">GITHUB_TOKEN</code> = your GitHub token</li>
                                    <li>Set <code className="bg-black/30 px-1 rounded">GITHUB_OWNER</code> = MALHI786</li>
                                    <li>Set <code className="bg-black/30 px-1 rounded">GITHUB_REPO</code> = portfolio-manager-editors</li>
                                    <li>Set <code className="bg-black/30 px-1 rounded">ADMIN_PASSWORD</code> = your password</li>
                                    <li>Redeploy the project</li>
                                </ol>
                            </div>
                            <button
                                onClick={fetchData}
                                className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DashboardTabs projects={projects} portfolio={portfolio} />

            {/* Footer note */}
            <div className="mt-8 p-4 bg-[rgba(0,243,255,0.05)] border border-[var(--neon-blue)] rounded-lg">
                <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--neon-blue)]">💡 How it works:</strong> When you save changes, 
                    they are automatically committed to GitHub. Vercel then detects the commit and redeploys your 
                    portfolio with the updated content.
                </p>
            </div>
        </>
    );
}
