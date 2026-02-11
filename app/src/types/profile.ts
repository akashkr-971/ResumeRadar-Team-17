export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  
  // Professional Summary (will be AI-generated)
  summary?: string;
  
  // Work Experience
  experience: Experience[];
  
  // Education
  education: Education[];
  
  // Skills - Simplified to array of strings (technology names)
  technicalSkills: string[];
  softSkills: string[];
  
  // Projects
  projects: Project[];
  
  // Certifications
  certifications: Certification[];
  
  // Languages
  languages: string[];
  
  // Additional Sections
  achievements: string[];
  publications: string[];
  
  // Job preferences
  targetRole?: string;
  targetIndustry?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}