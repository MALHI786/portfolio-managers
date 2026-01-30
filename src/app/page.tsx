import { getProjects, getPortfolioContent } from '@/lib/projects';
import LivePortfolio from '@/components/LivePortfolio';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();
  const portfolio = await getPortfolioContent();

  return <LivePortfolio initialPortfolio={portfolio} initialProjects={projects} />;
}
