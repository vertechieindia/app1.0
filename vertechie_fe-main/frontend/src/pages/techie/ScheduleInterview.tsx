/**
 * ScheduleInterview - Schedule video interviews with candidates
 * 
 * Features:
 * - Select interview type (Screening, Technical, HR, Final)
 * - Pick date and time
 * - Add participants (interviewers, candidates)
 * - Generate unique meeting link
 * - Send invitations
 * - Calendar integration
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Icons
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import LinkIcon from '@mui/icons-material/Link';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Styled Components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
  padding: 24,
});

const StyledCard = styled(Card)({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
});

const InterviewTypeCard = styled(Card)<{ selected?: boolean }>(({ selected }) => ({
  borderRadius: 16,
  cursor: 'pointer',
  border: selected ? '2px solid #0d47a1' : '2px solid transparent',
  background: selected ? alpha('#0d47a1', 0.05) : 'white',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
}));

const MeetingLinkBox = styled(Paper)({
  padding: 16,
  borderRadius: 12,
  background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.05) 0%, rgba(21, 101, 192, 0.1) 100%)',
  border: '1px solid rgba(13, 71, 161, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const StepContent = styled(Box)({
  padding: '24px 0',
});

// Interview Types
const interviewTypes = [
  { id: 'screening', name: 'Phone/Video Screening', duration: 30, icon: '📱', description: 'Initial candidate screening call' },
  { id: 'technical', name: 'Technical Interview', duration: 60, icon: '💻', description: 'Coding & technical assessment' },
  { id: 'behavioral', name: 'Behavioral Interview', duration: 45, icon: '🎯', description: 'Culture fit & soft skills' },
  { id: 'hr', name: 'HR Round', duration: 30, icon: '👔', description: 'HR discussion & negotiation' },
  { id: 'final', name: 'Final Interview', duration: 60, icon: '🏆', description: 'Final round with leadership' },
  { id: 'panel', name: 'Panel Interview', duration: 90, icon: '👥', description: 'Multiple interviewers' },
];

// Mock candidates
const mockCandidates = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', position: 'Senior Frontend Developer', avatar: '' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@email.com', position: 'Full Stack Developer', avatar: '' },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@email.com', position: 'Backend Engineer', avatar: '' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@email.com', position: 'DevOps Engineer', avatar: '' },
];

// Mock interviewers
const mockInterviewers = [
  { id: '1', name: 'Jane Smith (You)', email: 'jane.smith@company.com', role: 'Hiring Manager', avatar: '' },
  { id: '2', name: 'David Wilson', email: 'david.w@company.com', role: 'Tech Lead', avatar: '' },
  { id: '3', name: 'Lisa Brown', email: 'lisa.b@company.com', role: 'HR Manager', avatar: '' },
  { id: '4', name: 'Robert Taylor', email: 'robert.t@company.com', role: 'CTO', avatar: '' },
];

const ScheduleInterview: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedType, setSelectedType] = useState('technical');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState(60);
  const [selectedCandidates, setSelectedCandidates] = useState<typeof mockCandidates>([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState<typeof mockInterviewers>([mockInterviewers[0]]);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [sendReminders, setSendReminders] = useState(true);
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [recordMeeting, setRecordMeeting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = ['Interview Type', 'Date & Time', 'Participants', 'Review & Schedule'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Generate meeting link and schedule
      const roomId = `interview-${Date.now()}`;
      const link = `${window.location.origin}/techie/lobby/${roomId}?type=interview`;
      setGeneratedLink(link);
      setShowSuccess(true);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const startMeetingNow = () => {
    const roomId = `interview-${Date.now()}`;
    navigate(`/techie/lobby/${roomId}?type=interview&title=${encodeURIComponent(meetingTitle || 'Interview')}`);
  };

  const selectedInterviewType = interviewTypes.find(t => t.id === selectedType);

  return (
      <PageContainer>
        <Box maxWidth={900} mx="auto">
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <IconButton onClick={() => navigate('/techie/ats/scheduling')} sx={{ bgcolor: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#0d47a1">
                Schedule Interview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up a video interview with candidates
              </Typography>
            </Box>
          </Box>

          {/* Quick Start */}
          <StyledCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Start Instant Meeting
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a video call right now without scheduling
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={startMeetingNow}
                  sx={{
                    bgcolor: '#0d47a1',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Start Now
                </Button>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Stepper */}
          <StyledCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <StepContent>
                {/* Step 1: Interview Type */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Select Interview Type
                    </Typography>
                    <Grid container spacing={2}>
                      {interviewTypes.map((type) => (
                        <Grid item xs={12} sm={6} md={4} key={type.id}>
                          <InterviewTypeCard
                            selected={selectedType === type.id}
                            onClick={() => {
                              setSelectedType(type.id);
                              setDuration(type.duration);
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                              <Typography variant="h3" sx={{ mb: 1 }}>{type.icon}</Typography>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {type.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {type.description}
                              </Typography>
                              <Chip
                                size="small"
                                icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                                label={`${type.duration} min`}
                                sx={{ bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }}
                              />
                            </CardContent>
                          </InterviewTypeCard>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Step 2: Date & Time */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Select Date & Time
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Meeting Title"
                          placeholder="e.g., Technical Interview - Frontend Developer"
                          value={meetingTitle}
                          onChange={(e) => setMeetingTitle(e.target.value)}
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Date"
                          type="date"
                          value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Time"
                          type="time"
                          value={selectedTime ? selectedTime.toTimeString().slice(0, 5) : ''}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(':');
                            const newTime = new Date();
                            newTime.setHours(parseInt(hours), parseInt(minutes));
                            setSelectedTime(newTime);
                          }}
                          InputLabelProps={{ shrink: true }}
                          sx={{ mb: 3 }}
                        />
                        <FormControl fullWidth>
                          <InputLabel>Duration</InputLabel>
                          <Select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value as number)}
                            label="Duration"
                          >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={45}>45 minutes</MenuItem>
                            <MenuItem value={60}>60 minutes</MenuItem>
                            <MenuItem value={90}>90 minutes</MenuItem>
                            <MenuItem value={120}>2 hours</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Meeting Notes / Agenda"
                          placeholder="Add any notes or agenda items for the interview..."
                          value={meetingNotes}
                          onChange={(e) => setMeetingNotes(e.target.value)}
                          sx={{ mb: 3 }}
                        />
                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                          <FormControlLabel
                            control={<Switch checked={sendReminders} onChange={(e) => setSendReminders(e.target.checked)} />}
                            label="Send email reminders"
                          />
                          <FormControlLabel
                            control={<Switch checked={addToCalendar} onChange={(e) => setAddToCalendar(e.target.checked)} />}
                            label="Add to calendar"
                          />
                          <FormControlLabel
                            control={<Switch checked={recordMeeting} onChange={(e) => setRecordMeeting(e.target.checked)} />}
                            label="Record meeting"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 3: Participants */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Add Participants
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                          Candidates
                        </Typography>
                        <Autocomplete
                          multiple
                          options={mockCandidates}
                          getOptionLabel={(option) => option.name}
                          value={selectedCandidates}
                          onChange={(_, value) => setSelectedCandidates(value)}
                          renderInput={(params) => (
                            <TextField {...params} label="Add candidates" placeholder="Search..." />
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff9800' }}>
                                {option.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.position}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        />
                        <List sx={{ mt: 2 }}>
                          {selectedCandidates.map((candidate) => (
                            <ListItem key={candidate.id} sx={{ bgcolor: 'grey.50', borderRadius: 2, mb: 1 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#ff9800' }}>{candidate.name.charAt(0)}</Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={candidate.name}
                                secondary={candidate.position}
                              />
                              <Chip label="Candidate" size="small" sx={{ bgcolor: alpha('#ff9800', 0.2), color: '#ff9800' }} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                          Interviewers
                        </Typography>
                        <Autocomplete
                          multiple
                          options={mockInterviewers}
                          getOptionLabel={(option) => option.name}
                          value={selectedInterviewers}
                          onChange={(_, value) => setSelectedInterviewers(value)}
                          renderInput={(params) => (
                            <TextField {...params} label="Add interviewers" placeholder="Search..." />
                          )}
                          renderOption={(props, option) => (
                            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: '#0d47a1' }}>
                                {option.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{option.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {option.role}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        />
                        <List sx={{ mt: 2 }}>
                          {selectedInterviewers.map((interviewer) => (
                            <ListItem key={interviewer.id} sx={{ bgcolor: 'grey.50', borderRadius: 2, mb: 1 }}>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#0d47a1' }}>{interviewer.name.charAt(0)}</Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={interviewer.name}
                                secondary={interviewer.role}
                              />
                              <Chip label="Interviewer" size="small" sx={{ bgcolor: alpha('#0d47a1', 0.2), color: '#0d47a1' }} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 4: Review */}
                {activeStep === 3 && !showSuccess && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Review & Schedule
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: '#0d47a1', fontSize: 24 }}>
                              {selectedInterviewType?.icon}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {meetingTitle || selectedInterviewType?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {selectedInterviewType?.name}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                                <Typography>
                                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                <Typography>
                                  {selectedTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({duration} min)
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>

                          <Divider sx={{ my: 2 }} />

                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Participants</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            {selectedCandidates.map((c) => (
                              <Chip
                                key={c.id}
                                avatar={<Avatar sx={{ bgcolor: '#ff9800' }}>{c.name.charAt(0)}</Avatar>}
                                label={c.name}
                                size="small"
                              />
                            ))}
                            {selectedInterviewers.map((i) => (
                              <Chip
                                key={i.id}
                                avatar={<Avatar sx={{ bgcolor: '#0d47a1' }}>{i.name.charAt(0)}</Avatar>}
                                label={i.name}
                                size="small"
                              />
                            ))}
                          </Box>

                          {meetingNotes && (
                            <>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>Notes</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {meetingNotes}
                              </Typography>
                            </>
                          )}
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2 }}>Settings</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {sendReminders ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} /> : <InfoIcon sx={{ color: 'text.disabled', fontSize: 18 }} />}
                              <Typography variant="body2">Email reminders {sendReminders ? 'enabled' : 'disabled'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {addToCalendar ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} /> : <InfoIcon sx={{ color: 'text.disabled', fontSize: 18 }} />}
                              <Typography variant="body2">Calendar integration {addToCalendar ? 'enabled' : 'disabled'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {recordMeeting ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} /> : <InfoIcon sx={{ color: 'text.disabled', fontSize: 18 }} />}
                              <Typography variant="body2">Recording {recordMeeting ? 'enabled' : 'disabled'}</Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Success State */}
                {showSuccess && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                      Interview Scheduled!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Invitations have been sent to all participants
                    </Typography>

                    <MeetingLinkBox sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                      <LinkIcon sx={{ color: '#0d47a1' }} />
                      <Typography
                        variant="body2"
                        sx={{ flex: 1, wordBreak: 'break-all', fontFamily: 'monospace' }}
                      >
                        {generatedLink}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={linkCopied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                        onClick={copyLink}
                        sx={{ bgcolor: linkCopied ? 'success.main' : '#0d47a1' }}
                      >
                        {linkCopied ? 'Copied!' : 'Copy'}
                      </Button>
                    </MeetingLinkBox>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/techie/ats/scheduling')}
                      >
                        View All Interviews
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<VideocamIcon />}
                        onClick={() => navigate(generatedLink.replace(window.location.origin, ''))}
                        sx={{ bgcolor: '#0d47a1' }}
                      >
                        Join Now
                      </Button>
                    </Box>
                  </Box>
                )}
              </StepContent>

              {/* Navigation Buttons */}
              {!showSuccess && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #eee' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ bgcolor: '#0d47a1' }}
                  >
                    {activeStep === steps.length - 1 ? 'Schedule Interview' : 'Next'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Box>
      </PageContainer>
  );
};

export default ScheduleInterview;

