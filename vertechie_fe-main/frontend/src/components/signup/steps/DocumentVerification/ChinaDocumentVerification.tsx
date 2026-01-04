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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import { useDocumentCapture } from '../../shared/hooks/useDocumentCapture';
import { preloadFaceDetector } from '../../../../utils/faceDetection';

const ChinaDocumentVerification: React.FC<StepComponentProps> = ({
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
  
  const primaryColor = '#c62828'; // Chinese red
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

  // For China, the Resident Identity Card contains all necessary information
  const govIdHook = useDocumentCapture({
    cameraType: 'govId',
    country: 'CN',
    onCaptureComplete: (data) => {
      updateFormData({ governmentId: data });
    },
    onDataExtracted: (extractedData) => {
      const updates: any = {};
      if (extractedData.firstName) updates.firstName = extractedData.firstName;
      if (extractedData.lastName) updates.lastName = extractedData.lastName;
      if (extractedData.dateOfBirth) updates.dateOfBirth = extractedData.dateOfBirth;
      if (extractedData.address) updates.fullAddress = extractedData.address;
      // Chinese ID card number
      if (extractedData.idNumber || extractedData.panNumber) {
        updates.idCardNumber = extractedData.idNumber || extractedData.panNumber;
      }

      if (Object.keys(updates).length > 0) updateFormData(updates);
      if (extractedData.firstName && extractedData.lastName && extractedData.dateOfBirth) {
        setGovIdCaptured(true);
      }
    },
  });

  const handleLivePhotoStart = useCallback(() => livePhotoHook.startCamera(), [livePhotoHook]);
  const handleGovIdStart = useCallback(() => govIdHook.startCamera(), [govIdHook]);

  const headPositionText = useMemo(() => {
    if (livePhotoHook.capturedPositions.size >= 4) return '';
    const positionTexts: Record<string, string> = { left: 'to the left', right: 'to the right', up: 'up', down: 'down' };
    return `Slowly turn your head ${positionTexts[livePhotoHook.headPosition] || 'to the left'}`;
  }, [livePhotoHook.capturedPositions.size, livePhotoHook.headPosition]);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#333' }}>
        身份验证 - Document Verification - China
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Live Photo Card */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <PhotoCameraIcon sx={{ fontSize: 40, color: primaryColor }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>活体验证 / Liveness</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              请看镜头并按指示转动头部 / Look at the camera and follow instructions
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleLivePhotoStart} disabled={livePhotoCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {livePhotoCaptured ? '已验证 ✓' : '开始验证'}
            </Button>
            {livePhotoCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>

        {/* Resident Identity Card */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CreditCardIcon sx={{ fontSize: 40, color: '#424242' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>居民身份证</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              请将您的居民身份证正面对准镜头 / Show your Resident Identity Card (身份证)
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleGovIdStart} disabled={govIdCaptured || !livePhotoCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {govIdCaptured ? '已采集 ✓' : '采集身份证'}
            </Button>
            {govIdCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>
      </Grid>

      {/* Information Note */}
      <Box sx={{ mt: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          <strong>注意 / Note:</strong> 中国居民身份证包含所有必要信息，无需额外证件。
          The Chinese Resident Identity Card contains all necessary information for verification.
        </Typography>
      </Box>

      {/* Camera Dialogs */}
      <Dialog open={livePhotoHook.showCamera} onClose={livePhotoHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>活体验证 / Liveness Verification<IconButton onClick={livePhotoHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: primaryColor }}>{headPositionText}</Typography>
            <Typography variant="body2" color="text.secondary">进度 / Progress: {livePhotoHook.capturedPositions.size}/4</Typography>
          </Box>
          <Box sx={{ position: 'relative', width: 350, height: 350, mx: 'auto', borderRadius: '50%', overflow: 'hidden' }}>
            <video ref={livePhotoHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <canvas ref={livePhotoHook.canvasRef} style={{ display: 'none' }} />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={govIdHook.showCamera} onClose={govIdHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>居民身份证验证<IconButton onClick={govIdHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>请将您的<strong>居民身份证</strong>正面对准镜头。Show your <strong>Resident Identity Card</strong> front side.</Alert>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 400, mx: 'auto', border: `2px solid ${primaryColor}`, borderRadius: 2, overflow: 'hidden' }}>
            <video ref={govIdHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={govIdHook.canvasRef} style={{ display: 'none' }} />
            {govIdHook.processing && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: primaryColor }} /></Box>}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" onClick={govIdHook.capturePhoto} disabled={govIdHook.processing} sx={{ bgcolor: primaryColor }}>{govIdHook.processing ? '处理中...' : '采集身份证'}</Button></Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChinaDocumentVerification;


