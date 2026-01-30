import { getProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';
import { AdminShortcut } from '@/components/AdminShortcut';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen">
      <AdminShortcut />
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[rgba(10,10,15,0.9)] backdrop-blur-xl border-b border-[var(--card-border)]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex justify-center gap-6 flex-wrap">
            <a href="#home" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Home</a>
            <a href="#about" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">About</a>
            <a href="#skills" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Skills</a>
            <a href="#projects" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Projects</a>
            <a href="#contact" className="text-[var(--text-secondary)] hover:text-[var(--neon-blue)] transition-colors text-sm font-medium">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-20 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 neon-text">
                Muhammad Salman Ashraf
              </h1>
              <p className="text-xl md:text-2xl text-[var(--neon-purple)] mb-6 font-medium">
                BS Artificial Intelligence Student | AI & Software Developer
              </p>
              <p className="text-[var(--text-secondary)] max-w-xl mb-8 leading-relaxed">
                Passionate about artificial intelligence, machine learning, and software development.
                I build practical solutions using Python, C++, and C# with a focus on real-world applications.
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
                <a 
                  href="/resume.pdf"
                  download
                  className="px-6 py-3 border border-[var(--neon-purple)] text-[var(--neon-purple)] rounded-lg hover:bg-[rgba(157,0,255,0.1)] transition-all font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[var(--neon-blue)] shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                <Image
                  src="/profile.jpg"
                  alt="Muhammad Salman Ashraf"
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
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            I am a dedicated BS Artificial Intelligence student with strong expertise in AI, Machine Learning, and Software Development.
            I have served as Class Representative for multiple semesters, bridging communication between students and faculty.
            Known for leadership, teamwork, and clear communication skills, I enjoy collaborating on challenging projects and
            continuously expanding my technical knowledge.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 neon-text inline-block">Technical Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Programming Languages */}
            <div className="neon-card p-6">
              <h3 className="text-lg font-bold text-[var(--neon-blue)] mb-4">Programming Languages</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>• Python (Advanced)</li>
                <li>• C++ (Advanced)</li>
                <li>• C# (Intermediate)</li>
                <li>• SQL (Basic)</li>
              </ul>
            </div>

            {/* AI & Machine Learning */}
            <div className="neon-card p-6">
              <h3 className="text-lg font-bold text-[var(--neon-blue)] mb-4">AI & Machine Learning</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>• Supervised & Unsupervised Learning</li>
                <li>• Computer Vision</li>
                <li>• TensorFlow</li>
                <li>• Pandas & NumPy</li>
                <li>• Data Preprocessing</li>
              </ul>
            </div>

            {/* Software Development */}
            <div className="neon-card p-6">
              <h3 className="text-lg font-bold text-[var(--neon-blue)] mb-4">Software Development</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>• Object-Oriented Programming</li>
                <li>• Data Structures & Algorithms</li>
                <li>• GUI Development</li>
                <li>• File Handling</li>
                <li>• Database Management</li>
              </ul>
            </div>

            {/* Tools & Technologies */}
            <div className="neon-card p-6">
              <h3 className="text-lg font-bold text-[var(--neon-blue)] mb-4">Tools & Technologies</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li>• Git & GitHub</li>
                <li>• Visual Studio & VS Code</li>
                <li>• Streamlit</li>
                <li>• Jupyter Notebook</li>
                <li>• Scikit-learn</li>
              </ul>
            </div>
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
              href="mailto:salmanmalhig@gmail.com"
              className="neon-card p-6 text-center hover:border-[var(--neon-blue)]"
            >
              <div className="text-4xl mb-4">📧</div>
              <h4 className="font-bold text-white mb-2">Email</h4>
              <p className="text-[var(--text-muted)] text-sm">salmanmalhig@gmail.com</p>
            </a>

            {/* GitHub */}
            <a 
              href="https://github.com/MALHI786"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-card p-6 text-center hover:border-[var(--neon-blue)]"
            >
              <div className="text-4xl mb-4">💻</div>
              <h4 className="font-bold text-white mb-2">GitHub</h4>
              <p className="text-[var(--text-muted)] text-sm">github.com/MALHI786</p>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/muhammad-salman-ashraf-163002310"
              target="_blank"
              rel="noopener noreferrer"
              className="neon-card p-6 text-center hover:border-[var(--neon-blue)]"
            >
              <div className="text-4xl mb-4">🔗</div>
              <h4 className="font-bold text-white mb-2">LinkedIn</h4>
              <p className="text-[var(--text-muted)] text-sm">Muhammad Salman Ashraf</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--card-border)] text-center">
        <p className="text-[var(--text-muted)]">
          © 2026 Muhammad Salman Ashraf – AI Student Portfolio
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Built with Next.js & Tailwind CSS
        </p>
      </footer>
    </main>
  );
}
