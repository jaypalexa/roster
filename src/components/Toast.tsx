import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

export interface ToastProps {
  key: string;
  isOpen: boolean;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error' | undefined;
  onClose: () => void | undefined;
}

export const Toast: React.FC<ToastProps> = ({ isOpen, message, severity, onClose }) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={2000} onClose={onClose}>
      <Alert elevation={6} variant='filled' severity={severity || 'info'} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;