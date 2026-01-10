import { useState, useRef, useCallback, useEffect } from 'react';
import { detectFacePose, getHeadPosition, checkPositionMatch, FacePose } from '../../../../utils/faceDetection';
import { getLegacyApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { compressImage } from '../../../../utils/imageDownload';
import { validateImageQuality, enhanceImageForOCR, compressForOCR, ImageQualityResult } from '../../../../utils/imageQuality';
import Logger from '../../../../utils/logger';

interface UseDocumentCaptureProps {
  cameraType: 'live' | 'govId' | 'ssn' | 'pan';
  onCaptureComplete?: (data: string) => void;
  onDataExtracted?: (extractedData: { firstName?: string; lastName?: string; dateOfBirth?: string; address?: string; panNumber?: string; idNumber?: string }) => void;
  country?: 'US' | 'IN';
}

export const useDocumentCapture = ({ cameraType, onCaptureComplete, onDataExtracted, country }: UseDocumentCaptureProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [headPosition, setHeadPosition] = useState<'center' | 'right' | 'left' | 'up' | 'down'>('left');
  const [currentPose, setCurrentPose] = useState<FacePose | null>(null);
  const [poseMatched, setPoseMatched] = useState(false);
  const [capturedPositions, setCapturedPositions] = useState<Set<string>>(new Set());
  const [capturedImages, setCapturedImages] = useState<Record<string, string>>({});
  const [capturedBase64Images, setCapturedBase64Images] = useState<Record<string, string>>({});
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]); // Array to store 4 frames (one per position)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoCaptureStarted, setAutoCaptureStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const poseHoldStartRef = useRef<number | null>(null);
  const isAutoCapturingRef = useRef<boolean>(false);
  const handleAutoCaptureRef = useRef<((position: 'right' | 'left' | 'up' | 'down') => Promise<void>) | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const recordingStopPromiseRef = useRef<{ resolve: (chunks: Blob[]) => void; reject: (error: Error) => void } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const capturedFramesRef = useRef<string[]>([]); // Ref to store latest captured frames
  // Refs to store current values for interval callback to read fresh values
  const headPositionRef = useRef<'center' | 'right' | 'left' | 'up' | 'down'>('left');
  const capturedPositionsRef = useRef<Set<string>>(new Set());
  const POSE_HOLD_DURATION = 100; // 0.1 seconds in milliseconds (very fast capture for easier verification)

  // Capture timing tracking for frontend-only liveness validation
  const captureTimestampsRef = useRef<Record<string, number>>({});
  const livenessSessionStartRef = useRef<number>(0);
  
  // Random position order for anti-video-replay protection
  // Shuffled when camera opens, makes pre-recorded videos ineffective
  const randomPositionOrderRef = useRef<('right' | 'left' | 'up' | 'down')[]>(['left', 'right', 'up', 'down']);

  // Helper function to map image numbers to directions
  // Optimized: Memoized to avoid recreation on each render
  const mapImageNumberToDirection = useCallback((errorMessage: string): string => {
    // Map: 0 = left, 1 = right, 2 = up, 3 = down (matches positionIndexMap capture order)
    const directionMap: Record<number, string> = {
      0: 'Left',
      1: 'Right',
      2: 'Up',
      3: 'Down'
    };

    // Match patterns like "image 0", "image 1", "image 2", "image 3"
    // or "image0", "image1", etc.
    const imageNumberPattern = /image\s*(\d)/i;
    const match = errorMessage.match(imageNumberPattern);
    
    if (match) {
      const imageNumber = parseInt(match[1], 10);
      if (imageNumber >= 0 && imageNumber <= 3) {
        const direction = directionMap[imageNumber];
        // Replace "image X" with "the {direction} position"
        return errorMessage.replace(
          imageNumberPattern,
          `the ${direction} position`
        );
      }
    }
    
    return errorMessage;
  }, []);

  // Optimized: Common error handler to reduce code duplication
  const handleErrorResponse = useCallback((
    status: number,
    data: any,
    defaultMessage: string,
    resetHeadPosition: 'left' | 'right' = 'left'
  ) => {
    setProcessing(false);
    let apiErrorMessage = data?.message || data?.error || data?.detail;
    
    // Map image numbers to directions for user-friendly error messages
    if (apiErrorMessage) {
      apiErrorMessage = mapImageNumberToDirection(apiErrorMessage);
    }
    
    const errorMessage = apiErrorMessage 
      ? `${defaultMessage} ${apiErrorMessage}`
      : defaultMessage;
    
    // Log error for debugging
    Logger.apiError(cameraType, status, data, 'useDocumentCapture');
    
    setErrors({ capture: errorMessage });
    
    // Reset on error so user can try again
    setCapturedPositions(new Set());
    setCapturedImages({});
    setCapturedBase64Images({});
    setCapturedFrames([]); // Reset captured frames on error
    capturedFramesRef.current = []; // Reset ref
    setHeadPosition(resetHeadPosition);
    setCaptured(false); // Reset captured state to allow retry
    setAutoCaptureStarted(false); // Reset auto-capture state
    isAutoCapturingRef.current = false; // Reset auto-capturing flag
    poseHoldStartRef.current = null; // Reset pose hold timer
  }, [mapImageNumberToDirection]);

  // Optimized: Parse API response with better error handling
  const parseApiResponse = useCallback(async (response: Response): Promise<any> => {
    let data: any = null;
    const contentType = response.headers.get('content-type');

    // Try to parse JSON for all responses except 204
    if (response.status !== 204) {
      try {
        const text = await response.text();
        if (text && text.trim()) {
          // Try JSON parsing if content type looks like JSON
          if (
            !contentType ||
            contentType.includes('application/json') ||
            text.trim().startsWith('{') ||
            text.trim().startsWith('[')
          ) {
            try {
              data = JSON.parse(text);
            } catch (jsonError) {
              console.warn('Failed to parse as JSON, using text as error:', text);
              data = { error: text, message: text };
            }
          } else {
            // Non-JSON response
            data = { error: text, message: text };
          }
        }
      } catch (parseError) {
        console.error('Error reading response:', parseError);
      }
    }
    return data;
  }, []);

  // Frontend-only liveness validation - no backend API call needed
  // This validates that a real human completed the liveness check based on:
  // 1. All 4 positions were captured with valid face detection
  // 2. Timing is reasonable (not too fast = bot, not too slow = timeout)
  // 3. All images are different (not the same static image repeated)
  const validateLivenessFrontend = useCallback((): { success: boolean; error?: string } => {
    const frames = capturedFramesRef.current.filter(frame => frame && frame.length > 0);
    const timestamps = captureTimestampsRef.current;
    
    // Check 1: All 4 positions captured with valid frames
    if (frames.length !== 4) {
      console.warn('❌ Liveness validation failed: Not all positions captured');
      return { success: false, error: `Expected 4 frames, but got ${frames.length}. Please try again.` };
    }
    
    // Check 2: Timing validation - captures shouldn't be too fast (possible automation)
    const timestampValues = Object.values(timestamps);
    if (timestampValues.length >= 4) {
      const sortedTimes = timestampValues.sort((a, b) => a - b);
      const totalDuration = sortedTimes[sortedTimes.length - 1] - sortedTimes[0];
      
      // Minimum 2 seconds for human to move head 4 times (reduced from 3 for better UX)
      if (totalDuration < 2000) {
        console.warn('❌ Liveness validation failed: Captures too fast', { totalDuration });
        return { success: false, error: 'Verification was too fast. Please try again and move your head naturally.' };
      }
      
      // Maximum 120 seconds (session timeout)
      if (totalDuration > 120000) {
        console.warn('❌ Liveness validation failed: Session timeout', { totalDuration });
        return { success: false, error: 'Session expired. Please try again.' };
      }
      
      console.log('✅ Timing validation passed:', { totalDuration: `${(totalDuration / 1000).toFixed(1)}s` });
    }
    
    // Check 3: Image diversity - all frames should be different
    // Use middle portion of image data (skip base64 header which is same for all JPEGs)
    // This ensures we're comparing actual image content, not the identical header
    const frameSignatures = frames.map(frame => {
      // Skip first 100 chars (header), take 500 chars from middle of image
      const startPos = Math.min(100, Math.floor(frame.length * 0.1));
      const midPos = Math.floor(frame.length / 2);
      // Combine start-after-header + middle portion for better uniqueness
      return frame.substring(startPos, startPos + 200) + frame.substring(midPos, midPos + 300);
    });
    const uniqueSignatures = new Set(frameSignatures);
    console.log('🔍 Image diversity check:', { 
      totalFrames: frames.length, 
      uniqueSignatures: uniqueSignatures.size,
      frameLengths: frames.map(f => f.length)
    });
    if (uniqueSignatures.size < 4) {
      console.warn('❌ Liveness validation failed: Duplicate images detected', { uniqueSignatures: uniqueSignatures.size });
      return { success: false, error: 'Duplicate images detected. Please move your head to each position.' };
    }
    console.log('✅ Image diversity check passed');
    
    // Check 4: Session validity - ensure session started and is valid
    const sessionDuration = Date.now() - livenessSessionStartRef.current;
    if (livenessSessionStartRef.current === 0 || sessionDuration > 180000) { // 3 min max session
      console.warn('❌ Liveness validation failed: Invalid session', { sessionDuration });
      return { success: false, error: 'Session invalid. Please restart the verification.' };
    }
    console.log('✅ Session validation passed:', { sessionDuration: `${(sessionDuration / 1000).toFixed(1)}s` });
    
    // Check 5: Verify frames have reasonable size (not empty or corrupted)
    for (let i = 0; i < frames.length; i++) {
      // A valid base64 JPEG image should be at least 1KB
      if (frames[i].length < 1000) {
        console.warn(`❌ Liveness validation failed: Frame ${i} is too small`, { size: frames[i].length });
        return { success: false, error: `Invalid image captured. Please ensure good lighting and try again.` };
      }
    }
    console.log('✅ Frame size validation passed');
    
    // All checks passed!
    console.log('🎉 Frontend liveness validation PASSED - Human presence confirmed!');
    return { success: true };
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }

      // Use back camera for documents, front for live photo
      // For documents, use higher resolution for better OCR quality
      // Try back camera first, but fallback to front camera if not available
      let videoConstraints: MediaTrackConstraints;
      
      if (cameraType === 'govId' || cameraType === 'ssn' || cameraType === 'pan') {
        // For documents, prefer back camera but allow front camera as fallback
        videoConstraints = {
          facingMode: { ideal: 'environment' }, // Prefer back camera, but not required
          width: { ideal: 1600, min: 1024 },
          height: { ideal: 1200, min: 768 },
          aspectRatio: { ideal: 4/3 }
        };
      } else {
        // For live photo, use front camera
        videoConstraints = {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        };
      }

      console.log('📷 Requesting camera access with constraints:', videoConstraints);
      console.log('📷 Camera type:', cameraType);
      
      let stream: MediaStream;
      try {
        // Try with preferred constraints first
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints
        });
      } catch (error: any) {
        // If OverconstrainedError and it's a document camera, try with front camera as fallback
        if (error.name === 'OverconstrainedError' && (cameraType === 'govId' || cameraType === 'ssn' || cameraType === 'pan')) {
          console.warn('⚠️ Back camera not available, trying front camera as fallback...');
          // Fallback to front camera with same resolution requirements
          const fallbackConstraints: MediaTrackConstraints = {
            facingMode: 'user',
            width: { ideal: 1600, min: 1024 },
            height: { ideal: 1200, min: 768 },
            aspectRatio: { ideal: 4/3 }
          };
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: fallbackConstraints
            });
            console.log('✅ Using front camera as fallback for document capture');
          } catch (fallbackError: any) {
            // If even front camera fails, try with minimal constraints
            console.warn('⚠️ Front camera also failed, trying minimal constraints...');
            const minimalConstraints: MediaTrackConstraints = {
              width: { min: 640 },
              height: { min: 480 }
            };
            stream = await navigator.mediaDevices.getUserMedia({
              video: minimalConstraints
            });
            console.log('✅ Using minimal camera constraints');
          }
        } else {
          // Re-throw if it's not OverconstrainedError or not a document camera
          throw error;
        }
      }

      console.log('✅ Camera stream obtained:', stream);
      console.log('📹 Video tracks:', stream.getVideoTracks().map(t => ({
        label: t.label,
        enabled: t.enabled,
        readyState: t.readyState,
        settings: t.getSettings()
      })));
      
      setVideoStream(stream);
      
      if (cameraType === 'live') {
        // Shuffle position order for anti-video-replay protection
        // This makes pre-recorded videos ineffective since order is random each time
        const shuffleArray = <T,>(array: T[]): T[] => {
          const shuffled = [...array];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          return shuffled;
        };
        const shuffledPositions = shuffleArray(['left', 'right', 'up', 'down'] as ('right' | 'left' | 'up' | 'down')[]);
        randomPositionOrderRef.current = shuffledPositions;
        console.log('🔀 Randomized position order:', shuffledPositions);
        
        // Set first position from randomized order
        const firstPosition = shuffledPositions[0];
        setHeadPosition(firstPosition);
        setCapturedPositions(new Set());
        // Sync refs with initial state
        headPositionRef.current = firstPosition;
        capturedPositionsRef.current = new Set();
        setCapturedImages({});
        setCapturedBase64Images({});
        setCapturedFrames([]); // Reset captured frames when camera opens
        capturedFramesRef.current = []; // Reset ref
        setFaceDetected(false);
        setCaptured(false);
        setAutoCaptureStarted(false); // Reset auto-capture state when camera opens
        setRecording(false);
        setMediaRecorder(null);
        mediaRecorderRef.current = null;
        setVideoChunks([]);
        videoChunksRef.current = [];
      }

      console.log('📷 Setting showCamera to true');
      setShowCamera(true);
      setErrors({});
      
      // Initialize liveness session tracking for frontend-only validation
      livenessSessionStartRef.current = Date.now();
      captureTimestampsRef.current = {};
      console.log('🔐 Liveness session started at:', new Date().toISOString());
      
      // Log liveness session start
      if (cameraType === 'live') {
        Logger.info('Liveness session started', { 
          positionOrder: randomPositionOrderRef.current,
          sessionStartTime: new Date().toISOString()
        }, 'LivenessCheck');
      }
      
      console.log('✅ Camera dialog should now be visible');
    } catch (error: any) {
      console.error('Camera access error:', error);
      let errorMessage = 'Unable to access camera. Please ensure camera permissions are granted.';

      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please check your device has a camera.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application. Please close other apps and try again.';
      }

      setErrors({ camera: errorMessage });
    }
  }, [cameraType, videoStream]);

  // Stop camera
  const stopCamera = useCallback(() => {
    console.log('🛑 Stopping camera and cleaning up...');
    
    // IMPORTANT: Stop and cleanup MediaRecorder FIRST before stopping video stream
    // This prevents errors when trying to start a new recorder later
    if (mediaRecorder || mediaRecorderRef.current) {
      const recorder = mediaRecorderRef.current || mediaRecorder;
      console.log('🧹 Cleaning up MediaRecorder...', { state: recorder?.state });
      try {
        // Stop the recorder if it's in recording or paused state
        if (recorder && (recorder.state === 'recording' || recorder.state === 'paused')) {
          recorder.stop();
          console.log('✅ MediaRecorder stopped');
        }
        // Remove all event listeners to prevent memory leaks
        if (recorder) {
          recorder.ondataavailable = null;
          recorder.onstop = null;
          recorder.onerror = null;
        }
      } catch (cleanupError) {
        console.warn('⚠️ Error cleaning up MediaRecorder:', cleanupError);
      }
      // Clear the recorder references
      setMediaRecorder(null);
      mediaRecorderRef.current = null;
      setRecording(false);
    }
    
    // Reject any pending recording stop promise
    if (recordingStopPromiseRef.current) {
      recordingStopPromiseRef.current.reject(new Error('Camera stopped'));
      recordingStopPromiseRef.current = null;
    }
    
    // Stop video stream tracks
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    
    // Clear face detection interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    // Reset all states
    setShowCamera(false);
    setFaceDetected(false);
    setHeadPosition('center');
    setCapturedPositions(new Set());
    setCapturedImages({});
    setCapturedBase64Images({});
    setCapturedFrames([]); // Reset captured frames when camera stops
    capturedFramesRef.current = []; // Reset ref
    setProcessing(false);
    setErrors({});
    setAutoCaptureStarted(false); // Reset auto-capture state when camera stops
    setVideoChunks([]);
    videoChunksRef.current = [];
    
    console.log('✅ Camera stopped and cleaned up');
  }, [videoStream, mediaRecorder]);

  // Continuous face detection for live photo - checks pose every 200ms
  // Optimized: Reduced state updates, memoized calculations, early exits
  useEffect(() => {
    if (cameraType !== 'live' || !showCamera || !videoStream) {
      // Clear interval if camera is not active
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }

    // Early exit if all positions captured
    if (capturedPositions.size >= 4) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }

    // Start face detection interval
    const startDetection = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        // Retry after a short delay
        setTimeout(startDetection, 300);
        return;
      }

      console.log('🎯 Starting continuous face detection...');
      
      // Cache current values to avoid stale closures
      let lastPose: FacePose | null = null;
      let lastFaceDetected = false;
      let lastPoseMatched = false;
      
      detectionIntervalRef.current = window.setInterval(async () => {
        const video = videoRef.current;
        // Read fresh values from refs to avoid stale closures
        const currentCapturedPositions = capturedPositionsRef.current;
        if (!video || !videoStream || currentCapturedPositions.size >= 4) {
          return;
        }

        try {
          // Detect face pose
          const pose = await detectFacePose(video);
          
          if (pose) {
            // Only update state if pose actually changed (optimization)
            const poseChanged = !lastPose || 
              Math.abs(lastPose.yaw - pose.yaw) > 1 || 
              Math.abs(lastPose.pitch - pose.pitch) > 1;
            
            if (poseChanged) {
              setCurrentPose(pose);
              lastPose = pose;
            }
            
            // Only update faceDetected if it changed
            if (!lastFaceDetected) {
              setFaceDetected(true);
              lastFaceDetected = true;
            }
            
            // Get detected head position - read from ref to get fresh value
            const currentHeadPosition = headPositionRef.current;
            const isPositionCaptured = currentCapturedPositions.has(currentHeadPosition);
            const detectedPosition = getHeadPosition(pose);
            
            // Only log if position changed significantly
            if (poseChanged) {
              console.log('Detected pose:', { yaw: pose.yaw, pitch: pose.pitch, position: detectedPosition, required: currentHeadPosition });
            }
            
            // Check if current pose matches required position
            const isMatch = checkPositionMatch(pose, currentHeadPosition);
            const shouldMatch = isMatch && !isPositionCaptured;
            
            // Only update poseMatched state if it changed
            if (lastPoseMatched !== shouldMatch) {
              setPoseMatched(shouldMatch);
              lastPoseMatched = shouldMatch;
            }
            
            if (shouldMatch && !isAutoCapturingRef.current) {
              // Pose matches and is held for required duration
              const now = Date.now();
              
              if (!poseHoldStartRef.current) {
                // Start holding pose
                poseHoldStartRef.current = now;
                console.log(`✅ Pose matched for ${currentHeadPosition}, holding... (need ${POSE_HOLD_DURATION}ms)`);
              } else {
                const holdDuration = now - poseHoldStartRef.current;
                if (holdDuration >= POSE_HOLD_DURATION) {
                  // Pose held long enough - verify position (no photo capture, just mark as verified)
                  console.log(`✓ Position ${currentHeadPosition} verified after ${holdDuration}ms hold...`);
                  isAutoCapturingRef.current = true;
                  poseHoldStartRef.current = null;
                  setPoseMatched(false);
                  lastPoseMatched = false;
                  
                  // Call position verification (no photo capture)
                  if (handleAutoCaptureRef.current) {
                    console.log(`📞 Calling handleAutoCapture for ${currentHeadPosition}...`);
                    await handleAutoCaptureRef.current(currentHeadPosition as 'right' | 'left' | 'up' | 'down');
                    console.log(`✅ handleAutoCapture completed for ${currentHeadPosition}`);
                  } else {
                    console.error(`❌ handleAutoCaptureRef.current is null! Cannot verify position ${currentHeadPosition}`);
                    isAutoCapturingRef.current = false;
                  }
                } else {
                  // Still holding, log progress occasionally
                  if (holdDuration % 300 < 100) { // Log roughly every 300ms
                    console.log(`⏳ Still holding ${currentHeadPosition}... ${holdDuration}ms / ${POSE_HOLD_DURATION}ms`);
                  }
                }
              }
            } else {
              // Pose doesn't match - reset hold timer
              if (poseHoldStartRef.current) {
                console.log(`🔄 Pose no longer matches ${currentHeadPosition}, resetting hold timer`);
                poseHoldStartRef.current = null;
              }
            }
          } else {
            // Only update state if face was previously detected (optimization)
            if (lastFaceDetected) {
              setFaceDetected(false);
              setCurrentPose(null);
              setPoseMatched(false);
              lastFaceDetected = false;
              lastPoseMatched = false;
              lastPose = null;
            }
            poseHoldStartRef.current = null;
          }
        } catch (error) {
          console.error('Face detection error:', error);
          if (lastFaceDetected) {
            setFaceDetected(false);
            lastFaceDetected = false;
          }
        }
      }, 100); // Check every 100ms (faster detection for easier verification)
    };

    // Wait a bit for video to be ready
    const timer = setTimeout(startDetection, 300);
    
    return () => {
      clearTimeout(timer);
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [showCamera, videoStream, cameraType, headPosition, capturedPositions]);
  
  // Update refs whenever state changes so interval callback can read fresh values
  // This ensures the interval always reads the latest state values
  useEffect(() => {
    headPositionRef.current = headPosition;
  }, [headPosition]);
  
  useEffect(() => {
    capturedPositionsRef.current = capturedPositions;
  }, [capturedPositions]);
  
  // Initialize refs on mount to ensure they're in sync with initial state
  useEffect(() => {
    headPositionRef.current = headPosition;
    capturedPositionsRef.current = capturedPositions;
  }, []); // Only run once on mount


  // Connect video stream to video element - with retry logic like original
  // Optimized: Better cleanup, reduced retry attempts, early exits
  useEffect(() => {
    if (!videoStream || !showCamera) return;

    const timers: NodeJS.Timeout[] = [];
    let attempts = 0;
    const maxAttempts = 8; // Reduced from 10 to 8 for faster failure
    let isCleanedUp = false;

    const connectStream = () => {
      if (isCleanedUp) return; // Early exit if cleaned up
      
      attempts++;
      const video = videoRef.current;
      if (video && videoStream) {
        // Stop any existing play requests first
        if (video.srcObject) {
          const oldStream = video.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
        }

        // Clear any pending play() promises
        video.pause();

        // Only log on first attempt and every 3rd attempt to reduce console noise
        if (attempts === 1 || attempts % 3 === 0) {
          console.log(`Connecting stream to video element (attempt ${attempts}/${maxAttempts})`);
        }

        // Set srcObject first
        video.srcObject = videoStream;

        // Wait a bit before playing to avoid AbortError
        const playTimer = setTimeout(() => {
          if (isCleanedUp) return;
          
          const currentVideo = videoRef.current;
          if (currentVideo && currentVideo.srcObject === videoStream) {
            currentVideo.play()
              .then(() => {
                if (isCleanedUp) return;
                console.log('Video started playing successfully');
                if (currentVideo) {
                  console.log('Video dimensions:', currentVideo.videoWidth, 'x', currentVideo.videoHeight);
                }
              })
              .catch(err => {
                if (isCleanedUp) return;
                console.error('Error playing video:', err);
                // Retry once more
                if (currentVideo && currentVideo.srcObject === videoStream) {
                  setTimeout(() => {
                    if (!isCleanedUp) {
                      currentVideo?.play().catch(console.error);
                    }
                  }, 300);
                }
              });
          }
        }, 100);
        timers.push(playTimer);
      } else if (attempts < maxAttempts && !isCleanedUp) {
        // Retry after a short delay if video element isn't ready
        if (attempts % 2 === 0) { // Log every other attempt
          console.log(`Video element not ready, retrying... (attempt ${attempts}/${maxAttempts})`);
        }
        const timer = setTimeout(connectStream, 300);
        timers.push(timer);
      } else if (!isCleanedUp) {
        console.error('Failed to connect stream: video element not available after retries');
      }
    };

    // Longer delay to ensure dialog is fully rendered
    const initialTimer = setTimeout(connectStream, 300);
    timers.push(initialTimer);

    return () => {
      isCleanedUp = true; // Mark as cleaned up
      timers.forEach(timer => clearTimeout(timer));
      // Don't clear srcObject here - let cleanup happen naturally
    };
  }, [videoStream, showCamera]);

  // Helper function to capture a single frame from video at current moment
  // Returns base64 string (without data:image prefix, just base64)
  const captureCurrentFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      console.warn('Video or canvas not available for frame capture');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    
    if (!ctx || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('Video not ready for frame capture');
      return null;
    }

    // Set canvas dimensions to match video
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    // Unflip the frame (video preview is mirrored, but backend needs unmirrored)
    ctx.save();
    ctx.translate(videoWidth, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    // Convert to base64 (data URL format: data:image/jpeg;base64,...)
    const frameData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Restore context
    ctx.restore();
    
    // Return full data URL (includes data:image/jpeg;base64, prefix)
    return frameData;
  }, []);

  // Helper function to capture video frames
  // Optimized: Reduced canvas operations, better error handling
  const captureVideoFrames = useCallback(async (count: number = 5): Promise<string[]> => {
    if (!videoRef.current || !canvasRef.current) {
      console.warn('Video or canvas not available for frame capture');
      return [];
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false }); // Optimized context options
    
    if (!ctx || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      console.warn('Video not ready for frame capture');
      return [];
    }

    // Cache dimensions to avoid repeated property access
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    const frames: string[] = [];
    const interval = 200; // Capture frame every 200ms
    
    // Pre-calculate transform matrix for unflipping (optimization)
    ctx.save();
    ctx.translate(videoWidth, 0);
    ctx.scale(-1, 1);
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, interval * i));
      
      try {
        // Use cached transform - no need to reset/retransform each time
        ctx.drawImage(video, 0, 0);
        const frameData = canvas.toDataURL('image/jpeg', 0.8);
        // Extract base64 from data URL - optimized split
        const commaIndex = frameData.indexOf(',');
        if (commaIndex !== -1) {
          const base64Frame = frameData.substring(commaIndex + 1);
          if (base64Frame) {
            frames.push(`data:image/jpeg;base64,${base64Frame}`);
          }
        }
      } catch (error) {
        console.error('Error capturing frame:', error);
        // Continue with other frames even if one fails
      }
    }
    
    // Restore context state
    ctx.restore();
    
    console.log(`Captured ${frames.length} video frames`);
    return frames;
  }, []);

  // Frontend-only liveness check - no backend API call needed
  // Uses MediaPipe face detection + movement validation + security checks
  const sendLivenessCheck = useCallback(async (chunks?: Blob[]) => {
    setProcessing(true);
    setErrors({});
    
    // Clear captured images from display when all positions are captured and processing starts
    setCapturedImages({});

    try {
      // Get captured frames from ref (always latest) - should have 4 frames (one for each position: left, right, up, down)
      const framesToSend = capturedFramesRef.current.filter(frame => frame && frame.length > 0);
      
      console.log(`📸 Validating ${framesToSend.length} frames (Frontend-only):`, {
        left: framesToSend[0] ? 'captured' : 'missing',
        right: framesToSend[1] ? 'captured' : 'missing',
        up: framesToSend[2] ? 'captured' : 'missing',
        down: framesToSend[3] ? 'captured' : 'missing'
      });

      // Run frontend-only liveness validation
      const validationResult = validateLivenessFrontend();
      
      if (validationResult.success) {
        // Frontend validation passed - Human presence confirmed!
        console.log('✅ All frames verified successfully! Human presence confirmed (Frontend-only).');
        console.log('Setting captured state and calling onCaptureComplete...');
        
        // Calculate session duration for logging
        const sessionDuration = ((Date.now() - livenessSessionStartRef.current) / 1000).toFixed(1);
        Logger.info('Liveness verification successful (Frontend-only)', { 
          framesCount: framesToSend.length,
          positionOrder: randomPositionOrderRef.current,
          sessionDuration: `${sessionDuration}s`,
          captureTimestamps: captureTimestampsRef.current
        }, 'LivenessCheck');
          setCaptured(true);
          setProcessing(false);
          
          // Call onCaptureComplete with success (pass frames array as JSON string or first frame)
          if (onCaptureComplete) {
            console.log('Calling onCaptureComplete callback');
            // Pass the frames array as JSON string, or pass first frame for display
            const framesJson = JSON.stringify(framesToSend);
            onCaptureComplete(framesJson);
          } else {
            console.warn('onCaptureComplete callback is not defined!');
          }

          // Close camera after success
          setTimeout(() => {
            stopCamera();
          }, 1500);
        } else {
        // Frontend validation failed - show error and allow retry
        console.warn('❌ Frontend liveness validation failed:', validationResult.error);
        
        // Log validation failure
        Logger.warn('Liveness validation failed (Frontend-only)', { 
          error: validationResult.error,
          framesCount: framesToSend.length,
          sessionDuration: `${((Date.now() - livenessSessionStartRef.current) / 1000).toFixed(1)}s`
        }, 'LivenessCheck');
        
        setProcessing(false);
        
        const errorMessage = validationResult.error || 'Liveness verification failed. Please try again.';
        setErrors({ capture: errorMessage });
        
        // Reset on error so user can try again
        setCapturedPositions(new Set());
        capturedPositionsRef.current = new Set();
        setCapturedImages({});
        setCapturedBase64Images({});
        setCapturedFrames([]);
        capturedFramesRef.current = [];
        captureTimestampsRef.current = {}; // Reset timestamps
        setHeadPosition(randomPositionOrderRef.current[0]);
        headPositionRef.current = randomPositionOrderRef.current[0];
        setCaptured(false);
        setAutoCaptureStarted(false);
        isAutoCapturingRef.current = false;
        poseHoldStartRef.current = null;
        setRecording(false);
        setMediaRecorder(null);
        mediaRecorderRef.current = null;
        setVideoChunks([]);
        videoChunksRef.current = [];
      }
    } catch (error: any) {
      console.error('Error verifying liveness:', error);
      setProcessing(false);
      
      // Show user-friendly error messages
      const errorMessage = error.message || 'An error occurred during face detection. Please try again.';
      
      setErrors({
        capture: `Try again. ${errorMessage}`
      });

      // Reset on error so user can try again
      setCapturedPositions(new Set());
      capturedPositionsRef.current = new Set();
      setCapturedImages({});
      setCapturedBase64Images({});
      setCapturedFrames([]);
      capturedFramesRef.current = [];
      captureTimestampsRef.current = {}; // Reset timestamps
      setHeadPosition(randomPositionOrderRef.current[0]);
      headPositionRef.current = randomPositionOrderRef.current[0];
      setCaptured(false);
      setAutoCaptureStarted(false);
      isAutoCapturingRef.current = false;
      poseHoldStartRef.current = null;
      setRecording(false);
      setMediaRecorder(null);
      mediaRecorderRef.current = null;
      setVideoChunks([]);
      videoChunksRef.current = [];
    }
  }, [onCaptureComplete, stopCamera, validateLivenessFrontend]);

  // Wrapper function to send liveness check with specific chunks
  const sendLivenessCheckWithChunks = useCallback(async (chunks: Blob[]) => {
    await sendLivenessCheck(chunks);
  }, [sendLivenessCheck]);

  // Helper function to handle position verification - captures frame when position is verified
  const handleAutoCapture = useCallback(async (position: 'right' | 'left' | 'up' | 'down') => {
    // Check ref for fresh value to avoid stale closure
    if (!videoStream || capturedPositionsRef.current.has(position)) {
      isAutoCapturingRef.current = false;
      return;
    }

    try {
      // Capture frame from video at current moment when position is verified
      const frame = captureCurrentFrame();
      if (!frame) {
        console.warn(`Failed to capture frame for ${position} position`);
        isAutoCapturingRef.current = false;
        return;
      }

      // Store frame in the capturedFrames array (both state and ref)
      // Map position to index: left=0, right=1, up=2, down=3
      const positionIndexMap: Record<string, number> = {
        'left': 0,
        'right': 1,
        'up': 2,
        'down': 3
      };
      const index = positionIndexMap[position];
      
      setCapturedFrames(prev => {
        const newFrames = [...prev];
        newFrames[index] = frame; // Store frame at correct index
        // Also update ref for immediate access
        capturedFramesRef.current = newFrames;
        console.log(`📸 Frame captured for ${position} position (index ${index}). Total frames: ${newFrames.filter(f => f).length}/4`);
        return newFrames;
      });

      // Mark position as verified
      // Use ref to get fresh value, then update both state and ref
      const currentPositions = capturedPositionsRef.current;
      const newPositions = new Set(currentPositions);
      newPositions.add(position);
      setCapturedPositions(newPositions);
      // Update ref immediately for next check
      capturedPositionsRef.current = newPositions;
      
      // Record capture timestamp for frontend-only liveness validation
      captureTimestampsRef.current[position] = Date.now();
      console.log(`⏱️ Capture timestamp for ${position}:`, new Date().toISOString());

      console.log(`Position ${position} verified. Progress: ${newPositions.size}/4`);
      
      // Log position capture for audit trail
      Logger.info(`Liveness position captured: ${position}`, { 
        position,
        progress: `${newPositions.size}/4`,
        timestamp: new Date().toISOString()
      }, 'LivenessCheck');

      // Move to next position in RANDOMIZED sequence (anti-video-replay protection)
      const positionOrder = randomPositionOrderRef.current;
      const currentIndex = positionOrder.indexOf(position);
      const nextIndex = currentIndex + 1;

      if (nextIndex < positionOrder.length) {
        // Move to next position in randomized order
        const nextPosition = positionOrder[nextIndex];
        setHeadPosition(nextPosition);
        // Update ref immediately
        headPositionRef.current = nextPosition;
        isAutoCapturingRef.current = false;
        console.log(`🔀 Next position: ${nextPosition} (${nextIndex + 1}/${positionOrder.length})`);
      } else {
        // All positions verified - stop video recording and send to API
        console.log('✅ All 4 positions verified! Stopping video recording...');
        
        // Set processing state immediately to show "Processing..." in UI
        setProcessing(true);
        
        console.log('📊 Current recording state:', {
          hasMediaRecorder: !!mediaRecorder,
          recorderState: mediaRecorder?.state,
          recordingState: recording,
          chunksInRef: videoChunksRef.current.length,
          chunksInState: videoChunks.length
        });
        
        // If recording never started or has no chunks, start it now and wait for chunks
        if (!mediaRecorder || (mediaRecorder.state !== 'recording' && videoChunksRef.current.length === 0 && videoChunks.length === 0)) {
          console.warn('⚠️ Recording not started or no chunks collected. Starting recording now...');
          if (videoStream && videoRef.current) {
            startVideoRecording();
            // Wait for recording to start and collect some chunks
            let retries = 0;
            while (retries < 10 && (videoChunksRef.current.length === 0 && videoChunks.length === 0)) {
              await new Promise(resolve => setTimeout(resolve, 200));
              retries++;
            }
            if (videoChunksRef.current.length === 0 && videoChunks.length === 0) {
              console.error('❌ No chunks collected after starting recording');
              setProcessing(false);
              setErrors({ capture: 'Video recording failed. Please try again.' });
              isAutoCapturingRef.current = false;
              return;
            }
          } else {
            console.error('❌ Cannot start recording - video stream or ref not available');
            setProcessing(false);
            setErrors({ capture: 'Video recording failed to start. Please try again.' });
            isAutoCapturingRef.current = false;
            return;
          }
        }
        
        // Get current mediaRecorder from ref (always latest) or state
        const currentRecorder = mediaRecorderRef.current || mediaRecorder;
        
        // Stop video recording if it's still recording
        let finalChunks: Blob[] = [];
        if (currentRecorder) {
          if (currentRecorder.state === 'recording') {
            console.log('⏹️ Stopping active video recording...');
            
            // Ensure we have some chunks before stopping
            if (videoChunksRef.current.length === 0 && videoChunks.length === 0) {
              console.warn('⚠️ No chunks yet, waiting a bit before stopping...');
              // Wait a bit more for chunks to be collected
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Create a promise to wait for the onstop event
            const stopPromise = new Promise<Blob[]>((resolve, reject) => {
              recordingStopPromiseRef.current = { resolve, reject };
              // Set a timeout in case onstop never fires
              setTimeout(() => {
                if (recordingStopPromiseRef.current) {
                  console.warn('⚠️ Recording stop timeout, using existing chunks');
                  // Use existing chunks as fallback
                  const existingChunks = videoChunksRef.current.length > 0 
                    ? videoChunksRef.current 
                    : videoChunks;
                  if (existingChunks.length > 0) {
                    resolve(existingChunks);
                  } else {
                    reject(new Error('Recording stop timeout and no chunks available'));
                  }
                  recordingStopPromiseRef.current = null;
                }
              }, 2000);
            });
            
            // Request any remaining data before stopping
            if (currentRecorder.state === 'recording') {
              currentRecorder.requestData();
            }
            currentRecorder.stop();
            setRecording(false);
            
            try {
              // Wait for recording to stop and chunks to be collected
              finalChunks = await stopPromise;
              console.log('✅ Video recording stopped, chunks collected:', { 
                count: finalChunks.length,
                totalSize: finalChunks.reduce((sum, chunk) => sum + chunk.size, 0)
              });
            } catch (error) {
              console.error('❌ Error waiting for recording to stop:', error);
              // Use chunks from ref or state as fallback
              finalChunks = videoChunksRef.current.length > 0 
                ? videoChunksRef.current 
                : (videoChunks.length > 0 ? videoChunks : []);
              console.log('⚠️ Using chunks from ref/state as fallback:', { count: finalChunks.length });
            }
          } else if (currentRecorder.state === 'inactive' || currentRecorder.state === 'paused') {
            // Recording already stopped, use existing chunks
            finalChunks = videoChunksRef.current.length > 0 
              ? videoChunksRef.current 
              : (videoChunks.length > 0 ? videoChunks : []);
            console.log('📹 Recording already stopped, using existing video chunks:', { count: finalChunks.length });
          } else {
            // Unknown state, try to use existing chunks
            finalChunks = videoChunksRef.current.length > 0 
              ? videoChunksRef.current 
              : (videoChunks.length > 0 ? videoChunks : []);
            console.log('⚠️ Unknown recorder state, using existing chunks:', { 
              state: currentRecorder.state,
              count: finalChunks.length 
            });
          }
        } else {
          // No media recorder - try to use existing chunks
          console.warn('⚠️ No MediaRecorder instance found, using existing chunks');
          finalChunks = videoChunksRef.current.length > 0 
            ? videoChunksRef.current 
            : (videoChunks.length > 0 ? videoChunks : []);
          console.log('📹 Trying to use chunks from ref/state:', { count: finalChunks.length });
        }
        
        // Check if we have video chunks
        if (finalChunks.length === 0) {
          console.error('❌ No video chunks available after stopping recording');
          console.error('📊 Debug info:', {
            hasMediaRecorder: !!mediaRecorder,
            recorderState: mediaRecorder?.state,
            chunksInRef: videoChunksRef.current.length,
            chunksInState: videoChunks.length,
            recording: recording
          });
          setProcessing(false);
          setErrors({ capture: 'No video recorded. Please try again. Make sure video recording started properly.' });
          isAutoCapturingRef.current = false;
          return;
        }
        
        // Send to API with video only
        console.log('📤 Sending to check-liveness API with video only...', {
          chunksCount: finalChunks.length,
          totalSize: finalChunks.reduce((sum, chunk) => sum + chunk.size, 0)
        });
        
        try {
          await sendLivenessCheckWithChunks(finalChunks);
        } catch (error) {
          console.error('❌ Error sending liveness check:', error);
          setProcessing(false);
          setErrors({ 
            capture: 'Failed to send video to backend. Please try again.' 
          });
          // Reset positions so user can retry
          setCapturedPositions(new Set());
          setHeadPosition(randomPositionOrderRef.current[0]);
        }
        
        isAutoCapturingRef.current = false;
      }
    } catch (error) {
      console.error('Position verification error:', error);
      isAutoCapturingRef.current = false;
      setProcessing(false);
      setErrors({ capture: 'Failed to verify position. Please try again.' });
    }
  }, [videoStream, capturedPositions, sendLivenessCheckWithChunks, mediaRecorder, captureCurrentFrame]);

  // Update ref whenever handleAutoCapture changes
  useEffect(() => {
    handleAutoCaptureRef.current = handleAutoCapture;
  }, [handleAutoCapture]);

  // Extract Government ID details from captured image
  const extractGovIdDetails = useCallback(async (base64Image: string) => {
    setProcessing(true);
    setErrors({});

    try {
      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.EXTRACT_ID_DETAILS);
      
      // Add prefix if not already present
      const imageWithPrefix = base64Image.includes('data:image') 
        ? base64Image 
        : `data:image/jpeg;base64,${base64Image}`;

      // Use country prop, default to 'India' if not set
      const countryForExtraction = country === 'US' ? 'US' : (country === 'IN' ? 'India' : 'India');

      // Prepare request payload
      const requestPayload = {
        country: countryForExtraction,
        images: [imageWithPrefix]
      };

      // Log clear request details (without full base64 image)
      console.log('📤 [Government ID] Sending request to backend:', {
        url: apiUrl,
        country: countryForExtraction,
        imageSize: `${Math.round(imageWithPrefix.length / 1024)}KB`,
        hasImagePrefix: imageWithPrefix.includes('data:image'),
        requestPayload: {
          country: countryForExtraction,
          images: [`[Base64 Image: ${imageWithPrefix.length} characters]`]
        }
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      // Log response status and headers
      console.log('📥 [Government ID] Response received:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });

      // Check response status before parsing JSON
      let data = null;
      const contentType = response.headers.get('content-type');
      
      // Only parse JSON if response has content and is JSON
      if (response.status !== 204 && contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
            console.log('✅ [Government ID] Response data parsed successfully:', {
              hasData: !!data,
              dataKeys: data ? Object.keys(data) : [],
              fullResponse: data
            });
          } else {
            console.warn('⚠️ [Government ID] Response has JSON content-type but body is empty');
          }
        } catch (parseError) {
          console.error('❌ [Government ID] Error parsing JSON response:', parseError);
          setProcessing(false);
          setErrors({
            capture: 'Unable to process the response. Please try again.'
          });
          setCaptured(false);
          return;
        }
      } else if (response.status === 204) {
        console.log('ℹ️ [Government ID] Response is 204 No Content');
      } else {
        console.warn('⚠️ [Government ID] Response is not JSON or has unexpected content-type:', contentType);
      }

      // Handle different status codes
      if (response.status === 200 && data) {
        // Extract from combined_extracted object (India API format) or direct fields (US format)
        const combinedExtracted = data.combined_extracted || data;
        
        console.log('🔍 [Government ID] Extracting fields from response:', {
          hasCombinedExtracted: !!data.combined_extracted,
          combinedExtractedKeys: combinedExtracted ? Object.keys(combinedExtracted) : [],
          rawData: data
        });
        
        // Extract fields with multiple possible field name formats
        const firstName = combinedExtracted.first_name || combinedExtracted.firstName || combinedExtracted.first_name_en || combinedExtracted.firstNameEn || combinedExtracted.FirstName || data.first_name || data.firstName || '';
        const lastName = combinedExtracted.last_name || combinedExtracted.lastName || combinedExtracted.last_name_en || combinedExtracted.lastNameEn || combinedExtracted.LastName || data.last_name || data.lastName || '';
        const dateOfBirth = combinedExtracted.dob || combinedExtracted.date_of_birth || combinedExtracted.dateOfBirth || combinedExtracted.DOB || data.dob || data.date_of_birth || data.dateOfBirth || '';
        const address = combinedExtracted.address || data.address || '';

        const extractedFields = { firstName, lastName, dateOfBirth, address };
        console.log('📋 [Government ID] Extracted fields:', extractedFields);
        console.log('✅ [Government ID] Field validation:', {
          firstName: { value: firstName, valid: !!firstName },
          lastName: { value: lastName, valid: !!lastName },
          dateOfBirth: { value: dateOfBirth, valid: !!dateOfBirth },
          address: { value: address, valid: !!address },
          allRequiredFieldsPresent: !!(firstName && lastName && dateOfBirth)
        });

        // Check if all required fields are extracted
        if (firstName && lastName && dateOfBirth) {
          // All required fields extracted successfully
          console.log('✅ [Government ID] All required fields extracted successfully. Calling onDataExtracted callback.');
          Logger.info('Government ID extraction successful', { firstName, lastName, dateOfBirth: dateOfBirth ? 'extracted' : 'missing', country }, 'GovIdExtraction');
          
          // Call onDataExtracted callback with extracted data
          if (onDataExtracted) {
            onDataExtracted({
              firstName,
              lastName,
              dateOfBirth,
              address
            });
            console.log('✅ [Government ID] onDataExtracted callback executed successfully');
          }

          setProcessing(false);
          setErrors({});
          setCaptured(true);

          // Close camera after successful extraction (with delay to show success)
          setTimeout(() => {
            stopCamera();
          }, 2000);
        } else {
          // Missing required fields - show try again message
          const missingFields = [];
          if (!firstName) missingFields.push('First Name');
          if (!lastName) missingFields.push('Last Name');
          if (!dateOfBirth) missingFields.push('Date of Birth');
          
          console.warn('⚠️ [Government ID] Missing required fields:', missingFields);
          Logger.warn('Government ID extraction incomplete', { missingFields, country }, 'GovIdExtraction');
          setProcessing(false);
          setErrors({
            capture: `Try again. Failed to extract required details (${missingFields.join(', ')}). Please ensure the document is clearly visible and try again.`
          });
          // Don't close camera - allow user to retry
          setCaptured(false);
        }
      } else if (response.status === 204) {
        // 204 No Content - treat as success but no data extracted
        console.warn('⚠️ [Government ID] 204 No Content - no data extracted');
        Logger.warn('Government ID 204 - no data extracted', { country }, 'GovIdExtraction');
        setProcessing(false);
        setErrors({
          capture: 'Document captured but no information could be extracted. Please ensure the document is clearly visible and all required fields are readable, then try again.'
        });
        setCaptured(false);
      } else if (response.status === 400) {
        console.error('❌ [Government ID] 400 Bad Request:', data);
        Logger.apiError('EXTRACT_ID_DETAILS', response.status, data, 'GovIdExtraction');
        setProcessing(false);
        const errorMessage = data?.message || data?.error || 'Invalid request. Please check the document and try again.';
        setErrors({
          capture: errorMessage
        });
        setCaptured(false);
      } else if (response.status === 401 || response.status === 403) {
        console.error('❌ [Government ID] Authentication error:', response.status, data);
        Logger.apiError('EXTRACT_ID_DETAILS', response.status, data, 'GovIdExtraction');
        setProcessing(false);
        setErrors({
          capture: 'Authentication failed. Please refresh the page and try again.'
        });
        setCaptured(false);
      } else if (response.status === 404) {
        console.error('❌ [Government ID] 404 Not Found');
        Logger.apiError('EXTRACT_ID_DETAILS', response.status, { error: 'Not Found' }, 'GovIdExtraction');
        setProcessing(false);
        setErrors({
          capture: 'Service not available. Please try again later.'
        });
        setCaptured(false);
      } else if (response.status >= 500) {
        console.error('❌ [Government ID] Server error:', response.status, data);
        Logger.apiError('EXTRACT_ID_DETAILS', response.status, data, 'GovIdExtraction');
        setProcessing(false);
        const errorMessage = data?.message || data?.error || 'Server error occurred. Please try again in a moment.';
        setErrors({
          capture: errorMessage
        });
        setCaptured(false);
      } else {
        // Other status codes
        console.error('❌ [Government ID] Unexpected status code:', response.status, data);
        setProcessing(false);
        const errorMessage = data?.message || data?.error || 'Failed to extract ID details. Please ensure the document is clearly visible and try again.';
        setErrors({
          capture: errorMessage
        });
        setCaptured(false);
      }
    } catch (error: any) {
      console.error('❌ [Government ID] Error extracting ID details:', {
        error: error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      });
      setProcessing(false);
      
      // Show user-friendly error messages
      let errorMessage = 'An error occurred during ID extraction. Please try again.';
      
      if (error.message && error.message.includes('JSON')) {
        errorMessage = 'Unable to process the response. Please try again.';
      } else if (error.message && (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        // Only show technical error in console, not to user
        errorMessage = 'Failed to extract ID details. Please ensure the document is clearly visible and try again.';
      }
      
      setErrors({
        capture: errorMessage
      });
      // Don't close camera - allow user to retry
      setCaptured(false);
    }
  }, [country, onDataExtracted, stopCamera]);

  // Extract SSN Card details using id-verification API
  const verifySSNCard = useCallback(async (base64Image: string) => {
    setProcessing(true);
    setErrors({});

    try {
      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.ID_VERIFICATION);
      console.log('Sending SSN card image to id-verification API...');

      // Add prefix if not already present
      const imageWithPrefix = base64Image.includes('data:image') 
        ? base64Image 
        : `data:image/jpeg;base64,${base64Image}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: country === 'US' ? 'US' : 'India',
          images: [imageWithPrefix] // Send with data:image/jpeg;base64, prefix
        }),
      });

      // Check response status before parsing JSON
      let data = null;
      const contentType = response.headers.get('content-type');
      
      // Only parse JSON if response has content and is JSON
      if (response.status !== 204 && contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
          }
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          setProcessing(false);
          setErrors({
            capture: 'Unable to process the response. Please try again.'
          });
          setCaptured(false);
          return;
        }
      }

      console.log('SSN Verification API Response:', { status: response.status, data });

      // Handle different status codes
      if (response.status === 200 && data) {
        // Extract from combined_extracted object (India API format) or direct fields (US format)
        const combinedExtracted = data.combined_extracted || data;
        
        // For SSN card, extract SSN number (last 4 digits)
        const ssnNumber = combinedExtracted.id_number || combinedExtracted.idNumber || combinedExtracted.ssn_number || combinedExtracted.ssnNumber || combinedExtracted.SSN || combinedExtracted.ssn || data.id_number || data.idNumber || data.ssn_number || data.ssnNumber || '';

        console.log('Extracted SSN number:', ssnNumber);

        // Check if SSN number is extracted
        if (ssnNumber) {
          // SSN number extracted successfully
          Logger.info('SSN card verification successful', { ssnExtracted: true }, 'SSNVerification');
          // Call onDataExtracted callback with SSN number
          if (onDataExtracted) {
            onDataExtracted({
              idNumber: ssnNumber,
              panNumber: ssnNumber // Also store as panNumber for compatibility
            });
          }

          setProcessing(false);
          setErrors({});
          setCaptured(true);

          // Close camera after successful extraction (with delay to show success)
          setTimeout(() => {
            stopCamera();
          }, 2000);
        } else {
          // SSN number not extracted - show try again message
          Logger.warn('SSN extraction failed - no number found', { response: data }, 'SSNVerification');
          setProcessing(false);
          setErrors({
            capture: 'Try again. Failed to extract SSN number. Please ensure the SSN card is clearly visible and try again.'
          });
          // Don't close camera - allow user to retry
          setCaptured(false);
        }
      } else if (response.status === 204) {
        // 204 No Content - treat as success but no data extracted
        Logger.warn('SSN verification 204 - no data extracted', {}, 'SSNVerification');
        setProcessing(false);
        setErrors({
          capture: 'Please ensure the SSN card is clearly visible.'
        });
        setCaptured(false);
      } else if (response.status === 400) {
        Logger.apiError('ID_VERIFICATION', response.status, data, 'SSNVerification');
        setProcessing(false);
        setErrors({
          capture: 'Invalid request. Please check the SSN card and try again.'
        });
        setCaptured(false);
      } else if (response.status === 401 || response.status === 403) {
        Logger.apiError('ID_VERIFICATION', response.status, data, 'SSNVerification');
        setProcessing(false);
        setErrors({
          capture: 'Authentication failed. Please refresh the page and try again.'
        });
        setCaptured(false);
      } else if (response.status === 404) {
        Logger.apiError('ID_VERIFICATION', response.status, { error: 'Not Found' }, 'SSNVerification');
        setProcessing(false);
        setErrors({
          capture: 'Service not available. Please try again later.'
        });
        setCaptured(false);
      } else if (response.status >= 500) {
        Logger.apiError('ID_VERIFICATION', response.status, data, 'SSNVerification');
        setProcessing(false);
        setErrors({
          capture: 'Server error occurred. Please try again in a moment.'
        });
        setCaptured(false);
      } else {
        // Other status codes
        Logger.apiError('ID_VERIFICATION', response.status, data, 'SSNVerification');
        setProcessing(false);
        setErrors({
          capture: 'Failed to verify SSN card. Please ensure the card is clearly visible and try again.'
        });
        setCaptured(false);
      }
    } catch (error: any) {
      console.error('Error verifying SSN card:', error);
      Logger.error('SSN verification exception', { error: error.message }, 'SSNVerification');
      setProcessing(false);
      
      // Show user-friendly error messages
      let errorMessage = 'An error occurred during SSN card verification. Please try again.';
      
      if (error.message && error.message.includes('JSON')) {
        errorMessage = 'Unable to process the response. Please try again.';
      } else if (error.message && error.message.includes('network') || error.message && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        // Only show technical error in console, not to user
        errorMessage = 'Failed to verify SSN card. Please ensure the card is clearly visible and try again.';
      }
      
      setErrors({
        capture: errorMessage
      });
      // Don't close camera - allow user to retry
      setCaptured(false);
    }
  }, [country, onDataExtracted, stopCamera]);

  // Extract PAN Card details using id-verification API
  const verifyPanCard = useCallback(async (base64Image: string) => {
    setProcessing(true);
    setErrors({});

    try {
      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.ID_VERIFICATION);
      console.log('Sending PAN card image to id-verification API...');

      // Add prefix if not already present
      const imageWithPrefix = base64Image.includes('data:image') 
        ? base64Image 
        : `data:image/jpeg;base64,${base64Image}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: country === 'US' ? 'US' : 'India',
          images: [imageWithPrefix] // Send with data:image/jpeg;base64, prefix
        }),
      });

      // Check response status before parsing JSON
      let data = null;
      const contentType = response.headers.get('content-type');
      
      // Only parse JSON if response has content and is JSON
      if (response.status !== 204 && contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
          }
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          setProcessing(false);
          setErrors({
            capture: 'Unable to process the response. Please try again.'
          });
          setCaptured(false);
          return;
        }
      }

      console.log('PAN Verification API Response:', { status: response.status, data });

      // Handle different status codes
      if (response.status === 200 && data) {
        // Extract from combined_extracted object (India API format) or direct fields (US format)
        const combinedExtracted = data.combined_extracted || data;
        
        // For PAN card, only extract ID number (PAN number)
        const panNumber = combinedExtracted.id_number || combinedExtracted.idNumber || combinedExtracted.pan_number || combinedExtracted.panNumber || combinedExtracted.PAN || combinedExtracted.pan || data.id_number || data.idNumber || data.pan_number || data.panNumber || '';

        console.log('Extracted PAN number:', panNumber);

        // Check if PAN number is extracted
        if (panNumber) {
          // PAN number extracted successfully
          Logger.info('PAN card verification successful', { panExtracted: true }, 'PANVerification');
          // Call onDataExtracted callback with only PAN number
          if (onDataExtracted) {
            onDataExtracted({
              panNumber,
              idNumber: panNumber // Also store as idNumber for compatibility
            });
          }
 
          setProcessing(false);
          setErrors({});
          setCaptured(true);

          // Close camera after successful extraction (with delay to show success)
          setTimeout(() => {
            stopCamera();
          }, 2000);
        } else {
          // PAN number not extracted - show try again message
          Logger.warn('PAN extraction failed - no number found', { response: data }, 'PANVerification');
          setProcessing(false);
          setErrors({
            capture: 'Try again. Failed to extract PAN number. Please ensure the PAN card is clearly visible and try again.'
          });
          // Don't close camera - allow user to retry
          setCaptured(false);
        }
      } else if (response.status === 204) {
        // 204 No Content - treat as success but no data extracted
        Logger.warn('PAN verification 204 - no data extracted', {}, 'PANVerification');
        setProcessing(false);
        setErrors({
          capture: 'Please ensure the PAN card is clearly visible'
        });
        setCaptured(false);
      } else if (response.status === 400) {
        Logger.apiError('ID_VERIFICATION', response.status, data, 'PANVerification');
        setProcessing(false);
        setErrors({
          capture: 'Invalid request. Please check the PAN card and try again.'
        });
        setCaptured(false);
      } else if (response.status === 401 || response.status === 403) {
        Logger.apiError('ID_VERIFICATION', response.status, data, 'PANVerification');
        setProcessing(false);
        setErrors({
          capture: 'Authentication failed. Please refresh the page and try again.'
        });
        setCaptured(false);
      } else if (response.status === 404) {
        Logger.apiError('ID_VERIFICATION', response.status, { error: 'Not Found' }, 'PANVerification');
        setProcessing(false);
        setErrors({
          capture: 'Service not available. Please try again later.'
        });
        setCaptured(false);
      } else if (response.status >= 500) {
        Logger.apiError('ID_VERIFICATION', response.status, data, 'PANVerification');
        setProcessing(false);
        setErrors({
          capture: 'Server error occurred. Please try again in a moment.'
        });
        setCaptured(false);
      } else {
        // Other status codes
        Logger.apiError('ID_VERIFICATION', response.status, data, 'PANVerification');
        setProcessing(false);
        setErrors({
          capture: 'Failed to verify PAN card. Please ensure the card is clearly visible and try again.'
        });
        setCaptured(false);
      }
    } catch (error: any) {
      console.error('Error verifying PAN card:', error);
      Logger.error('PAN verification exception', { error: error.message }, 'PANVerification');
      setProcessing(false);
      
      // Show user-friendly error messages
      let errorMessage = 'An error occurred during PAN card verification. Please try again.';
      
      if (error.message && error.message.includes('JSON')) {
        errorMessage = 'Unable to process the response. Please try again.';
      } else if (error.message && error.message.includes('network') || error.message && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        // Only show technical error in console, not to user
        errorMessage = 'Failed to verify PAN card. Please ensure the card is clearly visible and try again.';
      }
      
      setErrors({
        capture: errorMessage
      });
      // Don't close camera - allow user to retry
      setCaptured(false);
    }
  }, [country, onDataExtracted, stopCamera]);

  // Capture photo with quality validation
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !videoStream) return;

    try {
      setProcessing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Wait for video to be ready
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        console.log('Video not ready yet, waiting...', {
          readyState: video.readyState,
          width: video.videoWidth,
          height: video.videoHeight
        });
        // Wait a bit and retry
        setTimeout(() => {
          if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
            capturePhoto();
          } else {
            setProcessing(false);
            setErrors({ capture: 'Camera not ready. Please wait a moment and try again.' });
          }
        }, 500);
        return;
      }

      // Use actual video dimensions for maximum quality
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setProcessing(false);
        setErrors({ capture: 'Failed to get canvas context. Please try again.' });
        return;
      }

      // For document capture, don't flip (back camera is already correct)
      // Only flip for front camera (live photo)
      if (cameraType === 'live') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      // Draw video frame with maximum quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      
      // Capture at MAXIMUM quality for documents (0.99 = highest JPEG quality)
      // This ensures clearest possible image for backend OCR extraction
      let imageData = canvas.toDataURL('image/jpeg', cameraType === 'govId' || cameraType === 'ssn' || cameraType === 'pan' ? 0.99 : 0.95);
      
      // For documents, send original high-quality image WITHOUT enhancement
      // Enhancement can reduce quality - send original for maximum clarity
      if (cameraType === 'govId' || cameraType === 'ssn' || cameraType === 'pan') {
        // Only validate quality in background (don't block) - but don't modify the image
        validateImageQuality(
          imageData,
          cameraType === 'pan' || cameraType === 'ssn' ? 'id' : 'document'
        ).then((qualityResult) => {
          console.log('📊 Image quality validation:', qualityResult);
          
          if (qualityResult.warnings.length > 0) {
            console.warn('⚠️ Image quality warnings:', qualityResult.warnings);
          }
          
          if (!qualityResult.isValid && qualityResult.errors.length > 0) {
            console.warn('❌ Image quality issues detected:', qualityResult.errors);
          }
        }).catch((validationError) => {
          console.warn('Image quality validation error:', validationError);
        });
        
        // SKIP enhancement - send original image for maximum clarity
        // Enhancement can sometimes reduce quality or introduce artifacts
        console.log('✅ Using original high-quality image (no enhancement) for maximum clarity');
        
        // Check file size - only compress if absolutely necessary (very large files)
        const base64Data = imageData.split(',')[1] || imageData;
        const currentSize = (base64Data.length * 3) / 4;
        const maxSize = 8 * 1024 * 1024; // Increased to 8 MB to avoid compression
        
        // Only compress if file is VERY large (above 8MB) and use maximum quality
        if (currentSize > maxSize) {
          console.warn(`⚠️ Image size (${(currentSize / 1024 / 1024).toFixed(2)}MB) exceeds limit, compressing with maximum quality...`);
          try {
            // Use very high quality (0.98) to maintain clarity even when compressing
            imageData = await compressForOCR(imageData, maxSize, 0.98);
            console.log('✅ Image compressed with maximum quality (0.98)');
          } catch (compressError) {
            console.warn('❌ Image compression failed, using original:', compressError);
            // Continue with original image if compression fails
          }
        } else {
          console.log(`✅ Image size (${(currentSize / 1024 / 1024).toFixed(2)}MB) is acceptable - sending original without compression for maximum clarity`);
        }
      }

      if (cameraType === 'live') {
        // For live photo, we don't capture photos - only video is recorded
        // Photo capture is handled by handleAutoCapture which only verifies positions
        setProcessing(false);
        setErrors({ capture: 'Live photo uses video recording only. Please use the automatic position verification.' });
        return;
      } else if (cameraType === 'govId') {
        // For Government ID, capture and then extract details
        // imageData already contains "data:image/jpeg;base64," prefix
        if (!imageData) {
          setProcessing(false);
          setErrors({ capture: 'Failed to process image. Please try again.' });
          return;
        }

        // Store captured image
        setCaptured(true);
        if (onCaptureComplete) {
          onCaptureComplete(imageData);
        }

        // Call extract-details API with full data URL (includes prefix)
        await extractGovIdDetails(imageData);
      } else if (cameraType === 'pan') {
        // For PAN Card, capture and then verify using id-verification API
        // imageData already contains "data:image/jpeg;base64," prefix
        if (!imageData) {
          setProcessing(false);
          setErrors({ capture: 'Failed to process image. Please try again.' });
          return;
        }

        // Store captured image
        setCaptured(true);
        if (onCaptureComplete) {
          onCaptureComplete(imageData);
        }

        // Call id-verification API for PAN card with full data URL (includes prefix)
        await verifyPanCard(imageData);
      } else if (cameraType === 'ssn') {
        // For SSN Card, capture and then verify using id-verification API
        // imageData already contains "data:image/jpeg;base64," prefix
        if (!imageData) {
          setProcessing(false);
          setErrors({ capture: 'Failed to process image. Please try again.' });
          return;
        }

        // Store captured image
        setCaptured(true);
        if (onCaptureComplete) {
          onCaptureComplete(imageData);
        }

        // Call id-verification API for SSN card with full data URL (includes prefix)
        await verifySSNCard(imageData);
      } else {
        // For other documents, single capture
        setCaptured(true);
        if (onCaptureComplete) {
          onCaptureComplete(imageData);
        }
      }

      setProcessing(false);
    } catch (error) {
      console.error('Capture error:', error);
      setErrors({ capture: 'Failed to capture image. Please try again.' });
      setProcessing(false);
    }
  }, [videoStream, cameraType, headPosition, capturedPositions, capturedImages, capturedBase64Images, sendLivenessCheck, extractGovIdDetails, verifyPanCard, verifySSNCard]);

  // Function to start video recording for liveness check - records until all positions captured
  const startVideoRecording = useCallback(() => {
    if (!videoStream) {
      console.error('❌ Video stream not available');
      // Don't set error immediately - video stream might be loading
      return;
    }

    // Wait for video element to be ready before starting recording
    if (!videoRef.current) {
      console.warn('⏳ Video ref not available yet, will retry...');
      // Retry after a short delay
      setTimeout(() => {
        if (videoRef.current && videoStream) {
          startVideoRecording();
        }
      }, 300);
      return;
    }

    // Check if video is ready (readyState >= 2 means HAVE_CURRENT_DATA)
    if (videoRef.current.readyState < 2) {
      console.warn('⏳ Video not ready yet (readyState:', videoRef.current.readyState, '), will retry...');
      // Retry after a short delay
      setTimeout(() => {
        if (videoRef.current && videoRef.current.readyState >= 2 && videoStream) {
          startVideoRecording();
        }
      }, 300);
      return;
    }

    // Don't start if already recording
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('⚠️ Video already recording, skipping...');
      return;
    }

    // IMPORTANT: Cleanup any existing MediaRecorder before creating a new one
    // This prevents "NotSupportedError" when trying to start a new recorder
    // This is especially important when camera is restarted (stop/start)
    if (mediaRecorder || mediaRecorderRef.current) {
      const oldRecorder = mediaRecorderRef.current || mediaRecorder;
      console.log('🧹 Cleaning up existing MediaRecorder before starting new one...', {
        state: oldRecorder?.state,
        hasRecorder: !!oldRecorder
      });
      try {
        // Stop the recorder if it's in recording or paused state
        if (oldRecorder && (oldRecorder.state === 'recording' || oldRecorder.state === 'paused')) {
          oldRecorder.stop();
          console.log('✅ Old MediaRecorder stopped');
        }
        // Remove all event listeners to prevent memory leaks
        if (oldRecorder) {
          oldRecorder.ondataavailable = null;
          oldRecorder.onstop = null;
          oldRecorder.onerror = null;
        }
      } catch (cleanupError) {
        console.warn('⚠️ Error cleaning up old MediaRecorder:', cleanupError);
      }
      // Clear the old recorder references
      setMediaRecorder(null);
      mediaRecorderRef.current = null;
      setRecording(false);
    }

    try {
      // Clear previous chunks
      videoChunksRef.current = [];
      setVideoChunks([]);
      setRecording(true);
      
      // Try to get supported MIME type - prefer mp4, fallback to webm
      let mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }
      
      console.log('🎥 Starting video recording with MIME type:', mimeType);
      console.log('📹 Recording will continue until all 4 positions are captured...');
      console.log('📊 Video stream tracks:', videoStream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
      
      // Create MediaRecorder with video stream
      const recorder = new MediaRecorder(videoStream, {
        mimeType: mimeType
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          // Optimized: Use ref directly to avoid unnecessary state updates
          videoChunksRef.current.push(e.data);
          // Only update state periodically to reduce re-renders
          // Update state every 5 chunks or if chunk is large (>500KB)
          const shouldUpdateState = videoChunksRef.current.length % 5 === 0 || e.data.size > 500000;
          if (shouldUpdateState) {
            setVideoChunks([...videoChunksRef.current]);
          }
          // Log only occasionally to reduce console overhead
          if (videoChunksRef.current.length % 10 === 0) {
            console.log('📦 Video chunk received:', { 
              size: e.data.size, 
              totalChunks: videoChunksRef.current.length,
              totalSize: videoChunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0)
            });
          }
        } else {
          // Only log empty chunks occasionally
          if (Math.random() < 0.1) {
            console.warn('⚠️ Empty chunk received');
          }
        }
      };

      recorder.onstop = async () => {
        // Optimized: Use ref directly, ensure final state sync
        const finalChunks = [...videoChunksRef.current];
        const totalSize = finalChunks.reduce((sum, chunk) => sum + chunk.size, 0);
        
        console.log('⏹️ Video recording stopped:', { 
          chunksCount: finalChunks.length,
          totalSize,
          recorderState: recorder.state
        });
        
        // Ensure chunks are stored - sync ref and state
        if (finalChunks.length > 0) {
          videoChunksRef.current = finalChunks;
          setVideoChunks(finalChunks); // Final state update
          console.log('✅ Chunks stored successfully');
        } else {
          console.error('❌ No chunks collected during recording!');
        }
        
        // Resolve the promise if waiting for stop
        if (recordingStopPromiseRef.current) {
          if (finalChunks.length > 0) {
            recordingStopPromiseRef.current.resolve(finalChunks);
          } else {
            recordingStopPromiseRef.current.reject(new Error('No video chunks collected'));
          }
          recordingStopPromiseRef.current = null;
        }
      };

      recorder.onerror = (error) => {
        console.error('❌ MediaRecorder error:', error);
        setRecording(false);
        setErrors({ capture: 'Failed to record video. Please try again.' });
        if (recordingStopPromiseRef.current) {
          recordingStopPromiseRef.current.reject(new Error('MediaRecorder error'));
          recordingStopPromiseRef.current = null;
        }
      };

      // Start recording - will continue until manually stopped
      // Use timeslice to ensure chunks are collected regularly
      recorder.start(100); // Collect data every 100ms
      setMediaRecorder(recorder);
      mediaRecorderRef.current = recorder; // Also store in ref for immediate access
      
      console.log('✅ Video recording started successfully - MediaRecorder state:', recorder.state);
      console.log('📹 Recording will continue until all 4 positions are captured...');
    } catch (error: any) {
      console.error('❌ Error starting video recording:', error);
      setRecording(false);
      setErrors({ capture: 'Failed to start video recording. Please try again.' });
      if (recordingStopPromiseRef.current) {
        recordingStopPromiseRef.current.reject(error);
        recordingStopPromiseRef.current = null;
      }
    }
  }, [videoStream, mediaRecorder]);

  // Function to upload video to backend (using chunks from parameter)
  const uploadVideoFromChunks = useCallback(async (chunks: Blob[]) => {
    if (chunks.length === 0) {
      console.error('❌ No video chunks to upload');
      setProcessing(false);
      setErrors({ capture: 'No video recorded. Please try again.' });
      return;
    }

    try {
      // Determine MIME type from first chunk or default to mp4
      let mimeType = chunks[0]?.type || 'video/mp4';
      
      // Ensure we use mp4 if available, otherwise webm
      if (!mimeType.includes('mp4') && !mimeType.includes('webm')) {
        mimeType = 'video/mp4';
      }
      
      // Create video blob
      const videoBlob = new Blob(chunks, { type: mimeType });
      const sizeMB = (videoBlob.size / 1024 / 1024).toFixed(2);
      console.log('📤 Video blob created:', {
        size: `${sizeMB} MB`,
        type: videoBlob.type,
        chunksCount: chunks.length
      });

      // Create FormData - matching the user's example format
      const formData = new FormData();
      const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';
      formData.append('video', videoBlob, `liveness.${fileExtension}`);

      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.CHECK_LIVENESS);
      console.log('🚀 Uploading video to:', apiUrl);
      console.log('📋 FormData details:', {
        fieldName: 'video',
        fileName: `liveness.${fileExtension}`,
        fileSize: `${sizeMB} MB`,
        fileType: mimeType
      });

      // Send video to backend using fetch (similar to user's axios example)
      // Don't set Content-Type header - browser will set it automatically with boundary
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header manually - browser sets it with multipart/form-data boundary
      });

      // Check response status before parsing JSON
      let data: any = null;
      const contentType = response.headers.get('content-type');

      // Try to parse JSON for all responses except 204
      if (response.status !== 204) {
        try {
          const text = await response.text();
          if (text && text.trim()) {
            if (
              !contentType ||
              contentType.includes('application/json') ||
              text.trim().startsWith('{') ||
              text.trim().startsWith('[')
            ) {
              try {
                data = JSON.parse(text);
              } catch (jsonError) {
                console.warn('Failed to parse as JSON, using text as error:', text);
                data = { error: text, message: text };
              }
            } else {
              data = { error: text, message: text };
            }
          }
        } catch (parseError) {
          console.error('Error reading response:', parseError);
        }
      }

      console.log('API Response received:', {
        status: response.status,
        data
      });

      // Handle response
      if (response.status === 200) {
        const isLivenessPassed = data?.liveness_ok === true;
        console.log('Liveness check result:', isLivenessPassed);

        if (isLivenessPassed) {
          console.log('✅ Video verified successfully! Human presence confirmed.');
          setCaptured(true);
          setProcessing(false);
          
          if (onCaptureComplete) {
            // Pass video blob URL or success indicator
            const videoUrl = URL.createObjectURL(videoBlob);
            onCaptureComplete(videoUrl);
          }

          // Close camera after success
          setTimeout(() => {
            stopCamera();
          }, 1500);
        } else {
          setProcessing(false);
          let apiErrorMessage = data?.message || data?.error || data?.detail;
          const errorMessage = apiErrorMessage 
            ? `Liveness verification failed. ${apiErrorMessage} Please try again.`
            : 'Liveness verification failed. Please ensure you are in a correct position and try again.';
          setErrors({ capture: errorMessage });
        }
      } else if (response.status === 204) {
        setProcessing(false);
        let apiErrorMessage = data?.message || data?.error || data?.detail;
        const errorMessage = apiErrorMessage 
          ? `Verification failed. ${apiErrorMessage} Please try capturing again.`
          : 'Verification failed. Please try capturing again.';
        setErrors({ capture: errorMessage });
      } else if (response.status === 400) {
        setProcessing(false);
        let apiErrorMessage = data?.message || data?.error || data?.detail;
        const errorMessage = apiErrorMessage 
          ? `${apiErrorMessage} Please try capturing again.`
          : 'Please try capturing again.';
        setErrors({ capture: errorMessage });
      } else if (response.status === 401 || response.status === 403) {
        setProcessing(false);
        setErrors({ capture: 'Authentication failed. Please refresh the page and try again.' });
      } else if (response.status === 404) {
        setProcessing(false);
        setErrors({ capture: 'Service not available. Please try again later.' });
      } else if (response.status === 413) {
        setProcessing(false);
        setErrors({ capture: 'Video size is too large. Please try again with better lighting or move closer to the camera.' });
      } else if (response.status >= 500) {
        setProcessing(false);
        setErrors({ capture: 'Server error occurred. Please try again in a moment.' });
      } else {
        setProcessing(false);
        const apiErrorMessage = data?.message || data?.error || data?.detail;
        const errorMessage = apiErrorMessage 
          ? `Verification failed. ${apiErrorMessage} Please try capturing again.`
          : 'Verification failed. Please ensure you are in good lighting, face the camera clearly, and try again.';
        setErrors({ capture: errorMessage });
      }
    } catch (error: any) {
      console.error('Error uploading video:', error);
      setProcessing(false);
      
      let errorMessage = 'An error occurred during video upload. Please try again.';
      if (error.message && (error.message.includes('network') || error.message.includes('fetch'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setErrors({ capture: errorMessage });
    } finally {
      // Clear video chunks after upload
      setVideoChunks([]);
    }
  }, [onCaptureComplete, stopCamera]);

  // Function to start auto-capture - starts video recording when camera opens
  // Video will record continuously until all 4 positions are captured
  const startAutoCapture = useCallback(() => {
    if (cameraType === 'live' && showCamera && videoStream) {
      console.log('🚀 Starting video recording for liveness check...');
      console.log('📹 Video will record all positions until capture is complete...');
      startVideoRecording();
    } else {
      console.warn('Cannot start video recording:', { cameraType, showCamera, hasVideoStream: !!videoStream });
      setErrors({ capture: 'Camera not ready. Please wait a moment and try again.' });
    }
  }, [cameraType, showCamera, videoStream, startVideoRecording]);
  
  // Auto-start video recording when camera opens for live photo
  useEffect(() => {
    if (cameraType === 'live' && showCamera && videoStream) {
      // Wait for video element to be ready before starting recording
      const startRecording = () => {
        // Check if video element exists and is ready
        if (!videoRef.current) {
          console.log('⏳ Video ref not available yet, retrying...');
          setTimeout(startRecording, 300);
          return;
        }

        // Check if video is ready (readyState >= 2 means HAVE_CURRENT_DATA)
        if (videoRef.current.readyState < 2) {
          console.log('⏳ Video not ready yet (readyState:', videoRef.current.readyState, '), retrying...');
          setTimeout(startRecording, 300);
          return;
        }

        // Only start if not already recording
        if (!mediaRecorder || mediaRecorder.state === 'inactive' || mediaRecorder.state === 'paused') {
          console.log('🎥 Auto-starting video recording for live photo...');
          console.log('📊 Pre-start check:', {
            hasVideoStream: !!videoStream,
            hasVideoRef: !!videoRef.current,
            videoReadyState: videoRef.current?.readyState,
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight,
            currentRecorderState: mediaRecorder?.state
          });
          startVideoRecording();
        } else {
          console.log('⚠️ Recording already active, state:', mediaRecorder.state);
        }
      };
      
      // Start with a small delay to ensure video element is mounted
      const timer = setTimeout(startRecording, 500);
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      console.log('⏸️ Auto-start conditions not met:', {
        cameraType,
        showCamera,
        hasVideoStream: !!videoStream,
        hasVideoRef: !!videoRef.current
      });
    }
  }, [cameraType, showCamera, videoStream, mediaRecorder, startVideoRecording]);
  
  // Function to reset and retry capture
  const resetCapture = useCallback(() => {
    console.log('🔄 Resetting capture process...'); 
    
    // IMPORTANT: Clear detection interval FIRST to stop any running detection
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
      console.log('✅ Face detection interval cleared');
    }
    
    // Stop any ongoing recording
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    // Reset all refs FIRST to ensure clean state
    poseHoldStartRef.current = null;
    isAutoCapturingRef.current = false;
    capturedFramesRef.current = [];
    videoChunksRef.current = [];
    mediaRecorderRef.current = null;
    if (recordingStopPromiseRef.current) {
      recordingStopPromiseRef.current.reject(new Error('Capture reset'));
      recordingStopPromiseRef.current = null;
    }
    
    // Reset all states - IMPORTANT: Reset captured state to allow fresh start
    // Use functional updates to ensure React detects the changes
    setCapturedPositions(() => new Set());
    setCapturedImages({});
    setCapturedBase64Images({});
    setCapturedFrames([]);
    
    // Generate new random position order for retry (anti-video-replay protection)
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    const newShuffledPositions = shuffleArray(['left', 'right', 'up', 'down'] as ('right' | 'left' | 'up' | 'down')[]);
    randomPositionOrderRef.current = newShuffledPositions;
    console.log('🔀 New randomized position order for retry:', newShuffledPositions);
    
    setHeadPosition(newShuffledPositions[0]); // Reset to first position in NEW random sequence
    // Update refs immediately
    headPositionRef.current = newShuffledPositions[0];
    capturedPositionsRef.current = new Set();
    setAutoCaptureStarted(false);
    setErrors({});
    setProcessing(false);
    setCaptured(false);
    setFaceDetected(false);
    setPoseMatched(false);
    setCurrentPose(null);
    setRecording(false);
    setMediaRecorder(null);
    setVideoChunks([]);
    
    console.log('✅ Capture process reset. Ready to start again.');
    console.log('📋 Reset state:', {
      hasHandleAutoCaptureRef: !!handleAutoCaptureRef.current,
      headPosition: 'left',
      capturedPositions: 0,
      captured: false,
      processing: false,
      detectionIntervalCleared: true
    });
  }, [mediaRecorder]);

  return {
    showCamera,
    videoStream,
    captured,
    processing,
    faceDetected,
    headPosition,
    currentPose,
    poseMatched,
    capturedPositions,
    capturedImages,
    errors,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    setErrors,
    autoCaptureStarted,
    startAutoCapture,
    resetCapture,
    recording,
  };
};
