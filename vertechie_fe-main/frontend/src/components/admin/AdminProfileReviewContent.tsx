/**
 * Same structured profile view as Techie Admin → Review profile (Settings).
 * Used by BDM submitter view (read-only) and can be reused elsewhere.
 */
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import {
  People,
  Business,
  School,
  VerifiedUser,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

export interface AdminProfileReviewContentProps {
  /** Response from GET /users/{id}/full-profile */
  profile: Record<string, any> | null;
}

const AdminProfileReviewContent: React.FC<AdminProfileReviewContentProps> = ({ profile }) => {
  if (!profile) return null;

  const reviewData = profile;
  const rolesLower = Array.isArray(reviewData.roles)
    ? reviewData.roles.map((r: string) => String(r).toLowerCase())
    : [];
  const showWorkAndEducation = rolesLower.includes('techie');

  return (
    <>
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
        >
          <People sx={{ fontSize: 18 }} /> Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Full Name
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e40af' }}>
              {[reviewData.first_name, reviewData.middle_name, reviewData.last_name].filter(Boolean).join(' ') || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.email || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e40af' }}>
              {reviewData.mobile_number || reviewData.phone || '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.dob || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Country
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.country || '—'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.address || '—'}</Typography>
          </Grid>
          {String(reviewData.country || '').toLowerCase() === 'india' ? (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                PAN (Last 4)
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e40af' }}>
                {reviewData.gov_id_last_four || reviewData.gov_id || '—'}
              </Typography>
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary">
                Government ID (Last 4)
              </Typography>
              <Typography variant="body2" sx={{ color: '#1e40af' }}>
                {reviewData.gov_id_last_four || reviewData.gov_id || '—'}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">
              VerTechie ID
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#15803d' }}>{reviewData.vertechie_id || '—'}</Typography>
          </Grid>
        </Grid>
      </Box>

      {reviewData.profile && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
            >
              <People sx={{ fontSize: 18 }} /> Profile
            </Typography>
            <Grid container spacing={2}>
              {reviewData.profile.headline != null && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Headline
                  </Typography>
                  <Typography variant="body2">{reviewData.profile.headline || '—'}</Typography>
                </Grid>
              )}
              {reviewData.profile.bio != null && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Bio
                  </Typography>
                  <Typography variant="body2">{reviewData.profile.bio || '—'}</Typography>
                </Grid>
              )}
              {reviewData.profile.location != null && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">{reviewData.profile.location || '—'}</Typography>
                </Grid>
              )}
              {reviewData.profile.skills?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {reviewData.profile.skills.map((s: string, i: number) => (
                      <Chip key={i} size="small" label={s} />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </>
      )}

      {reviewData.organization && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
            >
              <Business sx={{ fontSize: 18 }} /> Organization Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.type || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.role || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Organization Name
                </Typography>
                <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.name || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Organization Email
                </Typography>
                <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.email || '—'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Website
                </Typography>
                <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.website || '—'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  About
                </Typography>
                <Typography variant="body2" sx={{ color: '#1e40af' }}>{reviewData.organization.description || '—'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Chip
                  size="small"
                  label={reviewData.organization.verified ? 'Organization verified' : 'Organization not verified'}
                  icon={
                    reviewData.organization.verified ? (
                      <CheckCircle sx={{ fontSize: 14, color: '#16a34a' }} />
                    ) : (
                      <Cancel sx={{ fontSize: 14, color: '#d97706' }} />
                    )
                  }
                  sx={{
                    bgcolor: reviewData.organization.verified ? '#f0fdf4' : '#fffbeb',
                    color: reviewData.organization.verified ? '#16a34a' : '#d97706',
                    fontWeight: 600,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {showWorkAndEducation && (
        <>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
        >
          <Business sx={{ fontSize: 18 }} /> Work Experience ({reviewData.experiences?.length || 0})
        </Typography>
        {reviewData.experiences?.length > 0 ? (
          reviewData.experiences.map((exp: any, idx: number) => (
            <Paper
              key={exp.id || idx}
              sx={{ p: 1.5, mb: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {exp.title || 'Position'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {exp.company_name || exp.client_name || 'Company'} | {exp.start_date || 'N/A'} -{' '}
                  {exp.is_current ? 'Present' : exp.end_date || 'N/A'}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {exp.description}
                  </Typography>
                )}
                {(exp.manager_name || exp.manager_email || exp.manager_phone || exp.manager_linkedin) && (
                  <Box sx={{ mt: 1 }}>
                    {exp.manager_name && (
                      <Typography variant="body2">
                        <strong>Manager:</strong> {exp.manager_name}
                      </Typography>
                    )}
                    {exp.manager_email && (
                      <Typography variant="body2">
                        <strong>Manager Email:</strong> {exp.manager_email}
                      </Typography>
                    )}
                    {exp.manager_phone && (
                      <Typography variant="body2">
                        <strong>Manager Phone:</strong> {exp.manager_phone}
                      </Typography>
                    )}
                    {exp.manager_linkedin && (
                      <Typography variant="body2">
                        <strong>Manager LinkedIn:</strong> {exp.manager_linkedin}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
              <Chip
                size="small"
                label={exp.is_verified ? 'Verified' : 'Pending'}
                icon={exp.is_verified ? <CheckCircle sx={{ fontSize: 14, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 14, color: '#d97706' }} />}
                sx={{
                  bgcolor: exp.is_verified ? '#f0fdf4' : '#fffbeb',
                  color: exp.is_verified ? '#16a34a' : '#d97706',
                  fontWeight: 600,
                }}
              />
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No work experience added
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
        >
          <School sx={{ fontSize: 18 }} /> Education ({reviewData.educations?.length || 0})
        </Typography>
        {reviewData.educations?.length > 0 ? (
          reviewData.educations.map((edu: any, idx: number) => (
            <Paper
              key={edu.id || idx}
              sx={{ p: 1.5, mb: 1.5, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {edu.school_name || 'Institution'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {[edu.degree, edu.field_of_study].filter(Boolean).join(' · ')}
                  {edu.start_year || edu.end_year ? ` · ${edu.start_year || '—'} - ${edu.end_year || '—'}` : ''}
                </Typography>
                {(edu.grade || edu.score_value) && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {edu.score_type ? `${edu.score_type}: ` : ''}
                    {edu.grade || edu.score_value}
                  </Typography>
                )}
              </Box>
              <Chip
                size="small"
                label={edu.is_verified ? 'Verified' : 'Pending'}
                icon={edu.is_verified ? <CheckCircle sx={{ fontSize: 14, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 14, color: '#d97706' }} />}
                sx={{
                  bgcolor: edu.is_verified ? '#f0fdf4' : '#fffbeb',
                  color: edu.is_verified ? '#16a34a' : '#d97706',
                  fontWeight: 600,
                }}
              />
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No education added
          </Typography>
        )}
      </Box>
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}
        >
          <VerifiedUser sx={{ fontSize: 18 }} /> Verification Status
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            size="small"
            label={reviewData.email_verified ? 'Email Verified' : 'Email Not Verified'}
            icon={
              reviewData.email_verified ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />
            }
            sx={{
              bgcolor: reviewData.email_verified ? '#f0fdf4' : '#fef2f2',
              color: reviewData.email_verified ? '#16a34a' : '#dc2626',
              fontWeight: 600,
            }}
          />
          <Chip
            size="small"
            label={reviewData.mobile_verified ? 'Mobile Verified' : 'Mobile Not Verified'}
            icon={
              reviewData.mobile_verified ? <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} /> : <Cancel sx={{ fontSize: 16, color: '#dc2626' }} />
            }
            sx={{
              bgcolor: reviewData.mobile_verified ? '#f0fdf4' : '#fef2f2',
              color: reviewData.mobile_verified ? '#16a34a' : '#dc2626',
              fontWeight: 600,
            }}
          />
          <Chip
            size="small"
            label={
              Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? 'Face Verified' : 'Face Not Verified'
            }
            icon={
              Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? (
                <CheckCircle sx={{ fontSize: 16, color: '#16a34a' }} />
              ) : (
                <Cancel sx={{ fontSize: 16, color: '#9ca3af' }} />
              )
            }
            sx={{
              bgcolor:
                Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? '#f0fdf4' : '#fef2f2',
              color:
                Array.isArray(reviewData.face_verification) && reviewData.face_verification.length > 0 ? '#16a34a' : '#dc2626',
              fontWeight: 600,
            }}
          />
          <Chip
            size="small"
            label={`Status: ${
              (reviewData.verification_status || '').toLowerCase() === 'approved'
                ? 'ACCEPTED'
                : (reviewData.verification_status || 'PENDING').toUpperCase()
            }`}
            sx={{
              bgcolor:
                (reviewData.verification_status || '').toLowerCase() === 'approved'
                  ? '#f0fdf4'
                  : (reviewData.verification_status || '').toLowerCase() === 'rejected'
                    ? '#fef2f2'
                    : '#fffbeb',
              color:
                (reviewData.verification_status || '').toLowerCase() === 'approved'
                  ? '#16a34a'
                  : (reviewData.verification_status || '').toLowerCase() === 'rejected'
                    ? '#dc2626'
                    : '#d97706',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {reviewData.institution_invite_requests?.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 1.5 }}>
              Institution invite requests
            </Typography>
            {reviewData.institution_invite_requests.map((inv: any, i: number) => (
              <Typography key={inv.id || i} variant="body2" color="text.secondary">
                {inv.institution_name} — {inv.status}
              </Typography>
            ))}
          </Box>
        </>
      )}
    </>
  );
};

export default AdminProfileReviewContent;
