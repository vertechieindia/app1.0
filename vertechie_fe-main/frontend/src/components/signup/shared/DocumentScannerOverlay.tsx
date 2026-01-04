import React from 'react';
import { Box } from '@mui/material';

interface DocumentScannerOverlayProps {
  width?: number | string;
  height?: number | string;
  borderColor?: string;
  showCorners?: boolean;
  cornerSize?: number;
}

/**
 * Scanner-like rectangular overlay for document placement guide
 * Similar to document scanner apps, shows a rectangular frame to guide users
 */
export const DocumentScannerOverlay: React.FC<DocumentScannerOverlayProps> = ({
  width = '85%',
  height = '60%',
  borderColor = '#4CAF50',
  showCorners = true,
  cornerSize = 30,
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {/* Dark overlay - top section */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `calc((100% - ${height}) / 2)`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      {/* Dark overlay - bottom section */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `calc((100% - ${height}) / 2)`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      {/* Dark overlay - left section */}
      <Box
        sx={{
          position: 'absolute',
          top: `calc((100% - ${height}) / 2)`,
          left: 0,
          width: `calc((100% - ${width}) / 2)`,
          height: height,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      {/* Dark overlay - right section */}
      <Box
        sx={{
          position: 'absolute',
          top: `calc((100% - ${height}) / 2)`,
          right: 0,
          width: `calc((100% - ${width}) / 2)`,
          height: height,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      
      {/* Scanner frame border */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: width,
          height: height,
          border: `2px solid ${borderColor}`,
          borderRadius: 2,
          pointerEvents: 'none',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 0 2px ${borderColor}40`, // Subtle glow
        }}
      >
        {/* Corner indicators for better visual guidance */}
        {showCorners && (
          <>
            {/* Top-left corner */}
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                left: -2,
                width: cornerSize,
                height: cornerSize,
                borderTop: `4px solid ${borderColor}`,
                borderLeft: `4px solid ${borderColor}`,
                borderTopLeftRadius: 2,
              }}
            />
            {/* Top-right corner */}
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: cornerSize,
                height: cornerSize,
                borderTop: `4px solid ${borderColor}`,
                borderRight: `4px solid ${borderColor}`,
                borderTopRightRadius: 2,
              }}
            />
            {/* Bottom-left corner */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                left: -2,
                width: cornerSize,
                height: cornerSize,
                borderBottom: `4px solid ${borderColor}`,
                borderLeft: `4px solid ${borderColor}`,
                borderBottomLeftRadius: 2,
              }}
            />
            {/* Bottom-right corner */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: cornerSize,
                height: cornerSize,
                borderBottom: `4px solid ${borderColor}`,
                borderRight: `4px solid ${borderColor}`,
                borderBottomRightRadius: 2,
              }}
            />
          </>
        )}
        
        {/* Instruction text */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 600,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          Align document within frame
        </Box>
      </Box>
    </Box>
  );
};

export default DocumentScannerOverlay;
