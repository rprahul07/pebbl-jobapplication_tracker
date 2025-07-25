export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salaryRange?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  applicationDeadline: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resume: File | string;
  coverLetter: string;
  appliedDate: string;
  status: 'New' | 'In Review' | 'Rejected' | 'Hired';
}

export interface JobFilters {
  search: string;
  location: string;
  type: string;
  company: string;
}