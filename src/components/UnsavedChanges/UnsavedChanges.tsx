import NavigationPrompt from 'react-router-navigation-prompt';
import React from 'react';

interface UnsavedChangesProps {
  isDirty: boolean
}

const UnsavedChanges: React.FC<UnsavedChangesProps> = (props) => {
  return (
    <NavigationPrompt when={props.isDirty}>
      {({ onConfirm, onCancel }) => (
        <div className='modal is-active'>
          <div className='modal-background'></div>
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Unsaved Changes</p>
            </header>
            <section className='modal-card-body'>
              <p>You have unsaved changes. Are you sure you want to leave?</p>
            </section>
            <footer className='modal-card-foot'>
              <button className='button is-success' onClick={onConfirm}>Yes</button>
              <button className='button is-danger' onClick={onCancel}>No</button>
            </footer>
          </div>
        </div>
      )}
    </NavigationPrompt>
  );
};

export default UnsavedChanges;
