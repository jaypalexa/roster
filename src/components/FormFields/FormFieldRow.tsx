import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

export const FormFieldRow: React.FC = (props) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      fieldBody: {
        position: 'relative',
        width: '100%',
      },
    })
  );
  const classes = useStyles();

  return (
    <>
      <div className='field is-horizontal'>
        <div className={classes.fieldBody}>
          {props.children}
        </div>
      </div>
    </>
  );
};

export default FormFieldRow;