import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// Cloud storage removed

// Types
interface PoseData {
  pose: string;
  photoUrl: string;
  timestamp: string;
  yaw: number;
  pitch: number;
}

interface LivePhotoCaptureProps {
  userId: string;
  onComplete?: (photos: PoseData[]) => void;
  onError?: (error: string) => void;
  // Cloud storage removed
  className?: string;
}

interface PoseRequirement {
  pose: string;
  label: string;
  instruction: string;
  yawRange: [number, number];
  pitchRange: [number, number];
  required: boolean;
}

// Constants
const POSE_REQUIREMENTS: PoseRequirement[] = [
  {
    pose: 'center',
    label: 'Center',
    instruction: 'Look straight at the camera',
    yawRange: [-5, 5],
    pitchRange: [-5, 5],
    required: true
  },
  {
    pose: 'left',
    label: 'Left',
    instruction: 'Turn your head to the left',
    yawRange: [-30, -18],
    pitchRange: [-10, 10],
    required: true
  },
  {
    pose: 'right',
    label: 'Right',
    instruction: 'Turn your head to the right',
    yawRange: [18, 30],
    pitchRange: [-10, 10],
    required: true
  },
  {
    pose: 'up',
    label: 'Up',
    instruction: 'Tilt your head up',
    yawRange: [-10, 10],
    // லேசான அசைவுக்கு pitch ரேஞ்சை 5-ல் இருந்து 20 வரை வையுங்கள்
    pitchRange: [5, 20],
    required: true
  },
  {
    pose: 'down',
    label: 'Down',
    instruction: 'Tilt your head down',
    yawRange: [-15, 15],
    // கீழே பார்ப்பதற்கு நெகட்டிவ் ரேஞ்ச் பயன்படுத்தவும்
    pitchRange: [-20, -5],
    required: true
  },
  {
    pose: 'hand',
    label: 'Hand',
    instruction: 'Hold your hand near your face',
    yawRange: [-15, 15],
    pitchRange: [-15, 15],
    required: false
  }
];

const POSE_HOLD_DURATION = 900; // 0.9 seconds in milliseconds
const FACE_DETECTION_INTERVAL = 100; // Check face every 100ms

export const LivePhotoCapture: React.FC<LivePhotoCaptureProps> = ({
  userId,
  onComplete,
  onError,
  // Cloud storage removed
  className = ''
}) => {
  // State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentPose, setCurrentPose] = useState<string>('');
  const [capturedPhotos, setCapturedPhotos] = useState<Record<string, PoseData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poseHoldStart, setPoseHoldStart] = useState<number | null>(null);
  const [currentYaw, setCurrentYaw] = useState<number>(0);
  const [currentPitch, setCurrentPitch] = useState<number>(0);
  const [faceDetected, setFaceDetected] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const poseHoldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cloud storage removed - no cloud storage

  // Helper functions
  const isSecureContext = useCallback(() => {
    return window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }, []);

  const classifyMediaError = useCallback((error: MediaError | Error): string => {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          return 'Camera access denied. Please enable camera permissions and try again.';
        case 'NotReadableError':
          return 'Camera is already in use by another application. Please close other camera apps and try again.';
        case 'NotFoundError':
          return 'No camera found on your device. Please connect a camera and try again.';
        case 'SecurityError':
          return 'Camera access blocked due to security restrictions. Please use HTTPS or localhost.';
        default:
          return `Camera error: ${error.message}`;
      }
    }
    return `Unexpected error: ${error.message}`;
  }, []);

  const within = useCallback((value: number, range: [number, number]): boolean => {
    return value >= range[0] && value <= range[1];
  }, []);

  const isPoseMatch = useCallback((yaw: number, pitch: number, pose: string): boolean => {
    const requirement = POSE_REQUIREMENTS.find(p => p.pose === pose);
    if (!requirement) return false;
    
    return within(yaw, requirement.yawRange) && within(pitch, requirement.pitchRange);
  }, [within]);

  // MediaPipe Face Landmarker implementation
  const detectFacePose = useCallback(async (video: HTMLVideoElement): Promise<{ yaw: number; pitch: number } | null> => {
    try {
      // TODO: Replace this with actual MediaPipe implementation
      // Install: npm install @mediapipe/tasks-vision
      
      // Mock implementation for development/testing
      // In production, implement actual MediaPipe face detection:
      
      /*
      import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
      
      // Initialize FaceLandmarker
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO"
      });
      
      // Process video frame
      const results = await faceLandmarker.detectForVideo(video, Date.now());
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        // Calculate yaw and pitch from landmarks
        // This is a simplified calculation - you may need more sophisticated math
        const yaw = calculateYawFromLandmarks(landmarks);
        const pitch = calculatePitchFromLandmarks(landmarks);
        
        return { yaw, pitch };
      }
      */
      
      // For now, return mock data that simulates realistic head movements
      const mockYaw = Math.sin(Date.now() * 0.001) * 25; // Oscillating yaw
      const mockPitch = Math.cos(Date.now() * 0.0015) * 15; // Oscillating pitch
      
      return {
        yaw: mockYaw,
        pitch: mockPitch
      };
    } catch (error) {
      console.error('Face detection error:', error);
      return null;
    }
  }, []);

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      if (!isSecureContext()) {
        throw new Error('Camera requires a secure context (HTTPS or localhost). Please use HTTPS or localhost to access this feature.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        
        // Start face detection
        startFaceDetection();
        
        // Set initial pose
        setCurrentPose(POSE_REQUIREMENTS[0].pose);
      }
    } catch (error) {
      const errorMessage = classifyMediaError(error as Error);
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [isSecureContext, classifyMediaError, onError]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
      faceDetectionIntervalRef.current = null;
    }
    
    if (poseHoldTimeoutRef.current) {
      clearTimeout(poseHoldTimeoutRef.current);
      poseHoldTimeoutRef.current = null;
    }
    
    setIsCameraActive(false);
    setFaceDetected(false);
    setPoseHoldStart(null);
  }, []);

  const startFaceDetection = useCallback(() => {
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
    }

    faceDetectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !isCameraActive || !currentPose) return;

      try {
        const poseData = await detectFacePose(videoRef.current);
        if (poseData) {
          const { yaw, pitch } = poseData;
          setCurrentYaw(yaw);
          setCurrentPitch(pitch);
          setFaceDetected(true);

          // Check if current pose matches
          if (isPoseMatch(yaw, pitch, currentPose)) {
            if (!poseHoldStart) {
              setPoseHoldStart(Date.now());
            } else if (Date.now() - poseHoldStart >= POSE_HOLD_DURATION) {
              // Auto-capture after holding pose
              capturePhoto();
            }
          } else {
            setPoseHoldStart(null);
          }
        } else {
          setFaceDetected(false);
          setPoseHoldStart(null);
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, FACE_DETECTION_INTERVAL);
  }, [isCameraActive, currentPose, detectFacePose, isPoseMatch, poseHoldStart]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !currentPose || isProcessing) return;

    try {
      setIsProcessing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Failed to get canvas context');

      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create blob');
        }, 'image/jpeg', 0.9);
      });

      // Cloud storage removed - create local URL instead
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const photoUrl = URL.createObjectURL(blob);

      const photoData: PoseData = {
        pose: currentPose,
        photoUrl: photoUrl,
        timestamp: timestamp,
        yaw: currentYaw,
        pitch: currentPitch
      };

      setCapturedPhotos(prev => ({
        ...prev,
        [currentPose]: photoData
      }));

      // Move to next pose
      const currentIndex = POSE_REQUIREMENTS.findIndex(p => p.pose === currentPose);
      const nextPose = POSE_REQUIREMENTS[currentIndex + 1];
      
      if (nextPose) {
        setCurrentPose(nextPose.pose);
        setPoseHoldStart(null);
      }

      // Check if all required poses are captured
      const requiredPoses = POSE_REQUIREMENTS.filter(p => p.required);
      const capturedRequired = requiredPoses.every(p => capturedPhotos[p.pose] || p.pose === currentPose);
      
      if (capturedRequired && nextPose) {
        onComplete?.(Object.values(capturedPhotos));
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to capture photo';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [videoRef, canvasRef, currentPose, isProcessing, currentYaw, currentPitch, userId, capturedPhotos, onComplete, onError]);

  const retakePhoto = useCallback((pose: string) => {
    setCapturedPhotos(prev => {
      const newPhotos = { ...prev };
      delete newPhotos[pose];
      return newPhotos;
    });
    
    if (currentPose === pose) {
      setPoseHoldStart(null);
    }
  }, [currentPose]);

  const selectPose = useCallback((pose: string) => {
    setCurrentPose(pose);
    setPoseHoldStart(null);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Progress calculation
  const progress = useMemo(() => {
    const total = POSE_REQUIREMENTS.filter(p => p.required).length;
    const completed = Object.keys(capturedPhotos).length;
    return Math.round((completed / total) * 100);
  }, [capturedPhotos]);

  const requiredPosesCompleted = useMemo(() => {
    const required = POSE_REQUIREMENTS.filter(p => p.required);
    return required.every(p => capturedPhotos[p.pose]);
  }, [capturedPhotos]);

  // Render functions
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            {error.includes('HTTPS') && (
              <div className="mt-3">
                <p className="text-sm text-red-600">
                  <strong>Solution:</strong> Use HTTPS or localhost to access this feature.
                </p>
              </div>
            )}
            {error.includes('permissions') && (
              <div className="mt-3">
                <p className="text-sm text-red-600">
                  <strong>Solution:</strong> Click the camera icon in your browser's address bar and allow camera access.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCamera = () => {
    if (!isCameraActive) return null;

    return (
      <div className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-2xl mx-auto border-2 border-blue-500 rounded-lg"
          />
          
          {/* Face detection indicator */}
          {faceDetected && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              Face Detected
            </div>
          )}
          
          {/* Pose hold indicator */}
          {poseHoldStart && (
            <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              Hold Pose...
            </div>
          )}
        </div>

        {/* Current pose info */}
        {currentPose && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Current Pose: {POSE_REQUIREMENTS.find(p => p.pose === currentPose)?.label}
            </h3>
            <p className="text-gray-600">
              {POSE_REQUIREMENTS.find(p => p.pose === currentPose)?.instruction}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Yaw: {currentYaw.toFixed(1)}° | Pitch: {currentPitch.toFixed(1)}°
            </div>
          </div>
        )}

        {/* Manual capture button */}
        <div className="text-center">
          <button
            onClick={capturePhoto}
            disabled={isProcessing || !faceDetected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Capture Photo'}
          </button>
        </div>
      </div>
    );
  };

  const renderPoseSelection = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {POSE_REQUIREMENTS.map((pose) => {
          const isCaptured = !!capturedPhotos[pose.pose];
          const isCurrent = currentPose === pose.pose;
          const isRequired = pose.required;

          return (
            <button
              key={pose.pose}
              onClick={() => selectPose(pose.pose)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-center
                ${isCaptured 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : isCurrent 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
                ${!isRequired ? 'opacity-75' : ''}
              `}
            >
              <div className="font-medium">{pose.label}</div>
              <div className="text-xs mt-1">{pose.instruction}</div>
              {isCaptured && (
                <div className="mt-2">
                  <svg className="w-5 h-5 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderCapturedPhotos = () => {
    const photos = Object.values(capturedPhotos);
    if (photos.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Captured Photos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.pose} className="border rounded-lg p-3">
              <img
                src={photo.photoUrl}
                alt={`${photo.pose} pose`}
                className="w-full h-32 object-cover rounded mb-2"
              />
              <div className="text-sm text-gray-600 mb-2">
                <div className="font-medium">{POSE_REQUIREMENTS.find(p => p.pose === photo.pose)?.label}</div>
                <div>Yaw: {photo.yaw.toFixed(1)}°</div>
                <div>Pitch: {photo.pitch.toFixed(1)}°</div>
              </div>
              <button
                onClick={() => retakePhoto(photo.pose)}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded transition-colors"
              >
                Retake
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Photo Capture</h2>
        <p className="text-gray-600">
          Please capture photos in different poses to verify your identity
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {Object.keys(capturedPhotos).length} / {POSE_REQUIREMENTS.filter(p => p.required).length} poses
          </span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Error display */}
      {renderError()}

      {/* Camera controls */}
      <div className="text-center mb-6">
        {!isCameraActive ? (
          <button
            onClick={startCamera}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Stop Camera
          </button>
        )}
      </div>

      {/* Pose selection */}
      {renderPoseSelection()}

      {/* Camera feed */}
      {renderCamera()}

      {/* Captured photos */}
      {renderCapturedPhotos()}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Completion message */}
      {requiredPosesCompleted && (
        <div className="mt-8 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-green-800 mb-2">All Photos Captured!</h3>
            <p className="text-green-700">
              You have successfully captured all required poses. You can now proceed to the next step.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Test functions
export const __runLivePhotoTests = () => {
  console.log('🧪 Running LivePhotoCapture tests...');
  
  // Test helper functions
  const testWithin = () => {
    const within = (value: number, range: [number, number]): boolean => {
      return value >= range[0] && value <= range[1];
    };
    
    console.assert(within(5, [0, 10]) === true, 'within(5, [0, 10]) should be true');
    console.assert(within(0, [0, 10]) === true, 'within(0, [0, 10]) should be true');
    console.assert(within(10, [0, 10]) === true, 'within(10, [0, 10]) should be true');
    console.assert(within(-1, [0, 10]) === false, 'within(-1, [0, 10]) should be false');
    console.assert(within(11, [0, 10]) === false, 'within(11, [0, 10]) should be false');
    console.log('✅ within() tests passed');
  };

  const testIsPoseMatch = () => {
    const within = (value: number, range: [number, number]): boolean => {
      return value >= range[0] && value <= range[1];
    };
    
    const isPoseMatch = (yaw: number, pitch: number, pose: string): boolean => {
      const requirement = POSE_REQUIREMENTS.find(p => p.pose === pose);
      if (!requirement) return false;
      
      return within(yaw, requirement.yawRange) && within(pitch, requirement.pitchRange);
    };
    
    console.assert(isPoseMatch(0, 0, 'center') === true, 'Center pose should match at (0, 0)');
    console.assert(isPoseMatch(-20, 0, 'left') === true, 'Left pose should match at (-20, 0)');
    console.assert(isPoseMatch(20, 0, 'right') === true, 'Right pose should match at (20, 0)');
    console.assert(isPoseMatch(0, -15, 'up') === true, 'Up pose should match at (0, -15)');
    console.assert(isPoseMatch(0, 15, 'down') === true, 'Down pose should match at (0, 15)');
    console.log('✅ isPoseMatch() tests passed');
  };

  const testClassifyMediaError = () => {
    const classifyMediaError = (error: MediaError | Error): string => {
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            return 'Camera access denied. Please enable camera permissions and try again.';
          case 'NotReadableError':
            return 'Camera is already in use by another application. Please close other camera apps and try again.';
          case 'NotFoundError':
            return 'No camera found on your device. Please connect a camera and try again.';
          case 'SecurityError':
            return 'Camera access blocked due to security restrictions. Please use HTTPS or localhost.';
          default:
            return `Camera error: ${error.message}`;
        }
      }
      return `Unexpected error: ${error.message}`;
    };
    
    const mockError = new DOMException('Permission denied', 'NotAllowedError');
    const result = classifyMediaError(mockError);
    console.assert(result.includes('Camera access denied'), 'Should classify NotAllowedError correctly');
    console.log('✅ classifyMediaError() tests passed');
  };

  // Run all tests
  testWithin();
  testIsPoseMatch();
  testClassifyMediaError();
  
  console.log('🎉 All LivePhotoCapture tests completed!');
};

export default LivePhotoCapture;
