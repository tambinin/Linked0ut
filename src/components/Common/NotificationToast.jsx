import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  styled,
  Grow,
} from '@mui/material';
import { colors } from '../../styles/theme';

const StyledAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: colors.white,
  border: `1px solid ${colors.blue}`,
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  '& .MuiAlert-icon': {
    fontSize: '1.5rem',
  },
  '& .MuiAlert-message': {
    padding: 0,
  },
}));

const NotificationIcon = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginRight: theme.spacing(1),
}));

const NotificationToast = ({ notification, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow time for close animation
      }
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  const getSeverity = (type) => {
    switch (type) {
      case 'endorsement':
      case 'badge':
      case 'level_up':
        return 'success';
      case 'rejection':
        return 'error';
      case 'reminder':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Grow}
      sx={{ mt: 8 }} // Margin top to avoid header
    >
      <StyledAlert
        severity={getSeverity(notification.type)}
        onClose={handleClose}
        variant="outlined"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <NotificationIcon>{notification.icon}</NotificationIcon>
          <AlertTitle sx={{ mb: 0, fontWeight: 600, fontSize: '0.875rem' }}>
            {notification.title}
          </AlertTitle>
        </Box>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: colors.greyDark }}>
          {notification.message}
        </Typography>
      </StyledAlert>
    </Snackbar>
  );
};

export default NotificationToast;