import React, { useEffect, useRef } from 'react';
import { handleModalKeyDownEvent } from 'utils';

interface YesNoCancelDialogProps {
  isActive: boolean,
  titleText?: string,
  bodyText?: string,
  onYes: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  onNo: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
  onCancel: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined,
}

const YesNoCancelDialog: React.FC<YesNoCancelDialogProps> = ({isActive, titleText, bodyText, onYes, onNo, onCancel}) => {
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;
    yesButtonRef?.current?.focus();
    document.addEventListener('keydown', handleModalKeyDownEvent);
    return () => {
      document.removeEventListener('keydown', handleModalKeyDownEvent);
    }
  }, [isActive]);

  return (
    isActive ?
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
            <button className='button is-success' onClick={onYes} ref={yesButtonRef}>Yes</button>
            <button className='button is-danger' onClick={onNo}>No</button>
            <button className='button is-info' onClick={onCancel}>Cancel</button>
          </footer>
        </div>
      </div>
    : null
  );
};

export default YesNoCancelDialog;
