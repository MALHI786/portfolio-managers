import Link from 'next/link';
import { Plus, Home, FolderGit2, LogOut } from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { getProjects } from '@/lib/projects';
import { LogoutButton } from '@/components/LogoutButton';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Dashboard | Portfolio Manager',
    description: 'Manage your portfolio projects'
};

export default async function DashboardPage() {
    const projects = await getProjects();

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FolderGit2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Manage your portfolio projects
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">View Portfolio</span>
                            </Link>
                            <LogoutButton />
                        </div>
                    </div>
                </header>

                {/* Actions bar */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">{projects.length}</span>
                        {' '}project{projects.length !== 1 ? 's' : ''}
                    </p>
                    <Link
                        href="/dashboard/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Project
                    </Link>
                </div>

                {/* Projects list */}
                {projects.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderGit2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No projects yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Get started by adding your first project.
                        </p>
                        <Link
                            href="/dashboard/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Your First Project
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <DashboardCard key={project.id} project={project} />
                        ))}
                    </div>
                )}

                {/* Footer note */}
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>How it works:</strong> When you add, edit, or delete a project, the changes are 
                        automatically committed to GitHub. Vercel then detects the commit and redeploys your 
                        portfolio with the updated content.
                    </p>
                </div>
            </div>
        </main>
    );
}
