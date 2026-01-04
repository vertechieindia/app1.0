import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { SvgIconComponent } from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      width: '100%',
      maxHeight: '100vh',
      borderRadius: 0,
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiTypography-h6': {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  '& .MuiTypography-body1': {
    marginBottom: theme.spacing(1.5),
  },
}));

export interface FeatureContent {
  title: string;
  description: string[];
  tagline: string;
  icon: SvgIconComponent;
}

interface CompanyFeatureModalProps {
  open: boolean;
  onClose: () => void;
  feature: FeatureContent;
}

const CompanyFeatureModal = ({ open, onClose, feature }: CompanyFeatureModalProps) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        timeout: 300,
      }}
    >
      <StyledDialogTitle>
        <Typography variant="h5" component="h2">
          {feature.title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent>
        <ContentSection>
          {feature.description.map((item, index) => (
            <Typography key={index} variant="body1">
              {item}
            </Typography>
          ))}
        </ContentSection>
        <Typography
          variant="subtitle1"
          sx={{
            fontStyle: 'italic',
            color: 'text.secondary',
            textAlign: 'center',
            mt: 2,
          }}
        >
          {feature.tagline}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            minWidth: 120,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default CompanyFeatureModal; 