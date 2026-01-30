import fs from 'fs/promises';
import path from 'path';
import { Project } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
    const filePath = path.join(process.cwd(), 'data/projects.json');

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const projects = JSON.parse(fileContent);

        // Sort by createdAt desc
        return projects.sort((a: Project, b: Project) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (error) {
        console.error('Error reading projects:', error);
        return [];
    }
}
