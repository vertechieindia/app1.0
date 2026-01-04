import React from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  ButtonProps, 
  CardProps, 
  Paper, 
  PaperProps,
  styled,
  keyframes,
  SxProps,
  Theme,
  alpha
} from '@mui/material';

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0px 0px 0px 0px rgba(0, 119, 181, 0.2);
  }
  50% {
    box-shadow: 0px 0px 0px 8px rgba(0, 119, 181, 0);
  }
  100% {
    box-shadow: 0px 0px 0px 0px rgba(0, 119, 181, 0);
  }
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shineAnimation = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Apple-inspired button
export const AppleButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    backgroundPosition: '-100% 0',
    opacity: 0,
    transform: 'rotate(30deg)',
    transition: 'opacity 0.3s',
  },
  '&:hover::after': {
    opacity: 1,
    animation: `${shineAnimation} 1.5s infinite`,
  },
  '&.MuiButton-containedPrimary': {
    background: 'linear-gradient(135deg, #0077B5 0%, #1DA1F2 100%)',
    color: '#fff',
  },
  '&.MuiButton-containedSecondary': {
    background: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 100%)',
    color: '#fff',
  },
  '&.MuiButton-outlinedPrimary': {
    borderWidth: '2px',
    '&:hover': {
      borderWidth: '2px',
    },
  },
}));

// Button with pulse effect
export const PulseButton = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  boxShadow: 'none',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    animation: `${pulseAnimation} 2s infinite`,
  },
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&.MuiButton-containedPrimary': {
    background: 'linear-gradient(135deg, #0077B5 0%, #1DA1F2 100%)',
  },
}));

// Frosted Glass Card Component
export const GlassCard = styled(Card)<CardProps>(({ theme }) => ({
  background: alpha('#ffffff', 0.7),
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
  },
}));

// Animation Container for fade-in elements
export const AnimatedBox = styled(Box)<{ delay?: number }>(({ theme, delay = 0 }) => ({
  animation: `${fadeInUp} 0.6s ease-out forwards`,
  animationDelay: `${delay}ms`,
  opacity: 0,
}));

// Gradient Section background
export const GradientSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(6),
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
  },
}));

// Neumorphic Paper Component
export const NeumorphicPaper = styled(Paper)<PaperProps>(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: '#f0f4f8',
  boxShadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '12px 12px 20px #d1d9e6, -12px -12px 20px #ffffff',
  }
}));

// Feature Card with Hoverable Effect
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  sx?: SxProps<Theme>;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, sx }) => {
  return (
    <Card 
      sx={{ 
        borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          '& .icon-container': {
            transform: 'scale(1.1) translateY(-5px)',
          }
        },
        ...sx
      }}
    >
      <Box
        className="icon-container"
        sx={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '24px auto 16px',
          background: 'linear-gradient(135deg, #0077B5 0%, #1DA1F2 100%)',
          color: 'white',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '110%',
            height: '110%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.15)',
            zIndex: -1,
            transition: 'all 0.3s ease',
          },
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.primary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>
      </CardContent>
      <Box 
        sx={{ 
          height: '6px', 
          background: 'linear-gradient(90deg, #0077B5 0%, #1DA1F2 100%)' 
        }} 
      />
    </Card>
  );
};

// Course Card with Hover Effect
interface CourseCardProps {
  image: string;
  title: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  duration: string;
  price: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  image, 
  title, 
  instructor, 
  rating, 
  studentsCount, 
  duration, 
  price,
  sx,
  onClick
}) => {
  return (
    <Card 
      sx={{ 
        borderRadius: '20px', 
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          '& .course-image': {
            transform: 'scale(1.1)',
          }
        },
        ...sx
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <CardMedia
          component="img"
          className="course-image"
          image={image}
          alt={title}
          sx={{ 
            height: '100%',
            transition: 'transform 0.5s ease',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '8px',
            px: 2,
            py: 0.5,
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {price}
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          by {instructor}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 2,
            mb: 1,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#FF9500',
              mr: 2,
            }}
          >
            <Typography variant="body2" fontWeight={600} mr={0.5}>
              {rating}
            </Typography>
            ★★★★★
          </Box>
          <Typography variant="body2" color="text.secondary">
            {studentsCount} students
          </Typography>
        </Box>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {duration}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            sx={{
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Enroll Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Testimonial Card with Frosted Glass Effect
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  sx?: SxProps<Theme>;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  avatar,
  sx
}) => {
  return (
    <Box 
      sx={{ 
        borderRadius: '24px', 
        overflow: 'hidden',
        background: alpha('#fff', 0.7),
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        p: 4,
        position: 'relative',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '6px',
          background: 'linear-gradient(90deg, #0077B5 0%, #1DA1F2 100%)',
        },
        ...sx
      }}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          fontStyle: 'italic',
          mb: 3,
          position: 'relative',
          '&::before': {
            content: '"""',
            fontSize: '4rem',
            color: alpha('#0077B5', 0.1),
            position: 'absolute',
            top: -30,
            left: -10,
            fontStyle: 'normal',
            fontFamily: 'Georgia, serif',
          }
        }}
      >
        {quote}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src={avatar}
          alt={author}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            mr: 2,
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Hero Section Background with dotted pattern
export const HeroBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(10, 2),
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(#0077B5 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    opacity: 0.1,
  },
}));

// Animated Background Gradient
export const AnimatedGradientBackground = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
  backgroundSize: '400% 400%',
  animation: `$gradientAnimation 15s ease infinite`,
  '@keyframes gradientAnimation': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}); 