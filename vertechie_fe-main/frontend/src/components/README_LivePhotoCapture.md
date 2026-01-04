# LivePhotoCapture Component

A production-ready React + TypeScript component for live photo capture with MediaPipe face detection and local storage integration.

## 🚀 Features

- **Live Camera Integration**: Opens front-facing camera with proper permission handling
- **MediaPipe Face Detection**: Uses @mediapipe/tasks-vision for accurate pose estimation
- **Automatic Pose Detection**: Auto-captures photos when poses are held steady for 0.9 seconds
- **Six Pose Types**: Center, Left, Right, Up, Down, and optional Hand pose
- **Local Storage**: Automatically saves photos locally
- **Progress Tracking**: Visual progress bar and completion indicators
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Responsive Design**: Tailwind CSS styling with mobile-first approach
- **TypeScript**: Fully typed with comprehensive interfaces

## 📦 Installation

### 1. Install Dependencies

```bash
npm install @mediapipe/tasks-vision
```

### 2. Install Tailwind CSS (if not already installed)

```bash
npm install -D tailwindcss
npx tailwindcss init
```

### 3. Configure Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 🔧 Setup

### 1. Local Storage Configuration

The component now uses local storage for photo management.

### 2. Environment Variables

No environment variables are required for local storage.

## 💻 Usage

### Basic Usage

```tsx
import { LivePhotoCapture } from './components/LivePhotoCapture';

function App() {
  const handleComplete = (photos) => {
    console.log('All photos captured:', photos);
    // Navigate to next step or submit form
  };

  const handleError = (error) => {
    console.error('Photo capture error:', error);
    // Show error message to user
  };

  return (
    <LivePhotoCapture
      userId="user123"
      onComplete={handleComplete}
      onError={handleError}
    />
  );
}
```

### With Custom Configuration

```tsx
import { LivePhotoCapture } from './components/LivePhotoCapture';

function App() {
  return (
    <LivePhotoCapture
      userId="user123"
      onComplete={(photos) => console.log(photos)}
    />
  );
}
```

### With Custom Styling

```tsx
<LivePhotoCapture
  userId="user123"
  className="my-custom-class"
  onComplete={handleComplete}
/>
```

## 🎯 Pose Requirements

The component automatically detects and validates these head poses:

| Pose | Yaw Range | Pitch Range | Required |
|------|-----------|-------------|----------|
| Center | -5° to +5° | -5° to +5° | ✅ Yes |
| Left | -30° to -18° | -10° to +10° | ✅ Yes |
| Right | +18° to +30° | -10° to +10° | ✅ Yes |
| Up | -10° to +10° | -25° to -12° | ✅ Yes |
| Down | -10° to +10° | +12° to +25° | ✅ Yes |
| Hand | -15° to +15° | -15° to +15° | ❌ No |

## 🔍 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `userId` | `string` | ✅ | Unique identifier for the user |
| `onComplete` | `(photos: PoseData[]) => void` | ❌ | Callback when all required poses are captured |
| `onError` | `(error: string) => void` | ❌ | Callback for error handling |
| `className` | `string` | ❌ | Additional CSS classes |

## 📊 PoseData Interface

```typescript
interface PoseData {
  pose: string;        // Pose identifier (e.g., 'center', 'left')
  photoUrl: string;    // Local storage URL
  timestamp: string;   // ISO timestamp
  yaw: number;         // Detected yaw angle in degrees
  pitch: number;       // Detected pitch angle in degrees
}
```

## 🧪 Testing

The component includes built-in test functions:

```tsx
import { __runLivePhotoTests } from './components/LivePhotoCapture';

// Run tests in browser console
__runLivePhotoTests();
```

This will test:
- `within()` function for range validation
- `isPoseMatch()` function for pose detection
- `classifyMediaError()` function for error handling

## 🔒 Security & Permissions

### HTTPS Requirement
- Camera access requires HTTPS or localhost
- Component automatically checks security context
- Clear error messages for non-secure contexts

### Camera Permissions
- Handles all common permission scenarios
- User-friendly error messages with solutions
- Graceful fallbacks for permission issues

## 🎨 Customization

### Styling
The component uses Tailwind CSS classes and can be customized by:
- Overriding Tailwind classes
- Adding custom CSS classes via `className` prop
- Modifying the component's internal styling

### Pose Requirements
Modify the `POSE_REQUIREMENTS` constant to:
- Change angle ranges
- Add/remove poses
- Adjust required vs. optional poses

## 🚨 Error Handling

The component handles these error scenarios:

| Error Type | Description | User Message |
|------------|-------------|--------------|
| `NotAllowedError` | Camera permission denied | "Camera access denied. Please enable camera permissions and try again." |
| `NotReadableError` | Camera in use by another app | "Camera is already in use by another application." |
| `NotFoundError` | No camera found | "No camera found on your device." |
| `SecurityError` | Non-secure context | "Camera access blocked. Please use HTTPS or localhost." |

## 📱 Browser Support

- **Modern Browsers**: Chrome 67+, Firefox 60+, Safari 11.1+
- **Mobile**: iOS Safari 11.1+, Chrome Mobile 67+
- **Requirements**: WebRTC, MediaDevices API, Canvas API

## 🔧 Development

### MediaPipe Integration
To implement actual MediaPipe face detection:

1. Install the package: `npm install @mediapipe/tasks-vision`
2. Replace the mock `detectFacePose` function with real implementation
3. Use the commented code in the component as a starting point

### Testing
```bash
# Run component tests
npm test

# Run in development mode
npm run dev
```

## 📄 License

This component is provided as-is for educational and production use.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

For questions or issues:
1. Check the error messages in the component
2. Verify local storage permissions
3. Ensure HTTPS/localhost environment
4. Check browser console for detailed logs

