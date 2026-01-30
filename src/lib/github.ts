import { Octokit } from 'octokit';
import { Project, PortfolioContent } from './types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = 'main';
const PROJECTS_PATH = 'data/projects.json';
const PORTFOLIO_PATH = 'data/portfolio.json';

// Initialize Octokit only if token exists
const octokit = GITHUB_TOKEN ? new Octokit({ auth: GITHUB_TOKEN }) : null;

// Generic function to fetch any JSON file from GitHub
async function fetchFileFromGithub<T>(path: string): Promise<{ data: T, sha: string }> {
    if (!octokit || !OWNER || !REPO) {
        console.error('GitHub config check:', { 
            hasToken: !!GITHUB_TOKEN, 
            owner: OWNER, 
            repo: REPO 
        });
        throw new Error(`GitHub configuration missing - Token: ${!!GITHUB_TOKEN}, Owner: ${OWNER}, Repo: ${REPO}`);
    }

    try {
        console.log(`Fetching from GitHub: ${OWNER}/${REPO}/${path}`);
        const { data } = await octokit.rest.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: path,
            ref: BRANCH,
        });

        if ('content' in data && Array.isArray(data) === false) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            return {
                data: JSON.parse(content),
                sha: data.sha
            };
        }

        throw new Error('Invalid response from GitHub');
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string };
        console.error(`Error fetching ${path} from GitHub:`, err.status, err.message);
        throw new Error(`GitHub API Error (${err.status || 'unknown'}): ${err.message || 'Unknown error'} - Repo: ${OWNER}/${REPO}/${path}`);
    }
}

// Generic function to save any JSON file to GitHub
async function saveFileToGithub<T>(path: string, data: T, currentSha: string, message: string) {
    if (!octokit || !OWNER || !REPO) {
        throw new Error('GitHub configuration missing');
    }

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

    await octokit.rest.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: path,
        message: message,
        content: content,
        sha: currentSha,
        branch: BRANCH
    });
}

// Projects functions
export async function fetchProjectsFromGithub(): Promise<{ projects: Project[], sha: string }> {
    const result = await fetchFileFromGithub<Project[]>(PROJECTS_PATH);
    return { projects: result.data, sha: result.sha };
}

export async function saveProjectsToGithub(projects: Project[], currentSha: string, message: string) {
    await saveFileToGithub(PROJECTS_PATH, projects, currentSha, message);
}

// Portfolio content functions
export async function fetchPortfolioFromGithub(): Promise<{ portfolio: PortfolioContent, sha: string }> {
    const result = await fetchFileFromGithub<PortfolioContent>(PORTFOLIO_PATH);
    return { portfolio: result.data, sha: result.sha };
}

export async function savePortfolioToGithub(portfolio: PortfolioContent, currentSha: string, message: string) {
    await saveFileToGithub(PORTFOLIO_PATH, portfolio, currentSha, message);
}
