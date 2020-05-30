import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React from 'react';

interface YesNoDialogProps {
  isOpen: boolean,
  titleText?: string,
  bodyText?: string,
  onYesClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  onNoClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
}

const YesNoDialog: React.FC<YesNoDialogProps> = ({isOpen, titleText, bodyText, onYesClick, onNoClick}) => {
  return (
    isOpen ? 
      <Dialog
        open={isOpen}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{titleText}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {bodyText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onYesClick} color='secondary'>
            Yes
          </Button>
          <Button onClick={onNoClick} color='primary' autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    : null
  );
};

export default YesNoDialog;
