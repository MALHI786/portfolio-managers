import { Project } from '@/lib/types';
import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="neon-card p-6 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[var(--neon-blue)] group-hover:text-[var(--neon-purple)] transition-colors">
                    <a 
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-2"
                    >
                        {project.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </h3>
                <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[rgba(0,243,255,0.1)] hover:bg-[rgba(0,243,255,0.2)] transition-colors"
                >
                    <Github className="w-5 h-5 text-[var(--neon-blue)]" />
                </a>
            </div>

            <p className="text-[var(--text-secondary)] mb-6 flex-grow text-sm leading-relaxed">
                {project.overview}
            </p>

            {/* Features */}
            <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {project.features.slice(0, 4).map((feature, i) => (
                        <span key={i} className="feature-tag">
                            {feature}
                        </span>
                    ))}
                    {project.features.length > 4 && (
                        <span className="text-xs text-[var(--text-muted)] self-center">
                            +{project.features.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--card-border)]">
                {project.techStack.map((tech) => (
                    <span key={tech} className="tech-tag">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
}
