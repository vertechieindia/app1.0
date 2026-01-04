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

const IndiaDocumentVerification: React.FC<StepComponentProps> = ({
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
  const [panCaptured, setPanCaptured] = useState(
    !!formData.panCard && !!formData.panNumber
  );
  const [aadhaarCaptured, setAadhaarCaptured] = useState(
    !!formData.aadhaar && !!formData.firstName && !!formData.lastName && !!formData.dateOfBirth
  );
  
  // HR colors: India = attractive green (#2E7D32), Techie = green (#138808)
  const primaryColor = role === 'hr' ? '#2E7D32' : '#138808';
  const lightColor = role === 'hr' ? '#e8f5e9' : '#e8f5e9';
  const darkColor = role === 'hr' ? '#1B5E20' : '#0f7005';

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
      setLivePhotoCaptured(true);
    },
  });

  // Aadhaar/DL Hook (Government ID - 2nd) - using govId camera type for Aadhaar/DL
  const aadhaarHook = useDocumentCapture({
    cameraType: 'govId',
    country: location || 'IN',
    onCaptureComplete: (data) => {
      updateFormData({ aadhaar: data });
      // Don't set aadhaarCaptured here - wait for onDataExtracted to validate required fields
    },
    onDataExtracted: (extractedData) => {
      console.log('Extracted Aadhaar/DL data:', extractedData);
      const updates: any = {};

      if (extractedData.firstName) {
        updates.firstName = extractedData.firstName;
      }
      if (extractedData.lastName) {
        updates.lastName = extractedData.lastName;
      }
      if (extractedData.dateOfBirth) {
        updates.dateOfBirth = extractedData.dateOfBirth;
      }
      if (extractedData.address) {
        updates.fullAddress = extractedData.address;
      }

      if (Object.keys(updates).length > 0) {
        updateFormData(updates);
        console.log('Updated formData with extracted fields:', updates);
      }

      // Only mark as captured if all required fields are extracted
      if (extractedData.firstName && extractedData.lastName && extractedData.dateOfBirth) {
        setAadhaarCaptured(true);
        console.log('Government ID captured successfully with all required fields');
      } else {
        setAadhaarCaptured(false);
        console.log('Government ID extraction incomplete - missing required fields');
      }
    },
  });

  // PAN Card Hook (3rd)
  const panHook = useDocumentCapture({
    cameraType: 'pan',
    country: location || 'IN',
    onCaptureComplete: (data) => {
      updateFormData({ panCard: data });
      // Don't set panCaptured here - wait for onDataExtracted to validate PAN number
    },
    onDataExtracted: (extractedData) => {
      console.log('Extracted PAN data:', extractedData);
      const updates: any = {};

      // Only store PAN number (ID number)
      if (extractedData.panNumber || extractedData.idNumber) {
        updates.panNumber = extractedData.panNumber || extractedData.idNumber;
      }

      if (Object.keys(updates).length > 0) {
        updateFormData(updates);
        console.log('Updated formData with extracted PAN number:', updates);
      }

      // Only mark as captured if PAN number is extracted
      if (extractedData.panNumber || extractedData.idNumber) {
        setPanCaptured(true);
        console.log('PAN card captured successfully with ID number');
      } else {
        setPanCaptured(false);
        console.log('PAN card extraction incomplete - missing ID number');
      }
    },
  });

  const handleLivePhotoStart = useCallback(() => {
    livePhotoHook.startCamera();
  }, [livePhotoHook]);

  const handlePanStart = useCallback(() => {
    panHook.startCamera();
  }, [panHook]);

  const handleAadhaarStart = useCallback(async () => {
    console.log('🔄 Aadhaar capture button clicked');
    console.log('📊 Current state:', {
      livePhotoCaptured,
      aadhaarCaptured,
      hasHook: !!aadhaarHook,
      hasStartCamera: typeof aadhaarHook.startCamera === 'function'
    });
    try {
      await aadhaarHook.startCamera();
      console.log('✅ Camera start initiated');
    } catch (error) {
      console.error('❌ Error starting Aadhaar camera:', error);
    }
  }, [aadhaarHook, livePhotoCaptured, aadhaarCaptured]);

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

  // Debug: Log when Aadhaar camera dialog state changes
  useEffect(() => {
    console.log('📷 Aadhaar camera dialog state changed:', {
      showCamera: aadhaarHook.showCamera,
      hasVideoStream: !!aadhaarHook.videoStream,
      errors: aadhaarHook.errors,
      processing: aadhaarHook.processing
    });
  }, [aadhaarHook.showCamera, aadhaarHook.videoStream, aadhaarHook.errors, aadhaarHook.processing]);

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
              p:  { xs: 1.5, sm: 2 },
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
                bgcolor: lightColor,
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
Live Verification
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
                bgcolor: 'white',
                '&:hover': {
                  borderColor: primaryColor,
                  bgcolor: lightColor,
                  color: primaryColor,
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e',
                  bgcolor: 'white',
                },
              }}
            >
              {livePhotoCaptured ? 'Liveness Verified ✓' : 'Capture Liveness'}
            </Button>
            {livePhotoCaptured && (
              <CheckCircleIcon sx={{ color: primaryColor, ml: 1, mt: 1 }} />
            )}
          </Paper>
        </Grid>

        {/* Aadhaar/DL Card (Government ID) - 2nd */}
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
              Show your Aadhaar or Driving License or Indian Passport to the camera.
        </Typography>
        <Button
              variant="outlined"
          startIcon={<PhotoCameraIcon />}
              onClick={(e) => {
                console.log('🔘 Government ID button clicked', {
                  disabled: aadhaarCaptured || !livePhotoCaptured,
                  aadhaarCaptured,
                  livePhotoCaptured,
                  event: e
                });
                if (!aadhaarCaptured && livePhotoCaptured) {
                  handleAadhaarStart();
                } else {
                  console.warn('⚠️ Button click ignored - button is disabled or already captured');
                }
              }}
              disabled={aadhaarCaptured || !livePhotoCaptured}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: 'none',
                px: 3,
                py: 1,
                bgcolor: 'white',
                '&:hover': {
                  borderColor: primaryColor,
                  bgcolor: lightColor,
                  color: primaryColor,
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e',
                  bgcolor: 'white',
                },
              }}
            >
              {aadhaarCaptured ? 'ID Captured ✓' : 'Capture ID Document'}
        </Button>
            {aadhaarCaptured && (
              <CheckCircleIcon sx={{ color: '#4caf50', ml: 1, mt: 1 }} />
            )}
          </Paper>
        </Grid>

        {/* PAN Card - 3rd */}
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
          PAN Card
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
              Show your PAN card to the camera. System will auto-capture when details are clear.
        </Typography>
        <Button
              variant="outlined"
          startIcon={<PhotoCameraIcon />}
              onClick={handlePanStart}
              disabled={panCaptured || !aadhaarCaptured}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: 'none',
                px: 3,
                py: 1,
                bgcolor: 'white',
                '&:hover': {
                  borderColor: primaryColor,
                  bgcolor: lightColor,
                  color: primaryColor,
                },
                '&:disabled': {
                  borderColor: '#e0e0e0',
                  color: '#9e9e9e',
                  bgcolor: 'white',
                },
              }}
            >
              {panCaptured ? 'PAN Captured ✓' : 'Capture PAN Card'}
        </Button>
            {panCaptured && (
              <CheckCircleIcon sx={{ color: primaryColor, ml: 1, mt: 1 }} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Error Messages */}
      {(livePhotoHook.errors.camera ||
        livePhotoHook.errors.capture ||
        aadhaarHook.errors.camera ||
        aadhaarHook.errors.capture ||
        panHook.errors.camera ||
        panHook.errors.capture ||
        errors.submit) && (
        <Box sx={{ mt: 3 }}>
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
          {aadhaarHook.errors.camera && (
            <Alert severity="error" sx={{ mb: 1 }}>
              Aadhaar Camera: {aadhaarHook.errors.camera}
            </Alert>
          )}
          {aadhaarHook.errors.capture && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {aadhaarHook.errors.capture}
            </Alert>
          )}
          {panHook.errors.camera && (
            <Alert severity="error" sx={{ mb: 1 }}>
              PAN Camera: {panHook.errors.camera}
            </Alert>
          )}
          {panHook.errors.capture && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {panHook.errors.capture}
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
                  livePhotoHook.resetCapture();
                  
                  // Wait longer for reset to complete and state to propagate
                  // This ensures the face detection useEffect sees the reset state
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  // Reattach video stream and play
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
                    }
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
                <strong>Instructions:</strong>Please keep the camera at your eye level and ensure your entire face is clearly visible.
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
                          backgroundColor: primaryColor,
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

      {/* PAN Card Camera Dialog */}
      <Dialog
        open={panHook.showCamera}
        onClose={panHook.stopCamera}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          PAN Card Verification - India
          <IconButton
            onClick={panHook.stopCamera}
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
          {!panHook.errors.capture && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please show your <strong>PAN Card</strong> to the camera. Ensure
              all details are clearly visible.
            </Alert>
          )}
          {/* Show success message if extraction is successful */}
          {panCaptured && !panHook.processing && !panHook.errors.capture && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                ✓ Successfully extracted PAN number
              </Typography>
            </Alert>
          )}
          {/* Show error message if extraction fails */}
          {panHook.errors.capture && !panHook.processing && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {panHook.errors.capture}
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
              mb: 2,
            }}
          >
            <video
              ref={panHook.videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                backgroundColor: '#000',
                objectFit: 'cover',
              }}
            />
            <canvas ref={panHook.canvasRef} style={{ display: 'none' }} />
            {panHook.processing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={60} sx={{ color: primaryColor, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Extracting PAN Details...
                  </Typography>
                </Box>
              </Box>
        )}
      </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                // Clear errors when retrying
                if (panHook.errors.capture) {
                  panHook.setErrors({});
                }
                panHook.capturePhoto();
              }}
              disabled={panHook.processing || !panHook.videoStream}
              size="large"
              sx={{
                bgcolor: primaryColor,
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: darkColor,
                },
              }}
            >
              {panHook.processing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Processing...
                </>
              ) : (
                <>
                  <PhotoCameraIcon sx={{ mr: 1 }} />
                  Capture PAN Card
                </>
              )}
            </Button>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            {panCaptured && !panHook.errors.capture && (
              <Button
                variant="outlined"
                onClick={() => {
                  setPanCaptured(false);
                  updateFormData({ 
                    panCard: null,
                    panNumber: null
                  });
                  panHook.setErrors({});
                  // Restart camera for recapture
                  panHook.stopCamera();
                  setTimeout(() => {
                    panHook.startCamera();
                  }, 300);
                }}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: darkColor,
                    bgcolor: lightColor,
                  },
                }}
              >
                Re-capture
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Aadhaar/DL Camera Dialog */}
      <Dialog
        open={aadhaarHook.showCamera}
        onClose={aadhaarHook.stopCamera}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Aadhaar Card / Driving License Verification - India
          <IconButton
            onClick={aadhaarHook.stopCamera}
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
          {/* Show camera error if camera access failed */}
          {aadhaarHook.errors.camera && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Camera Error:</strong> {aadhaarHook.errors.camera}
              </Typography>
            </Alert>
          )}
          {/* Show info only when there's no error */}
          {!aadhaarHook.errors.capture && !aadhaarHook.errors.camera && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please show your <strong>Aadhaar Card or Driving License</strong> to the camera. Ensure
              all details are clearly visible. The system will automatically
              capture when the document is properly aligned.
            </Alert>
          )}
          {/* Show success message if extraction is successful */}
          {aadhaarCaptured && !aadhaarHook.processing && !aadhaarHook.errors.capture && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                ✓ Successfully extracted: First Name, Last Name, Date of Birth
              </Typography>
            </Alert>
          )}
          {/* Show error message if extraction fails */}
          {aadhaarHook.errors.capture && !aadhaarHook.processing && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {aadhaarHook.errors.capture}
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
              mb: 2,
              
            }}
          >
            <video
              ref={aadhaarHook.videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                backgroundColor: '#000',
                objectFit: 'cover',
              }}
              onLoadedMetadata={() => {
                console.log('📹 Aadhaar video loaded, dimensions:', 
                  aadhaarHook.videoRef.current?.videoWidth, 
                  'x', 
                  aadhaarHook.videoRef.current?.videoHeight
                );
              }}
              onCanPlay={() => {
                console.log('✅ Aadhaar video can play');
              }}
              onError={(e) => {
                console.error('❌ Aadhaar video error:', e);
                aadhaarHook.setErrors({ camera: 'Failed to load video stream. Please try again.' });
              }}
            />
            <canvas ref={aadhaarHook.canvasRef} style={{ display: 'none' }} />
            {aadhaarHook.processing && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={60} sx={{ color: primaryColor, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    Extracting Document Details...
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                // Clear errors when retrying
                if (aadhaarHook.errors.capture) {
                  aadhaarHook.setErrors({});
                }
                aadhaarHook.capturePhoto();
              }}
              disabled={aadhaarHook.processing || !aadhaarHook.videoStream}
              size="large"
              sx={{
                bgcolor: primaryColor,
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: darkColor,
                },
              }}
            >
              {aadhaarHook.processing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Processing...
                </>
              ) : (
                <>
                  <PhotoCameraIcon sx={{ mr: 1 }} />
                  Capture Aadhaar/DL
                </>
              )}
            </Button>
          </Box>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            {aadhaarCaptured && !aadhaarHook.errors.capture && (
              <Button
                variant="outlined"
                onClick={() => {
                  setAadhaarCaptured(false);
                  updateFormData({ 
                    aadhaar: null,
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    fullAddress: formData.fullAddress || ''
                  });
                  aadhaarHook.setErrors({});
                  // Restart camera for recapture
                  aadhaarHook.stopCamera();
                  setTimeout(() => {
                    aadhaarHook.startCamera();
                  }, 300);
                }}
                sx={{
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: darkColor,
                    bgcolor: lightColor,
                  },
                }}
              >
                Re-capture
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default IndiaDocumentVerification;
