import { Box, Breadcrumbs, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppService from 'services/AppService';
import MessageService from 'services/MessageService';
import sharedStyles from 'styles/sharedStyles';
import { isIosDevice } from 'utils';

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

  const [lastUpdateCheckDateTime, setLastUpdateCheckDateTime] = useState<string | null>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  
  const onInstallUpdateClick = () => {
    AppService.installUpdate();
  };

  const onCheckForUpdateClick = () => {
    AppService.checkForUpdate();
  }

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  /* check for update */
  useMount(() => {
    if (!isIosDevice) {
      AppService.checkForUpdate();
    }
  });

  /* listen for 'is update available' notifications */
  useMount(() => {
    const subscription = MessageService.observeIsUpdateAvailableChanged().subscribe(message => {
      if (message) {
        setIsUpdateAvailable(message.isUpdateAvailable);
      }
    });
    return () => subscription.unsubscribe();
  });

  /* listen for 'last update check datetime' notifications */
  useMount(() => {
    const subscription = MessageService.observeLastUpdateCheckDateTimeChanged().subscribe(message => {
      if (message) {
        setLastUpdateCheckDateTime(message.lastUpdateCheckDateTime);
      }
    });
    return () => subscription.unsubscribe();
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
            <p>v2020.06.15.1900</p>
            {isUpdateAvailable
              ? <p>
                  <span>(</span>
                  <span className={classes.spanLink} onClick={onInstallUpdateClick}>install update</span>
                  <span>)</span>
                </p>
              : <p>
                  <span>(</span>
                  <span className={classes.spanLink} onClick={onCheckForUpdateClick}>check for update</span>
                  {lastUpdateCheckDateTime ? <span> - last checked: {lastUpdateCheckDateTime}</span> : null}
                  <span>)</span>
                </p>
            }
            <br />
            <p>
              Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
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
