import { Octokit } from 'octokit';
import { Project } from './types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = 'main';
const PATH = 'data/projects.json';

// Initialize Octokit only if token exists
const octokit = GITHUB_TOKEN ? new Octokit({ auth: GITHUB_TOKEN }) : null;

export async function fetchProjectsFromGithub(): Promise<{ projects: Project[], sha: string }> {
    if (!octokit || !OWNER || !REPO) {
        throw new Error('GitHub configuration missing (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)');
    }

    try {
        const { data } = await octokit.rest.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: PATH,
            ref: BRANCH,
        });

        if ('content' in data && Array.isArray(data) === false) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            return {
                projects: JSON.parse(content),
                sha: data.sha
            };
        }

        throw new Error('Invalid response from GitHub');
    } catch (error) {
        console.error('Error fetching from GitHub:', error);
        throw error;
    }
}

export async function saveProjectsToGithub(projects: Project[], currentSha: string, message: string) {
    if (!octokit || !OWNER || !REPO) {
        throw new Error('GitHub configuration missing');
    }

    const content = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');

    await octokit.rest.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: PATH,
        message: message,
        content: content,
        sha: currentSha,
        branch: BRANCH,
        committer: {
            name: 'Portfolio Bot',
            email: 'bot@example.com'
        }
    });
}
