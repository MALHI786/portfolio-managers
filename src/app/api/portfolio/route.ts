import { NextResponse } from 'next/server';
import { fetchPortfolioFromGithub, savePortfolioToGithub } from '@/lib/github';
import { getPortfolioContent } from '@/lib/projects';

// GET: Returns portfolio content
export async function GET() {
    if (!process.env.GITHUB_TOKEN) {
        // Return local data for development
        const localData = await getPortfolioContent();
        return NextResponse.json(localData);
    }

    try {
        const { portfolio } = await fetchPortfolioFromGithub();
        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('GET /api/portfolio error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch portfolio content' },
            { status: 500 }
        );
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
