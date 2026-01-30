'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, User, Code2, Mail, FolderGit2, FileText, Save, Loader2, Trash2 } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { Project, PortfolioContent, SkillCategory } from '@/lib/types';

interface DashboardTabsProps {
    projects: Project[];
    portfolio: PortfolioContent | null;
}

type Tab = 'profile' | 'about' | 'skills' | 'contact' | 'projects';

export function DashboardTabs({ projects, portfolio }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form states
    const [hero, setHero] = useState({
        name: portfolio?.hero?.name || '',
        title: portfolio?.hero?.title || '',
        bio: portfolio?.hero?.bio || '',
        resumeLink: portfolio?.hero?.resumeLink || '/resume.pdf'
    });

    const [about, setAbout] = useState({
        text: portfolio?.about?.text || ''
    });

    const [skills, setSkills] = useState<SkillCategory[]>(
        portfolio?.skills || [
            { category: 'Programming Languages', items: [] },
            { category: 'AI & Machine Learning', items: [] },
            { category: 'Software Development', items: [] },
            { category: 'Tools & Technologies', items: [] }
        ]
    );

    const [contact, setContact] = useState({
        email: portfolio?.contact?.email || '',
        github: portfolio?.contact?.github || '',
        githubUsername: portfolio?.contact?.githubUsername || '',
        linkedin: portfolio?.contact?.linkedin || '',
        linkedinName: portfolio?.contact?.linkedinName || ''
    });

    const [footer, setFooter] = useState({
        copyright: portfolio?.footer?.copyright || '',
        note: portfolio?.footer?.note || ''
    });

    const saveSection = async (section: string, data: object) => {
        setSaving(true);
        setMessage(null);

        try {
            const currentPortfolio = {
                hero,
                about,
                skills,
                contact,
                footer
            };

            const response = await fetch('/api/portfolio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section,
                    data,
                    fullPortfolio: { ...currentPortfolio, [section]: data }
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save');
            }

            setMessage({ type: 'success', text: `${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully!` });
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save' });
        } finally {
            setSaving(false);
        }
    };

    const updateSkillItem = (categoryIndex: number, itemIndex: number, value: string) => {
        const newSkills = [...skills];
        newSkills[categoryIndex].items[itemIndex] = value;
        setSkills(newSkills);
    };

    const addSkillItem = (categoryIndex: number) => {
        const newSkills = [...skills];
        newSkills[categoryIndex].items.push('New Skill');
        setSkills(newSkills);
    };

    const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
        const newSkills = [...skills];
        newSkills[categoryIndex].items.splice(itemIndex, 1);
        setSkills(newSkills);
    };

    const updateSkillCategory = (categoryIndex: number, value: string) => {
        const newSkills = [...skills];
        newSkills[categoryIndex].category = value;
        setSkills(newSkills);
    };

    const tabs = [
        { id: 'profile' as Tab, label: 'Profile', icon: User },
        { id: 'about' as Tab, label: 'About', icon: FileText },
        { id: 'skills' as Tab, label: 'Skills', icon: Code2 },
        { id: 'contact' as Tab, label: 'Contact', icon: Mail },
        { id: 'projects' as Tab, label: 'Projects', icon: FolderGit2 }
    ];

    return (
        <div>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--card-border)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            activeTab === tab.id
                                ? 'bg-[var(--neon-blue)] text-black font-medium'
                                : 'text-[var(--text-secondary)] hover:bg-[rgba(0,243,255,0.1)] hover:text-white'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Status Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success' 
                        ? 'bg-green-900/20 border border-green-500 text-green-400' 
                        : 'bg-red-900/20 border border-red-500 text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="neon-card p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Edit Profile / Hero Section</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={hero.name}
                            onChange={(e) => setHero({ ...hero, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Title / Tagline
                        </label>
                        <input
                            type="text"
                            value={hero.title}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                            placeholder="e.g., BS AI Student | Software Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Short Bio (Hero Section)
                        </label>
                        <textarea
                            value={hero.bio}
                            onChange={(e) => setHero({ ...hero, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none resize-none"
                            placeholder="Brief introduction that appears in the hero section"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Resume Link (path to PDF)
                        </label>
                        <input
                            type="text"
                            value={hero.resumeLink}
                            onChange={(e) => setHero({ ...hero, resumeLink: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                            placeholder="/resume.pdf"
                        />
                    </div>

                    <button
                        onClick={() => saveSection('hero', hero)}
                        disabled={saving}
                        className="neon-btn flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Profile
                    </button>
                </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
                <div className="neon-card p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Edit About Section</h2>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            About Me Text
                        </label>
                        <textarea
                            value={about.text}
                            onChange={(e) => setAbout({ text: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none resize-none"
                            placeholder="Write about yourself, your background, experience, and goals..."
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-2">
                            Tip: Use new lines to create paragraphs
                        </p>
                    </div>

                    <button
                        onClick={() => saveSection('about', about)}
                        disabled={saving}
                        className="neon-btn flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save About
                    </button>
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="neon-card p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Edit Skills</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skills.map((skillCategory, categoryIndex) => (
                            <div key={categoryIndex} className="bg-[rgba(0,0,0,0.3)] p-4 rounded-lg border border-[var(--card-border)]">
                                <input
                                    type="text"
                                    value={skillCategory.category}
                                    onChange={(e) => updateSkillCategory(categoryIndex, e.target.value)}
                                    className="w-full px-3 py-2 mb-4 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--neon-blue)] font-medium focus:border-[var(--neon-blue)] focus:outline-none"
                                />
                                
                                <div className="space-y-2">
                                    {skillCategory.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => updateSkillItem(categoryIndex, itemIndex, e.target.value)}
                                                className="flex-1 px-3 py-2 rounded bg-[var(--input-bg)] border border-[var(--input-border)] text-white text-sm focus:border-[var(--neon-blue)] focus:outline-none"
                                            />
                                            <button
                                                onClick={() => removeSkillItem(categoryIndex, itemIndex)}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => addSkillItem(categoryIndex)}
                                    className="mt-3 text-sm text-[var(--neon-blue)] hover:text-white flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Skill
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => saveSection('skills', skills)}
                        disabled={saving}
                        className="neon-btn flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Skills
                    </button>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <div className="neon-card p-6 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Edit Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={contact.email}
                                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                GitHub URL
                            </label>
                            <input
                                type="url"
                                value={contact.github}
                                onChange={(e) => setContact({ ...contact, github: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                GitHub Username (for display)
                            </label>
                            <input
                                type="text"
                                value={contact.githubUsername}
                                onChange={(e) => setContact({ ...contact, githubUsername: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={contact.linkedin}
                                onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                LinkedIn Display Name
                            </label>
                            <input
                                type="text"
                                value={contact.linkedinName}
                                onChange={(e) => setContact({ ...contact, linkedinName: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                            />
                        </div>
                    </div>

                    <hr className="border-[var(--card-border)]" />
                    
                    <h3 className="text-lg font-medium text-white">Footer</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Copyright Text
                            </label>
                            <input
                                type="text"
                                value={footer.copyright}
                                onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                                placeholder="© 2026 Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Footer Note
                            </label>
                            <input
                                type="text"
                                value={footer.note}
                                onChange={(e) => setFooter({ ...footer, note: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-[var(--input-bg)] border border-[var(--input-border)] text-white focus:border-[var(--neon-blue)] focus:outline-none"
                                placeholder="Built with Next.js"
                            />
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            await saveSection('contact', contact);
                            await saveSection('footer', footer);
                        }}
                        disabled={saving}
                        className="neon-btn flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Contact & Footer
                    </button>
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--text-secondary)]">
                            <span className="font-semibold text-white">{projects.length}</span>
                            {' '}project{projects.length !== 1 ? 's' : ''}
                        </p>
                        <Link
                            href="/dashboard/new"
                            className="neon-btn flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Project
                        </Link>
                    </div>

                    {projects.length === 0 ? (
                        <div className="neon-card p-12 text-center">
                            <div className="w-16 h-16 bg-[rgba(0,243,255,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                                <FolderGit2 className="w-8 h-8 text-[var(--neon-blue)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                No projects yet
                            </h3>
                            <p className="text-[var(--text-muted)] mb-6">
                                Get started by adding your first project.
                            </p>
                            <Link
                                href="/dashboard/new"
                                className="neon-btn inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <DashboardCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
