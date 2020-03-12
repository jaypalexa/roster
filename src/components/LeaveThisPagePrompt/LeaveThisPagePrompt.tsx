import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';
import YesNoDialog from '../Dialogs/YesNoDialog';

interface LeaveThisPagePromptProps {
  isDirty: boolean
}

const LeaveThisPagePrompt: React.FC<LeaveThisPagePromptProps> = ({isDirty}) => {
  return (
    <NavigationPrompt when={isDirty}>
      {({ onConfirm, onCancel }) => (
        <YesNoDialog 
          isActive={true}
          titleText='Unsaved Changes'
          bodyText='Leave this page?  Changes you made may not be saved.'
          onYes={onConfirm} 
          onNo={onCancel} 
        />
      )}
    </NavigationPrompt>
  );
};

export default LeaveThisPagePrompt;
