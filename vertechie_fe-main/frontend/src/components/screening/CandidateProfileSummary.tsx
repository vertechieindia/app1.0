import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';
import { ScreeningTask } from '../../services/screeningService';

interface Props {
  task: ScreeningTask;
}

const CandidateProfileSummary: React.FC<Props> = ({ task }) => {
  const profile = task.candidate_profile_data || {};

  return (
    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
      <Typography variant="subtitle2" gutterBottom>Candidate profile</Typography>
      <Typography variant="body2"><strong>Name:</strong> {task.candidate_name || '—'}</Typography>
      <Typography variant="body2"><strong>Email:</strong> {task.candidate_email || '—'}</Typography>
      {task.candidate_phone && (
        <Typography variant="body2"><strong>Phone:</strong> {task.candidate_phone}</Typography>
      )}
      {task.candidate_source && (
        <Typography variant="body2"><strong>Source:</strong> {task.candidate_source}</Typography>
      )}
      {task.candidate_resume_url && (
        <Typography variant="body2">
          <strong>Resume:</strong>{' '}
          <Link href={task.candidate_resume_url} target="_blank" rel="noopener noreferrer">
            View resume
          </Link>
        </Typography>
      )}
      {task.candidate_linkedin_url && (
        <Typography variant="body2">
          <strong>LinkedIn:</strong>{' '}
          <Link href={task.candidate_linkedin_url} target="_blank" rel="noopener noreferrer">
            View profile
          </Link>
        </Typography>
      )}
      {Object.keys(profile).length > 0 && (
        <Box sx={{ mt: 1 }}>
          {Object.entries(profile).slice(0, 8).map(([k, v]) => (
            <Typography key={k} variant="caption" display="block" color="text.secondary">
              {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </Typography>
          ))}
        </Box>
      )}
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
};

export default CandidateProfileSummary;
