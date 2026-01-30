import { NextResponse } from 'next/server';
import { fetchPortfolioFromGithub, savePortfolioToGithub } from '@/lib/github';
import { getPortfolioContent } from '@/lib/projects';

// GET: Returns portfolio content
export async function GET() {
    // Check if GitHub is configured
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
        console.log('GitHub not configured, returning local data');
        // Return local data for development
        const localData = await getPortfolioContent();
        return NextResponse.json(localData);
    }

    try {
        console.log(`Fetching portfolio from GitHub: ${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}`);
        const { portfolio } = await fetchPortfolioFromGithub();
        console.log('Portfolio fetched successfully');
        return NextResponse.json(portfolio);
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('GET /api/portfolio error:', err.message);
        // Return error message so dashboard can show what's wrong
        return NextResponse.json({ 
            error: err.message || 'Failed to fetch portfolio',
            config: {
                owner: process.env.GITHUB_OWNER,
                repo: process.env.GITHUB_REPO,
                hasToken: !!process.env.GITHUB_TOKEN
            }
        }, { status: 500 });
    }
}

// PUT: Update portfolio content
export async function PUT(request: Request) {
    try {
        // Check all required env variables
        if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
            console.error('Missing env vars:', {
                hasToken: !!process.env.GITHUB_TOKEN,
                owner: process.env.GITHUB_OWNER,
                repo: process.env.GITHUB_REPO
            });
            return NextResponse.json(
                { error: 'GitHub integration not configured. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel.' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { section, data } = body;

        if (!section || !data) {
            return NextResponse.json(
                { error: 'Section and data are required' },
                { status: 400 }
            );
        }

        const validSections = ['hero', 'about', 'skills', 'contact', 'footer'];
        if (!validSections.includes(section)) {
            return NextResponse.json(
                { error: 'Invalid section' },
                { status: 400 }
            );
        }

        console.log(`Saving ${section} section to GitHub...`);
        
        const { portfolio, sha } = await fetchPortfolioFromGithub();
        
        // Update the specific section
        const updatedPortfolio = {
            ...portfolio,
            [section]: data
        };

        await savePortfolioToGithub(
            updatedPortfolio,
            sha,
            `update: ${section} section updated`
        );

        console.log(`${section} section saved successfully!`);
        
        return NextResponse.json({ success: true, portfolio: updatedPortfolio });
    } catch (error) {
        console.error('PUT /api/portfolio error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update portfolio' },
            { status: 500 }
        );
    }
}
