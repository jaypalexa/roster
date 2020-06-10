import { Box, Button, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import sharedStyles from 'styles/sharedStyles';
import browserHistory from '../browserHistory';

const NotFound: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  return (
    <Box id='not-found'>
      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Not Found</Typography>
          <Box className={classes.formActionButtonsContainer}>
            <Button className={classes.fixedWidthMedium} color='secondary' variant='contained' onClick={() => browserHistory.push('/')}>
              Home
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotFound;
