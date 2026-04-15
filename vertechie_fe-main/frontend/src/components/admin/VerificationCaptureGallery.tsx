import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { CameraAlt, Badge } from '@mui/icons-material';

const DOC_LABELS: Record<string, string> = {
  pan_card: 'PAN card',
  aadhaar: 'Aadhaar',
  government_id: 'Government ID',
  ssn_document: 'SSN document',
  nino_document: 'NINO',
  sin_document: 'SIN document',
  social_insurance_de: 'Social insurance (DE)',
  ahv_document: 'AHV / AVS',
  resident_id: 'Resident ID',
  passport: 'Passport',
};

function safeSrc(s: string): string {
  if (!s || typeof s !== 'string') return '';
  const t = s.trim();
  if (t.startsWith('data:')) return t;
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  return `data:image/jpeg;base64,${t}`;
}

export interface VerificationCaptureGalleryProps {
  faceVerification?: string[] | null;
  documentVerification?: Record<string, string> | null;
}

/**
 * Renders face liveness captures and ID document images for admin review.
 * Data is cleared server-side after profile approval.
 */
const VerificationCaptureGallery: React.FC<VerificationCaptureGalleryProps> = ({
  faceVerification,
  documentVerification,
}) => {
  const faces = Array.isArray(faceVerification)
    ? faceVerification.filter((x) => typeof x === 'string' && x.trim().length > 0)
    : [];
  const docs = documentVerification && typeof documentVerification === 'object'
    ? Object.entries(documentVerification).filter(([, v]) => typeof v === 'string' && v.trim().length > 0)
    : [];

  if (faces.length === 0 && docs.length === 0) return null;

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
        >
          <CameraAlt sx={{ fontSize: 18 }} /> Identity captures (review only)
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          Removed from storage after the profile is approved.
        </Typography>

        {faces.length > 0 && (
          <Box sx={{ mb: docs.length ? 2 : 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Face / liveness
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
              {faces.map((src, i) => (
                <Box key={`face-${i}`}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                    Liveness {i + 1} of {faces.length}
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{ p: 0.5, borderRadius: 2, overflow: 'hidden', maxWidth: 280 }}
                  >
                    <img
                      src={safeSrc(src)}
                      alt={`Liveness capture ${i + 1} of ${faces.length}`}
                      style={{ maxWidth: '100%', maxHeight: 200, display: 'block', objectFit: 'contain' }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {docs.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Badge sx={{ fontSize: 16 }} /> Documents
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 0.5 }}>
              {docs.map(([key, src]) => (
                <Box key={key}>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                    {DOC_LABELS[key] || key.replace(/_/g, ' ')}
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2, overflow: 'hidden', maxWidth: 320 }}>
                    <img
                      src={safeSrc(src)}
                      alt={key}
                      style={{ maxWidth: '100%', maxHeight: 220, display: 'block', objectFit: 'contain' }}
                    />
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default VerificationCaptureGallery;
