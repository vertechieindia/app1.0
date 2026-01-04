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

const GermanyDocumentVerification: React.FC<StepComponentProps> = ({
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
  const [svnrCaptured, setSVNRCaptured] = useState(!!formData.svnr);
  
  const primaryColor = '#212121'; // German black
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
    country: 'DE',
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

  const svnrHook = useDocumentCapture({
    cameraType: 'ssn',
    country: 'DE',
    onCaptureComplete: (data) => {
      updateFormData({ svnr: data });
    },
    onDataExtracted: (extractedData) => {
      if (extractedData.idNumber || extractedData.panNumber) {
        updateFormData({ svnrNumber: extractedData.idNumber || extractedData.panNumber });
        setSVNRCaptured(true);
      }
    },
  });

  const handleLivePhotoStart = useCallback(() => livePhotoHook.startCamera(), [livePhotoHook]);
  const handleGovIdStart = useCallback(() => govIdHook.startCamera(), [govIdHook]);
  const handleSVNRStart = useCallback(() => svnrHook.startCamera(), [svnrHook]);

  const headPositionText = useMemo(() => {
    if (livePhotoHook.capturedPositions.size >= 4) return '';
    const positionTexts: Record<string, string> = { left: 'to the left', right: 'to the right', up: 'up', down: 'down' };
    return `Slowly turn your head ${positionTexts[livePhotoHook.headPosition] || 'to the left'}`;
  }, [livePhotoHook.capturedPositions.size, livePhotoHook.headPosition]);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#333' }}>
        Dokumentenverifizierung - Deutschland
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <PhotoCameraIcon sx={{ fontSize: 40, color: primaryColor }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Liveness-Verifizierung</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              Schauen Sie in die Kamera und folgen Sie den Anweisungen
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleLivePhotoStart} disabled={livePhotoCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {livePhotoCaptured ? 'Verifiziert ✓' : 'Liveness erfassen'}
            </Button>
            {livePhotoCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CreditCardIcon sx={{ fontSize: 40, color: '#424242' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Personalausweis</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              Zeigen Sie Ihren Personalausweis oder Reisepass der Kamera
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleGovIdStart} disabled={govIdCaptured || !livePhotoCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {govIdCaptured ? 'Erfasst ✓' : 'Ausweis erfassen'}
            </Button>
            {govIdCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 2 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 40, color: '#FF8C00' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Sozialversicherungsnummer</Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, minHeight: 48 }}>
              Zeigen Sie Ihren Sozialversicherungsausweis. Format: 12 345678 A 123
            </Typography>
            <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={handleSVNRStart} disabled={svnrCaptured || !govIdCaptured} sx={{ borderColor: primaryColor, color: primaryColor }}>
              {svnrCaptured ? 'SVNR Erfasst ✓' : 'SVNR erfassen'}
            </Button>
            {svnrCaptured && <CheckCircleIcon sx={{ color: successColor, mt: 1 }} />}
          </Paper>
        </Grid>
      </Grid>

      {/* Camera Dialogs */}
      <Dialog open={livePhotoHook.showCamera} onClose={livePhotoHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>Liveness-Verifizierung<IconButton onClick={livePhotoHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: primaryColor }}>{headPositionText}</Typography>
            <Typography variant="body2" color="text.secondary">Fortschritt: {livePhotoHook.capturedPositions.size}/4 Positionen</Typography>
          </Box>
          <Box sx={{ position: 'relative', width: 350, height: 350, mx: 'auto', borderRadius: '50%', overflow: 'hidden' }}>
            <video ref={livePhotoHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <canvas ref={livePhotoHook.canvasRef} style={{ display: 'none' }} />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={govIdHook.showCamera} onClose={govIdHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>Personalausweis-Verifizierung<IconButton onClick={govIdHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Zeigen Sie Ihren <strong>Personalausweis oder Reisepass</strong> der Kamera.</Alert>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 400, mx: 'auto', border: `2px solid ${primaryColor}`, borderRadius: 2, overflow: 'hidden' }}>
            <video ref={govIdHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={govIdHook.canvasRef} style={{ display: 'none' }} />
            {govIdHook.processing && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#fff' }} /></Box>}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" onClick={govIdHook.capturePhoto} disabled={govIdHook.processing} sx={{ bgcolor: primaryColor }}>{govIdHook.processing ? 'Verarbeitung...' : 'Ausweis erfassen'}</Button></Box>
        </DialogContent>
      </Dialog>

      <Dialog open={svnrHook.showCamera} onClose={svnrHook.stopCamera} maxWidth="md" fullWidth>
        <DialogTitle>Sozialversicherungsnummer-Verifizierung<IconButton onClick={svnrHook.stopCamera} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>Zeigen Sie Ihren <strong>Sozialversicherungsausweis</strong>. Format: 12 345678 A 123</Alert>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, height: 400, mx: 'auto', border: `2px solid ${primaryColor}`, borderRadius: 2, overflow: 'hidden' }}>
            <video ref={svnrHook.videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <canvas ref={svnrHook.canvasRef} style={{ display: 'none' }} />
            {svnrHook.processing && <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress sx={{ color: '#fff' }} /></Box>}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}><Button variant="contained" onClick={svnrHook.capturePhoto} disabled={svnrHook.processing} sx={{ bgcolor: primaryColor }}>{svnrHook.processing ? 'Verarbeitung...' : 'SVNR erfassen'}</Button></Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GermanyDocumentVerification;


