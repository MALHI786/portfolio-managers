import { NextResponse } from 'next/server';
import { fetchProjectsFromGithub, saveProjectsToGithub } from '@/lib/github';
import { Project } from '@/lib/types';
import { getProjects as getLocalProjects } from '@/lib/projects';
import { validateProject, sanitizeProject } from '@/lib/validation';

// GET: Returns projects (from GitHub in prod, or local fallback)
export async function GET() {
    // In dashboard, we want the source of truth (GitHub).
    // For offline dev without GitHub token, use local data.

    if (!process.env.GITHUB_TOKEN) {
        console.warn('No GITHUB_TOKEN, returning local data (Read-Only mode)');
        const localData = await getLocalProjects();
        return NextResponse.json(localData);
    }

    try {
        const { projects } = await fetchProjectsFromGithub();
        // Sort by createdAt descending (newest first)
        const sorted = projects.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return NextResponse.json(sorted);
    } catch (error) {
        console.error('GET /api/projects error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects from GitHub' }, 
            { status: 500 }
        );
    }
}

// POST: Add a new project
export async function POST(request: Request) {
    try {
        // Check GitHub configuration
        if (!process.env.GITHUB_TOKEN) {
            return NextResponse.json(
                { error: 'GitHub integration not configured. Set GITHUB_TOKEN environment variable.' },
                { status: 503 }
            );
        }

        const body = await request.json();

        // Validate input
        const validation = validateProject(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        // Sanitize and create project
        const sanitized = sanitizeProject(body);
        const newProject: Project = {
            ...sanitized,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };

        const { projects, sha } = await fetchProjectsFromGithub();
        const updatedProjects = [newProject, ...projects];

        await saveProjectsToGithub(
            updatedProjects,
            sha,
            `feat: add project '${newProject.title}'`
        );

        return NextResponse.json({ success: true, project: newProject });
    } catch (error) {
        console.error('POST /api/projects error:', error);
        return NextResponse.json(
            { error: 'Failed to create project. Please try again.' }, 
            { status: 500 }
        );
    }
}

// PUT: Update a project
export async function PUT(request: Request) {
    try {
        // Check GitHub configuration
        if (!process.env.GITHUB_TOKEN) {
            return NextResponse.json(
                { error: 'GitHub integration not configured. Set GITHUB_TOKEN environment variable.' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        // Validate updates
        const validation = validateProject(updates);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.errors },
                { status: 400 }
            );
        }

        const sanitized = sanitizeProject(updates);
        const { projects, sha } = await fetchProjectsFromGithub();

        const index = projects.findIndex(p => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Preserve original id and createdAt
        const updatedProject: Project = { 
            ...projects[index], 
            ...sanitized 
        };
        projects[index] = updatedProject;

        await saveProjectsToGithub(
            projects,
            sha,
            `fix: update project '${updatedProject.title}'`
        );

        return NextResponse.json({ success: true, project: updatedProject });
    } catch (error) {
        console.error('PUT /api/projects error:', error);
        return NextResponse.json(
            { error: 'Failed to update project. Please try again.' }, 
            { status: 500 }
        );
    }
}

// DELETE: Remove a project
export async function DELETE(request: Request) {
    try {
        // Check GitHub configuration
        if (!process.env.GITHUB_TOKEN) {
            return NextResponse.json(
                { error: 'GitHub integration not configured. Set GITHUB_TOKEN environment variable.' },
                { status: 503 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const { projects, sha } = await fetchProjectsFromGithub();
        const projectToDelete = projects.find(p => p.id === id);

        if (!projectToDelete) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const updatedProjects = projects.filter(p => p.id !== id);

        await saveProjectsToGithub(
            updatedProjects,
            sha,
            `chore: delete project '${projectToDelete.title}'`
        );

        return NextResponse.json({ success: true, deleted: projectToDelete.title });
    } catch (error) {
        console.error('DELETE /api/projects error:', error);
        return NextResponse.json(
            { error: 'Failed to delete project. Please try again.' }, 
            { status: 500 }
        );
    }
}
