import { Box, Breadcrumbs, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import useMount from 'hooks/UseMount';
import React from 'react';
import { Link } from 'react-router-dom';
import sharedStyles from 'styles/sharedStyles';

const AboutRoster: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({
      ...sharedStyles(theme), 
      spanLink: {
        cursor: 'pointer',
        color: '#3273dc',
      },
    })
  );
  const classes = useStyles();

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div id='aboutRoster'>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Typography color='textPrimary'>About ROSTER</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/'>&#10094; Home</Link>
      </Breadcrumbs>
      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>About ROSTER</Typography>
          <Box textAlign='center'>
            <p>v2021.03.07.1500</p>
            <br />
            <p>
              Copyright &copy; 2006-2021 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
              &nbsp;|&nbsp;
              <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
                GitHub
              </a>
            </p>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AboutRoster;
