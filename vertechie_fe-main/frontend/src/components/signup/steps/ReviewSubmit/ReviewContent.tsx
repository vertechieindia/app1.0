import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, CircularProgress, Alert, Paper, Button, Grid, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import BusinessIcon from '@mui/icons-material/Business';
import { SignupLocation } from '../../types';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { formatDateToMMDDYYYY, formatDateToDDMMYYYY } from '../../utils/formatters';

interface ReviewContentProps {
  formData: any;
  location: SignupLocation;
  goToStep?: (stepId: string) => void;
  updateFormData?: (updates: any) => void;
}

const ReviewContent: React.FC<ReviewContentProps> = ({ formData, location, goToStep, updateFormData }) => {
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [companyError, setCompanyError] = useState<string>('');
  const [schoolDetails, setSchoolDetails] = useState<any>(null);
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [schoolError, setSchoolError] = useState<string>('');

  // Get role from formData - check multiple sources
  const role = formData.role || 
               formData.type || 
               (formData.tokenResponse as any)?.user_data?.role ||
               (formData.registrationResponse as any)?.user?.role ||
               '';
  const isHR = role === 'hr' || role === 'hiring_manager' || role === 'HR' || role === 'HIRING_MANAGER';
  const isTechie = role === 'techie' || role === 'Techie' || role === 'TECHIE';
  const isCompany = role === 'company' || role === 'Company' || role === 'COMPANY';
  const isSchool = role === 'school' || role === 'School' || role === 'SCHOOL';

  // Get user data from token response, registration response, or formData
  const tokenUserData = formData.tokenResponse?.user_data || formData.user_data || formData.tokenUser || {};
  const registerUserData = formData.registrationResponse?.user || formData.registrationResponse?.user_data || formData.registeredUser || formData.registeredUserData || {};
  
  // Merge user data from both sources (token response takes priority)
  const userData = { ...registerUserData, ...tokenUserData };
  
  // Extract DOB, address, country from token response, registration response, or formData
  const dob = userData.dob || formData.dateOfBirth || formData.dob || registerUserData.dob || '';
  const address = userData.address || formData.fullAddress || formData.address || registerUserData.address || '';
  const country = userData.country || formData.country || registerUserData.country || (location === 'US' ? 'USA' : 'India');

  // Format DOB based on location
  const formattedDOB = dob 
    ? (location === 'US' ? formatDateToMMDDYYYY(dob) : formatDateToDDMMYYYY(dob))
    : 'Not provided';

  // Fetch company details for HR and Company - only once when component mounts or userId changes
  useEffect(() => {
    // Only fetch if HR or Company, has userId, and we haven't loaded company details yet
    if ((isHR || isCompany) && (formData.userId || formData.user_id) && !companyDetails && !loadingCompany) {
      setLoadingCompany(true);
      const token = 
        localStorage.getItem('authToken') ||
        formData.token ||
        formData.access_token ||
        formData.access ||
        (formData.tokenResponse as any)?.access ||
        (formData.tokenResponse as any)?.access_token ||
        (formData.tokenResponse as any)?.token;

      // Use different endpoint for company signup vs HR signup
      const endpoint = isCompany ? API_ENDPOINTS.COMPANY_SIGNUP : API_ENDPOINTS.COMPANY;
      const apiUrl = getApiUrl(endpoint);
      
      // GET company details - use id from token response as query parameter
      const userId = formData.userId || formData.user_id;
      // Use 'id' query parameter instead of 'user' - id comes from token response
      const getUrl = userId ? `${apiUrl}?id=${userId}` : apiUrl;
      
      axios.get(getUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
        .then((response) => {
          console.log('Company details fetched:', response.data);
          // Handle both single object and array response
          let companyData = null;
          if (Array.isArray(response.data) && response.data.length > 0) {
            companyData = response.data[0];
          } else if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
            companyData = response.data;
          }
          
          if (companyData) {
            setCompanyDetails(companyData);
            setLoadingCompany(false); // Clear loading state when data is found
            // Store company ID in formData for edit functionality (only if not already set)
            const companyId = companyData.id || companyData.company_id;
            if (companyId && updateFormData && !formData.companyId && !formData.company_id) {
              updateFormData({
                companyId: companyId,
                company_id: companyId,
              });
            }
          } else {
            // No company data found - set loading to false
            setLoadingCompany(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching company details:', error);
          setCompanyError('Failed to load company details');
          setLoadingCompany(false);
        });
    } else if ((!isHR && !isCompany) || !(formData.userId || formData.user_id)) {
      // Not HR/Company or no userId - ensure loading is false
      setLoadingCompany(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHR, isCompany, formData.userId, formData.user_id]);

  // Fetch school details for School - only once when component mounts or userId changes
  useEffect(() => {
    // Only fetch if School, has userId, and we haven't loaded school details yet
    if (isSchool && (formData.userId || formData.user_id) && !schoolDetails && !loadingSchool) {
      setLoadingSchool(true);
      const token = 
        localStorage.getItem('authToken') ||
        formData.token ||
        formData.access_token ||
        formData.access ||
        (formData.tokenResponse as any)?.access ||
        (formData.tokenResponse as any)?.access_token ||
        (formData.tokenResponse as any)?.token;

      const apiUrl = getApiUrl(API_ENDPOINTS.SCHOOL_SIGNUP);
      
      // GET school details - use id from token response as query parameter
      const userId = formData.userId || formData.user_id;
      // Use 'id' query parameter instead of 'user' - id comes from token response
      const getUrl = userId ? `${apiUrl}?id=${userId}` : apiUrl;
      
      axios.get(getUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
        .then((response) => {
          console.log('School details fetched:', response.data);
          // Handle both single object and array response
          let schoolData = null;
          if (Array.isArray(response.data) && response.data.length > 0) {
            schoolData = response.data[0];
          } else if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
            schoolData = response.data;
          }
          
          if (schoolData) {
            setSchoolDetails(schoolData);
            setLoadingSchool(false);
            // Store school ID in formData for edit functionality (only if not already set)
            const schoolId = schoolData.id || schoolData.school_id;
            if (schoolId && updateFormData && !formData.schoolId && !formData.school_id) {
              updateFormData({
                schoolId: schoolId,
                school_id: schoolId,
              });
            }
          } else {
            // No school data found - set loading to false
            setLoadingSchool(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching school details:', error);
          setSchoolError('Failed to load school details');
          setLoadingSchool(false);
        });
    } else if (!isSchool || !(formData.userId || formData.user_id)) {
      // Not School or no userId - ensure loading is false
      setLoadingSchool(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSchool, formData.userId, formData.user_id]);

  // Get name, email, phone from multiple sources (formData > token response > registration response)
  const firstName = formData.firstName || userData.first_name || registerUserData.first_name || '';
  const lastName = formData.lastName || userData.last_name || registerUserData.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const email = formData.email || userData.email || registerUserData.email || registerUserData.email || '';
  const phone = formData.phone || userData.mobile_number || userData.phone || registerUserData.mobile_number || registerUserData.phone || '';

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#333' }}>
        Please review your information before submitting:
      </Typography>

      {/* Personal Information Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: '#1976d2', fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2' }}>
              Personal Information
            </Typography>
          </Box>
          {goToStep && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => goToStep('personal-information')}
              sx={{ textTransform: 'none' }}
            >
              Edit
            </Button>
          )}
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Full Name</Typography>
            <Typography variant="body1" fontWeight={600}>{fullName || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Email</Typography>
            <Typography variant="body1" fontWeight={600}>{email || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Phone</Typography>
            <Typography variant="body1" fontWeight={600}>{phone || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Date of Birth</Typography>
            <Typography variant="body1" fontWeight={600}>{formattedDOB}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Address</Typography>
            <Typography variant="body1" fontWeight={600}>{address || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Country</Typography>
            <Chip label={country} color="primary" size="small" />
          </Grid>
        </Grid>
      </Paper>

      {/* Work Experience Section - Only for Techie */}
      {isTechie && !isHR && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon sx={{ color: '#1976d2', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2' }}>
                Work Experience ({formData.experience?.length || 0})
              </Typography>
            </Box>
            {goToStep && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => goToStep('work-experience')}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            )}
          </Box>
          {formData.experience && formData.experience.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {formData.experience.map((exp: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                    {exp.position || 'Job Title'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {exp.companyName || exp.company || 'Company Name'}
                  </Typography>
                  {exp.website && (
                    <Typography variant="body2" sx={{ color: '#1976d2', mb: 0.5 }}>
                      {exp.website}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {' '}
                    {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              No work experience added
            </Typography>
          )}
        </Paper>
      )}

      {/* Education Section - Only for Techie */}
      {isTechie && !isHR && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ color: '#1976d2', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2' }}>
                Education ({formData.education?.length || 0})
              </Typography>
            </Box>
            {goToStep && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => goToStep('education')}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            )}
          </Box>
          {formData.education && formData.education.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {formData.education.map((edu: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                    {edu.institution || 'Institution Name'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {edu.levelOfEducation || 'Level of Education'}
                  </Typography>
                  {edu.fieldOfStudy && (
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                      {edu.fieldOfStudy}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - {' '}
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              No education added
            </Typography>
          )}
        </Paper>
      )}

      {/* Company Details Section - For HR and Company */}
      {(isHR || isCompany) && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon sx={{ color: isCompany ? '#ed6c02' : '#1976d2', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: isCompany ? '#ed6c02' : '#1976d2' }}>
                Company Details
              </Typography>
            </Box>
            {goToStep && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => goToStep('company-details')}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            )}
          </Box>
          {loadingCompany ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Loading company details...</Typography>
            </Box>
          ) : companyError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              {companyError}
            </Alert>
          ) : companyDetails ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Company Name</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {companyDetails.company_name || companyDetails.companyName || 'Not provided'}
                </Typography>
              </Grid>
              {isCompany ? (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Company Website</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {companyDetails.company_website || companyDetails.companyWebsite || companyDetails.comapny_website || 'Not provided'}
                    </Typography>
                  </Grid>
                  {location === 'IN' ? (
                    // India company signup fields
                    <>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>CIN</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails?.cin || 
                           companyDetails?.company_identification_number ||
                           formData?.cin || 
                           formData?.companyDetails?.cin || 
                           'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Established Year</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails?.established_year || 
                           companyDetails?.establishedYear || 
                           formData?.establishedYear || 
                           formData?.companyDetails?.establishedYear || 
                           'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Registration State</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails?.reg_state || 
                           companyDetails?.regState || 
                           formData?.regState || 
                           formData?.companyDetails?.regState || 
                           'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Company Address</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails?.company_address || 
                           companyDetails?.companyAddress || 
                           formData?.companyAddress || 
                           formData?.companyDetails?.companyAddress || 
                           'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>About</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails?.about || 
                           formData?.about || 
                           formData?.companyDetails?.about || 
                           'Not provided'}
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    // US company signup fields
                    <>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>EIN</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails.ein || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Everify Account Number</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails.account_number || companyDetails.accountNumber || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Registration State</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails.reg_state || companyDetails.regState || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Started Date</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails.started_date 
                            ? (() => {
                                const dateMatch = companyDetails.started_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                                if (dateMatch) {
                                  const [, year, month, day] = dateMatch;
                                  return `${month}-${day}-${year}`;
                                }
                                return companyDetails.started_date;
                              })()
                            : (companyDetails.startedDate 
                                ? (() => {
                                    const dateMatch = companyDetails.startedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                                    if (dateMatch) {
                                      const [, year, month, day] = dateMatch;
                                      return `${month}-${day}-${year}`;
                                    }
                                    return companyDetails.startedDate;
                                  })()
                                : 'Not provided')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>About</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {companyDetails.about || 'Not provided'}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Company Email</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {companyDetails.company_email || companyDetails.companyEmail || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Company Website</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {companyDetails.company_website || companyDetails.companyWebsite || companyDetails.compnay_website || 'Not provided'}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              No company details found. Please save company details first.
            </Typography>
          )}
        </Paper>
      )}

      {/* School Details Section - For School */}
      {isSchool && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ color: location === 'US' ? '#1976d2' : '#004D40', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700} sx={{ color: location === 'US' ? '#1976d2' : '#004D40' }}>
                School Details
              </Typography>
            </Box>
            {goToStep && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => goToStep('school-details')}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            )}
          </Box>
          {loadingSchool ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2">Loading school details...</Typography>
            </Box>
          ) : schoolError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              {schoolError}
            </Alert>
          ) : schoolDetails || formData.schoolDetails || formData.schoolName ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>School Name</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {schoolDetails?.school_name || 
                   schoolDetails?.schoolName || 
                   formData.schoolName || 
                   formData.schoolDetails?.schoolName || 
                   'Not provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Established Year</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(() => {
                    // Extract year from est_year (YYYY-MM-DD format) or use established_year
                    const estYear = schoolDetails?.est_year || schoolDetails?.established_year || 
                                   formData.establishedYear || formData.schoolDetails?.establishedYear || '';
                    if (estYear && estYear.includes('-')) {
                      // If it's in YYYY-MM-DD format, extract year
                      return estYear.split('-')[0];
                    }
                    return estYear || 'Not provided';
                  })()}
                </Typography>
              </Grid>
              {location === 'IN' ? (
                // India: Show Address
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Address</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {schoolDetails?.address || 
                     formData.address || 
                     formData.schoolDetails?.address || 
                     'Not provided'}
                  </Typography>
                </Grid>
              ) : (
                // US: Show Started Date
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Date Company Started</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {(() => {
                      const startedDate = schoolDetails?.started_date || 
                                         schoolDetails?.startedDate || 
                                         formData.startedDate || 
                                         formData.schoolDetails?.startedDate || '';
                      if (startedDate) {
                        // Convert YYYY-MM-DD to MM-DD-YYYY for display
                        const dateMatch = startedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                        if (dateMatch) {
                          const [, year, month, day] = dateMatch;
                          return `${month}-${day}-${year}`;
                        }
                        return startedDate;
                      }
                      return 'Not provided';
                    })()}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>About School</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {schoolDetails?.about || 
                   formData?.about || 
                   formData.schoolDetails?.about || 
                   'Not provided'}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              No school details found. Please save school details first.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ReviewContent;

