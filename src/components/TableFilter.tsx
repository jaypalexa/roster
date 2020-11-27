import { createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FilterList } from '@material-ui/icons';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';

interface TableFilterProps {
  filterText?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => any;
}

export const TableFilter: React.FC<TableFilterProps> = ({filterText, onChange}) => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      ...sharedStyles(theme),
      tableFilter: {
        marginBottom: '1rem',
        [theme.breakpoints.down('sm')]: {
          marginRight: '1rem',
          width: '100%',
        },
      },
    })
  );
  const classes = useStyles();

  return (
    <TextField id='search' type='text' placeholder='Filter' size='small' value={filterText} 
      className={classes.tableFilter} 
      onChange={onChange} 
      InputProps={{ startAdornment: (<InputAdornment position='start'><FilterList /></InputAdornment>), }}
    />
  );
};

export default TableFilter;
