import React from 'react';
import { SvgIcon, Box } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

// Base interface for all illustrations
interface IllustrationProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  secondaryColor?: string;
  accentColor?: string;
  style?: React.CSSProperties;
}

// Profile Verification Illustration
export const ProfileVerificationIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#34C759',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    <path
      d="M90 110L80 100L75 105L90 120L125 85L120 80L90 110Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="100"
      cy="100"
      r="70"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeDasharray="10 5"
    />
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={accentColor}
      strokeWidth="2"
      strokeDasharray="5 10"
      opacity="0.5"
    />
  </Box>
);

// Skill Assessment Illustration
export const SkillAssessmentIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#FF9500',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Code Symbol */}
    <path
      d="M85 90L70 100L85 110M115 90L130 100L115 110"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Brain Circuit Pattern */}
    <g opacity="0.7">
      <circle cx="140" cy="70" r="5" fill={accentColor} />
      <circle cx="160" cy="100" r="5" fill={accentColor} />
      <circle cx="140" cy="130" r="5" fill={accentColor} />
      <circle cx="60" cy="70" r="5" fill={accentColor} />
      <circle cx="40" cy="100" r="5" fill={accentColor} />
      <circle cx="60" cy="130" r="5" fill={accentColor} />
      
      <path
        d="M140 70L160 100L140 130M60 70L40 100L60 130"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="5 5"
    />
  </Box>
);

// Job Matching Illustration
export const JobMatchingIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#FF3B30',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Briefcase Icon */}
    <path
      d="M85 90H115V110H85V90ZM90 90V85C90 82.2386 92.2386 80 95 80H105C107.761 80 110 82.2386 110 85V90"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    
    {/* Connection Lines */}
    <g opacity="0.7">
      <circle cx="150" cy="60" r="10" fill={accentColor} opacity="0.8" />
      <circle cx="170" cy="100" r="8" fill={accentColor} opacity="0.6" />
      <circle cx="150" cy="140" r="10" fill={accentColor} opacity="0.8" />
      <circle cx="50" cy="60" r="10" fill={accentColor} opacity="0.8" />
      <circle cx="30" cy="100" r="8" fill={accentColor} opacity="0.6" />
      <circle cx="50" cy="140" r="10" fill={accentColor} opacity="0.8" />
      
      <path
        d="M100 40L150 60L170 100L150 140L100 160L50 140L30 100L50 60L100 40Z"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="8 4"
    />
  </Box>
);

// Learning Illustration
export const LearningIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#34C759',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Book/Graduation Cap Icon */}
    <path
      d="M70 100L100 85L130 100L100 115L70 100Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M80 105V120"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M100 115V130"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M120 105V120"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
    
    {/* Knowledge Bubbles */}
    <g opacity="0.8">
      <circle cx="140" cy="60" r="8" fill={accentColor} />
      <circle cx="160" cy="85" r="6" fill={accentColor} />
      <circle cx="150" cy="120" r="7" fill={accentColor} />
      <circle cx="60" cy="60" r="8" fill={accentColor} />
      <circle cx="40" cy="85" r="6" fill={accentColor} />
      <circle cx="50" cy="120" r="7" fill={accentColor} />
      
      <path
        d="M140 60C150 40 170 50 160 85C180 100 160 130 150 120C130 150 110 140 100 130C90 140 70 150 50 120C40 130 20 100 40 85C30 50 50 40 60 60C80 30 120 30 140 60Z"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="4 8"
      opacity="0.7"
    />
  </Box>
);

// Networking Illustration
export const NetworkingIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#FF9500',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Network Icon */}
    <circle cx="100" cy="100" r="15" fill="white" />
    <circle cx="70" cy="80" r="10" fill="white" opacity="0.8" />
    <circle cx="130" cy="80" r="10" fill="white" opacity="0.8" />
    <circle cx="70" cy="120" r="10" fill="white" opacity="0.8" />
    <circle cx="130" cy="120" r="10" fill="white" opacity="0.8" />
    
    <line x1="85" y1="100" x2="70" y2="80" stroke="white" strokeWidth="3" />
    <line x1="115" y1="100" x2="130" y2="80" stroke="white" strokeWidth="3" />
    <line x1="85" y1="100" x2="70" y2="120" stroke="white" strokeWidth="3" />
    <line x1="115" y1="100" x2="130" y2="120" stroke="white" strokeWidth="3" />
    
    {/* Global Network */}
    <g opacity="0.6">
      <circle cx="50" cy="50" r="6" fill={accentColor} />
      <circle cx="150" cy="50" r="6" fill={accentColor} />
      <circle cx="50" cy="150" r="6" fill={accentColor} />
      <circle cx="150" cy="150" r="6" fill={accentColor} />
      <circle cx="30" cy="100" r="5" fill={accentColor} />
      <circle cx="170" cy="100" r="5" fill={accentColor} />
      <circle cx="100" cy="30" r="5" fill={accentColor} />
      <circle cx="100" cy="170" r="5" fill={accentColor} />
      
      <path
        d="M50 50L30 100L50 150L100 170L150 150L170 100L150 50L100 30L50 50Z"
        stroke={accentColor}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M50 50L150 50L150 150L50 150L50 50Z"
        stroke={accentColor}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M30 100L170 100"
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <path
        d="M100 30L100 170"
        stroke={accentColor}
        strokeWidth="1.5"
      />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="10 5"
    />
  </Box>
);

// Companies Illustration
export const CompaniesIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#FF3B30',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Building Icon */}
    <path
      d="M80 120V80H120V120H80Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M90 90H110M90 100H110M90 110H110M95 120V110H105V120"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M70 120V90H80M130 120V90H120"
      fill="none"
      stroke="white"
      strokeWidth="2"
    />
    
    {/* Corporate Elements */}
    <g opacity="0.7">
      <rect x="40" y="60" width="20" height="30" rx="2" fill={accentColor} opacity="0.6" />
      <rect x="140" y="60" width="20" height="30" rx="2" fill={accentColor} opacity="0.6" />
      <rect x="60" y="50" width="20" height="40" rx="2" fill={accentColor} opacity="0.7" />
      <rect x="120" y="50" width="20" height="40" rx="2" fill={accentColor} opacity="0.7" />
      <rect x="80" y="40" width="40" height="50" rx="2" fill={accentColor} opacity="0.8" />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="3 6"
    />
  </Box>
);

// Blogs Illustration
export const BlogsIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#5AC8FA',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Document Icon */}
    <path
      d="M80 75H120V125H80V75Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M90 90H110M90 100H110M90 110H100"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    
    {/* Blog Posts */}
    <g opacity="0.7">
      <rect x="50" y="60" width="30" height="20" rx="2" fill={accentColor} opacity="0.6" />
      <rect x="40" y="120" width="30" height="20" rx="2" fill={accentColor} opacity="0.6" />
      <rect x="120" y="60" width="30" height="20" rx="2" fill={accentColor} opacity="0.6" />
      <rect x="130" y="120" width="30" height="20" rx="2" fill={accentColor} opacity="0.6" />
      
      <line x1="50" y1="65" x2="80" y2="65" stroke="white" strokeWidth="1.5" />
      <line x1="50" y1="70" x2="70" y2="70" stroke="white" strokeWidth="1.5" />
      <line x1="50" y1="75" x2="75" y2="75" stroke="white" strokeWidth="1.5" />
      
      <line x1="120" y1="65" x2="150" y2="65" stroke="white" strokeWidth="1.5" />
      <line x1="120" y1="70" x2="140" y2="70" stroke="white" strokeWidth="1.5" />
      <line x1="120" y1="75" x2="145" y2="75" stroke="white" strokeWidth="1.5" />
      
      <line x1="40" y1="125" x2="70" y2="125" stroke="white" strokeWidth="1.5" />
      <line x1="40" y1="130" x2="60" y2="130" stroke="white" strokeWidth="1.5" />
      <line x1="40" y1="135" x2="65" y2="135" stroke="white" strokeWidth="1.5" />
      
      <line x1="130" y1="125" x2="160" y2="125" stroke="white" strokeWidth="1.5" />
      <line x1="130" y1="130" x2="150" y2="130" stroke="white" strokeWidth="1.5" />
      <line x1="130" y1="135" x2="155" y2="135" stroke="white" strokeWidth="1.5" />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="5 10"
    />
  </Box>
);

// Contact Us Illustration
export const ContactIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#34C759',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    <circle cx="100" cy="100" r="40" fill={color} />
    
    {/* Envelope Icon */}
    <path
      d="M75 85H125V115H75V85Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M75 85L100 100L125 85"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    
    {/* Communication Elements */}
    <g opacity="0.8">
      <circle cx="50" cy="70" r="10" fill={accentColor} opacity="0.6" />
      <path
        d="M45 70H55M50 65V75"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <circle cx="150" cy="70" r="10" fill={accentColor} opacity="0.6" />
      <path
        d="M145 70H155"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <circle cx="50" cy="130" r="10" fill={accentColor} opacity="0.6" />
      <path
        d="M50 130C50 130 53 127 53 127L57 131M50 130C50 130 47 127 47 127L43 131"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <circle cx="150" cy="130" r="10" fill={accentColor} opacity="0.6" />
      <path
        d="M145 128C145 128 150 135 150 135L155 128"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <path
        d="M50 70C40 80 35 90 35 100C35 110 40 120 50 130M150 70C160 80 165 90 165 100C165 110 160 120 150 130"
        stroke={accentColor}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5 5"
      />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="2 4"
    />
  </Box>
);

// Professional Connection Illustration
export const ConnectionIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 200,
  color = '#0077B5',
  secondaryColor = '#90CAF9',
  accentColor = '#FF9500',
  style,
}) => (
  <Box
    component="svg"
    viewBox="0 0 200 200"
    width={width}
    height={height}
    style={style}
    sx={{
      filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.1))',
    }}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={accentColor} stopOpacity="0.8" />
      </linearGradient>
    </defs>
    
    <circle cx="100" cy="100" r="80" fill={secondaryColor} opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill={secondaryColor} opacity="0.3" />
    
    {/* Connection Visualization */}
    <circle cx="70" cy="80" r="25" fill="url(#grad1)" opacity="0.9" />
    <circle cx="130" cy="120" r="25" fill="url(#grad1)" opacity="0.9" />
    
    <path
      d="M90 90L110 110"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
    />
    
    {/* Person Icons */}
    <circle cx="70" cy="70" r="10" fill="white" />
    <path
      d="M60 85C60 85 60 95 70 95C80 95 80 85 80 85"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
    
    <circle cx="130" cy="110" r="10" fill="white" />
    <path
      d="M120 125C120 125 120 135 130 135C140 135 140 125 140 125"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
    
    {/* Network Background */}
    <g opacity="0.5">
      <circle cx="40" cy="40" r="5" fill={accentColor} />
      <circle cx="160" cy="40" r="5" fill={accentColor} />
      <circle cx="40" cy="160" r="5" fill={accentColor} />
      <circle cx="160" cy="160" r="5" fill={accentColor} />
      <circle cx="30" cy="100" r="4" fill={accentColor} />
      <circle cx="170" cy="100" r="4" fill={accentColor} />
      <circle cx="100" cy="30" r="4" fill={accentColor} />
      <circle cx="100" cy="170" r="4" fill={accentColor} />
      
      <path
        d="M40 40L30 100L40 160M160 40L170 100L160 160M40 40L100 30L160 40M40 160L100 170L160 160"
        stroke={accentColor}
        strokeWidth="1"
        strokeDasharray="5 5"
        fill="none"
      />
    </g>
    
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="10 5"
    />
  </Box>
);

// Custom Icon Components
interface CustomIconProps extends Omit<SvgIconProps, 'color'> {
  color?: string;
}

// Verification Check Icon
export const VerificationCheckIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z"
    />
    <path 
      fill={color}
      d="M9.29,16.29L6.7,13.7c-0.39-0.39-0.39-1.02,0-1.41c0.39-0.39,1.02-0.39,1.41,0L10,14.17l6.88-6.88 c0.39-0.39,1.02-0.39,1.41,0c0.39,0.39,0.39,1.02,0,1.41l-7.59,7.59C10.32,16.68,9.68,16.68,9.29,16.29z"
    />
  </SvgIcon>
);

// Code Icon
export const CodeIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M9.4,16.6L4.8,12l4.6-4.6L8,6l-6,6l6,6L9.4,16.6z M14.6,16.6l4.6-4.6l-4.6-4.6L16,6l6,6l-6,6L14.6,16.6z"
    />
  </SvgIcon>
);

// Network Icon
export const NetworkIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13h2c0,3.31,2.69,6,6,6v2c-4.42,0-8-3.58-8-8z M2,9 h2c0-3.31,2.69-6,6-6V1C5.58,1,2,4.58,2,9z M22,13h-2c0,3.31-2.69,6-6,6v2c4.42,0,8-3.58,8-8z M22,9h-2c0-3.31-2.69-6-6-6V1 C18.42,1,22,4.58,22,9z"
    />
  </SvgIcon>
);

// Briefcase Icon
export const BriefcaseIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M20,6h-4V4c0-1.11-0.89-2-2-2h-4C8.89,2,8,2.89,8,4v2H4C2.89,6,2.01,6.89,2.01,8L2,19c0,1.11,0.89,2,2,2h16c1.11,0,2-0.89,2-2 V8C22,6.89,21.11,6,20,6z M12,15c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2s2,0.9,2,2C14,14.1,13.1,15,12,15z M14,6h-4V4h4V6z"
    />
  </SvgIcon>
);

// Education Icon
export const EducationIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12,3L1,9l4,2.18v6L12,21l7-3.82v-6l2-1.09V17h2V9L12,3z M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9z M17,15.99l-5,2.73 l-5-2.73v-3.72L12,15l5-2.73V15.99z"
    />
  </SvgIcon>
);

// Message Icon
export const MessageIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H5.17L4,17.17V4h16V16z"
    />
    <path
      fill={color}
      d="M7,9h2v2H7V9z M11,9h2v2h-2V9z M15,9h2v2h-2V9z"
    />
  </SvgIcon>
);

// Document/Blog Icon
export const DocumentIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M16,18H8v-2h8V18z M16,14H8v-2h8V14z M13,9V3.5 L18.5,9H13z"
    />
  </SvgIcon>
);

// Building/Company Icon
export const BuildingIcon: React.FC<CustomIconProps> = ({ color = '#0077B5', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12,7V3H2v18h20V7H12z M6,19H4v-2h2V19z M6,15H4v-2h2V15z M6,11H4V9h2V11z M6,7H4V5h2V7z M10,19H8v-2h2V19z M10,15H8v-2h2 V15z M10,11H8V9h2V11z M10,7H8V5h2V7z M20,19h-8v-2h2v-2h-2v-2h2v-2h-2V9h8V19z M18,11h-2v2h2V11z M18,15h-2v2h2V15z"
    />
  </SvgIcon>
);

// Star Rating Icon
export const StarIcon: React.FC<CustomIconProps> = ({ color = '#FF9500', ...props }) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z"
    />
  </SvgIcon>
); 