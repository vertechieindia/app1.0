/**
 * Record a short webcam video answer for screening questions (WebM).
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Chip, LinearProgress, Typography, Alert } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopIcon from '@mui/icons-material/Stop';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadJobScreeningVideo, resolveUploadsPublicUrl } from '../../services/jobPortalService';

export interface VideoScreeningRecorderProps {
  maxSeconds: number;
  value: string;
  onChange: (videoUrl: string) => void;
  disabled?: boolean;
}

const VideoScreeningRecorder: React.FC<VideoScreeningRecorderProps> = ({
  maxSeconds,
  value,
  onChange,
  disabled = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPreferredMimeType = () => {
    const preferredTypes = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp8',
      'video/webm',
    ];
    return preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) || '';
  };

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  /** Stop recorder + tracks + detach preview — required on unmount (e.g. after submit) or camera may stay on. */
  const releaseAllCapture = useCallback(() => {
    clearTick();
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const clearTick = () => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const stopRecordingAndUpload = useCallback(async () => {
    clearTick();
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      await new Promise<void>((resolve) => {
        rec.addEventListener('stop', () => resolve(), { once: true });
        rec.stop();
      });
    }
    recorderRef.current = null;
    setRecording(false);
    stopStream();
    const mimeType = rec?.mimeType || 'video/webm';
    const blob = new Blob(chunksRef.current, { type: mimeType });
    chunksRef.current = [];
    if (blob.size < 2000) {
      setError('Recording too short. Try again.');
      return;
    }
    setUploading(true);
    try {
      const file = new File([blob], `screening-${Date.now()}.webm`, { type: mimeType });
      const url = await uploadJobScreeningVideo(file);
      onChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onChange, stopStream]);

  useEffect(() => {
    return () => {
      releaseAllCapture();
    };
  }, [releaseAllCapture]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!recording || !video || !stream) return;

    video.srcObject = stream;
    void video.play().catch(() => {
      // Ignore autoplay timing issues; the user already initiated recording.
    });
  }, [recording]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280, max: 1280 },
          height: { ideal: 720, max: 720 },
          aspectRatio: { ideal: 16 / 9 },
        },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const mimeType = getPreferredMimeType();
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.start(200);
      setRecording(true);
      setSeconds(0);
      let elapsed = 0;
      tickRef.current = window.setInterval(() => {
        elapsed += 1;
        setSeconds(elapsed);
        if (elapsed >= maxSeconds) {
          void stopRecordingAndUpload();
        }
      }, 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not access camera/microphone');
    }
  };

  const previewSrc = value ? resolveUploadsPublicUrl(value) : '';

  return (
    <Box data-allow-paste="true">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 2 }}>
        <Chip
          icon={<VideocamIcon />}
          label={recording ? `Recording ${seconds}s / ${maxSeconds}s max` : 'Video answer'}
          color={recording ? 'error' : 'default'}
        />
        {recording && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (seconds / maxSeconds) * 100)}
            sx={{ flex: 1, minWidth: 120 }}
          />
        )}
      </Box>
      {recording && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 920,
            aspectRatio: '16 / 9',
            maxHeight: { xs: 220, sm: 280, md: 320 },
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#000',
            border: '1px solid rgba(15, 23, 42, 0.08)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              background: '#000',
              objectFit: 'contain',
            }}
          />
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
        {!recording && !uploading && (
          <Button
            variant="contained"
            startIcon={<VideocamIcon />}
            onClick={() => void startRecording()}
            disabled={disabled}
            sx={{ textTransform: 'none' }}
          >
            Start video
          </Button>
        )}
        {recording && (
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            onClick={() => void stopRecordingAndUpload()}
            sx={{ textTransform: 'none' }}
          >
            Stop & upload
          </Button>
        )}
        {uploading && (
          <Button disabled startIcon={<CloudUploadIcon />}>
            Uploading…
          </Button>
        )}
      </Box>
      {previewSrc && !recording && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Uploaded video
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: 920,
              aspectRatio: '16 / 9',
              maxHeight: { xs: 220, sm: 280, md: 320 },
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#000',
            }}
          >
            <video
              src={previewSrc}
              controls
              playsInline
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                background: '#000',
                objectFit: 'contain',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VideoScreeningRecorder;
