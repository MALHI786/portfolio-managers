import { getProjects, getPortfolioContent } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';
import { Download, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();
  const portfolio = await getPortfolioContent();

  // Fallback content if portfolio.json doesn't load
  const hero = portfolio?.hero || {
    name: 'Muhammad Salman Ashraf',
    title: 'BS Artificial Intelligence Student | AI & Software Developer',
    bio: 'Passionate about artificial intelligence and software development.',
    resumeLink: '/resume.pdf'
  };

  const about = portfolio?.about || { text: 'About me content...' };
  const skills = portfolio?.skills || [];
  const contact = portfolio?.contact || {
    email: 'email@example.com',
    github: 'https://github.com',
    githubUsername: 'username',
    linkedin: 'https://linkedin.com',
    linkedinName: 'Name'
  };
  const footer = portfolio?.footer || {
    copyright: '© 2026 Portfolio',
    note: 'Built with Next.js'
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[rgba(10,10,15,0.9)] backdrop-blur-xl border-b border-[var(--card-border)]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex justify-center gap-4 md:gap-6 flex-wrap items-center">
            <a href="#home" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Home</a>
            <a href="#about" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">About</a>
            <a href="#skills" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Skills</a>
            <a href="#projects" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Projects</a>
            <a href="#contact" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Contact</a>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 text-[var(--neon-purple)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium ml-4 px-3 py-1 border border-[var(--neon-purple)] rounded-lg hover:border-[var(--neon-blue)]"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-20 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 neon-text">
                {hero.name}
              </h1>
              <p className="text-xl md:text-2xl text-[var(--neon-purple)] mb-6 font-medium">
                {hero.title}
              </p>
              <p className="text-[var(--text-secondary)] max-w-xl mb-8 leading-relaxed">
                {hero.bio}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#projects" className="neon-btn">
                  View My Projects
                </a>
                <a 
                  href="#contact"
                  className="px-6 py-3 border border-[var(--neon-blue)] text-[var(--neon-blue)] rounded-lg hover:bg-[rgba(0,243,255,0.1)] transition-all font-medium"
                >
                  Contact Me
                </a>
                {hero.resumeLink && (
                  <a 
                    href={hero.resumeLink}
                    download
                    className="px-6 py-3 border border-[var(--neon-purple)] text-[var(--neon-purple)] rounded-lg hover:bg-[rgba(157,0,255,0.1)] transition-all font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                )}
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[var(--neon-blue)] shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                <Image
                  src="/profile.jpg"
                  alt={hero.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 neon-text inline-block">About Me</h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {about.text}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 neon-text inline-block">Technical Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillCategory, index) => (
              <div key={index} className="neon-card p-6">
                <h3 className="text-lg font-bold text-[var(--neon-blue)] mb-4">{skillCategory.category}</h3>
                <ul className="space-y-2 text-[var(--text-secondary)]">
                  {skillCategory.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text inline-block">Projects</h2>
          <p className="text-[var(--text-secondary)] mb-12 max-w-2xl">
            Hands-on projects demonstrating programming skills, AI/ML concepts, and system utilities. 
            Click on project names to view source code on GitHub.
          </p>

          {projects.length === 0 ? (
            <div className="text-center py-20 neon-card p-12">
              <h3 className="text-xl font-medium text-[var(--text-muted)]">No projects yet.</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-text inline-block">Contact</h2>
          <p className="text-[var(--text-secondary)] mb-12">
            Feel free to reach out via email or connect with me on professional platforms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <a 
              href={`mailto:${contact.email}`}
              className="neon-card p-6 text-center hover:border-[var(--neon-blue)]"
            >
              <div className="text-4xl mb-4">📧</div>
              <h4 className="font-bold text-white mb-2">Email</h4>
              <p className="text-[var(--text-muted)] text-sm">{contact.email}</p>
            </a>

            {/* GitHub */}
            <a 
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-card p-6 text-center hover:border-[var(--neon-blue)]"
            >
              <div className="text-4xl mb-4">💻</div>
              <h4 className="font-bold text-white mb-2">GitHub</h4>
              <p className="text-[var(--text-muted)] text-sm">github.com/{contact.githubUsername}</p>
            </a>

            {/* LinkedIn */}
            <a 
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-card p-6 text-center hover:border-[var(--neon-blue)]"
            >
              <div className="text-4xl mb-4">🔗</div>
              <h4 className="font-bold text-white mb-2">LinkedIn</h4>
              <p className="text-[var(--text-muted)] text-sm">{contact.linkedinName}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--card-border)] text-center">
        <p className="text-[var(--text-muted)]">
          {footer.copyright}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          {footer.note}
        </p>
      </footer>
    </main>
  );
}
