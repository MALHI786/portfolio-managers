'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, ProjectFormData } from '@/lib/types';
import { validateProject, ValidationError } from '@/lib/validation';
import { Plus, X, Loader2, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
    mode: 'create' | 'edit';
    initialData?: Project;
}

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState(initialData?.title || '');
    const [overview, setOverview] = useState(initialData?.overview || '');
    const [features, setFeatures] = useState<string[]>(initialData?.features || ['']);
    const [techStack, setTechStack] = useState<string[]>(initialData?.techStack || ['']);
    const [githubLink, setGithubLink] = useState(initialData?.githubLink || '');
    const [documentation, setDocumentation] = useState(initialData?.documentation || '');

    const getFieldError = (field: string) => {
        return errors.find(e => e.field === field)?.message;
    };

    const addFeature = () => setFeatures([...features, '']);
    const removeFeature = (index: number) => {
        if (features.length > 1) {
            setFeatures(features.filter((_, i) => i !== index));
        }
    };
    const updateFeature = (index: number, value: string) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    const addTech = () => setTechStack([...techStack, '']);
    const removeTech = (index: number) => {
        if (techStack.length > 1) {
            setTechStack(techStack.filter((_, i) => i !== index));
        }
    };
    const updateTech = (index: number, value: string) => {
        const updated = [...techStack];
        updated[index] = value;
        setTechStack(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setApiError(null);

        const formData: ProjectFormData = {
            title,
            overview,
            features: features.filter(f => f.trim()),
            techStack: techStack.filter(t => t.trim()),
            githubLink,
            documentation: documentation || undefined
        };

        // Validate
        const validation = validateProject(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);

        try {
            const url = '/api/projects';
            const method = mode === 'create' ? 'POST' : 'PUT';
            const body = mode === 'create' 
                ? formData 
                : { id: initialData?.id, ...formData };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save project');
            }

            // Success - redirect to dashboard
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* API Error */}
            {apiError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-800 dark:text-red-200">Error</p>
                        <p className="text-sm text-red-600 dark:text-red-300">{apiError}</p>
                    </div>
                </div>
            )}

            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        getFieldError('title') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2`}
                    placeholder="My Awesome Project"
                />
                {getFieldError('title') && (
                    <p className="mt-1 text-sm text-red-500">{getFieldError('title')}</p>
                )}
            </div>

            {/* Overview */}
            <div>
                <label htmlFor="overview" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overview *
                </label>
                <textarea
                    id="overview"
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        getFieldError('overview') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2`}
                    placeholder="A brief description of what this project does..."
                />
                {getFieldError('overview') && (
                    <p className="mt-1 text-sm text-red-500">{getFieldError('overview')}</p>
                )}
            </div>

            {/* Features */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features * (at least one)
                </label>
                <div className="space-y-2">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => updateFeature(index, e.target.value)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Feature ${index + 1}`}
                            />
                            {features.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                    <Plus className="w-4 h-4" /> Add Feature
                </button>
                {getFieldError('features') && (
                    <p className="mt-1 text-sm text-red-500">{getFieldError('features')}</p>
                )}
            </div>

            {/* Tech Stack */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack * (at least one)
                </label>
                <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <input
                                type="text"
                                value={tech}
                                onChange={(e) => updateTech(index, e.target.value)}
                                className="w-32 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Technology"
                            />
                            {techStack.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTech(index)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTech}
                        className="px-3 py-1.5 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                {getFieldError('techStack') && (
                    <p className="mt-1 text-sm text-red-500">{getFieldError('techStack')}</p>
                )}
            </div>

            {/* GitHub Link */}
            <div>
                <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Repository URL *
                </label>
                <input
                    type="url"
                    id="githubLink"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                        getFieldError('githubLink') 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } bg-white dark:bg-gray-800 focus:outline-none focus:ring-2`}
                    placeholder="https://github.com/username/repository"
                />
                {getFieldError('githubLink') && (
                    <p className="mt-1 text-sm text-red-500">{getFieldError('githubLink')}</p>
                )}
            </div>

            {/* Documentation (Optional) */}
            <div>
                <label htmlFor="documentation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Documentation <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    id="documentation"
                    value={documentation}
                    onChange={(e) => setDocumentation(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional documentation, setup instructions, or notes..."
                />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {mode === 'create' ? 'Creating...' : 'Saving...'}
                        </>
                    ) : (
                        mode === 'create' ? 'Create Project' : 'Save Changes'
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
