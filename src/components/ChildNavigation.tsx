import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';

interface ChildNavigationProps {
  itemName: string,
  disabled?: boolean,
  onClick: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
}

const ChildNavigation: React.FC<ChildNavigationProps> = ({itemName, disabled, onClick}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(
      {
        ...sharedStyles(theme),
        childNavigationContainer: {
          backgroundColor: 'whitesmoke',
          cursor: 'pointer',
          display: 'flex',
          fontSize: '1.25rem',
          marginTop: '.5rem',
          padding: '1rem',
          '@media (max-width: 768px)': { // when mobile
            justifyContent: 'space-between',
          },
        },
        childNavigationItem: {
          color: 'blue',
          cursor: 'pointer',
          display: 'inline-block',        
        },
        childNavigationIsDisabled: {
          cursor: 'not-allowed',
          '& a, span': {
            color: 'gray',
            pointerEvents: 'none',
          },
        },
      })
  );
  const classes = useStyles();

  return (
    <Box
      className={clsx(classes.childNavigationContainer, (disabled ? classes.childNavigationIsDisabled : ''))}
      onClick={disabled ? () => {} : onClick}>
      <span className={classes.childNavigationItem}>{itemName}</span>
      <span className={classes.childNavigationItem}>&nbsp;&nbsp;&#10095;</span>
    </Box>
  );
};

export default ChildNavigation;
