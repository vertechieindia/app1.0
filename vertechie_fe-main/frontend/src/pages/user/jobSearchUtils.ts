import { Job, JobFilters } from '../../types/jobPortal';

export const DEFAULT_JOB_FILTERS: Required<JobFilters> = {
  search: '',
  jobType: '',
  experienceLevel: '',
  location: '',
  dateRange: 'all',
};

export const TECHIE_JOB_TYPE_OPTIONS = [
  { value: 'fulltime', label: 'Full-Time' },
  { value: 'parttime', label: 'Part-Time' },
  { value: 'w2contract', label: 'W2 - Contract' },
  { value: 'corp2corp', label: 'Corp-to-Corp' },
  { value: 'unpaid_internship', label: 'Unpaid Internship' },
  { value: 'paid_internship', label: 'Paid Internship' },
  { value: 'freelance', label: 'Freelance' },
] as const;

export const TECHIE_EXPERIENCE_OPTIONS = [
  { value: 'college_fresh', label: 'College fresh grads' },
  { value: '0_2', label: '0 to 2+ years' },
  { value: '2_5', label: '2 to 5+ years' },
  { value: '5_8', label: '5 to 8 years' },
  { value: '8_10', label: '8 to 10 years' },
  { value: '10_12', label: '10 to 12+' },
  { value: '12_leadership', label: '12 to leadership' },
] as const;

export const TECHIE_DATE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'last7', label: 'Last 7 Days' },
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
] as const;

export const normalizeJobTypeForFilter = (value: string): string => {
  const raw = (value || '').toLowerCase();
  const compact = raw.replace(/[^a-z0-9]/g, '');
  if (compact.includes('fulltime')) return 'fulltime';
  if (compact.includes('parttime')) return 'parttime';
  if (compact.includes('w2')) return 'w2contract';
  if (compact.includes('corp2corp') || compact.includes('corptocorp')) return 'corp2corp';
  if (compact.includes('unpaid') && compact.includes('intern')) return 'unpaid_internship';
  if (compact.includes('paid') && compact.includes('intern')) return 'paid_internship';
  if (compact.includes('freelance')) return 'freelance';
  if (compact.includes('contract')) return 'contract';
  if (compact.includes('internship')) return 'internship';
  return compact;
};

export const normalizeExperienceForFilter = (value: string): string => {
  const raw = (value || '').toLowerCase();
  const compact = raw.replace(/[^a-z0-9_]/g, '');
  if (compact.includes('college') || compact.includes('fresh')) return 'college_fresh';
  if (compact === 'entry' || compact === '0_2' || compact.includes('02')) return '0_2';
  if (compact === 'mid' || compact === '2_5' || compact.includes('25')) return '2_5';
  if (compact === 'senior' || compact === '5_8' || compact.includes('58')) return '5_8';
  if (compact === '8_10' || compact.includes('810')) return '8_10';
  if (compact === '10_12' || compact.includes('1012')) return '10_12';
  if (compact === 'lead' || compact === '12_leadership' || compact.includes('12lead')) return '12_leadership';
  return compact;
};

export function hasActiveJobFilters(filters: JobFilters): boolean {
  return Boolean(
    filters.search ||
    filters.jobType ||
    filters.experienceLevel ||
    filters.location ||
    (filters.dateRange && filters.dateRange !== 'all')
  );
}

export function applyJobFilters(jobs: Job[], filters: JobFilters): Job[] {
  let filtered = [...jobs];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.requiredSkills.some((skill) => skill.toLowerCase().includes(query))
    );
  }

  if (filters.jobType) {
    filtered = filtered.filter((job) => {
      const normalizedJobType = normalizeJobTypeForFilter(job.jobType);
      if (filters.jobType === 'w2contract' || filters.jobType === 'corp2corp') {
        return normalizedJobType === filters.jobType || normalizedJobType === 'contract';
      }
      if (filters.jobType === 'paid_internship' || filters.jobType === 'unpaid_internship') {
        return normalizedJobType === filters.jobType || normalizedJobType === 'internship';
      }
      return normalizedJobType === filters.jobType;
    });
  }

  if (filters.experienceLevel) {
    filtered = filtered.filter((job) => {
      const normalizedExp = normalizeExperienceForFilter(job.experienceLevel);
      if (filters.experienceLevel === 'college_fresh') {
        return normalizedExp === 'college_fresh' || normalizedExp === '0_2';
      }
      if (filters.experienceLevel === '0_2') {
        return normalizedExp === '0_2' || normalizedExp === 'college_fresh';
      }
      if (filters.experienceLevel === '8_10') {
        return normalizedExp === '8_10' || normalizedExp === '5_8';
      }
      if (filters.experienceLevel === '10_12') {
        return normalizedExp === '10_12' || normalizedExp === '12_leadership';
      }
      return normalizedExp === filters.experienceLevel;
    });
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    filtered = filtered.filter((job) => job.location.toLowerCase().includes(loc));
  }

  if (filters.dateRange && filters.dateRange !== 'all') {
    const dayWindow = filters.dateRange === 'last7' ? 7 : filters.dateRange === 'last30' ? 30 : 90;
    filtered = filtered.filter((job) => {
      const postedTs = new Date(job.createdAt).getTime();
      if (!Number.isFinite(postedTs)) return false;
      const ageInDays = (Date.now() - postedTs) / (1000 * 60 * 60 * 24);
      return ageInDays <= dayWindow;
    });
  }

  return filtered;
}
