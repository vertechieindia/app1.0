/**
 * Mobile Preview Component
 * 
 * Shows mobile emulator/simulator preview with device frame.
 * Supports iOS and Android devices.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  CircularProgress,
  Chip,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Screenshot as ScreenshotIcon,
  RotateRight as RotateIcon,
  PhoneAndroid as AndroidIcon,
  PhoneIphone as IosIcon,
  Tablet as TabletIcon,
  Home as HomeIcon,
  ArrowBack as BackIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Videocam as RecordIcon,
} from '@mui/icons-material';
import { ideService } from '../../services/IDEService';

// Device configurations
const DEVICES = {
  ios: [
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', width: 393, height: 852, notch: true },
    { id: 'iphone-15', name: 'iPhone 15', width: 390, height: 844, notch: true },
    { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, notch: false },
    { id: 'ipad-pro', name: 'iPad Pro 12.9"', width: 1024, height: 1366, notch: false },
  ],
  android: [
    { id: 'pixel-8', name: 'Pixel 8', width: 412, height: 915, notch: true },
    { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, notch: true },
    { id: 'samsung-s24', name: 'Samsung S24', width: 412, height: 915, notch: true },
    { id: 'tablet', name: 'Android Tablet', width: 800, height: 1280, notch: false },
  ],
};

interface MobilePreviewProps {
  projectId?: string;
  previewUrl?: string;
  onScreenshot?: (imageData: string) => void;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({
  projectId,
  previewUrl,
  onScreenshot,
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  const devices = DEVICES[platform];
  const currentDevice = devices[deviceIndex];
  
  // Calculate device dimensions
  const scale = 0.6; // Scale down for preview
  const deviceWidth = isLandscape ? currentDevice.height : currentDevice.width;
  const deviceHeight = isLandscape ? currentDevice.width : currentDevice.height;
  const scaledWidth = deviceWidth * scale;
  const scaledHeight = deviceHeight * scale;
  
  // Handle platform change
  const handlePlatformChange = (newPlatform: 'ios' | 'android') => {
    setPlatform(newPlatform);
    setDeviceIndex(0);
  };
  
  // Handle device change
  const handleDeviceChange = (index: number) => {
    setDeviceIndex(index);
  };
  
  // Toggle orientation
  const toggleOrientation = () => {
    setIsLandscape(!isLandscape);
  };
  
  // Start emulator
  const handleStart = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would call the emulator API
      // const result = await ideService.startEmulator(projectId, currentDevice.id);
      // setSessionId(result.id);
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to start emulator:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Stop emulator
  const handleStop = async () => {
    if (sessionId) {
      // await ideService.stopEmulator(sessionId);
    }
    setIsRunning(false);
    setSessionId(null);
  };
  
  // Take screenshot
  const handleScreenshot = async () => {
    if (!sessionId) return;
    
    try {
      // const result = await ideService.emulatorScreenshot(sessionId);
      // if (onScreenshot) onScreenshot(result.image);
      console.log('Screenshot taken');
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  };
  
  // Toggle recording
  const handleRecord = () => {
    setIsRecording(!isRecording);
    // In real implementation, start/stop recording via API
  };
  
  // Refresh preview
  const handleRefresh = () => {
    // Reload the iframe/webview
    const iframe = document.getElementById('mobile-preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Platform Toggle */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="iOS">
            <IconButton
              size="small"
              color={platform === 'ios' ? 'primary' : 'default'}
              onClick={() => handlePlatformChange('ios')}
            >
              <IosIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Android">
            <IconButton
              size="small"
              color={platform === 'android' ? 'primary' : 'default'}
              onClick={() => handlePlatformChange('android')}
            >
              <AndroidIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Divider orientation="vertical" flexItem />
        
        {/* Device Selector */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={deviceIndex}
            onChange={(e) => handleDeviceChange(e.target.value as number)}
          >
            {devices.map((device, index) => (
              <MenuItem key={device.id} value={index}>
                {device.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Orientation */}
        <Tooltip title="Rotate">
          <IconButton size="small" onClick={toggleOrientation}>
            <RotateIcon />
          </IconButton>
        </Tooltip>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Controls */}
        {!isRunning ? (
          <Button
            size="small"
            variant="contained"
            startIcon={loading ? <CircularProgress size={14} /> : <StartIcon />}
            onClick={handleStart}
            disabled={loading}
          >
            Start
          </Button>
        ) : (
          <>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Screenshot">
              <IconButton size="small" onClick={handleScreenshot}>
                <ScreenshotIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={isRecording ? 'Stop Recording' : 'Record'}>
              <IconButton
                size="small"
                color={isRecording ? 'error' : 'default'}
                onClick={handleRecord}
              >
                <RecordIcon />
              </IconButton>
            </Tooltip>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<StopIcon />}
              onClick={handleStop}
            >
              Stop
            </Button>
          </>
        )}
        
        <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MoreIcon />
        </IconButton>
        
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => { handleScreenshot(); setMenuAnchor(null); }}>
            <ListItemIcon><ScreenshotIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Take Screenshot</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); }}>
            <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Download Recording</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      
      {/* Device Preview */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#1a1a1a',
          overflow: 'auto',
          p: 2,
        }}
      >
        {/* Device Frame */}
        <Box
          sx={{
            position: 'relative',
            width: scaledWidth + 20,
            height: scaledHeight + 20,
            bgcolor: platform === 'ios' ? '#1c1c1e' : '#1a1a1a',
            borderRadius: platform === 'ios' ? 6 : 4,
            p: '10px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Status Bar (iOS) */}
          {platform === 'ios' && currentDevice.notch && (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: scaledWidth * 0.4,
                height: 30 * scale,
                bgcolor: '#000',
                borderRadius: 2,
                zIndex: 10,
              }}
            />
          )}
          
          {/* Screen */}
          <Box
            sx={{
              width: scaledWidth,
              height: scaledHeight,
              bgcolor: '#000',
              borderRadius: platform === 'ios' ? 4 : 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {isRunning ? (
              <iframe
                id="mobile-preview-iframe"
                src={previewUrl || 'about:blank'}
                style={{
                  width: deviceWidth,
                  height: deviceHeight,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  border: 'none',
                }}
                title="Mobile Preview"
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                {platform === 'ios' ? <IosIcon sx={{ fontSize: 48 }} /> : <AndroidIcon sx={{ fontSize: 48 }} />}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {currentDevice.name}
                </Typography>
                <Typography variant="caption">
                  {deviceWidth} × {deviceHeight}
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Home Indicator (iOS) */}
          {platform === 'ios' && !currentDevice.notch && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 15,
                left: '50%',
                transform: 'translateX(-50%)',
                width: scaledWidth * 0.35,
                height: 4 * scale,
                bgcolor: 'rgba(255,255,255,0.3)',
                borderRadius: 2,
              }}
            />
          )}
          
          {/* Navigation Bar (Android) */}
          {platform === 'android' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 4,
              }}
            >
              <BackIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
              <HomeIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Device Info */}
      <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Chip
          size="small"
          icon={platform === 'ios' ? <IosIcon /> : <AndroidIcon />}
          label={`${currentDevice.name} • ${deviceWidth}×${deviceHeight}`}
        />
      </Box>
    </Box>
  );
};

export default MobilePreview;

