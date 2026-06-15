import { ScreeningCriteria, ScreeningTask } from '../../services/screeningService';

export const PROFICIENCY_LEVELS = [
  'Expert',
  'Advanced',
  'Intermediate',
  'Beginner',
  'Not met',
  'Not assessed',
] as const;

export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];

export interface ScreeningReviewState {
  checks: Record<string, boolean>;
  visaType: string;
  locationVerified: string;
  mandatoryProficiency: Record<string, string>;
  optionalProficiency: Record<string, string>;
  comments: string;
  outcome: 'selected' | 'rejected';
  rejectionReason: string;
  rejectionNotes: string;
}

export function checksFromCriteria(criteria?: ScreeningCriteria): string[] {
  if (criteria?.checks?.length) return criteria.checks;
  return ['location', 'visa', 'tech'];
}

export function initSkillProficiency(skills?: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  (skills || []).forEach((s) => {
    const key = s.trim();
    if (key) out[key] = '';
  });
  return out;
}

export function initReviewState(
  criteria?: ScreeningCriteria,
  existing?: Record<string, unknown>,
): ScreeningReviewState {
  const checkKeys = checksFromCriteria(criteria);
  const checks: Record<string, boolean> = {};
  checkKeys.forEach((c) => { checks[c] = false; });

  const mandatory = initSkillProficiency(criteria?.tech_mandatory);
  const optional = initSkillProficiency(criteria?.tech_optional);

  if (existing) {
    const mand = existing.mandatory_skills as Record<string, string> | undefined;
    const opt = existing.optional_skills as Record<string, string> | undefined;
    if (mand) Object.keys(mandatory).forEach((k) => { if (mand[k]) mandatory[k] = mand[k]; });
    if (opt) Object.keys(optional).forEach((k) => { if (opt[k]) optional[k] = opt[k]; });
  }

  return {
    checks,
    visaType: String(existing?.visa_type_verified || ''),
    locationVerified: String(existing?.location_verified || ''),
    mandatoryProficiency: mandatory,
    optionalProficiency: optional,
    comments: '',
    outcome: 'selected',
    rejectionReason: 'skill_mismatch',
    rejectionNotes: '',
  };
}

export function buildDetailedResults(state: Pick<
  ScreeningReviewState,
  'visaType' | 'locationVerified' | 'mandatoryProficiency' | 'optionalProficiency'
>): Record<string, unknown> {
  const mandatory_skills: Record<string, string> = {};
  Object.entries(state.mandatoryProficiency).forEach(([k, v]) => {
    if (v) mandatory_skills[k] = v;
  });
  const optional_skills: Record<string, string> = {};
  Object.entries(state.optionalProficiency).forEach(([k, v]) => {
    if (v) optional_skills[k] = v;
  });
  return {
    visa_type_verified: state.visaType || undefined,
    location_verified: state.locationVerified || undefined,
    mandatory_skills: Object.keys(mandatory_skills).length ? mandatory_skills : undefined,
    optional_skills: Object.keys(optional_skills).length ? optional_skills : undefined,
  };
}

export function formatDetailedResults(results?: Record<string, unknown>): string[] {
  if (!results || !Object.keys(results).length) return [];
  const lines: string[] = [];
  if (results.location_verified) lines.push(`Location: ${results.location_verified}`);
  if (results.visa_type_verified) lines.push(`Visa: ${results.visa_type_verified}`);
  const mand = results.mandatory_skills as Record<string, string> | undefined;
  if (mand) {
    Object.entries(mand).forEach(([skill, level]) => lines.push(`${skill} (required): ${level}`));
  }
  const opt = results.optional_skills as Record<string, string> | undefined;
  if (opt) {
    Object.entries(opt).forEach(([skill, level]) => lines.push(`${skill} (optional): ${level}`));
  }
  if (results.skill_proficiency_notes) lines.push(`Skills: ${results.skill_proficiency_notes}`);
  return lines;
}

export function reviewStateFromTask(
  criteria: ScreeningCriteria | undefined,
  task: ScreeningTask,
): ScreeningReviewState {
  const state = initReviewState(criteria, task.detailed_results);
  if (task.screener_comments) state.comments = task.screener_comments;
  if (task.checks_completed) {
    Object.entries(task.checks_completed).forEach(([k, v]) => {
      state.checks[k] = !!v;
    });
  }
  if (task.status === 'selected') state.outcome = 'selected';
  if (task.status === 'rejected') {
    state.outcome = 'rejected';
    state.rejectionReason = task.rejection_reason || 'other';
    state.rejectionNotes = task.rejection_notes || '';
  }
  return state;
}
