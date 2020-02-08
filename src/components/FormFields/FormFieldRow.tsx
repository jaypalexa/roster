import React from 'react';

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