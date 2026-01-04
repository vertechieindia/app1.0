import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CameraAlt,
  PhotoCamera,
  RotateLeft,
  RotateRight,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Warning,
  CheckCircle,
  Person,
  School,
  Work,
  Security,
  Delete,
  Add,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const SelfieContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  textAlign: 'center',
}));

const VideoPreview = styled('video')({
  width: '100%',
  borderRadius: '8px',
  border: '2px solid #e0e0e0',
});

const CanvasPreview = styled('canvas')({
  width: '100%',
  borderRadius: '8px',
  border: '2px solid #e0e0e0',
});

const PostureButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
  margin: theme.spacing(1),
  minWidth: '120px',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[200],
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.grey[300],
  },
}));

const DisclaimersContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
}));

// Types
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  visaStatus: string;
}

interface Education {
  id: string;
  degreeType: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
  gpa?: string;
}

interface WorkReference {
  firstName: string;
  lastName: string;
  phone: string;
  companyEmail: string;
  linkedinUrl: string;
  relationship: 'projectManager' | 'teamLeader' | 'teamCoMember';
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  references: WorkReference[];
}

interface TechieProfile {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  selfies: { [posture: string]: string };
}

const STEPS = [
  'Personal Information',
  'Live Selfie Verification',
  'Education Details',
  'Work Experience',
  'Final Review & Disclaimer'
];

const POSTURES = [
  { key: 'front', label: 'Front View', icon: <Person /> },
  { key: 'left', label: 'Left Side', icon: <RotateLeft /> },
  { key: 'right', label: 'Right Side', icon: <RotateRight /> },
  { key: 'up', label: 'Look Up', icon: <KeyboardArrowUp /> },
  { key: 'down', label: 'Look Down', icon: <KeyboardArrowDown /> },
  { key: 'hand', label: 'Show Hand', icon: <CheckCircle /> },
];

const TechieSignup: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [profile, setProfile] = useState<TechieProfile>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      visaStatus: '',
    },
    education: [],
    workExperience: [],
    selfies: {},
  });

  const [currentPosture, setCurrentPosture] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<{ [key: string]: string }>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  }, [stream]);

  const captureSelfie = useCallback((posture: string) => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImages(prev => ({ ...prev, [posture]: imageData }));
        setProfile(prev => ({
          ...prev,
          selfies: { ...prev.selfies, [posture]: imageData }
        }));
        
        setCurrentPosture(posture);
        setTimeout(() => setCurrentPosture(''), 2000);
      }
    }
  }, []);

  // Form handlers
  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degreeType: '',
      degree: '',
      institution: '',
      fieldOfStudy: '',
      graduationYear: '',
      gpa: '',
    };
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addWorkExperience = () => {
    const newWorkExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      references: [],
    };
    setProfile(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newWorkExp]
    }));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(work =>
        work.id === id ? { ...work, [field]: value } : work
      )
    }));
  };

  const addReference = (workExpId: string) => {
    const newReference: WorkReference = {
      firstName: '',
      lastName: '',
      phone: '',
      companyEmail: '',
      linkedinUrl: '',
      relationship: 'projectManager',
    };
    
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(work =>
        work.id === workExpId
          ? { ...work, references: [...work.references, newReference] }
          : work
      )
    }));
  };

  const updateReference = (workExpId: string, refIndex: number, field: keyof WorkReference, value: string) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(work =>
        work.id === workExpId
          ? {
              ...work,
              references: work.references.map((ref, index) =>
                index === refIndex ? { ...ref, [field]: value } : ref
              )
            }
          : work
      )
    }));
  };

  const removeReference = (workExpId: string, refIndex: number) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(work =>
        work.id === workExpId
          ? {
              ...work,
              references: work.references.filter((_, index) => index !== refIndex)
            }
          : work
      )
    }));
  };

  const handleNext = () => {
    if (activeStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields
      if (!profile.personalInfo.firstName || !profile.personalInfo.lastName || 
          !profile.personalInfo.email || !profile.personalInfo.phone || 
          !profile.personalInfo.visaStatus) {
        alert('Please fill in all required personal information fields.');
        return;
      }

      if (Object.keys(profile.selfies).length < POSTURES.length) {
        alert('Please capture all required selfie postures.');
        return;
      }

      if (profile.education.length === 0) {
        alert('Please add at least one education entry.');
        return;
      }

      // Submit to backend
      const response = await fetch('http://127.0.0.1:54321/functions/v1/techie-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        alert('Techie profile submitted successfully! We will begin the background verification process.');
        // Redirect or show success page
      } else {
        throw new Error('Failed to submit profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Failed to submit profile. Please try again.');
    }
  };

  const renderPersonalInfo = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name *"
            value={profile.personalInfo.firstName}
            onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name *"
            value={profile.personalInfo.lastName}
            onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email ID *"
            type="email"
            value={profile.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number *"
            type="tel"
            value={profile.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            onKeyDown={(e) => {
              // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
              if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
                  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                  (e.keyCode === 65 && e.ctrlKey === true) ||
                  (e.keyCode === 67 && e.ctrlKey === true) ||
                  (e.keyCode === 86 && e.ctrlKey === true) ||
                  (e.keyCode === 88 && e.ctrlKey === true) ||
                  // Allow: numbers 0-9
                  (e.keyCode >= 48 && e.keyCode <= 57) ||
                  // Allow: numpad numbers 0-9
                  (e.keyCode >= 96 && e.keyCode <= 105)) {
                return;
              }
              // Prevent all other keys
              e.preventDefault();
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Work Authorization *</InputLabel>
            <Select
              value={profile.personalInfo.visaStatus}
              onChange={(e) => handlePersonalInfoChange('visaStatus', e.target.value)}
            >
              <MenuItem value="us_citizen">US Citizen</MenuItem>
              <MenuItem value="green_card">Green Card</MenuItem>
              <MenuItem value="gc_ead">GC EAD (Green Card EAD)</MenuItem>
              <MenuItem value="h1b">H1B</MenuItem>
              <MenuItem value="h4_ead">H4 EAD</MenuItem>
              <MenuItem value="l1">L1</MenuItem>
              <MenuItem value="l2_ead">L2 EAD</MenuItem>
              <MenuItem value="j1">J1 (Exchange Visitor)</MenuItem>
              <MenuItem value="j2_ead">J2 EAD</MenuItem>
              <MenuItem value="o1">O1 (Extraordinary Ability)</MenuItem>
              <MenuItem value="e1">E1 (Treaty Trader)</MenuItem>
              <MenuItem value="e2">E2 (Treaty Investor)</MenuItem>
              <MenuItem value="e3">E3 (Australian Specialty)</MenuItem>
              <MenuItem value="tn">TN (NAFTA)</MenuItem>
              <MenuItem value="opt_ead">OPT EAD</MenuItem>
              <MenuItem value="stem_opt_ead">STEM OPT EAD</MenuItem>
              <MenuItem value="cpt">CPT</MenuItem>
              <MenuItem value="f1">F1 (Student)</MenuItem>
              <MenuItem value="eb_pending">EB-1/2/3 (Green Card Pending)</MenuItem>
              <MenuItem value="asylum_ead">Asylum EAD</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSelfieVerification = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Live Selfie Verification
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Please capture selfies in different postures to verify your identity. 
        This helps prevent fraud and ensures genuine profiles.
      </Typography>

      {!showCamera ? (
        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<CameraAlt />}
            onClick={startCamera}
            sx={{ mb: 3 }}
          >
            Start Camera
          </Button>
        </Box>
      ) : (
        <SelfieContainer>
          <VideoPreview
            ref={videoRef}
            autoPlay
            playsInline
            muted
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Capture Selfies in Different Postures:
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {POSTURES.map((posture) => (
                <Grid item key={posture.key}>
                  <PostureButton
                    variant="outlined"
                    startIcon={posture.icon}
                    onClick={() => captureSelfie(posture.key)}
                    active={!!capturedImages[posture.key]}
                    disabled={!!capturedImages[posture.key]}
                  >
                    {posture.label}
                  </PostureButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          {Object.keys(capturedImages).length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Captured Selfies:
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(capturedImages).map(([posture, imageData]) => (
                  <Grid item xs={6} sm={4} key={posture}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={imageData}
                        alt={`${posture} selfie`}
                        style={{ width: '100%', borderRadius: '4px' }}
                      />
                      <Chip
                        label={POSTURES.find(p => p.key === posture)?.label}
                        size="small"
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={stopCamera}>
              Stop Camera
            </Button>
          </Box>
        </SelfieContainer>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );

  const renderEducation = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Education Details
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addEducation}
        >
          Add Education
        </Button>
      </Box>

      {/* Strict Warning Message */}
      <Box sx={{ 
        bgcolor: '#fff3cd', 
        border: '2px solid #ffc107', 
        borderRadius: '8px', 
        p: 3, 
        mb: 3,
        borderLeft: '6px solid #ff9800'
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: '#d32f2f', display: 'flex', alignItems: 'center' }}>
          ⚠️ STRICT VERIFICATION WARNING
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#d32f2f' }}>
          <strong>IMPORTANT:</strong> Please provide ONLY genuine education details. We will directly reach out to your institutions and physically verify all documents with our expert team.
        </Typography>
      </Box>


      {profile.education.map((edu, index) => (
        <Card key={edu.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Education #{index + 1}
              </Typography>
              <IconButton
                color="error"
                onClick={() => removeEducation(edu.id)}
              >
                <Delete />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Degree Type *</InputLabel>
                  <Select
                    value={edu.degreeType}
                    onChange={(e) => updateEducation(edu.id, 'degreeType', e.target.value)}
                    label="Degree Type *"
                  >
                    <MenuItem value="masters">Masters</MenuItem>
                    <MenuItem value="bachelors">Bachelors</MenuItem>
                    <MenuItem value="college">College</MenuItem>
                    <MenuItem value="diploma">Diploma</MenuItem>
                    <MenuItem value="high-school">High School</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree/Program Name *"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="e.g., Computer Science, MBA, Engineering"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution *"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study *"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Graduation Year *"
                  value={edu.graduationYear}
                  onChange={(e) => updateEducation(edu.id, 'graduationYear', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GPA (Optional)"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderWorkExperience = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Work Experience
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={addWorkExperience}
        >
          Add Work Experience
        </Button>
      </Box>


      {profile.workExperience.map((work, index) => (
        <Card key={work.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Work Experience #{index + 1}
              </Typography>
              <IconButton
                color="error"
                onClick={() => {
                  setProfile(prev => ({
                    ...prev,
                    workExperience: prev.workExperience.filter(w => w.id !== work.id)
                  }));
                }}
              >
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company *"
                  value={work.company}
                  onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position *"
                  value={work.position}
                  onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date *"
                  type="date"
                  value={work.startDate}
                  onChange={(e) => updateWorkExperience(work.id, 'startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={work.endDate}
                  onChange={(e) => updateWorkExperience(work.id, 'endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  disabled={work.currentlyWorking}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={work.description}
                  onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                References (Required - Project Manager, Team Leader, Team Co-members)
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => addReference(work.id)}
                color="primary"
              >
                Add Reference
              </Button>
            </Box>

            {work.references.length === 0 && (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center', 
                border: '2px dashed #ccc', 
                borderRadius: '8px',
                mb: 2,
                bgcolor: '#f9f9f9'
              }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  No references added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Add Reference" to add Project Manager, Team Leader, or Team Co-member references
                </Typography>
              </Box>
            )}

            {work.references.map((ref, refIndex) => (
              <Card key={refIndex} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Reference #{refIndex + 1}
                    </Typography>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => removeReference(work.id, refIndex)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Reference Type *</InputLabel>
                        <Select
                          value={ref.relationship}
                          onChange={(e) => updateReference(work.id, refIndex, 'relationship', e.target.value)}
                        >
                          <MenuItem value="projectManager">Project Manager</MenuItem>
                          <MenuItem value="teamLeader">Team Leader</MenuItem>
                          <MenuItem value="teamCoMember">Team Co-member</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={ref.firstName}
                        onChange={(e) => updateReference(work.id, refIndex, 'firstName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name *"
                        value={ref.lastName}
                        onChange={(e) => updateReference(work.id, refIndex, 'lastName', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number *"
                        type="tel"
                        value={ref.phone}
                        onChange={(e) => updateReference(work.id, refIndex, 'phone', e.target.value)}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
                          if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
                              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                              (e.keyCode === 65 && e.ctrlKey === true) ||
                              (e.keyCode === 67 && e.ctrlKey === true) ||
                              (e.keyCode === 86 && e.ctrlKey === true) ||
                              (e.keyCode === 88 && e.ctrlKey === true) ||
                              // Allow: numbers 0-9
                              (e.keyCode >= 48 && e.keyCode <= 57) ||
                              // Allow: numpad numbers 0-9
                              (e.keyCode >= 96 && e.keyCode <= 105)) {
                            return;
                          }
                          // Prevent all other keys
                          e.preventDefault();
                        }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Email ID *"
                        type="email"
                        value={ref.companyEmail}
                        onChange={(e) => updateReference(work.id, refIndex, 'companyEmail', e.target.value)}
                        placeholder="reference@company.com"
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="LinkedIn URL *"
                        value={ref.linkedinUrl}
                        onChange={(e) => updateReference(work.id, refIndex, 'linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderFinalReview = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Final Review & Important Disclaimers
      </Typography>

      <DisclaimersContainer>
        <Typography variant="h6" color="error" gutterBottom>
          ⚠️ CRITICAL ANTI-FRAUD DISCLOSURE
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>ATTENTION:</strong> Before submitting your profile, please read this carefully:
        </Typography>
        
        <List>
          <ListItem>
            <ListItemIcon>
              <Warning color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Fake Profile Detection"
              secondary="We employ advanced AI and human verification to detect fake profiles, false information, and fraudulent activities."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Security color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Information Sharing with Authorities"
              secondary="Fake profiles will be reported to USCIS, ICE, and other relevant authorities. This may lead to deportation proceedings."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Work color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Vendor & Client Notification"
              secondary="All fake profiles will be shared with our subscribed vendors and clients for fraud prevention purposes."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Background Verification"
              secondary="We conduct in-depth background checks including reference verification, employment history, and credential validation."
            />
          </ListItem>
        </List>

        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
          By submitting this profile, you confirm that:
        </Typography>
        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
          ✅ All information provided is accurate and truthful<br/>
          ✅ You have permission to share reference contact details<br/>
          ✅ You understand the consequences of providing false information<br/>
          ✅ You consent to background verification processes<br/>
          ✅ You acknowledge the anti-fraud measures and legal implications
        </Typography>
      </DisclaimersContainer>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Personal Info:</Typography>
            <Typography variant="body2">
              {profile.personalInfo.firstName} {profile.personalInfo.lastName}<br/>
              {profile.personalInfo.email}<br/>
              {profile.personalInfo.phone}<br/>
              Work Authorization: {getWorkAuthorizationLabel(profile.personalInfo.visaStatus)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Verification:</Typography>
            <Typography variant="body2">
              Selfies: {Object.keys(profile.selfies).length}/{POSTURES.length}<br/>
              Education: {profile.education.length} entries<br/>
              Work Experience: {profile.workExperience.length} entries
            </Typography>
          </Grid>
        </Grid>

        {/* Education Details */}
        {profile.education.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Education Details
            </Typography>
            {profile.education.map((edu, index) => (
              <Card key={edu.id} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Education #{index + 1}
                </Typography>
                <Typography variant="body2">
                  <strong>Degree Type:</strong> {edu.degreeType.charAt(0).toUpperCase() + edu.degreeType.slice(1).replace('-', ' ')}<br/>
                  <strong>Degree/Program:</strong> {edu.degree}<br/>
                  <strong>Institution:</strong> {edu.institution}<br/>
                  <strong>Field of Study:</strong> {edu.fieldOfStudy}<br/>
                  <strong>Graduation Year:</strong> {edu.graduationYear}<br/>
                  {edu.gpa && <><strong>GPA:</strong> {edu.gpa}</>}
                </Typography>
              </Card>
            ))}
          </Box>
        )}

        {/* Work Experience Details */}
        {profile.workExperience.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Work Experience Details
            </Typography>
            {profile.workExperience.map((work, index) => (
              <Card key={work.id} sx={{ mb: 3, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Work Experience #{index + 1}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Company:</strong> {work.company}<br/>
                  <strong>Position:</strong> {work.position}<br/>
                  <strong>Start Date:</strong> {work.startDate}<br/>
                  <strong>End Date:</strong> {work.currentlyWorking ? 'Currently Working' : work.endDate}<br/>
                  {work.description && <><strong>Description:</strong> {work.description}</>}
                </Typography>
                
                {work.references.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      References:
                    </Typography>
                    {work.references.map((ref, refIndex) => (
                      <Box key={refIndex} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                        <Typography variant="body2">
                          <strong>Type:</strong> {ref.relationship === 'projectManager' ? 'Project Manager' : 
                                               ref.relationship === 'teamLeader' ? 'Team Leader' : 'Team Co-member'}<br/>
                          <strong>Name:</strong> {ref.firstName} {ref.lastName}<br/>
                          <strong>Phone:</strong> {ref.phone}<br/>
                          <strong>Company Email:</strong> {ref.companyEmail}<br/>
                          <strong>LinkedIn:</strong> {ref.linkedinUrl}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

  const getWorkAuthorizationLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'us_citizen': 'US Citizen',
      'green_card': 'Green Card',
      'gc_ead': 'GC EAD (Green Card EAD)',
      'h1b': 'H1B',
      'h4_ead': 'H4 EAD',
      'l1': 'L1',
      'l2_ead': 'L2 EAD',
      'j1': 'J1 (Exchange Visitor)',
      'j2_ead': 'J2 EAD',
      'o1': 'O1 (Extraordinary Ability)',
      'e1': 'E1 (Treaty Trader)',
      'e2': 'E2 (Treaty Investor)',
      'e3': 'E3 (Australian Specialty)',
      'tn': 'TN (NAFTA)',
      'opt_ead': 'OPT EAD',
      'stem_opt_ead': 'STEM OPT EAD',
      'cpt': 'CPT',
      'f1': 'F1 (Student)',
      'eb_pending': 'EB-1/2/3 (Green Card Pending)',
      'asylum_ead': 'Asylum EAD',
      'other': 'Other'
    };
    return labels[value] || value;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderSelfieVerification();
      case 2:
        return renderEducation();
      case 3:
        return renderWorkExperience();
      case 4:
        return renderFinalReview();
      default:
        return 'Unknown step';
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return profile.personalInfo.firstName && profile.personalInfo.lastName && 
               profile.personalInfo.email && profile.personalInfo.phone && 
               profile.personalInfo.visaStatus;
      case 1:
        return Object.keys(profile.selfies).length === POSTURES.length;
      case 2:
        return profile.education.length > 0 && 
               profile.education.every(edu => 
                 edu.degreeType && edu.degree && edu.institution && edu.fieldOfStudy && edu.graduationYear
               );
      case 3:
        return profile.workExperience.length > 0 && 
               profile.workExperience.every(work => 
                 work.company && work.position && work.startDate &&
                 work.references.length > 0 &&
                 work.references.every(ref => 
                   ref.firstName && ref.lastName && ref.phone && ref.companyEmail && ref.linkedinUrl
                 )
               );
      default:
        return true;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Techie Profile Registration
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Complete your profile to join VerTechie's verified tech professional network
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4, mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {activeStep === STEPS.length - 1 ? 'Submit Profile' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TechieSignup;
