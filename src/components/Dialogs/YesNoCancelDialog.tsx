import React from 'react';

interface YesNoCancelDialogProps {
  isActive: boolean,
  titleText?: string,
  bodyText?: string,
  onYes: any,
  onNo: any,
  onCancel: any
}

const YesNoCancelDialog: React.FC<YesNoCancelDialogProps> = ({isActive, titleText, bodyText, onYes, onNo, onCancel}) => {
  return (
    <div className={`modal ${isActive ? 'is-active' : ''}`}>
      <div className='modal-background'></div>
      <div className='modal-card'>
        <header className='modal-card-head'>
          <p className='modal-card-title'>{titleText}</p>
        </header>
        <section className='modal-card-body'>
          <p>{bodyText}</p>
        </section>
        <footer className='modal-card-foot'>
          <button className='button is-success' onClick={onYes}>Yes</button>
          <button className='button is-danger' onClick={onNo}>No</button>
          <button className='button is-info' onClick={onCancel}>Cancel</button>
        </footer>
      </div>
    </div>
  );
};

export default YesNoCancelDialog;
