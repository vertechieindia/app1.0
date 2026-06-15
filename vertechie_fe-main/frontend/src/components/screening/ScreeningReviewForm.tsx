import React from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem,
  FormGroup, FormControlLabel, Checkbox, Grid,
} from '@mui/material';
import { ScreeningCriteria } from '../../services/screeningService';
import ScreeningCriteriaPanel from './ScreeningCriteriaPanel';
import CandidateProfileSummary from './CandidateProfileSummary';
import { ScreeningTask } from '../../services/screeningService';
import { ScreeningReviewState, PROFICIENCY_LEVELS, checksFromCriteria } from './screeningReviewUtils';

const REJECTION_REASONS = [
  { value: 'work_authorization_mismatch', label: 'Work Authorization Mismatch' },
  { value: 'location_mismatch', label: 'Location Mismatch' },
  { value: 'skill_mismatch', label: 'Skill Mismatch' },
  { value: 'other', label: 'Other' },
];

interface Props {
  task: ScreeningTask;
  criteria?: ScreeningCriteria;
  state: ScreeningReviewState;
  onChange: (patch: Partial<ScreeningReviewState>) => void;
  commentsLabel?: string;
  selectedLabel?: string;
  readOnly?: boolean;
}

const ScreeningReviewForm: React.FC<Props> = ({
  task,
  criteria,
  state,
  onChange,
  commentsLabel = 'Screener comments (visible to HM)',
  selectedLabel = 'Selected → HM pipeline',
  readOnly = false,
}) => {
  const activeChecks = checksFromCriteria(criteria);
  const showLocation = activeChecks.includes('location');
  const showVisa = activeChecks.includes('visa');
  const showTech = activeChecks.includes('tech');
  const mandatorySkills = criteria?.tech_mandatory || [];
  const optionalSkills = criteria?.tech_optional || [];

  const setCheck = (key: string, value: boolean) => {
    onChange({ checks: { ...state.checks, [key]: value } });
  };

  const setMandatory = (skill: string, level: string) => {
    onChange({ mandatoryProficiency: { ...state.mandatoryProficiency, [skill]: level } });
  };

  const setOptional = (skill: string, level: string) => {
    onChange({ optionalProficiency: { ...state.optionalProficiency, [skill]: level } });
  };

  return (
    <>
      {task.jd_text && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Job requirements</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{task.jd_text}</Typography>
        </Box>
      )}
      <ScreeningCriteriaPanel criteria={criteria} />
      <CandidateProfileSummary task={task} />

      <Typography variant="subtitle2" sx={{ mb: 1 }}>Verification</Typography>
      <FormGroup sx={{ mb: 2 }}>
        {activeChecks.map((c) => (
          <FormControlLabel
            key={c}
            control={
              <Checkbox
                checked={!!state.checks[c]}
                onChange={(e) => setCheck(c, e.target.checked)}
                disabled={readOnly}
              />
            }
            label={`${c.charAt(0).toUpperCase()}${c.slice(1)} check completed`}
          />
        ))}
      </FormGroup>

      {showVisa && (
        <TextField
          fullWidth
          required={showVisa}
          label="Visa type verified"
          margin="dense"
          placeholder={criteria?.visa_notes || 'e.g. H1B, Green Card, US Citizen'}
          value={state.visaType}
          onChange={(e) => onChange({ visaType: e.target.value })}
          InputProps={{ readOnly }}
        />
      )}
      {showLocation && (
        <TextField
          fullWidth
          required={showLocation}
          label="Location verified"
          margin="dense"
          placeholder={criteria?.location_notes || 'e.g. Remote US — confirmed'}
          value={state.locationVerified}
          onChange={(e) => onChange({ locationVerified: e.target.value })}
          InputProps={{ readOnly }}
        />
      )}

      {showTech && mandatorySkills.length > 0 && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Mandatory skills — proficiency</Typography>
          <Grid container spacing={1}>
            {mandatorySkills.map((skill) => (
              <Grid item xs={12} sm={6} key={skill}>
                <FormControl fullWidth size="small" margin="dense">
                  <InputLabel>{skill} *</InputLabel>
                  <Select
                    label={`${skill} *`}
                    value={state.mandatoryProficiency[skill] || ''}
                    onChange={(e) => setMandatory(skill, e.target.value)}
                    disabled={readOnly}
                  >
                    <MenuItem value=""><em>Select proficiency</em></MenuItem>
                    {PROFICIENCY_LEVELS.map((l) => (
                      <MenuItem key={l} value={l}>{l}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {showTech && optionalSkills.length > 0 && (
        <Box sx={{ mt: 1, mb: 1 }}>
          <Typography variant="subtitle2" gutterBottom>Optional skills — proficiency</Typography>
          <Grid container spacing={1}>
            {optionalSkills.map((skill) => (
              <Grid item xs={12} sm={6} key={skill}>
                <FormControl fullWidth size="small" margin="dense">
                  <InputLabel>{skill}</InputLabel>
                  <Select
                    label={skill}
                    value={state.optionalProficiency[skill] || ''}
                    onChange={(e) => setOptional(skill, e.target.value)}
                    disabled={readOnly}
                  >
                    <MenuItem value=""><em>Not assessed</em></MenuItem>
                    {PROFICIENCY_LEVELS.map((l) => (
                      <MenuItem key={l} value={l}>{l}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <TextField
        fullWidth
        multiline
        rows={3}
        label={commentsLabel}
        margin="dense"
        value={state.comments}
        onChange={(e) => onChange({ comments: e.target.value })}
        InputProps={{ readOnly }}
      />
      {!readOnly && (
        <>
          <FormControl fullWidth margin="dense">
            <InputLabel>Decision</InputLabel>
            <Select
              label="Decision"
              value={state.outcome}
              onChange={(e) => onChange({ outcome: e.target.value as 'selected' | 'rejected' })}
            >
              <MenuItem value="selected">{selectedLabel}</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          {state.outcome === 'rejected' && (
            <>
              <FormControl fullWidth margin="dense">
                <InputLabel>Rejection reason</InputLabel>
                <Select
                  label="Rejection reason"
                  value={state.rejectionReason}
                  onChange={(e) => onChange({ rejectionReason: e.target.value })}
                >
                  {REJECTION_REASONS.map((r) => (
                    <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Rejection notes"
                margin="dense"
                value={state.rejectionNotes}
                onChange={(e) => onChange({ rejectionNotes: e.target.value })}
              />
            </>
          )}
        </>
      )}
      {readOnly && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Decision:</strong> {state.outcome === 'selected' ? selectedLabel : 'Rejected'}
        </Typography>
      )}
    </>
  );
};

export default ScreeningReviewForm;
