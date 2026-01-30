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
