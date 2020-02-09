import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';
import UnsavedChangesDialog from './UnsavedChangesDialog';

interface UnsavedChangesWhenLeavingPromptProps {
  isDirty: boolean
}

const UnsavedChangesWhenLeavingPrompt: React.FC<UnsavedChangesWhenLeavingPromptProps> = ({isDirty}) => {
  return (
    <NavigationPrompt when={isDirty}>
      {({ onConfirm, onCancel }) => (
        <UnsavedChangesDialog 
          isActive={true}
          titleText='Unsaved Changes'
          bodyText='Leave this page?  Changes you made may not be saved.'
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )}
    </NavigationPrompt>
  );
};

export default UnsavedChangesWhenLeavingPrompt;
