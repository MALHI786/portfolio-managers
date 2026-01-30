import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/ProjectForm';
import { getProjects } from '@/lib/projects';

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProjectPageProps) {
    const { id } = await params;
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);
    
    return {
        title: project ? `Edit ${project.title} | Portfolio Manager` : 'Edit Project',
        description: 'Edit your portfolio project'
    };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = await params;
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Edit Project
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Update <span className="font-semibold">{project.title}</span>. Changes will be committed to GitHub.
                    </p>
                </header>

                {/* Form */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                    <ProjectForm mode="edit" initialData={project} />
                </div>
            </div>
        </main>
    );
}
