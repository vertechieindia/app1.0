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

const SwitzerlandDocumentVerification: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  location,
  role,
}) => {
  const [livePhotoCaptured, setLivePhotoCaptured] = useState(!!formData.livePhoto);
  const [govIdCaptured, setGovIdCaptured] = useState(
    !!formData.governmentId && !!formData.firstName && !!formData.lastName && !!formData.dateOfBirth
  );
  const [ahvCaptured, setAHVCaptured] = useState(!!formData.ahv);
  
  const primaryColor = '#d32f2f'; // Swiss red
  const successColor = '#4caf50';

  useEffect(() => {
    preloadFaceDetector().catch((err) => {
      console.warn('Face detector pre-load failed:', err);
    });
  }, []);

  const livePhotoHook = useDocumentCapture({
    cameraType: 'live',
    onCaptureComplete: (data) => {
      updateFormData({ livePhoto: data });
      setLivePhotoCaptured(true);
    },
  });

  const govIdHook = useDocumentCapture({
    cameraType: 'govId',
    country: 'CH',
    onCaptureComplete: (data) => {
      updateFormData({ governmentId: data });
    },
    onDataExtracted: (extractedData) => {
      const updates: any = {};
      if (extractedData.firstName) updates.firstName = extractedData.firstName;
      if (extractedData.lastName) updates.lastName = extractedData.lastName;
      if (extractedData.dateOfBirth) updates.dateOfBirth = extractedData.dateOfBirth;
      if (extractedData.address) updates.fullAddress = extractedData.address;

      if (Object.keys(updates).length > 0) updateFormData(updates);
      if (extractedData.firstName && extractedData.lastName && extractedData.dateOfBirth) {
        setGovIdCaptured(true);
      }
    },
  });

  const ahvHook = useDocumentCapture({
    cameraType: 'ssn',
    country: 'CH',
    onCaptureComplete: (data) => {
      updateFormData({ ahv: data });
    },
    onDataExtracted: (extractedData) => {
      if (extractedData.idNumber || extractedData.panNumber) {
        updateFormData({ ahvNumber: extractedData.idNumber || extractedData.panNumber });
        setAHVCaptured(true);
      }
    },
  });

  const handleLivePhotoStart = useCallback(() => livePhotoHook.startCamera(), [livePhotoHook]);
  const handleGovIdStart = useCallback(() => govIdHook.startCamera(), [govIdHook]);
  const handleAHVStart = useCallback(() => ahvHook.startCamera(), [ahvHook]);

  const headPositionText = useMemo(() => {
    if (livePhotoHook.capturedPositions.size >= 4) return '';
    const positionTexts: Record<string, string> = { left: 'to the left', right: 'to the right', up: 'up', down: 'down' };
    return `Slowly turn your head ${positionTexts[livePhotoHook.headPosition] || 'to the left'}`;
  }, [livePhotoHook.capturedPositions.size, livePhotoHook.headPosition]);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#333' }}>
        Document Verification - Switzerland / Schweiz
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#ffcdd2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <PhotoCameraIcon sx={{ fontSize: 40, color: primaryColor }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Liveness Verification</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              Look at the camera and follow the instructions
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleLivePhotoStart} disabled={livePhotoCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {livePhotoCaptured ? 'Verified ✓' : 'Capture Liveness'}
            </Button>
            {livePhotoCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CreditCardIcon sx={{ fontSize: 40, color: '#424242' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Government ID</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              Show your Swiss ID Card (Identitätskarte) or Passport
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleGovIdStart} disabled={govIdCaptured || !livePhotoCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {govIdCaptured ? 'ID Captured ✓' : 'Capture ID'}
            </Button>
            {govIdCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#FF8C00' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>AHV-Nummer</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              Show your AHV/AVS card. Format: 756.1234.5678.97
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleAHVStart} disabled={ahvCaptured || !govIdCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {ahvCaptured ? 'AHV Captured ✓' : 'Capture AHV'}
            </Button>
            {ahvCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>
      </Grid>

      {/* Camera Dialogs */}
      <Dialog open={livePhotoHook.showCamera} onClose={livePhotoHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>Liveness Verification<IconButton onClick={livePhotoHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: primaryColor }}>{headPositionText}</Typography>
            <Typography variant="body2" color="text.secondary">Progress: {livePhotoHook.capturedPositions.size}/4 positions</Typography>
          </Box>
          <Box sx={{ position: 'relative', width: 350, height: 350, mx: 'auto', borderRadius: '50%', overflow: 'hidden' }}>
            <video ref={livePhotoHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <canvas ref={livePhotoHook.canvasRef} style={{ display: 'none' }} />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={govIdHook.showCamera} onClose={govIdHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>Government ID Verification - Switzerland<IconButton onClick={govIdHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Show your <strong>Swiss ID Card or Passport</strong> to the camera.</Alert>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 400, mx: 'auto', border: `2px solid ${primaryColor}`, borderRadius: 2, overflow: 'hidden' }}>
            <video ref={govIdHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={govIdHook.canvasRef} style={{ display: 'none' }} />
            {govIdHook.processing && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: primaryColor }} /></Box>}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" onClick={govIdHook.capturePhoto} disabled={govIdHook.processing} sx={{ bgcolor: primaryColor }}>{govIdHook.processing ? 'Processing...' : 'Capture ID'}</Button></Box>
        </DialogContent>
      </Dialog>

      <Dialog open={ahvHook.showCamera} onClose={ahvHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>AHV-Nummer Verification - Switzerland<IconButton onClick={ahvHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Show your <strong>AHV/AVS Card</strong>. Format: 756.1234.5678.97</Alert>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 400, mx: 'auto', border: `2px solid ${primaryColor}`, borderRadius: 2, overflow: 'hidden' }}>
            <video ref={ahvHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={ahvHook.canvasRef} style={{ display: 'none' }} />
            {ahvHook.processing && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: primaryColor }} /></Box>}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" onClick={ahvHook.capturePhoto} disabled={ahvHook.processing} sx={{ bgcolor: primaryColor }}>{ahvHook.processing ? 'Processing...' : 'Capture AHV'}</Button></Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SwitzerlandDocumentVerification;


