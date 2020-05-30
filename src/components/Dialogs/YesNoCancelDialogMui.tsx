import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React from 'react';

interface YesNoCancelDialogMuiProps {
  isOpen: boolean,
  titleText?: string,
  bodyText?: string,
  onYesClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  onNoClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  onCancelClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
}

const YesNoCancelDialogMui: React.FC<YesNoCancelDialogMuiProps> = ({isOpen, titleText, bodyText, onYesClick, onNoClick, onCancelClick}) => {

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
          <Button onClick={onYesClick} color='secondary' autoFocus>
            Yes
          </Button>
          <Button onClick={onNoClick} color='primary'>
            No
          </Button>
          <Button onClick={onCancelClick} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    : null
  );
};

export default YesNoCancelDialogMui;
