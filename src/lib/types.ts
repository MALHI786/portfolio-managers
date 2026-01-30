export interface Project {
  id: string;
  title: string;
  overview: string;
  features: string[];
  techStack: string[];
  githubLink: string;
  documentation?: string;
  createdAt: string;
}

export type ProjectFormData = Omit<Project, 'id' | 'createdAt'>;

// Portfolio Content Types
export interface HeroContent {
  name: string;
  title: string;
  bio: string;
  resumeLink: string;
}

export interface AboutContent {
  text: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ContactContent {
  email: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  linkedinName: string;
}

export interface FooterContent {
  copyright: string;
  note: string;
}

export interface PortfolioContent {
  hero: HeroContent;
  about: AboutContent;
  skills: SkillCategory[];
  contact: ContactContent;
  footer: FooterContent;
}
