 // To use MediaPipe, install: npm install @mediapipe/tasks-vision
type FaceLandmarkerType = any;
type FilesetResolverType = any;

export interface FacePose {
  yaw: number;   // Left (-) to Right (+) rotation in degrees
  pitch: number; // Down (+) to Up (-) rotation in degrees
  roll?: number; // Optional roll angle
}

// More forgiving position ranges for easier verification
const POSITION_RANGES = {
  center: { yaw: [-10, 10], pitch: [-5, 5]},
  right:  { yaw: [3, 50], pitch: [-30, 30] },
  left:   { yaw: [-50, -3], pitch: [-30, 30] },
  up:     { yaw: [-25, 25], pitch: [-20, 0] },  // Much wider range for looking up
  down:   { yaw: [-25, 25], pitch: [2, 25] },   // Much wider range for looking down
};

class FaceDetector {
  private faceLandmarker: FaceLandmarkerType | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private useMediaPipe: boolean = false;
  private mediaPipeModule: any = null; // Store the imported module

  /**
   * Initialize MediaPipe Face Landmarker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        // Dynamically import MediaPipe (ES module import)
        if (!this.mediaPipeModule) {
          this.mediaPipeModule = await import('@mediapipe/tasks-vision');
        }

        console.log(' Initializing MediaPipe Face Landmarker...');
        const { FaceLandmarker, FilesetResolver } = this.mediaPipeModule;
        
        // Load MediaPipe WASM files
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        console.log('📥 Downloading face landmarker model...');
        // Create Face Landmarker
        this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: false,
          runningMode: 'VIDEO',
          numFaces: 1
        });

        this.useMediaPipe = true;
        this.isInitialized = true;
        console.log('🎯 Face detection is now active');
      } catch (error: any) {
        console.error('❌ Failed to initialize MediaPipe:', error);
        if (error?.message) {
          console.error('Error message:', error.message);
        }
        if (error?.code === 'MODULE_NOT_FOUND' || error?.message?.includes('Cannot find module')) {
          console.error('💡 MediaPipe package not found. Please install: npm install @mediapipe/tasks-vision');
        } else {
          console.error('Error details:', error);
        }
        console.warn('⚠️ Continuing without MediaPipe - face detection will NOT work');
        this.isInitialized = true;
        this.useMediaPipe = false;
      }
    })();

    return this.initializationPromise;
  }

  /**
   * Detect face pose from video element using MediaPipe (if available) or fallback
   */
  async detectPose(video: HTMLVideoElement): Promise<FacePose | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!video || video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    // Try MediaPipe first if available
    if (this.useMediaPipe && this.faceLandmarker) {
      try {
        const result = await this.detectPoseMediaPipe(video);
        if (result) {
          return result;
        }
      } catch (error) {
        console.error('❌ MediaPipe detection failed:', error);
      }
    }
    return null;
  }

  /**
   * MediaPipe-based detection (when MediaPipe is properly loaded)
   */
  private async detectPoseMediaPipe(video: HTMLVideoElement): Promise<FacePose | null> {
    if (!this.faceLandmarker) return null;

    try {
      const timestamp = Date.now();
      const results = this.faceLandmarker.detectForVideo(video, timestamp);

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        return this.calculatePoseFromLandmarks(landmarks);
      }
      return null;
    } catch (error) {
      console.error('MediaPipe detection error:', error);
      return null;
    }
  }

  /**
   * Calculate yaw and pitch from face landmarks (MediaPipe format)
   * MediaPipe returns 468 landmarks in normalized coordinates (0-1)
   * Optimized: Pre-calculated constants, reduced redundant calculations
   */
  private calculatePoseFromLandmarks(landmarks: any[]): FacePose {
    if (!landmarks || landmarks.length < 468) {
      return { yaw: 0, pitch: 0 };
    }

    // Cache landmark indices for better performance
    const noseTip = landmarks[4];
    const leftEyeOuter = landmarks[33];
    const rightEyeOuter = landmarks[263];
    const leftMouth = landmarks[61];
    const rightMouth = landmarks[291];

    // Calculate yaw (horizontal rotation: left/right) - optimized
    const eyeMidX = (leftEyeOuter.x + rightEyeOuter.x) * 0.5; // Use multiplication instead of division
    const eyeDistance = Math.abs(rightEyeOuter.x - leftEyeOuter.x);
    const eyeDistanceSafe = Math.max(eyeDistance, 0.01); // Cache safe value
    
    // Normalize offset by eye distance
    const yawOffset = (noseTip.x - eyeMidX) / eyeDistanceSafe;
    // Convert to degrees (empirically calibrated) - use pre-calculated constant
    const yaw = -yawOffset * 40; // Negate to fix left/right inversion
    const clampedYaw = Math.max(-45, Math.min(45, yaw));

    // Calculate pitch (vertical rotation: up/down) - optimized
    const eyeMidY = (leftEyeOuter.y + rightEyeOuter.y) * 0.5; // Use multiplication
    const mouthMidY = (leftMouth.y + rightMouth.y) * 0.5; // Use multiplication
    const faceHeight = Math.abs(mouthMidY - eyeMidY);
    const faceHeightSafe = Math.max(faceHeight * 0.5, 0.01); // Cache safe value
    
    // Nose position relative to eyes indicates pitch
    const pitchOffset = (noseTip.y - eyeMidY) / faceHeightSafe;
    // Convert to degrees (empirically calibrated) - use pre-calculated constant
    const pitch = pitchOffset * 35; // Positive when looking down, negative when looking up
    // Clamp to reasonable range - allow up to 65 for down position
    const clampedPitch = Math.max(-45, Math.min(65, pitch));

    return { yaw: clampedYaw, pitch: clampedPitch };
  }

  /**
   * Fallback detection using canvas image analysis
   * Analyzes facial features position to estimate head pose
   */
  private detectPoseFallback(video: HTMLVideoElement): FacePose | null {
    try {
      // Create a canvas to capture the video frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx || !video.videoWidth || !video.videoHeight) {
        return null;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Video stream is already unmirrored (CSS transform only affects display)
      ctx.drawImage(video, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple face detection using edge detection and symmetry analysis
      // This is a simplified method - for better accuracy, use MediaPipe or face-api.js
      const result = this.analyzeFacePosition(imageData, canvas.width, canvas.height);
      
      return result;
    } catch (error) {
      console.error('Fallback detection error:', error);
      return null;
    }
  }

  /**
   * Analyze face position from image data
   * This is a simplified method that estimates head position
   */
  private analyzeFacePosition(imageData: ImageData, width: number, height: number): FacePose | null {
    const data = imageData.data;
    const centerX = width / 2;
    const centerY = height / 2;

    // Analyze the center region for face-like features
    // This is a very simplified method - actual implementation would need
    // proper face detection (Haar cascades, neural networks, etc.)
    
    // For now, return a mock detection that allows the UI to work
    // In production, integrate with a proper face detection library
    
    // Since this is complex without a proper library, we'll return null
    // and let the UI handle it differently - or use MediaPipe if available
    return null;
  }

  /**
   * Determine head position category from pose
   * Prioritizes yaw (left/right) over pitch (up/down) when both are present
   * Optimized: Early exits, cached calculations, reduced iterations
   */
  detectHeadPosition(pose: FacePose | null): 'center' | 'right' | 'left' | 'up' | 'down' | null {
    if (!pose) return null;

    const { yaw, pitch } = pose;
    const absYaw = Math.abs(yaw); // Cache absolute value
    const absPitch = Math.abs(pitch); // Cache absolute value

    // First, check if yaw indicates clear left/right movement (prioritize horizontal)
    // Prioritize yaw over pitch when yaw is significant, unless pitch is very extreme
    // This ensures left/right detection works even when user tilts head slightly up/down
    if (absYaw >= 5) {
      // Horizontal movement detected - prioritize this for left/right
      // Allow wider pitch range for left/right detection (user can turn head while tilting)
      if (yaw >= 5) {
        // Check if it matches right range (with lenient pitch) - early exit
        const rightYawRange = POSITION_RANGES.right.yaw;
        if (yaw >= rightYawRange[0] && yaw <= rightYawRange[1]) {
          return 'right';
        }
      }
      if (yaw <= -5) {
        // Check if it matches left range (with lenient pitch) - early exit
        // Allow any pitch value when yaw clearly indicates left/right
        const leftYawRange = POSITION_RANGES.left.yaw;
        if (yaw >= leftYawRange[0] && yaw <= leftYawRange[1]) {
          return 'left';
        }
      }
    }

    // Then check for up/down if pitch is significant AND yaw is small
    // Only prioritize up/down when head is relatively straight (not turning left/right)
    // Made more forgiving for easier verification
    if (absPitch >= 0.5 && absYaw < 25) {
      // Strong vertical movement with small yaw - prioritize up/down
      // Up position check - any negative pitch (looking up = negative)
      if (pitch <= 0) {
        // Fallback: if pitch is negative (looking up), detect as up with wide yaw tolerance
        if (pitch <= 0 && absYaw <= 25) {
          return 'up';
        }
      }
      // Down position check - positive pitch (looking down = positive)
      if (pitch >= 2) {
        // Fallback: if pitch is positive enough (looking down), detect as down with wide yaw tolerance
        if (pitch >= 2 && absYaw <= 25) {
          return 'down';
        }
      }
    }

    // Check specific poses first (up, down, right, left) before center
    // This ensures specific poses are detected correctly even if they're close to center
    const upRange = POSITION_RANGES.up;
    if (yaw >= upRange.yaw[0] && yaw <= upRange.yaw[1] &&
        pitch >= upRange.pitch[0] && pitch <= upRange.pitch[1]) {
      return 'up';
    }

    const downRange = POSITION_RANGES.down;
    if (yaw >= downRange.yaw[0] && yaw <= downRange.yaw[1] &&
        pitch >= downRange.pitch[0] && pitch <= downRange.pitch[1]) {
      return 'down';
    }

    const rightRange = POSITION_RANGES.right;
    if (yaw >= rightRange.yaw[0] && yaw <= rightRange.yaw[1] &&
        pitch >= rightRange.pitch[0] && pitch <= rightRange.pitch[1]) {
      return 'right';
    }

    const leftRange = POSITION_RANGES.left;
    if (yaw >= leftRange.yaw[0] && yaw <= leftRange.yaw[1] &&
        pitch >= leftRange.pitch[0] && pitch <= leftRange.pitch[1]) {
      return 'left';
    }

    // Check center last - only if no specific pose matches
    const centerRange = POSITION_RANGES.center;
    if (yaw >= centerRange.yaw[0] && yaw <= centerRange.yaw[1] &&
        pitch >= centerRange.pitch[0] && pitch <= centerRange.pitch[1]) {
      return 'center';
    }

    // If not in any specific range, try to infer direction
    // Made more forgiving for easier verification
    // Prioritize yaw for left/right when yaw is significant
    if (absYaw >= 3) {
      // Horizontal movement - prioritize yaw for left/right
      if (yaw > 3) return 'right';
      if (yaw < -3) return 'left';
    } else if (absYaw < 25 && absPitch >= 0.5) {
      // Vertical movement dominates (only if yaw is small, meaning head is relatively straight)
      // Made much more forgiving for up/down detection
      if (pitch <= 0) return 'up'; // Up position with any negative pitch
      if (pitch >= 2) return 'down'; // Down position with small positive pitch
    }

    // Default to center if close
    if (absYaw < 10 && absPitch < 5) {
      return 'center';
    }

    return null;
  }

  /**
   * Check if pose matches required position
   */
  isPositionMatch(pose: FacePose | null, requiredPosition: 'center' | 'right' | 'left' | 'up' | 'down'): boolean {
    if (!pose) return false;
    const detectedPosition = this.detectHeadPosition(pose);
    return detectedPosition === requiredPosition;
  }
}

// Singleton instance
let faceDetectorInstance: FaceDetector | null = null;

/**
 * Get or create face detector instance
 */
export function getFaceDetector(): FaceDetector {
  if (!faceDetectorInstance) {
    faceDetectorInstance = new FaceDetector();
  }
  return faceDetectorInstance;
}

/**
 * Detect face pose from video element
 */
export async function detectFacePose(video: HTMLVideoElement): Promise<FacePose | null> {
  const detector = getFaceDetector();
  return detector.detectPose(video);
}

/**
 * Get head position category from pose
 */
export function getHeadPosition(pose: FacePose | null): 'center' | 'right' | 'left' | 'up' | 'down' | null {
  if (!pose) return null;
  const detector = getFaceDetector();
  return detector.detectHeadPosition(pose);
}

/**
 * Check if current pose matches required position
 */
export function checkPositionMatch(
  pose: FacePose | null,
  requiredPosition: 'center' | 'right' | 'left' | 'up' | 'down'
): boolean {
  if (!pose) return false;
  const detector = getFaceDetector();
  return detector.isPositionMatch(pose, requiredPosition);
}

/**
 * Pre-load face detector for faster first detection
 * Call this early (e.g., on component mount) to avoid delay when camera opens
 */
export async function preloadFaceDetector(): Promise<void> {
  const detector = getFaceDetector();
  await detector.initialize();
  console.log('✅ Face detector pre-loaded and ready');
}

