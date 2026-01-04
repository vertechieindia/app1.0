import React from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Button, Chip, Stack, Rating } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  price: number;
  discountPrice?: number;
  category: string;
  featured?: boolean;
  onEnroll?: (id: string) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '24px',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.05)',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 22px 40px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.05)',
    '& .media-hover-effect': {
      transform: 'scale(1.05)',
    },
    '& .card-hover-overlay': {
      opacity: 1,
    },
  },
}));

const MediaWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: 220,
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
}));

const MediaOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
  zIndex: 1,
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  zIndex: 2,
  borderRadius: '8px',
  fontWeight: 600,
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

const FeaturedBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 2,
  padding: '6px 12px',
  borderRadius: '8px',
  fontWeight: 600,
  backgroundColor: '#0077B5',
  color: 'white',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
}));

const CardHoverOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  opacity: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.3s ease',
  background: 'rgba(0, 119, 181, 0.03)',
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const PriceTag = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  marginTop: theme.spacing(2),
}));

const DiscountPrice = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.secondary,
}));

const EnrollButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: '12px',
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #0077B5 0%, #5AC8FA 100%)',
  transition: 'all 0.3s ease',
  boxShadow: 'none',
  '&:hover': {
    background: 'linear-gradient(90deg, #006199 0%, #4BB8EA 100%)',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const MetadataItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  '& svg': {
    fontSize: '1rem',
  },
}));

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  instructor,
  thumbnail,
  duration,
  level,
  rating,
  reviewCount,
  price,
  discountPrice,
  category,
  featured = false,
  onEnroll
}) => {
  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(id);
    }
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Beginner':
        return '#34C759'; // Green
      case 'Intermediate':
        return '#FF9500'; // Orange
      case 'Advanced':
        return '#FF3B30'; // Red
      default:
        return '#0077B5'; // Default blue
    }
  };

  return (
    <StyledCard>
      <MediaWrapper>
        <StyledCardMedia
          className="media-hover-effect"
          image={thumbnail}
          title={title}
        />
        <MediaOverlay />
        <CategoryChip 
          label={category} 
          size="small"
        />
        {featured && (
          <FeaturedBadge>Featured</FeaturedBadge>
        )}
        <CardHoverOverlay className="card-hover-overlay">
          <EnrollButton 
            variant="contained"
            onClick={handleEnroll}
          >
            View Course
          </EnrollButton>
        </CardHoverOverlay>
      </MediaWrapper>
      <StyledCardContent>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '2.6em',
          }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '2.6em',
          }}
        >
          {description}
        </Typography>
        
        <Typography 
          variant="body2"
          sx={{ 
            fontWeight: 600,
            mb: 1.5,
          }}
        >
          {instructor}
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ mb: 1.5 }}
        >
          <MetadataItem>
            <AccessTimeIcon />
            <Typography variant="body2">{duration}</Typography>
          </MetadataItem>
          <MetadataItem>
            <BarChartIcon />
            <Typography 
              variant="body2"
              sx={{ 
                color: getLevelColor(level),
                fontWeight: 600,
              }}
            >
              {level}
            </Typography>
          </MetadataItem>
        </Stack>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Rating 
            value={rating} 
            precision={0.5} 
            readOnly 
            size="small"
            sx={{ 
              color: '#FF9500',
              mr: 1,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            ({reviewCount} reviews)
          </Typography>
        </Box>
        
        <PriceTag>
          {discountPrice ? (
            <>
              <DiscountPrice variant="h6">${discountPrice}</DiscountPrice>
              <OriginalPrice variant="body2">${price}</OriginalPrice>
            </>
          ) : (
            <DiscountPrice variant="h6">${price}</DiscountPrice>
          )}
        </PriceTag>
        
        <EnrollButton 
          variant="contained"
          fullWidth
          onClick={handleEnroll}
        >
          Enroll Now
        </EnrollButton>
      </StyledCardContent>
    </StyledCard>
  );
};

export default CourseCard; 