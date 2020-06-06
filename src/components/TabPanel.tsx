import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
};

export const a11yProps = (index: any) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      tabPanelContainer: {
        paddingLeft: 0,
      },
    }),
  );
  const classes = useStyles();

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.tabPanelContainer} p={3}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TabPanel;
