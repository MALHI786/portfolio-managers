import { getProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';
import Link from 'next/link';
import { LayoutDashboard, Github, Linkedin, Mail, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 neon-text">
            Muhammad Salman Ashraf
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-6">
            BS Artificial Intelligence Student | AI & Software Developer
          </p>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto mb-8">
            Passionate about artificial intelligence, machine learning, and software development.
            I build practical solutions using Python, C++, and C# with a focus on real-world applications.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <a 
              href="#projects" 
              className="neon-btn flex items-center gap-2"
            >
              View My Projects
            </a>
            <a 
              href="mailto:salmanmalhig@gmail.com"
              className="px-6 py-3 border border-[var(--neon-blue)] text-[var(--neon-blue)] rounded-lg hover:bg-[rgba(0,243,255,0.1)] transition-all"
            >
              Contact Me
            </a>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-3 text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center">
            <a 
              href="https://github.com/MALHI786" 
              target="_blank"
              className="p-3 neon-card hover:text-[var(--neon-blue)] transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/muhammad-salman-ashraf-163002310" 
              target="_blank"
              className="p-3 neon-card hover:text-[var(--neon-blue)] transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:salmanmalhig@gmail.com"
              className="p-3 neon-card hover:text-[var(--neon-blue)] transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </header>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-20">
          <h2 className="text-3xl font-bold mb-2 neon-text">Projects</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Hands-on projects demonstrating programming skills, AI/ML concepts, and system utilities.
          </p>

          {projects.length === 0 ? (
            <div className="text-center py-20 neon-card p-12">
              <h3 className="text-xl font-medium text-[var(--text-muted)]">No projects yet.</h3>
              <Link href="/dashboard/new" className="neon-btn mt-4 inline-block">
                Add Your First Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-[var(--card-border)] text-center">
          <p className="text-[var(--text-muted)]">
            © 2026 Muhammad Salman Ashraf – AI Student Portfolio
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            Built with Next.js, TypeScript & Tailwind CSS | Auto-managed via Dashboard
          </p>
        </footer>
      </div>
    </main>
  );
}
