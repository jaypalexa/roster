import React from 'react';
import './FormFieldRow.sass';

export const FormFieldRow: React.FC = (props) => {
  return (
    <>
      <div className='field is-horizontal'>
        <div className='field-body'>
          {props.children}
        </div>
      </div>
    </>
  );
};

export default FormFieldRow;