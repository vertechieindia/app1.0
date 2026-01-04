/**
 * PipelinePage - Kanban-style Candidate Pipeline
 */

import React, { useState } from 'react';
import {
  Box, Typography, Card, Avatar, Chip, IconButton, TextField, FormControl,
  InputLabel, Select, MenuItem, InputAdornment, Button, Rating, Tooltip,
  LinearProgress, Divider,
} from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewListIcon from '@mui/icons-material/ViewList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ATSLayout from './ATSLayout';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const ScoreBadge = styled(Box)<{ scorecolor: string }>(({ scorecolor }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  width: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '0.75rem',
  color: 'white',
  background: scorecolor,
  boxShadow: `0 2px 8px ${alpha(scorecolor, 0.4)}`,
}));

const AIInsightBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 8px',
  borderRadius: 6,
  background: `linear-gradient(135deg, ${alpha('#7C4DFF', 0.1)} 0%, ${alpha('#B388FF', 0.1)} 100%)`,
  border: `1px solid ${alpha('#7C4DFF', 0.3)}`,
  marginTop: theme.spacing(1),
}));

const PipelineColumn = styled(Box)(({ theme }) => ({
  minWidth: 280,
  backgroundColor: alpha('#f5f5f5', 0.5),
  borderRadius: 12,
  padding: theme.spacing(1.5),
}));

const CandidateCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  cursor: 'grab',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(13, 71, 161, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const stages = [
  { id: 'new', label: 'New Applicants', color: '#0d47a1' },
  { id: 'screening', label: 'Screening', color: '#FF9500' },
  { id: 'interview', label: 'Interview', color: '#5856D6' },
  { id: 'offer', label: 'Offer Stage', color: '#34C759' },
  { id: 'hired', label: 'Hired', color: '#00C853' },
];

interface Candidate {
  id: number;
  name: string;
  role: string;
  stage: string;
  skills: string[];
  rating: number;
  time: string;
  score: number;
  matchScore: number;
  aiInsight: string;
  experience: number;
  education: string;
  source: string;
}

const candidates: Candidate[] = [
  { id: 1, name: 'Sarah Johnson', role: 'Senior React Developer', stage: 'new', skills: ['React', 'TypeScript'], rating: 4, time: '2 hours ago', score: 92, matchScore: 95, aiInsight: 'Strong technical background', experience: 6, education: 'MS Computer Science', source: 'LinkedIn' },
  { id: 2, name: 'Mike Chen', role: 'Senior React Developer', stage: 'new', skills: ['React', 'Redux'], rating: 5, time: '5 hours ago', score: 88, matchScore: 91, aiInsight: 'Excellent portfolio projects', experience: 5, education: 'BS Software Eng', source: 'Referral' },
  { id: 3, name: 'Emily Davis', role: 'UX Designer', stage: 'new', skills: ['Figma', 'UI/UX'], rating: 3, time: '1 day ago', score: 75, matchScore: 78, aiInsight: 'Good design sense, needs mentoring', experience: 3, education: 'BA Design', source: 'Indeed' },
  { id: 4, name: 'Alex Rivera', role: 'Product Manager', stage: 'screening', skills: ['Agile', 'Roadmapping'], rating: 4, time: '3 days ago', score: 85, matchScore: 88, aiInsight: 'Strong leadership skills', experience: 7, education: 'MBA', source: 'Direct' },
  { id: 5, name: 'Jordan Lee', role: 'Senior React Developer', stage: 'screening', skills: ['React', 'Next.js'], rating: 5, time: '4 days ago', score: 94, matchScore: 97, aiInsight: 'Top 5% candidate', experience: 8, education: 'PhD CS', source: 'LinkedIn' },
  { id: 6, name: 'Taylor Smith', role: 'UX Designer', stage: 'interview', skills: ['Design Systems', 'User Research'], rating: 5, time: '1 week ago', score: 90, matchScore: 93, aiInsight: 'Award-winning designer', experience: 5, education: 'MFA Design', source: 'Portfolio' },
  { id: 7, name: 'Chris Brown', role: 'DevOps Engineer', stage: 'interview', skills: ['Kubernetes', 'Docker'], rating: 4, time: '1 week ago', score: 82, matchScore: 85, aiInsight: 'Solid infrastructure exp', experience: 4, education: 'BS IT', source: 'GitHub' },
  { id: 8, name: 'Morgan Williams', role: 'Senior React Developer', stage: 'offer', skills: ['React', 'System Design'], rating: 5, time: '2 weeks ago', score: 96, matchScore: 98, aiInsight: 'Perfect culture fit', experience: 9, education: 'MS CS', source: 'Referral' },
];

// Score color based on value
const getScoreColor = (score: number): string => {
  if (score >= 90) return '#00C853';
  if (score >= 80) return '#FF9500';
  if (score >= 70) return '#FF6B00';
  return '#FF3B30';
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  return 'Needs Review';
};

const PipelinePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedJob, setSelectedJob] = useState('all');

  return (
    <ATSLayout>
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Job</InputLabel>
            <Select value={selectedJob} label="Filter by Job" onChange={(e) => setSelectedJob(e.target.value)}>
              <MenuItem value="all">All Jobs</MenuItem>
              <MenuItem value="react">Senior React Developer</MenuItem>
              <MenuItem value="pm">Product Manager</MenuItem>
              <MenuItem value="ux">UX Designer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            placeholder="Search candidates..."
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            sx={{ width: 250 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => setViewMode('kanban')}
            sx={{ bgcolor: viewMode === 'kanban' ? alpha('#0d47a1', 0.1) : 'transparent' }}
          >
            <ViewKanbanIcon color={viewMode === 'kanban' ? 'primary' : 'inherit'} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            sx={{ bgcolor: viewMode === 'list' ? alpha('#0d47a1', 0.1) : 'transparent' }}
          >
            <ViewListIcon color={viewMode === 'list' ? 'primary' : 'inherit'} />
          </IconButton>
        </Box>
      </Box>

      {/* Kanban Board */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage.id);
          return (
            <PipelineColumn key={stage.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stage.color }} />
                <Typography variant="subtitle2" fontWeight={600}>{stage.label}</Typography>
                <Chip label={stageCandidates.length} size="small" sx={{ ml: 'auto' }} />
              </Box>
              {stageCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} sx={{ position: 'relative' }}>
                  {/* AI Score Badge */}
                  <Tooltip title={`Match Score: ${candidate.matchScore}% - ${getScoreLabel(candidate.score)}`}>
                    <ScoreBadge scorecolor={getScoreColor(candidate.score)}>
                      {candidate.score}
                    </ScoreBadge>
                  </Tooltip>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, pr: 4 }}>
                    <Avatar sx={{ bgcolor: alpha(stage.color, 0.2), color: stage.color }}>
                      {candidate.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{candidate.name}</Typography>
                          {candidate.score >= 90 && (
                            <Chip 
                              icon={<LocalFireDepartmentIcon sx={{ fontSize: 14 }} />}
                              label="Top Candidate" 
                              size="small" 
                              sx={{ 
                                height: 18, 
                                fontSize: '0.6rem', 
                                bgcolor: alpha('#FF6B6B', 0.1), 
                                color: '#FF3D00',
                                '& .MuiChip-icon': { color: '#FF3D00' }
                              }} 
                            />
                          )}
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{candidate.role}</Typography>
                      
                      {/* Experience & Education */}
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Tooltip title="Experience">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <WorkIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">{candidate.experience} yrs</Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Education">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <SchoolIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {candidate.education}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                      
                      {/* Match Score Bar */}
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">Match</Typography>
                          <Typography variant="caption" sx={{ color: getScoreColor(candidate.matchScore), fontWeight: 600 }}>
                            {candidate.matchScore}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={candidate.matchScore} 
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: alpha(getScoreColor(candidate.matchScore), 0.2),
                            '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(candidate.matchScore) }
                          }} 
                        />
                      </Box>
                      
                      {/* AI Insight */}
                      <AIInsightBadge>
                        <AutoAwesomeIcon sx={{ fontSize: 12, color: '#7C4DFF' }} />
                        <Typography variant="caption" sx={{ color: '#7C4DFF', fontWeight: 500 }}>
                          {candidate.aiInsight}
                        </Typography>
                      </AIInsightBadge>
                      
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                        {candidate.skills.map((skill) => (
                          <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Rating value={candidate.rating} size="small" readOnly />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={candidate.source} 
                            size="small" 
                            sx={{ fontSize: '0.6rem', height: 18, bgcolor: alpha('#0d47a1', 0.1), color: '#0d47a1' }} 
                          />
                          <Typography variant="caption" color="text.secondary">{candidate.time}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CandidateCard>
              ))}
              <Button fullWidth variant="text" size="small" sx={{ mt: 1 }}>+ Add Candidate</Button>
            </PipelineColumn>
          );
        })}
      </Box>
    </ATSLayout>
  );
};

export default PipelinePage;


