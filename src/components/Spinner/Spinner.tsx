import React from 'react';
import './Spinner.sass';

interface SpinnerProps {
  isActive: boolean
}

const Spinner: React.FC<SpinnerProps> = ({isActive}) => {
  return (
    isActive 
      ? <div className='spinner-container'>
          <img src='./logo192.png' className='rotating' alt='spinner' />
          {/* <i className='spinner fa fa-spinner fa-spin'></i> */}
        </div> 
      : null
  );
};

export default Spinner;
