import { getApiUrl, API_ENDPOINTS } from '../config/api';

/** Kept in sync with vertechie_be/.../scripts/seed_job_title_catalog.py (CATALOG_TITLES). */
const JOB_TITLE_SUGGESTIONS = [
  '.NET Developer',
  'AI Engineer',
  'Academic Advisor',
  'Account Executive',
  'Account Manager',
  'Accountant',
  'Accounts Payable Specialist',
  'Agile Coach',
  'Android Developer',
  'Angular Developer',
  'Automation Test Engineer',
  'BI Developer',
  'Backend Developer',
  'Blockchain Developer',
  'Brand Manager',
  'Business Analyst',
  'Business Development Manager',
  'Business Intelligence Analyst',
  'Business Operations Manager',
  'C# Developer',
  'Chief Financial Officer',
  'Chief Operating Officer',
  'Civil Engineer',
  'Clinical Research Associate',
  'Cloud Architect',
  'Cloud Engineer',
  'Compliance Officer',
  'Content Marketing Manager',
  'Content Strategist',
  'Contract Manager',
  'Controller',
  'Copywriter',
  'Curriculum Developer',
  'Customer Success Manager',
  'Customer Support Specialist',
  'Data Analyst',
  'Data Architect',
  'Data Engineer',
  'Data Scientist',
  'Database Administrator',
  'Delivery Manager',
  'DevOps Engineer',
  'Digital Marketing Manager',
  'ETL Developer',
  'Electrician',
  'Embedded Software Engineer',
  'Engineering Manager',
  'Field Service Engineer',
  'Financial Analyst',
  'Financial Controller',
  'Frontend Developer',
  'Full Stack Developer',
  'Go Developer',
  'Graphic Designer',
  'Growth Marketing Manager',
  'HR Business Partner',
  'HR Generalist',
  'HR Manager',
  'HVAC Technician',
  'IT Administrator',
  'Instructional Designer',
  'Java Architect',
  'Java Developer',
  'Java Technical Lead',
  'Kotlin Developer',
  'Learning and Development Specialist',
  'Legal Counsel',
  'Machine Learning Engineer',
  'Marketing Manager',
  'Marketing Specialist',
  'Mechanical Engineer',
  'Medical Coder',
  'Mobile App Developer',
  'Motion Designer',
  'Network Administrator',
  'Network Engineer',
  'Node.js Developer',
  'Nurse Practitioner',
  'Occupational Therapist',
  'Operations Analyst',
  'Operations Manager',
  'PHP Developer',
  'Paralegal',
  'Payroll Specialist',
  'People Operations Manager',
  'Pharmacist',
  'Photographer',
  'Physical Therapist',
  'Physician',
  'Physician Assistant',
  'Platform Engineer',
  'Plumber',
  'Principal Software Engineer',
  'Privacy Officer',
  'Product Designer',
  'Product Manager',
  'Product Marketing Manager',
  'Product Owner',
  'Professor',
  'Program Coordinator',
  'Program Manager',
  'Project Engineer',
  'Project Manager',
  'Python Developer',
  'QA Engineer',
  'Quality Assurance Manager',
  'React Developer',
  'React Native Developer',
  'Recruiter',
  'Registered Nurse',
  'Research Scientist',
  'Respiratory Therapist',
  'Risk Analyst',
  'Ruby on Rails Developer',
  'Rust Developer',
  'SEO Specialist',
  'Sales Development Representative',
  'Sales Engineer',
  'Sales Manager',
  'Salesforce Developer',
  'School Administrator',
  'Scrum Master',
  'Security Engineer',
  'Senior Java Developer',
  'Senior Software Engineer',
  'Site Reliability Engineer',
  'Social Media Manager',
  'Software Architect',
  'Software Engineer',
  'Solutions Architect',
  'Spring Boot Developer',
  'Staff Software Engineer',
  'Supply Chain Analyst',
  'Supply Chain Manager',
  'Swift Developer',
  'System Administrator',
  'Systems Engineer',
  'Talent Acquisition Specialist',
  'Teacher',
  'Technical Lead',
  'Technical Program Manager',
  'Technical Support Engineer',
  'Technical Writer',
  'Training Manager',
  'TypeScript Developer',
  'UI UX Designer',
  'UX Researcher',
  'Video Editor',
  'Visual Designer',
  'Vue.js Developer',
  'Warehouse Manager',
  'Web Developer',
  'iOS Developer',
];

const normalize = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9+.#\s]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Fetch job title suggestions from API (catalog + distinct titles from jobs), with local fallback.
 */
export async function fetchJobTitleSuggestions(query: string, limit = 24): Promise<string[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const url = `${getApiUrl(API_ENDPOINTS.JOBS.TITLE_AUTOCOMPLETE)}?q=${encodeURIComponent(q)}&limit=${limit}`;
    const token = localStorage.getItem('authToken');
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((x) => String(x)).filter(Boolean);
    }
  } catch {
    /* use local list below */
  }
  return getJobTitleSuggestions(q, limit);
}

/** Local-only suggestions (offline / API failure). */
export const getJobTitleSuggestions = (query: string, limit = 24): string[] => {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const queryTokens = normalizedQuery.split(' ').filter(Boolean);

  return JOB_TITLE_SUGGESTIONS
    .map((title) => {
      const normalizedTitle = normalize(title);
      const startsWithQuery = normalizedTitle.startsWith(normalizedQuery);
      const includesQuery = normalizedTitle.includes(normalizedQuery);
      const tokenMatches = queryTokens.every((token) => normalizedTitle.includes(token));

      let score = -1;
      if (startsWithQuery) score = 3;
      else if (includesQuery) score = 2;
      else if (tokenMatches) score = 1;

      return { title, score };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit)
    .map((item) => item.title);
};

export default JOB_TITLE_SUGGESTIONS;
