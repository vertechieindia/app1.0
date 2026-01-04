import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { StepComponentProps } from '../../types';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import { useDocumentCapture } from '../../shared/hooks/useDocumentCapture';
import { preloadFaceDetector } from '../../../../utils/faceDetection';

const USDocumentVerification: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  location,
  role,
}) => {
  const [livePhotoCaptured, setLivePhotoCaptured] = useState(
    !!formData.livePhoto
  );
  const [livePhotoSuccess, setLivePhotoSuccess] = useState(false);
  const [govIdCaptured, setGovIdCaptured] = useState(
    !!formData.governmentId && !!formData.firstName && !!formData.lastName && !!formData.dateOfBirth
  );
  const [govIdSuccess, setGovIdSuccess] = useState(false);
  const [govIdFailure, setGovIdFailure] = useState(false);
  const [ssnCaptured, setSSNCaptured] = useState(
    !!formData.ssn && (!!formData.ssn || formData.ssn?.length > 0)
  );
  const [ssnSuccess, setSSNSuccess] = useState(false);
  const [ssnFailure, setSSNFailure] = useState(false);
  
  // HR colors: US = attractive blue (#1976d2), Techie = blue (#0077B5)
  const primaryColor = role === 'hr' ? '#1976d2' : '#1976d2';
  const successColor = role === 'hr' ? '#1976d2' : '#4caf50';

  // Pre-load face detection model when component mounts
  // This eliminates the 5-8 second delay when user opens the liveness camera
  useEffect(() => {
    preloadFaceDetector().catch((err) => {
      console.warn('Face detector pre-load failed, will retry on first use:', err);
    });
  }, []);

  // Live Photo Hook
  const livePhotoHook = useDocumentCapture({
    cameraType: 'live',
    onCaptureComplete: (data) => {
      updateFormData({ livePhoto: data });
      // Only mark as captured when liveness_ok=true (handled in hook)
      setLivePhotoCaptured(true);
      setLivePhotoSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => {
        setLivePhotoSuccess(false);
      }, 3000);
    },
  });

  // Government ID Hook
  const govIdHook = useDocumentCapture({
    cameraType: 'govId',
    country: location || 'US',
    onCaptureComplete: (data) => {
      console.log('📸 [USDocumentVerification] Government ID image captured:', {
        hasData: !!data,
        dataLength: data ? data.length : 0,
        dataPreview: data ? `${data.substring(0, 50)}...` : 'No data'
      });
      updateFormData({ governmentId: data });
      console.log('💾 [USDocumentVerification] Government ID image saved to formData');
      // Don't set govIdCaptured here - wait for onDataExtracted to validate required fields
    },
    onDataExtracted: (extractedData) => {
      // Store extracted firstName, lastName, dateOfBirth in formData
      // Prefer extracted values over existing values
      console.log('📥 [USDocumentVerification] Received extracted ID data from backend:', {
        firstName: extractedData.firstName,
        lastName: extractedData.lastName,
        dateOfBirth: extractedData.dateOfBirth,
        address: extractedData.address,
        fullData: extractedData
      });
      
      const updates: any = {};

      if (extractedData.firstName) {
        updates.firstName = extractedData.firstName;
        console.log('✅ [USDocumentVerification] First Name extracted:', extractedData.firstName);
      }
      if (extractedData.lastName) {
        updates.lastName = extractedData.lastName;
        console.log('✅ [USDocumentVerification] Last Name extracted:', extractedData.lastName);
      }
      if (extractedData.dateOfBirth) {
        // Convert date to YYYY-MM-DD format for internal storage
        let dob = extractedData.dateOfBirth.trim();
        console.log('📅 [USDocumentVerification] Processing Date of Birth:', dob);
        
        // If already in YYYY-MM-DD format, use as is
        if (!dob.includes('/') && dob.includes('-') && dob.length === 10) {
          const parts = dob.split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            if (year.length === 4 && month.length === 2 && day.length === 2) {
              updates.dateOfBirth = `${year}-${month}-${day}`;
              console.log('✅ [USDocumentVerification] Date of Birth formatted (YYYY-MM-DD):', updates.dateOfBirth);
            } else {
              updates.dateOfBirth = dob; // Keep original if format is unclear
              console.log('⚠️ [USDocumentVerification] Date of Birth format unclear, keeping original:', dob);
            }
          } else {
            updates.dateOfBirth = dob; // Keep original if format is unclear
            console.log('⚠️ [USDocumentVerification] Date of Birth format unclear, keeping original:', dob);
          }
        } else if (dob.includes('/')) {
          // Convert from MM/DD/YYYY or DD/MM/YYYY to YYYY-MM-DD
          const parts = dob.split('/');
          if (parts.length === 3) {
            const [part1, part2, part3] = parts;
            // Check if it's MM/YYYY/DD format (wrong format) and fix it
            if (part1.length === 2 && part2.length === 4 && part3.length === 2) {
              const month = parseInt(part1, 10);
              const day = parseInt(part3, 10);
              const year = part2;
              if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year.length === 4) {
                updates.dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                console.log('✅ [USDocumentVerification] Date of Birth converted from MM/YYYY/DD to YYYY-MM-DD:', updates.dateOfBirth);
              } else {
                updates.dateOfBirth = dob; // Keep original if invalid
                console.log('⚠️ [USDocumentVerification] Date of Birth invalid, keeping original:', dob);
              }
            }
            // Check if it's MM/DD/YYYY (US format)
            else if (part1.length === 2 && part2.length === 2 && part3.length === 4) {
              const month = parseInt(part1, 10);
              const day = parseInt(part2, 10);
              const year = part3;
              if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year.length === 4) {
                updates.dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                console.log('✅ [USDocumentVerification] Date of Birth converted from MM/DD/YYYY to YYYY-MM-DD:', updates.dateOfBirth);
              } else {
                updates.dateOfBirth = dob; // Keep original if invalid
                console.log('⚠️ [USDocumentVerification] Date of Birth invalid, keeping original:', dob);
              }
            } else {
              updates.dateOfBirth = dob; // Keep original if format is unclear
              console.log('⚠️ [USDocumentVerification] Date of Birth format unclear, keeping original:', dob);
            }
          } else {
            updates.dateOfBirth = dob; // Keep original if format is unclear
            console.log('⚠️ [USDocumentVerification] Date of Birth format unclear, keeping original:', dob);
          }
        } else {
          updates.dateOfBirth = dob; // Keep original if format is unclear
          console.log('⚠️ [USDocumentVerification] Date of Birth format unclear, keeping original:', dob);
        }
      }
      if (extractedData.address) {
        updates.fullAddress = extractedData.address;
        console.log('✅ [USDocumentVerification] Address extracted:', extractedData.address);
      }

      if (Object.keys(updates).length > 0) {
        console.log('💾 [USDocumentVerification] Updating formData with extracted fields:', updates);
        updateFormData(updates);
        console.log('✅ [USDocumentVerification] formData updated successfully');
      } else {
        console.warn('⚠️ [USDocumentVerification] No updates to apply - extracted data is empty');
      }

      // Only mark as captured if all required fields are extracted
      const hasFirstName = !!extractedData.firstName;
      const hasLastName = !!extractedData.lastName;
      const hasDateOfBirth = !!extractedData.dateOfBirth;
      const allFieldsPresent = hasFirstName && hasLastName && hasDateOfBirth;
      
      console.log('🔍 [USDocumentVerification] Field validation:', {
        firstName: { present: hasFirstName, value: extractedData.firstName },
        lastName: { present: hasLastName, value: extractedData.lastName },
        dateOfBirth: { present: hasDateOfBirth, value: extractedData.dateOfBirth },
        allRequiredFieldsPresent: allFieldsPresent
      });

      if (allFieldsPresent) {
        setGovIdCaptured(true);
        setGovIdSuccess(true);
        setGovIdFailure(false);
        console.log('✅ [USDocumentVerification] Government ID captured successfully with all required fields');
        // Hide success message after 3 seconds
        setTimeout(() => {
          setGovIdSuccess(false);
        }, 3000);
      } else {
        const missingFields = [];
        if (!hasFirstName) missingFields.push('First Name');
        if (!hasLastName) missingFields.push('Last Name');
        if (!hasDateOfBirth) missingFields.push('Date of Birth');
        
        setGovIdCaptured(false);
        setGovIdFailure(true);
        setGovIdSuccess(false);
        console.warn('⚠️ [USDocumentVerification] Government ID extraction incomplete - missing required fields:', missingFields);
        // Hide failure message after 5 seconds
        setTimeout(() => {
          setGovIdFailure(false);
        }, 5000);
      }
    },
  });

  // SSN Hook
  const ssnHook = useDocumentCapture({
    cameraType: 'ssn',
    country: location || 'US',
    onCaptureComplete: (data) => {
      updateFormData({ ssn: data });
      // Don't set ssnCaptured here - wait for onDataExtracted to validate SSN number
    },
    onDataExtracted: (extractedData) => {
      console.log('Extracted SSN data:', extractedData);
      const updates: any = {};

      // Store SSN number (last 4 digits)
      if (extractedData.idNumber || extractedData.panNumber) {
        updates.ssn = extractedData.idNumber || extractedData.panNumber;
      }

      if (Object.keys(updates).length > 0) {
        updateFormData(updates);
        console.log('Updated formData with extracted SSN number:', updates);
      }

      // Only mark as captured if SSN number is extracted
      if (extractedData.idNumber || extractedData.panNumber) {
        setSSNCaptured(true);
        setSSNSuccess(true);
        setSSNFailure(false);
        console.log('SSN card captured successfully with ID number');
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSSNSuccess(false);
        }, 3000);
      } else {
        setSSNCaptured(false);
        setSSNFailure(true);
        setSSNSuccess(false);
        console.log('SSN card extraction incomplete - missing ID number');
        // Hide failure message after 5 seconds
        setTimeout(() => {
          setSSNFailure(false);
        }, 5000);
      }
    },
  });

  const handleLivePhotoStart = useCallback(() => {
    livePhotoHook.startCamera();
  }, [livePhotoHook]);

  const handleGovIdStart = useCallback(() => {
    govIdHook.startCamera();
  }, [govIdHook]);

  const handleSSNStart = useCallback(() => {
    ssnHook.startCamera();
  }, [ssnHook]);

  // Optimized: Memoize expensive calculations for UI
  const headPositionText = useMemo(() => {
    if (livePhotoHook.capturedPositions.size >= 4) {
      return '';
    }
    const positionTexts: Record<string, string> = {
      left: 'to the left',
      right: 'to the right',
      up: 'up',
      down: 'down'
    };
    return `Slowly turn your head ${positionTexts[livePhotoHook.headPosition] || 'to the left'}`;
  }, [livePhotoHook.capturedPositions.size, livePhotoHook.headPosition]);

  const verifiedPositionsText = useMemo(() => {
    const size = livePhotoHook.capturedPositions.size;
    if (size > 0 && size < 4) {
      return Array.from(livePhotoHook.capturedPositions).join(', ').toUpperCase();
    }
    return null;
  }, [livePhotoHook.capturedPositions]);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          color: '#333',
          fontSize: { xs: '1.3rem', md: '1.5rem' },
        }}
      >
        Document Verification
      </Typography>

      {/* Verification Cards */}
      <Grid container spacing={3}>
        {/* Live Photo Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 40, color: primaryColor }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#333',
                fontSize: '1.1rem',
              }}
            >
              Liveness Verification
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mb: 3,
                lineHeight: 1.6,
                minHeight: 48,
              }}
            >
              Look at the camera and follow the instructions to move your head
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              onClick={handleLivePhotoStart}
              disabled={livePhotoCaptured}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: 'none',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: '#e3f2fd',
                },
              }}
            >
              {livePhotoCaptured ? 'Liveness Verified ✓' : 'Capture Liveness'}
            </Button>
            {livePhotoCaptured && (
              <CheckCircleIcon sx={{ color: successColor, ml: 1, mt: 1 }} />
            )}
          </Paper>
        </Grid>

        {/* Government ID Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CreditCardIcon sx={{ fontSize: 40, color: '#424242' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#333',
                fontSize: '1.1rem',
              }}
            >
              Government ID
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mb: 3,
                lineHeight: 1.6,
                minHeight: 48,
              }}
            >
              Show your DL, State ID, or US Passport to the camera. System will
              auto-capture when details are clear.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              onClick={handleGovIdStart}
              disabled={govIdCaptured || !livePhotoCaptured}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: 'none',
                px: 3,
                py: 1,
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: '#e3f2fd',
                },
              }}
            >
              {govIdCaptured ? 'ID Captured ✓' : 'Capture ID Document'}
            </Button>
            {govIdCaptured && (
              <CheckCircleIcon sx={{ color: successColor, ml: 1, mt: 1 }} />
            )}
          </Paper>
        </Grid>

        {/* SSN Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 1.5, sm: 2 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 4,
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <SecurityIcon sx={{ fontSize: 40, color: '#FF8C00' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#333',
                fontSize: '1.1rem',
              }}
            >
              SSN Card
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                mb: 3,
                lineHeight: 1.6,
                minHeight: 48,
              }}
            >
              Hide first 5 digits, show last 4 digits clearly
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PhotoCameraIcon />}
              onClick={handleSSNStart}
              disabled={ssnCaptured || !govIdCaptured}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: 'none',
                px: 3,
                py: 1,
                bgcolor: 'white',
                '&:hover': {
                  borderColor: '#1565c0',
                  bgcolor: '#e3f2fd',
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e',
                  bgcolor: 'white',
                },
              }}
            >
              {ssnCaptured ? 'SSN Captured ✓' : 'Capture SSN Card'}
            </Button>
            {ssnCaptured && (
              <CheckCircleIcon sx={{ color: successColor, ml: 1, mt: 1 }} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Error Messages */}
      {(livePhotoHook.errors.camera ||
        livePhotoHook.errors.capture ||
        govIdHook.errors.camera ||
        ssnHook.errors.camera ||
        errors.submit) && (
          <Box sx={{ mt: 2 }}>
            {livePhotoHook.errors.camera && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {livePhotoHook.errors.camera}
              </Alert>
            )}
            {livePhotoHook.errors.capture && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {livePhotoHook.errors.capture}
              </Alert>
            )}
            {govIdHook.errors.camera && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {govIdHook.errors.camera}
              </Alert>
            )}
            {ssnHook.errors.camera && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {ssnHook.errors.camera}
              </Alert>
            )}
            {errors.submit && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {errors.submit}
              </Alert>
            )}
          </Box>
        )}

      {/* Live Photo Camera Dialog */}
      <Dialog
        open={livePhotoHook.showCamera}
        onClose={livePhotoHook.stopCamera}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Liveness Verification
          <IconButton
            onClick={livePhotoHook.stopCamera}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Show error first if it exists - Error message + Again Try button in one line */}
          {livePhotoHook.errors.capture && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 2,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}
            >
              <Typography 
                variant="body2" 
                color="error.main"
                sx={{ 
                  flex: 1,
                  minWidth: { xs: '100%', sm: 'auto' },
                  textAlign: { xs: 'center', sm: 'left' }
                }}
              >
                {livePhotoHook.errors.capture}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={async () => {
                  console.log('🔄 Again Try button clicked - resetting liveness verification');
                  
                  // Clear errors first
                  livePhotoHook.setErrors({});
                  
                  // Reset capture state - this will clear all positions and reset to 'left'
                  // DON'T stop camera - keep stream alive (same as India flow)
                  livePhotoHook.resetCapture();
                  
                  // Wait for reset to complete and state to propagate
                  // This ensures the face detection useEffect sees the reset state
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  // Reattach video stream and play (same approach as India flow)
                  if (livePhotoHook.videoRef.current && livePhotoHook.videoStream) {
                    const video = livePhotoHook.videoRef.current;
                    // Reattach the stream
                    video.srcObject = livePhotoHook.videoStream;
                    // Play the video
                    try {
                      await video.play();
                      console.log('✅ Video restarted successfully after retry');
                      
                      // Wait for video to be fully ready (readyState >= 2 means HAVE_CURRENT_DATA)
                      let retries = 0;
                      while (video.readyState < 2 && retries < 20) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        retries++;
                      }
                      
                      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
                        console.log('✅ Video is ready, face detection should restart automatically');
                        console.log('📋 Current state after reset:', {
                          headPosition: livePhotoHook.headPosition,
                          capturedPositions: livePhotoHook.capturedPositions.size,
                          processing: livePhotoHook.processing,
                          captured: livePhotoHook.captured
                        });
                        
                        // The face detection useEffect should automatically restart
                        // when headPosition and capturedPositions change
                        // No need to manually call startAutoCapture - it will start automatically
                        // But we can call it to ensure video recording starts
                        if (livePhotoHook.videoStream && livePhotoHook.showCamera) {
                          await new Promise(resolve => setTimeout(resolve, 300));
                          livePhotoHook.startAutoCapture();
                        }
                      } else {
                        console.warn('⚠️ Video not ready after retry, will retry auto-capture');
                        // Retry after a bit more time
                        setTimeout(() => {
                          if (livePhotoHook.videoStream && livePhotoHook.showCamera) {
                            livePhotoHook.startAutoCapture();
                          }
                        }, 500);
                      }
                    } catch (err) {
                      console.error('❌ Error playing video after retry:', err);
                      livePhotoHook.setErrors({ capture: 'Failed to restart video. Please try again.' });
                    }
                  } else {
                    console.error('❌ Video ref or stream not available');
                    livePhotoHook.setErrors({ capture: 'Camera not available. Please close and reopen the camera.' });
                  }
                }}
                disabled={livePhotoHook.processing}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 120,
                  flexShrink: 0,
                }}
              >
              Try Again
              </Button>
            </Box>
          )}
          {/* Hide instructions when there's an error */}
          {livePhotoHook.capturedPositions.size === 0 && !livePhotoHook.errors.capture && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Instructions:</strong> Please keep the camera at your eye level and ensure your entire face is clearly visible.
              </Typography>
            </Alert>
          )}
          {/* Hide progress info when there's an error */}
          {!livePhotoHook.errors.capture && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: primaryColor, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                {headPositionText}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Verification Progress:{' '}
                {livePhotoHook.capturedPositions.size}/4 positions
              </Typography>
              {verifiedPositionsText && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    color="success.main"
                    sx={{ fontWeight: 600 }}
                  >
                    ✓ Verified: {verifiedPositionsText}
                  </Typography>
                </Box>
              )}
              {/* Hide processing alert when all 4 positions captured - show blurred overlay instead */}
              {livePhotoHook.processing && livePhotoHook.capturedPositions.size < 4 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">
                      Processing position...
                    </Typography>
                  </Box>
                </Alert>
              )}
            </Box>
          )}
          {/* Camera and Captured Images - Hide when error is shown */}
          {!livePhotoHook.errors.capture && (
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                justifyContent: 'center',
                width: '100%',
              }}
            >
            {/* Live Camera Feed - Round/Circular UI */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 320, sm: 360, md: 400 },
                height: { xs: 320, sm: 360, md: 400 },
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {/* Circular Progress Ring - Segmented */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              >
                {/* CSS for blinking animation */}
                <style>
                  {`
                    @keyframes blinkIndicator {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.3; }
                    }
                  `}
                </style>
                {/* SVG for circular progress ring */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 200"
                  style={{
                    transform: 'rotate(-90deg)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <defs>
                    <linearGradient id={`progressGradient-${Math.random()}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4CAF50" />
                      <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                  </defs>
                  
                  {/* Calculate radius and create arc paths for each segment */}
                  {(() => {
                    const radius = 90;
                    const centerX = 100;
                    const centerY = 100;
                    
                    // Helper function to create arc path
                    // User wants: Right (45-135°), Down (135-225°), Left (225-315°), Up (315-45°)
                    // Based on image: when arrow points right, top-right quarter (12-3 o'clock) should be green
                    // This suggests user's angles are: 0°=top, 90°=right, 180°=bottom, 270°=left (visual system)
                    // SVG is rotated -90deg, and SVG math uses 0°=right
                    // After -90deg rotation: SVG 90° appears at visual top, SVG 180° at visual right
                    // To convert visual angle to SVG: svg_angle = (visual_angle + 90) % 360
                    const createArc = (startAngle: number, endAngle: number) => {
                      // User's angles are in visual system (0°=top), convert to SVG coordinates
                      const svgStartAngle = startAngle;
                      const svgEndAngle = endAngle;
                      const startRad = svgStartAngle * (Math.PI / 180);
                      const endRad = svgEndAngle * (Math.PI / 180);
                      const x1 = centerX + radius * Math.cos(startRad);
                      const y1 = centerY + radius * Math.sin(startRad);
                      const x2 = centerX + radius * Math.cos(endRad);
                      const y2 = centerY + radius * Math.sin(endRad);
                      // Calculate if we need large arc (for wrap-around cases)
                      let angleDiff = svgEndAngle - svgStartAngle;
                      if (angleDiff < 0) angleDiff += 360;
                      const largeArc = angleDiff > 180 ? 1 : 0;
                      return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
                    };
                    
                    // Define segments in standard coordinates: Right (45-135°), Down (135-225°), Left (225-315°), Up (315-45°)
                    const upColor = livePhotoHook.capturedPositions.has('up') 
                      ? '#4CAF50' 
                      : livePhotoHook.headPosition === 'up' && livePhotoHook.poseMatched
                      ? '#4CAF50'
                      : livePhotoHook.headPosition === 'up' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected
                      ? '#FF6B6B'
                      : '#ffffff';
                    const upIsMatched = livePhotoHook.headPosition === 'up' && livePhotoHook.poseMatched;
                    const upIsDetected = livePhotoHook.headPosition === 'up' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected;
                    
                    const segments = [
                      { 
                        name: 'right', 
                        startAngle: 45, 
                        endAngle: 135,
                        color: livePhotoHook.capturedPositions.has('right') 
                          ? '#4CAF50' 
                          : livePhotoHook.headPosition === 'right' && livePhotoHook.poseMatched
                          ? '#4CAF50'
                          : livePhotoHook.headPosition === 'right' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected
                          ? '#FF6B6B'
                          : '#ffffff',
                        isMatched: livePhotoHook.headPosition === 'right' && livePhotoHook.poseMatched,
                        isDetected: livePhotoHook.headPosition === 'right' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected,
                      },
                      { 
                        name: 'down', 
                        startAngle: 135, 
                        endAngle: 225,
                        color: livePhotoHook.capturedPositions.has('down') 
                          ? '#4CAF50' 
                          : livePhotoHook.headPosition === 'down' && livePhotoHook.poseMatched
                          ? '#4CAF50'
                          : livePhotoHook.headPosition === 'down' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected
                          ? '#FF6B6B'
                          : '#ffffff',
                        isMatched: livePhotoHook.headPosition === 'down' && livePhotoHook.poseMatched,
                        isDetected: livePhotoHook.headPosition === 'down' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected,
                      },
                      { 
                        name: 'left', 
                        startAngle: 225, 
                        endAngle: 315,
                        color: livePhotoHook.capturedPositions.has('left') 
                          ? '#4CAF50' 
                          : livePhotoHook.headPosition === 'left' && livePhotoHook.poseMatched
                          ? '#4CAF50'
                          : livePhotoHook.headPosition === 'left' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected
                          ? '#FF6B6B'
                          : '#ffffff',
                        isMatched: livePhotoHook.headPosition === 'left' && livePhotoHook.poseMatched,
                        isDetected: livePhotoHook.headPosition === 'left' && !livePhotoHook.poseMatched && livePhotoHook.faceDetected,
                      },
                    ];
                    
                    return (
                      <>
                        {segments.map((segment) => (
                          <path
                            key={segment.name}
                            d={createArc(segment.startAngle, segment.endAngle)}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{
                              transition: 'all 0.5s ease',
                              filter: segment.isMatched ? 'drop-shadow(0 0 8px #4CAF50)' : 'none',
                              animation: segment.isDetected ? 'blinkIndicator 1s ease-in-out infinite' : 'none',
                            }}
                          />
                        ))}
                        {/* Up segment (315-45°) - needs two arcs to handle wrap */}
                        <path
                          d={`${createArc(315, 360)} ${createArc(0, 45)}`}
                          fill="none"
                          stroke={upColor}
                          strokeWidth="4"
                          strokeLinecap="round"
                          style={{
                            transition: 'all 0.5s ease',
                            filter: upIsMatched ? 'drop-shadow(0 0 8px #4CAF50)' : 'none',
                            animation: upIsDetected ? 'blinkIndicator 1s ease-in-out infinite' : 'none',
                          }}
                        />
                      </>
                    );
                  })()}
                </svg>
              </Box>
              
              {/* Outer circular border */}
              <Box
                sx={{
                  position: 'absolute',
                  width: 'calc(100% - 10px)',
                  height: 'calc(100% - 10px)',
                  borderRadius: '50%',
                   zIndex: 2,
                  pointerEvents: 'none',
                }}
              />
              {/* Inner circular mask for video */}
              <Box
                sx={{
                  position: 'relative',
                  width: 'calc(100% - 50px)',
                  height: 'calc(100% - 50px)',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  zIndex: 1,
                  margin: '20px',
                }}
              >
                <video
                  ref={livePhotoHook.videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    filter: livePhotoHook.capturedPositions.size === 4 && livePhotoHook.processing ? 'blur(8px)' : 'none',
                    transition: 'filter 0.3s ease',
                    borderRadius: '50%',
                    transform: 'scaleX(-1)', // Mirror preview for natural user experience
                  }}
                onLoadedMetadata={() => {
                  if (livePhotoHook.videoRef.current) {
                    console.log('Video loaded, dimensions:', livePhotoHook.videoRef.current.videoWidth, 'x', livePhotoHook.videoRef.current.videoHeight);
                    // Ensure video is playing
                    if (livePhotoHook.videoRef.current.paused) {
                      livePhotoHook.videoRef.current.play().catch(err => {
                        console.error('Error playing video on loadedmetadata:', err);
                      });
                    }
                  }
                }}
                onCanPlay={() => {
                  if (livePhotoHook.videoRef.current && livePhotoHook.videoRef.current.paused) {
                    livePhotoHook.videoRef.current.play().catch(err => {
                      console.error('Error playing video on canplay:', err);
                    });
                  }
                }}
                onLoadedData={() => {
                  if (livePhotoHook.videoRef.current && livePhotoHook.videoStream && !livePhotoHook.videoRef.current.srcObject) {
                    livePhotoHook.videoRef.current.srcObject = livePhotoHook.videoStream;
                    livePhotoHook.videoRef.current.play().catch(err => {
                      console.error('Error playing video on loadeddata:', err);
                    });
                  }
                }}
                onError={(e) => {
                  console.error('Video error:', e);
                  livePhotoHook.setErrors({ camera: 'Failed to load video stream. Please try again.' });
                }}
                />
                {/* Direction indicator overlay - positioned on the ring */}
                {livePhotoHook.headPosition && livePhotoHook.capturedPositions.size < 4 && (
                  <>
                    {/* Arrow indicator on the ring */}
                    <Box
                      sx={{
                        position: 'absolute',
                        zIndex: 4,
                        pointerEvents: 'none',
                        ...(livePhotoHook.headPosition === 'right' && {
                          top: '50%',
                          right: '5px',
                          transform: 'translateY(-50%)',
                        }),
                        ...(livePhotoHook.headPosition === 'left' && {
                          top: '50%',
                          left: '5px',
                          transform: 'translateY(-50%)',
                        }),
                        ...(livePhotoHook.headPosition === 'up' && {
                          top: '5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }),
                        ...(livePhotoHook.headPosition === 'down' && {
                          bottom: '5px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          width: 35,
                          height: 35,
                          borderRadius: '50%',
                          backgroundColor: (livePhotoHook.faceDetected && livePhotoHook.poseMatched) ? '#4CAF50' : 'rgba(200, 200, 200, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: (livePhotoHook.faceDetected && livePhotoHook.poseMatched)
                            ? '0 4px 12px rgba(76, 175, 80, 0.4)' 
                            : '0 4px 12px rgba(0, 0, 0, 0.2)',
                          animation: (livePhotoHook.faceDetected && livePhotoHook.poseMatched) ? 'pulse 1.5s ease-in-out infinite' : 'none',
                          transition: 'all 0.3s ease',
                          '@keyframes pulse': {
                            '0%, 100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.15)',
                              opacity: 0.9,
                            },
                          },
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                          }}
                        >
                          {livePhotoHook.headPosition === 'right' && '→'}
                          {livePhotoHook.headPosition === 'left' && '←'}
                          {livePhotoHook.headPosition === 'up' && '↑'}
                          {livePhotoHook.headPosition === 'down' && '↓'}
                          {livePhotoHook.headPosition === 'center' && '→'}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
                
                {/* Perfect! message when position is captured */}
                {livePhotoHook.processing && livePhotoHook.capturedPositions.size > 0 && livePhotoHook.capturedPositions.size < 4 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '-50px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 5,
                      pointerEvents: 'none',
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: '#4CAF50',
                        textAlign: 'center',
                        animation: 'fadeInOut 1.5s ease-in-out',
                        '@keyframes fadeInOut': {
                          '0%, 100%': {
                            opacity: 0,
                            transform: 'translateX(-50%) translateY(10px)',
                          },
                          '50%': {
                            opacity: 1,
                            transform: 'translateX(-50%) translateY(0)',
                          },
                        },
                      }}
                    >
                      Perfect! ✓
                    </Typography>
                  </Box>
                )}
              </Box>
              <canvas ref={livePhotoHook.canvasRef} style={{ display: 'none' }} />

              {/* Blurred Overlay with Loading Spinner - Show when all 4 positions captured and processing */}
              {livePhotoHook.capturedPositions.size === 4 && livePhotoHook.processing && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 'calc(100% - 8px)',
                    height: 'calc(100% - 8px)',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    gap: 3,
                    padding: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <CircularProgress
                      size={64}
                      thickness={4}
                      sx={{
                        color: primaryColor,
                        animationDuration: '1.5s',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: primaryColor,
                        textAlign: 'center',
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      Verification in Progress
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        maxWidth: 280,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      Please wait while we verify human presence                    
                      </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      mt: 1,
                    }}
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <Box
                        key={num}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: successColor,
                          animation: 'pulse 1.5s ease-in-out infinite',
                          animationDelay: `${num * 0.2}s`,
                          '@keyframes pulse': {
                            '0%, 100%': {
                              opacity: 0.4,
                              transform: 'scale(1)',
                            },
                            '50%': {
                              opacity: 1,
                              transform: 'scale(1.2)',
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

            </Box>
          </Box>
          )}
          {!livePhotoHook.captured && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              {livePhotoHook.recording ? (
                <Typography variant="body2" sx={{ color: 'error.main', mb: 1, fontWeight: 600 }}>
                  🎥Please follow the instructions and turn your head as directed
                </Typography>
              ) : livePhotoHook.processing ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Processing video...
                </Typography>
              ) : null}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Government ID Camera Dialog */}
      <Dialog
        open={govIdHook.showCamera}
        onClose={govIdHook.stopCamera}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Government ID Verification - US
          <IconButton
            onClick={govIdHook.stopCamera}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Show info only when there's no error */}
          {!(govIdFailure || govIdHook.errors.capture) && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please show your{' '}
              <strong>
                Driver&apos;s License, State ID, or US Passport
              </strong>{' '}
              to the camera for the verification.
            </Alert>
          )}
          {/* Show success message if extraction is successful */}
          {govIdSuccess && !govIdHook.processing && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                ✓ Successfully captured and extracted: First Name, Last Name, Date of Birth
              </Typography>
            </Alert>
          )}
          {/* Show error message if extraction fails */}
          {(govIdFailure || govIdHook.errors.capture) && !govIdHook.processing && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {govIdHook.errors.capture || 'Failed to extract required information. Please try again.'}
              </Typography>
            </Alert>
          )}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 600,
              height: 400,
              mx: 'auto',
              border: `2px solid ${primaryColor}`,
              borderRadius: 2,
              overflow: 'hidden',
              mb:2,
            }}
          >
            <video
              ref={govIdHook.videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                backgroundColor: '#000',
                minHeight: '400px',
              }}
              onLoadedMetadata={() => {
                if (govIdHook.videoRef.current) {
                  console.log('Gov ID Video loaded, dimensions:', govIdHook.videoRef.current.videoWidth, 'x', govIdHook.videoRef.current.videoHeight);
                }
              }}
              onCanPlay={() => {
                console.log('Gov ID Video can play, dimensions:', govIdHook.videoRef.current?.videoWidth, 'x', govIdHook.videoRef.current?.videoHeight);
              }}
              onLoadedData={() => {
                console.log('Gov ID Video data loaded, dimensions:', govIdHook.videoRef.current?.videoWidth, 'x', govIdHook.videoRef.current?.videoHeight);
              }}
              onError={(e) => {
                console.error('Gov ID Video error:', e);
                govIdHook.setErrors({ camera: 'Failed to load video stream. Please try again.' });
              }}
            />
            <canvas ref={govIdHook.canvasRef} style={{ display: 'none' }} />

            {/* Loading Overlay - Show during processing */}
            {govIdHook.processing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  gap: 2,
                }}
              >
                <CircularProgress size={64} thickness={4} sx={{ color: primaryColor }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: primaryColor,
                    textAlign: 'center',
                  }}
                >
                  Processing...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  Extracting information from ID document
                </Typography>
              </Box>
            )}

            {/* Success Overlay - Show after successful extraction */}
            {govIdSuccess && !govIdHook.processing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(76, 175, 80, 0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  gap: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: 'white' }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  Successfully Captured!
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                  }}
                >
                  ID information extracted successfully
                </Typography>
              </Box>
            )}

            {/* Failure Overlay - Show after failed extraction */}
            {govIdFailure && !govIdHook.processing && !govIdSuccess && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(211, 47, 47, 0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  Capture Failed
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                  }}
                >     
                  Failed to extract required information. Please try again.
                </Typography>
              </Box>
            )}
          </Box>
          {govIdHook.errors.capture && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {govIdHook.errors.capture}
            </Alert>
          )}
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            {govIdCaptured && !govIdHook.errors.capture && (
              <Button
                variant="outlined"
                onClick={() => {
                  setGovIdCaptured(false);
                  setGovIdSuccess(false);
                  setGovIdFailure(false);
                  updateFormData({ 
                    governmentId: null,
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    fullAddress: formData.fullAddress || ''
                  });
                  govIdHook.setErrors({});
                  // Restart camera for recapture
                  govIdHook.stopCamera();
                  setTimeout(() => {
                    govIdHook.startCamera();
                  }, 300);
                }}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: '#1565c0',
                    bgcolor: '#e3f2fd',
                  },
                }}
              >
                Re-capture
              </Button>
            )}
            {(!govIdCaptured || govIdHook.errors.capture) && (
              <Button
                variant="contained"
                onClick={() => {
                  // Clear errors and failure state when retrying
                  if (govIdHook.errors.capture || govIdFailure) {
                    setGovIdFailure(false);
                    govIdHook.setErrors({});
                  }
                  govIdHook.capturePhoto();
                }}
                disabled={govIdHook.processing}
                sx={{
                  bgcolor: primaryColor,
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                {govIdHook.processing ? 'Capturing...' : 'Capture ID'}
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* SSN Camera Dialog */}
      <Dialog
        open={ssnHook.showCamera}
        onClose={ssnHook.stopCamera}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          SSN Card Verification - US
          <IconButton
            onClick={ssnHook.stopCamera}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Show warning only when there's no error */}
          {!(ssnFailure || ssnHook.errors.capture) && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Important:</strong> Cover the first 5 digits of your SSN.
              Only show the last 4 digits and your full name clearly.
            </Alert>
          )}
          {/* Show success message if extraction is successful */}
          {ssnSuccess && !ssnHook.processing && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                ✓ Successfully captured and extracted SSN number
              </Typography>
            </Alert>
          )}
          {/* Show error message if extraction fails */}
          {(ssnFailure || ssnHook.errors.capture) && !ssnHook.processing && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {ssnHook.errors.capture || 'Failed to extract SSN number. Please try again.'}
              </Typography>
            </Alert>
          )}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 640,
              mx: 'auto',
              border: '2px solid #1976d2',
              borderRadius: 2,
              overflow: 'hidden',
              minHeight: '400px',
            }}
          >
            <video
              ref={ssnHook.videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                backgroundColor: '#000',
                minHeight: '400px',
              }}
              onLoadedMetadata={() => {
                if (ssnHook.videoRef.current) {
                  console.log('SSN Video loaded, dimensions:', ssnHook.videoRef.current.videoWidth, 'x', ssnHook.videoRef.current.videoHeight);
                }
              }}
              onCanPlay={() => {
                console.log('SSN Video can play');
              }}
              onLoadedData={() => {
                console.log('SSN Video data loaded');
              }}
              onError={(e) => {
                console.error('SSN Video error:', e);
                ssnHook.setErrors({ camera: 'Failed to load video stream. Please try again.' });
              }}
            />
            <canvas ref={ssnHook.canvasRef} style={{ display: 'none' }} />

            {/* Loading Overlay - Show during processing */}
            {ssnHook.processing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  gap: 2,
                }}
              >
                <CircularProgress size={64} thickness={4} sx={{ color: primaryColor }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: primaryColor,
                    textAlign: 'center',
                  }}
                >
                  Processing...
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  Extracting SSN number from card
                </Typography>
              </Box>
            )}

            {/* Success Overlay - Show after successful extraction */}
            {ssnSuccess && !ssnHook.processing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(76, 175, 80, 0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  gap: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: 'white' }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  Successfully Captured!
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                  }}
                >
                  SSN number extracted successfully
                </Typography>
              </Box>
            )}

            {/* Failure Overlay - Show after failed extraction */}
            {ssnFailure && !ssnHook.processing && !ssnSuccess && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(211, 47, 47, 0.95)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  gap: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  Capture Failed
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center',
                  }}
                >
                  Failed to extract SSN number. Please try again.
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            {ssnCaptured && !ssnHook.errors.capture && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSSNCaptured(false);
                  setSSNSuccess(false);
                  setSSNFailure(false);
                  updateFormData({ 
                    ssn: null
                  });
                  ssnHook.setErrors({});
                  // Restart camera for recapture
                  ssnHook.stopCamera();
                  setTimeout(() => {
                    ssnHook.startCamera();
                  }, 300);
                }}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: '#1565c0',
                    bgcolor: '#e3f2fd',
                  },
                }}
              >
                Re-capture
              </Button>
            )}
            {(!ssnCaptured || ssnHook.errors.capture) && (
              <Button
                variant="contained"
                onClick={() => {
                  // Clear errors and failure state when retrying
                  if (ssnHook.errors.capture) {
                    setSSNFailure(false);
                    ssnHook.setErrors({});
                  }
                  ssnHook.capturePhoto();
                }}
                disabled={ssnHook.processing}
                sx={{
                  bgcolor: primaryColor,
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                {ssnHook.processing ? 'Capturing...' : 'Capture SSN'}
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Export component
export default USDocumentVerification;

