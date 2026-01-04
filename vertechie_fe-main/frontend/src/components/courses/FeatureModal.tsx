import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface FeatureModalProps {
  open: boolean;
  onClose: () => void;
  feature?: any;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ open, onClose, feature }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="feature-modal-title"
      aria-describedby="feature-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="feature-modal-title" variant="h6" component="h2">
          Feature Details
        </Typography>
        <Typography id="feature-modal-description" sx={{ mt: 2 }}>
          {feature ? feature.description : 'No feature details available.'}
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default FeatureModal;
