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

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
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
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    chunksRef.current = [];
    if (blob.size < 2000) {
      setError('Recording too short. Try again.');
      return;
    }
    setUploading(true);
    try {
      const file = new File([blob], `screening-${Date.now()}.webm`, { type: 'video/webm' });
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
      clearTick();
      stopStream();
    };
  }, [stopStream]);

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const rec = new MediaRecorder(stream, { mimeType: mime });
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
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            maxHeight: 260,
            borderRadius: 12,
            background: '#000',
            objectFit: 'cover',
          }}
        />
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
          <video src={previewSrc} controls style={{ width: '100%', maxHeight: 280, borderRadius: 12 }} />
        </Box>
      )}
    </Box>
  );
};

export default VideoScreeningRecorder;
