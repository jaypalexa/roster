import React, { useEffect, useRef } from 'react';
import { handleModalKeyDownEvent } from 'utils';

interface YesNoDialogProps {
  isActive: boolean,
  titleText?: string,
  bodyText?: string,
  onYes: any,
  onNo: any
}

const YesNoDialog: React.FC<YesNoDialogProps> = ({isActive, titleText, bodyText, onYes, onNo}) => {
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
          </footer>
        </div>
      </div>
    : null
  );
};

export default YesNoDialog;
