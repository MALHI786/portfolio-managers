import { ProjectFormData } from './types';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Validates project form data
 * Returns validation result with any errors found
 */
export function validateProject(data: Partial<ProjectFormData>): ValidationResult {
    const errors: ValidationError[] = [];

    // Title validation
    if (!data.title || data.title.trim().length === 0) {
        errors.push({ field: 'title', message: 'Title is required' });
    } else if (data.title.trim().length < 3) {
        errors.push({ field: 'title', message: 'Title must be at least 3 characters' });
    } else if (data.title.trim().length > 100) {
        errors.push({ field: 'title', message: 'Title must be less than 100 characters' });
    }

    // Overview validation
    if (!data.overview || data.overview.trim().length === 0) {
        errors.push({ field: 'overview', message: 'Overview is required' });
    } else if (data.overview.trim().length < 10) {
        errors.push({ field: 'overview', message: 'Overview must be at least 10 characters' });
    } else if (data.overview.trim().length > 500) {
        errors.push({ field: 'overview', message: 'Overview must be less than 500 characters' });
    }

    // Features validation
    if (!data.features || data.features.length === 0) {
        errors.push({ field: 'features', message: 'At least one feature is required' });
    } else {
        const validFeatures = data.features.filter(f => f.trim().length > 0);
        if (validFeatures.length === 0) {
            errors.push({ field: 'features', message: 'At least one non-empty feature is required' });
        }
    }

    // Tech stack validation
    if (!data.techStack || data.techStack.length === 0) {
        errors.push({ field: 'techStack', message: 'At least one technology is required' });
    } else {
        const validTech = data.techStack.filter(t => t.trim().length > 0);
        if (validTech.length === 0) {
            errors.push({ field: 'techStack', message: 'At least one non-empty technology is required' });
        }
    }

    // GitHub link validation
    if (!data.githubLink || data.githubLink.trim().length === 0) {
        errors.push({ field: 'githubLink', message: 'GitHub link is required' });
    } else {
        const githubPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
        if (!githubPattern.test(data.githubLink.trim())) {
            errors.push({ 
                field: 'githubLink', 
                message: 'Must be a valid GitHub repository URL (e.g., https://github.com/user/repo)' 
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitizes project data by trimming strings and filtering empty array items
 */
export function sanitizeProject(data: ProjectFormData): ProjectFormData {
    return {
        title: data.title.trim(),
        overview: data.overview.trim(),
        features: data.features.map(f => f.trim()).filter(f => f.length > 0),
        techStack: data.techStack.map(t => t.trim()).filter(t => t.length > 0),
        githubLink: data.githubLink.trim(),
        documentation: data.documentation?.trim() || undefined
    };
}
