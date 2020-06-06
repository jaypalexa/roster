import { Box, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';

interface CheckboxGroupFormFieldProps {
  labelText?: string;
  itemsPerColumn?: number;
}

export const CheckboxGroupFormField: React.FC<CheckboxGroupFormFieldProps> = ({ labelText, itemsPerColumn, children }) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      ...sharedStyles(theme),
      formFieldGroupLabel: {
        color: 'rgba(0, 0, 0, 0.54)',
        padding: 0,
        fontSize: '.75rem',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: '0.00938em',
        marginBottom: '0.5em',
      },
      gridItemContents: {
        marginLeft: '8px',
      },
      gridItemContentsChildren: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
      },
      itemsPerColumn1: {
        '@media (min-width: 768px)': {
          height: '2rem',
        }
      },
      itemsPerColumn2: {
        '@media (min-width: 768px)': {
          height: '4rem',
        }
      },
      itemsPerColumn3: {
        '@media (min-width: 768px)': {
          height: '6rem',
        }
      },
      itemsPerColumn4: {
        '@media (min-width: 768px)': {
          height: '8rem',
        }
      },
      itemsPerColumn5: {
        '@media (min-width: 768px)': {
          height: '10rem',
        }
      },
    })
  );
  const classes = useStyles();

  const getItemsPerColumnClass = (itemsPerColumn?: number) => {
    switch (itemsPerColumn) {
      case 2: return classes.itemsPerColumn2;
      case 3: return classes.itemsPerColumn3;
      case 4: return classes.itemsPerColumn4;
      case 5: return classes.itemsPerColumn5;
      default: return classes.itemsPerColumn1;
    }
  };

  const itemsPerColumnClass = itemsPerColumn ? getItemsPerColumnClass(itemsPerColumn) : '';

  return (
    <Grid item xs={12} md>
      <Box className={clsx(classes.gridItemContents)}>
        <label className={clsx(`${labelText ? '' : classes.hidden}`, classes.formFieldGroupLabel)}>{labelText === '&nbsp;' ? '\u00A0' : labelText}</label>
        <Box className={clsx(classes.gridItemContentsChildren, itemsPerColumnClass)}>
          {children}
        </Box>
      </Box>
    </Grid>
  );
};

export default CheckboxGroupFormField;