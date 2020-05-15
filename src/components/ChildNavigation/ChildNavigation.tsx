import React from 'react';
import './ChildNavigation.sass';

interface ChildNavigationProps {
  itemName: string,
  disabled?: boolean,
  onClick: () => {}
}

const ChildNavigation: React.FC<ChildNavigationProps> = ({itemName, disabled, onClick}) => {
  return (
    <div
      className={'child-navigation-container ' + (disabled ? 'is-disabled' : '')}
      onClick={onClick}>
      <span className='child-navigation-item'>{itemName}</span>
      <span className='child-navigation-item'>&nbsp;&nbsp;&#10095;</span>
    </div>
  );
};

export default ChildNavigation;
