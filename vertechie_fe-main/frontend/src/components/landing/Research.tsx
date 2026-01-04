import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';

const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  color: 'white',
  boxShadow: theme.shadows[4],
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/grid.svg")',
    opacity: 0.1,
  }
}));

const ResearchCircle = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

const ResearchPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
  }
}));

const Research = () => {
  return (
    <Box sx={{ 
      py: 10, 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
    }}>
      <Container 
        maxWidth={false}
        sx={{ 
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, md: 6, lg: 8 } 
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 700 }}
        >
          Research & Development
        </Typography>
        
        <Box sx={{ mb: 8 }}>
          <GradientBox>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
              Driving Innovation Through Research
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
              At VerTechie, we're committed to pushing the boundaries of technology through dedicated research 
              and development initiatives. Our team of experts works tirelessly to explore emerging technologies 
              and develop innovative solutions that address complex challenges.
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2, mt: 6 }}>
              <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 2, mb: { xs: 4, md: 0 } }}>
                <ResearchCircle>
                  <LightbulbIcon sx={{ fontSize: 50 }} />
                </ResearchCircle>
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Innovation
                </Typography>
                <Typography textAlign="center">
                  Creating novel solutions that challenge the status quo and drive technological advancement.
                </Typography>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 2, mb: { xs: 4, md: 0 } }}>
                <ResearchCircle>
                  <PsychologyIcon sx={{ fontSize: 50 }} />
                </ResearchCircle>
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Problem Solving
                </Typography>
                <Typography textAlign="center">
                  Tackling complex challenges with creative approaches and methodical research processes.
                </Typography>
              </Box>
              
              <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 2 }}>
                <ResearchCircle>
                  <TrendingUpIcon sx={{ fontSize: 50 }} />
                </ResearchCircle>
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Future-Focused
                </Typography>
                <Typography textAlign="center">
                  Anticipating market trends and developing forward-thinking technologies.
                </Typography>
              </Box>
            </Box>
          </GradientBox>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2, mb: { xs: 4, md: 4 } }}>
            <ResearchPaper elevation={3}>
              <Typography variant="h5" gutterBottom color="primary">
                Artificial Intelligence & Machine Learning
              </Typography>
              <Typography variant="body1" paragraph>
                Our AI research team explores cutting-edge machine learning algorithms, natural language processing, 
                and computer vision to create intelligent solutions that automate processes and provide actionable insights.
              </Typography>
              <Typography variant="body1">
                From predictive analytics to autonomous systems, we're pushing the boundaries of what's possible with AI.
              </Typography>
            </ResearchPaper>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2, mb: 4 }}>
            <ResearchPaper elevation={3}>
              <Typography variant="h5" gutterBottom color="primary">
                Blockchain & Distributed Systems
              </Typography>
              <Typography variant="body1" paragraph>
                We're researching innovative applications of blockchain technology beyond cryptocurrencies, 
                exploring secure and transparent solutions for supply chain management, identity verification, and more.
              </Typography>
              <Typography variant="body1">
                Our team is developing next-generation distributed systems that combine security, scalability, and efficiency.
              </Typography>
            </ResearchPaper>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2, mb: { xs: 4, md: 0 } }}>
            <ResearchPaper elevation={3}>
              <Typography variant="h5" gutterBottom color="primary">
                Internet of Things (IoT)
              </Typography>
              <Typography variant="body1" paragraph>
                Our IoT research focuses on developing secure, interoperable devices and systems that 
                collect, analyze, and act on data in real-time, creating smarter environments and processes.
              </Typography>
              <Typography variant="body1">
                We're working on innovations that bridge the physical and digital worlds to create integrated, intelligent solutions.
              </Typography>
            </ResearchPaper>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '50%' }, px: 2 }}>
            <ResearchPaper elevation={3}>
              <Typography variant="h5" gutterBottom color="primary">
                Quantum Computing
              </Typography>
              <Typography variant="body1" paragraph>
                Looking toward the future, our quantum computing research explores this revolutionary technology's 
                potential to solve problems that are currently beyond classical computing capabilities.
              </Typography>
              <Typography variant="body1">
                We're developing quantum algorithms and applications that will be ready for the quantum computing era.
              </Typography>
            </ResearchPaper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Research; 