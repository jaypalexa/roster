import YesNoDialogMui from 'components/Dialogs/YesNoDialogMui';
import React from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';

interface LeaveThisPagePromptProps {
  isDirty: boolean
}

const LeaveThisPagePrompt: React.FC<LeaveThisPagePromptProps> = ({isDirty}) => {
  return (
    <NavigationPrompt when={isDirty}>
      {({ onConfirm, onCancel }) => (
        <YesNoDialogMui 
          isOpen={true}
          titleText='Unsaved Changes'
          bodyText='Leave this page?  Changes you made may not be saved.'
          onYesClick={onConfirm} 
          onNoClick={onCancel} 
        />
      )}
    </NavigationPrompt>
  );
};

export default LeaveThisPagePrompt;
