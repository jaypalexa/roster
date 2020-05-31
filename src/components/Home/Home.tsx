import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import HomeTile from 'components/HomeTile/HomeTile';
import useMount from 'hooks/UseMount';
import React from 'react';

const HomeMui: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
    }),
  );
  const classes = useStyles();

  useMount(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div id='home' className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <HomeTile color='darkgreen' content='Sea Turtles' linkTo='/sea-turtles' />
        </Grid>
        <Grid item xs={12} md={4}>
          <HomeTile color='hsl(245, 100%, 25%)' content='Hatchlings Events' linkTo='/hatchlings-events' />
        </Grid>
        <Grid item xs={12} md={4}>
          <HomeTile color='hsl(245, 100%, 40%)' content='Washbacks Events' linkTo='/washbacks-events' />
        </Grid>
        <Grid item xs={12} md={5}>
          <HomeTile color='darkmagenta' content='Holding Tanks' linkTo='/holding-tanks' />
        </Grid>
        <Grid item xs={12} md={3}>
          <HomeTile color='darkred' content='Reports' linkTo='/reports' />
        </Grid>
        <Grid item xs={12} md={4}>
          <HomeTile color='firebrick' content='Blank Forms' linkTo='/blank-forms' />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomeMui;
