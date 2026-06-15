import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { ScreeningCriteria } from '../../services/screeningService';
import { checksFromCriteria } from './screeningReviewUtils';

interface Props {
  criteria?: ScreeningCriteria;
  compact?: boolean;
}

const ScreeningCriteriaPanel: React.FC<Props> = ({ criteria, compact }) => {
  if (!criteria) return null;

  const activeChecks = checksFromCriteria(criteria);
  const showLocation = activeChecks.includes('location');
  const showVisa = activeChecks.includes('visa');
  const showTech = activeChecks.includes('tech');

  return (
    <Box sx={{ mt: compact ? 0.5 : 1 }}>
      <Typography variant={compact ? 'caption' : 'subtitle2'} color="text.secondary" gutterBottom>
        Screening checks required
      </Typography>
      <Box sx={{ mb: 1 }}>
        {activeChecks.map((ch) => (
          <Chip key={ch} size="small" label={ch} color="primary" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
        ))}
      </Box>

      {showLocation && criteria.location_notes && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Location requirements:</strong> {criteria.location_notes}
        </Typography>
      )}
      {showVisa && criteria.visa_notes && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Visa / work authorization:</strong> {criteria.visa_notes}
        </Typography>
      )}

      {showTech && (
        <>
          {criteria.tech_mandatory?.length ? (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Mandatory skills:</strong> {criteria.tech_mandatory.join(', ')}
            </Typography>
          ) : null}
          {criteria.tech_optional?.length ? (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Optional skills:</strong> {criteria.tech_optional.join(', ')}
            </Typography>
          ) : null}
        </>
      )}

      {!compact && (showLocation || showVisa || showTech) && <Divider sx={{ my: 1.5 }} />}
    </Box>
  );
};

export default ScreeningCriteriaPanel;
