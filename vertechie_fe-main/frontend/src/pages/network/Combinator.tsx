/**
 * Combinator - Y Combinator-style founder matching platform
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Avatar, Button, Grid, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Divider, Snackbar, Alert, useTheme, alpha, CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Verified, Handshake, Celebration, Lightbulb, Refresh } from '@mui/icons-material';
import NetworkLayout from '../../components/network/NetworkLayout';
import { combinatorService, StartupIdea as BackendIdea } from '../../services/combinatorService';

// ============================================
// STYLED COMPONENTS
// ============================================
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));

// ============================================
// COMPONENT
// ============================================
const Combinator: React.FC = () => {
  const theme = useTheme();
  const [ideas, setIdeas] = useState<BackendIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitIdeaDialogOpen, setSubmitIdeaDialogOpen] = useState(false);
  const [ideaData, setIdeaData] = useState({
    title: '',
    description: '',
    problem: '',
    market: '',
    stage: '',
    commitment: '',
    funding: '',
    rolesNeeded: [] as string[],
    skillsNeeded: '',
    teamSize: 0,
    founderRoles: '',
    founderSkills: '',
    founderCommitment: '',
    founderFunding: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  // Fetch startup ideas from API
  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendIdeas = await combinatorService.getIdeas({ limit: 20 });
      setIdeas(backendIdeas);
    } catch (err: any) {
      console.error('Error fetching ideas:', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to load startup ideas.';
      if (errorMessage.includes('migrations') || errorMessage.includes('table not found')) {
        setError('Database tables not found. Please run migrations: alembic upgrade head');
      } else {
        setError(errorMessage);
      }
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    setIdeaData(prev => ({
      ...prev,
      rolesNeeded: prev.rolesNeeded.includes(role)
        ? prev.rolesNeeded.filter(r => r !== role)
        : [...prev.rolesNeeded, role]
    }));
  };

  const handleSubmitIdea = async () => {
    if (!ideaData.title.trim() || !ideaData.description.trim() || !ideaData.problem.trim()) {
      setSnackbar({ open: true, message: 'Please fill in all required fields (Title, Description, Problem).', severity: 'error' });
      return;
    }
    
    try {
      // Parse skills from comma-separated string
      const skillsNeededArray = ideaData.skillsNeeded
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const founderRolesArray = ideaData.founderRoles
        .split(',')
        .map(r => r.trim())
        .filter(r => r.length > 0);
      
      const founderSkillsArray = ideaData.founderSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      await combinatorService.submitIdea({
        title: ideaData.title,
        description: ideaData.description,
        problem: ideaData.problem,
        target_market: ideaData.market || undefined,
        stage: ideaData.stage || undefined,
        commitment: ideaData.commitment || undefined,
        funding_status: ideaData.funding || undefined,
        roles_needed: ideaData.rolesNeeded,
        skills_needed: skillsNeededArray,
        team_size: ideaData.teamSize,
        founder_roles: founderRolesArray,
        founder_skills: founderSkillsArray,
        founder_commitment: ideaData.founderCommitment || undefined,
        founder_funding: ideaData.founderFunding || undefined,
      });
      
      setSnackbar({ open: true, message: 'Your startup idea has been submitted successfully! We will match you with co-founders soon.', severity: 'success' });
      setSubmitIdeaDialogOpen(false);
      setIdeaData({
        title: '', description: '', problem: '', market: '', stage: '', commitment: '', funding: '',
        rolesNeeded: [], skillsNeeded: '', teamSize: 0, founderRoles: '', founderSkills: '', founderCommitment: '', founderFunding: '',
      });
      
      // Refresh ideas list
      await fetchIdeas();
    } catch (err) {
      console.error('Error submitting idea:', err);
      setSnackbar({ open: true, message: 'Failed to submit idea. Please try again.', severity: 'error' });
    }
  };

  // Map backend ideas to featured founders format
  const featuredFounders = ideas.slice(0, 4).map((idea, idx) => {
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#e91e63'];
    const roles = idea.founder_roles.length > 0 ? idea.founder_roles[0] : 'Founder';
    const skills = idea.founder_skills.length > 0 ? idea.founder_skills : idea.skills_needed.slice(0, 3);
    const lookingFor = idea.roles_needed.length > 0 ? `${idea.roles_needed[0]} Co-Founder` : 'Co-Founder';
    
    return {
      id: idea.id,
      name: idea.founder_name || 'Founder',
      title: roles,
      skills: skills,
      looking: lookingFor,
      idea: idea.title,
      avatar: (idea.founder_name || 'F').charAt(0).toUpperCase(),
      raised: idea.funding_status || 'Exploring',
      color: colors[idx % colors.length],
    };
  });

  const successStories = [
    { 
      company: 'TechFlow AI', 
      founders: 'David & Emma',
      story: 'Met through Combinator, raised $2M seed, now serving 500+ enterprise clients.',
      valuation: '$15M',
    },
    { 
      company: 'GreenCart', 
      founders: 'James & Aisha',
      story: 'Connected as technical and business co-founders, acquired by major retailer.',
      valuation: 'Acquired',
    },
    { 
      company: 'CodeMentor Pro', 
      founders: 'Ryan & Sofia',
      story: 'Built a coding education platform, 100K+ students, profitable in 18 months.',
      valuation: '$8M',
    },
  ];

  return (
    <NetworkLayout>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: 4,
        p: 4,
        mb: 4,
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <Box sx={{ 
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(76,175,80,0.3) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, position: 'relative' }}>
          🚀 VerTechie Combinator
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 400, mb: 3, opacity: 0.9, position: 'relative' }}>
          We help founders make something people want
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', opacity: 0.8, position: 'relative' }}>
          Find your perfect co-founder, build your dream team, and launch your startup with the support of our thriving community.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => setSubmitIdeaDialogOpen(true)}
          sx={{ 
            mt: 3,
            px: 5,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #ff6b35 30%, #f7931e 90%)',
            fontWeight: 600,
            fontSize: '1.1rem',
            '&:hover': {
              background: 'linear-gradient(45deg, #e55a2b 30%, #d6811a 90%)',
            }
          }}
        >
          Submit Your Idea
        </Button>
      </Box>

      {/* Value Propositions */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: 'primary.main' }}>
            Why VerTechie Combinator?
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: '👥', title: 'Support at Every Stage', desc: 'We help founders at their earliest stages regardless of their age or experience.' },
              { icon: '📈', title: 'Improved Success Rates', desc: 'We dramatically improve the success rate of our startups through mentorship and resources.' },
              { icon: '💰', title: 'Fundraising Advantage', desc: 'We give startups a huge fundraising advantage with our network of investors.' },
              { icon: '🦄', title: 'Unicorn Track Record', desc: 'Our companies have a track record of becoming billion dollar companies.' },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: alpha('#1976d2', 0.05),
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: alpha('#1976d2', 0.1),
                    transform: 'translateY(-4px)',
                  }
                }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>{item.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* How It Works */}
      <StyledCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
            How Does It Work?
          </Typography>
          <Grid container spacing={4}>
            {[
              { step: 1, icon: '💡', title: 'Share Your Idea', desc: 'Describe your startup concept, target market, problem you\'re solving, and your vision for the future.', color: '#4caf50' },
              { step: 2, icon: '🎯', title: 'Define Your Needs', desc: 'Tell us what roles you need - CTO, Marketing Lead, Designer - and the skills that would complement yours.', color: '#2196f3' },
              { step: 3, icon: '🤝', title: 'Connect With Matches', desc: 'Our AI matches you with co-founders who share your vision. Review profiles and send connection requests.', color: '#ff9800' },
              { step: 4, icon: '🚀', title: 'Start Building', desc: 'Schedule discovery calls, align on goals, and start building your dream startup together!', color: '#e91e63' },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}40 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    border: `3px solid ${item.color}`,
                    position: 'relative',
                  }}>
                    <Typography variant="h3">{item.icon}</Typography>
                    <Box sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: item.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}>
                      {item.step}
                    </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Featured Founders */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>🔥 Featured Founders</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={fetchIdeas}
          disabled={loading}
          sx={{ borderRadius: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {!loading && featuredFounders.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No startup ideas yet. Be the first to submit one!
              </Typography>
            </Box>
          </Grid>
        )}
        {!loading && featuredFounders.map((founder, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <StyledCard sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: founder.color,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                  }}>
                    {founder.avatar}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{founder.name}</Typography>
                      <Verified sx={{ fontSize: 18, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">{founder.title}</Typography>
                    <Chip label={founder.raised} size="small" sx={{ mt: 0.5 }} color="success" variant="outlined" />
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>IDEA</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{founder.idea}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>SKILLS</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {founder.skills.map(skill => (
                      <Chip key={skill} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>LOOKING FOR</Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>{founder.looking}</Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<Handshake />}
                  sx={{ borderRadius: 2, mt: 1 }}
                  onClick={async () => {
                    try {
                      await combinatorService.connectFounder(founder.id);
                      setSnackbar({ 
                        open: true, 
                        message: `Connection request sent to ${founder.name}!`, 
                        severity: 'success' 
                      });
                      await fetchIdeas();
                    } catch (err) {
                      console.error('Error connecting with founder:', err);
                      setSnackbar({ 
                        open: true, 
                        message: 'Failed to send connection request. Please try again.', 
                        severity: 'error' 
                      });
                    }
                  }}
                >
                  Connect
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Box sx={{ 
        mt: 4,
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Have a Startup Idea? Let's Make It Happen!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Submit your idea and let our AI match you with the perfect co-founder to bring your vision to life.
        </Typography>
        <Button 
          variant="contained"
          size="large"
          onClick={() => setSubmitIdeaDialogOpen(true)}
          sx={{ 
            bgcolor: 'white',
            color: '#667eea',
            fontWeight: 600,
            px: 4,
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            }
          }}
        >
          Submit Your Startup Idea
        </Button>
      </Box>

      {/* Success Stories */}
      <StyledCard sx={{ mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            🌟 Success Stories
          </Typography>
          <Grid container spacing={3}>
            {successStories.map((story, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: alpha('#4caf50', 0.05),
                  border: `1px solid ${alpha('#4caf50', 0.2)}`,
                  height: '100%',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Celebration sx={{ color: '#4caf50' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{story.company}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                    "{story.story}"
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      by {story.founders}
                    </Typography>
                    <Chip label={story.valuation} size="small" color="success" />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Submit Idea Dialog */}
      <Dialog
        open={submitIdeaDialogOpen}
        onClose={() => setSubmitIdeaDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}>
          <Lightbulb sx={{ fontSize: 28 }} /> Submit Your Startup Idea
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>💡 Your Idea</Typography>
          <TextField
            label="Startup Name / Title"
            fullWidth
            margin="normal"
            value={ideaData.title}
            onChange={(e) => setIdeaData({ ...ideaData, title: e.target.value })}
            required
          />
          <TextField
            label="Describe Your Idea"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={ideaData.description}
            onChange={(e) => setIdeaData({ ...ideaData, description: e.target.value })}
            required
          />
          <TextField
            label="Problem You're Solving"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={ideaData.problem}
            onChange={(e) => setIdeaData({ ...ideaData, problem: e.target.value })}
            required
          />
          <TextField
            label="Target Market"
            fullWidth
            margin="normal"
            value={ideaData.market}
            onChange={(e) => setIdeaData({ ...ideaData, market: e.target.value })}
            required
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>📊 Current Stage</Typography>
          <TextField
            select
            label="Startup Stage"
            fullWidth
            margin="normal"
            value={ideaData.stage}
            onChange={(e) => setIdeaData({ ...ideaData, stage: e.target.value })}
            required
          >
            {['Just an Idea', 'Validating', 'Building MVP', 'Launched', 'Revenue'].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Your Commitment"
            fullWidth
            margin="normal"
            value={ideaData.commitment}
            onChange={(e) => setIdeaData({ ...ideaData, commitment: e.target.value })}
            required
          >
            {['Full-time', 'Part-time', 'Side Project', 'Exploring'].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Funding Status"
            fullWidth
            margin="normal"
            value={ideaData.funding}
            onChange={(e) => setIdeaData({ ...ideaData, funding: e.target.value })}
            required
          >
            {['Bootstrapped', 'Seeking Pre-Seed', 'Seeking Seed', 'Funded', 'Not Sure'].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>🎯 Roles You Need</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['CTO', 'Full-Stack', 'Backend', 'Frontend', 'Mobile', 'AI/ML', 'DevOps', 'Designer', 'Product', 'Marketing', 'Sales', 'Finance', 'Operations', 'Data Scientist', 'Growth Hacker'].map((role) => (
              <Chip
                key={role}
                label={role}
                onClick={() => handleRoleToggle(role)}
                color={ideaData.rolesNeeded.includes(role) ? 'primary' : 'default'}
                variant={ideaData.rolesNeeded.includes(role) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
          <TextField
            label="Skills & Expertise Needed (comma-separated)"
            fullWidth
            margin="normal"
            value={ideaData.skillsNeeded}
            onChange={(e) => setIdeaData({ ...ideaData, skillsNeeded: e.target.value })}
            placeholder="e.g., React, Node.js, Figma, SEO"
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>🤝 Your Team (Optional)</Typography>
          <TextField
            type="number"
            label="Current Team Size (excluding yourself)"
            fullWidth
            margin="normal"
            value={ideaData.teamSize}
            onChange={(e) => setIdeaData({ ...ideaData, teamSize: parseInt(e.target.value) || 0 })}
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Co-founder Roles (comma-separated, if any)"
            fullWidth
            margin="normal"
            value={ideaData.founderRoles}
            onChange={(e) => setIdeaData({ ...ideaData, founderRoles: e.target.value })}
            placeholder="e.g., CTO, Marketing Lead"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setSubmitIdeaDialogOpen(false)} color="secondary">Cancel</Button>
          <Button
            onClick={handleSubmitIdea}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6ad1 30%, #6a3f91 90%)',
              },
            }}
          >
            Submit Idea
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NetworkLayout>
  );
};

export default Combinator;

