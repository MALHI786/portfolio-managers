'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { DeleteModal } from './DeleteModal';
import { Pencil, Trash2, Github, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardCardProps {
    project: Project;
}

export function DashboardCard({ project }: DashboardCardProps) {
    const [showDelete, setShowDelete] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {project.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {project.overview}
                            </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Link
                                href={`/dashboard/edit/${project.id}`}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Edit project"
                            >
                                <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => setShowDelete(true)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Delete project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span className="truncate max-w-[200px]">
                                {project.githubLink.replace('https://github.com/', '')}
                            </span>
                        </a>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {project.techStack.slice(0, 5).map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 5 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                                +{project.techStack.length - 5} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Expandable details */}
                <div className="border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full px-4 sm:px-6 py-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                        <span>{expanded ? 'Hide' : 'Show'} details</span>
                        {expanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                    
                    {expanded && (
                        <div className="px-4 sm:px-6 pb-4 space-y-4">
                            {/* Features */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Features ({project.features.length})
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {project.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Documentation */}
                            {project.documentation && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Documentation
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                        {project.documentation}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            <DeleteModal
                project={project}
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
            />
        </>
    );
}
