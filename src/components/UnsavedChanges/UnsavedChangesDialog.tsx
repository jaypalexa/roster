import React from 'react';

interface UnsavedChangesDialogProps {
  isActive: boolean,
  bodyText?: string,
  onConfirm: any,
  onCancel: any
}

const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({isActive, bodyText, onConfirm, onCancel}) => {
  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className='modal-background'></div>
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>Unsaved Changes</p>
        </header>
        <section className='modal-card-body'>
          <p>{bodyText || 'Save changes?'}</p>
        </section>
        <footer className='modal-card-foot'>
          <button className='button is-success' onClick={onConfirm}>Yes</button>
          <button className='button is-danger' onClick={onCancel}>No</button>
        </footer>
      </div>
    </div>
  );
};

export default UnsavedChangesDialog;
