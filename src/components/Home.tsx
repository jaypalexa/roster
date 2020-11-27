import { Box, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ChipData } from 'components/ChipsPanel';
import HomeTile from 'components/HomeTile';
import React, { useEffect, useState } from 'react';
import HomeSummaryService from 'services/HomeSummaryService';
import ToastService from 'services/ToastService';
import { constants } from 'utils';
import Spinner from './Spinner/Spinner';

const Home: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      homeGridItem: {
        display: 'flex', 
      }
    }),
  );
  const classes = useStyles();

  const [seaTurtlesChips, setSeaTurtlesChips] = useState(new Array<ChipData>());
  const [hatchlingsEventsChips, setHatchlingsEventsChips] = useState(new Array<ChipData>());
  const [washbacksEventsChips, setWashbacksEventsChips] = useState(new Array<ChipData>());
  const [holdingTanksChips, setHoldingTanksChips] = useState(new Array<ChipData>());
  const [reportsChips, setReportsChips] = useState(new Array<ChipData>());
  const [blankFormsChips, setBlankFormsChips] = useState(new Array<ChipData>());
  const [showSpinner, setShowSpinner] = useState(false);

  /* scroll to top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* fetch table data */
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setShowSpinner(true);
        const homeSummary = await HomeSummaryService.getHomeSummary();

        setSeaTurtlesChips([
          {label: 'Active', avatar: homeSummary.activeSeaTurtlesCount}, 
          {label: 'Relinquished', avatar: homeSummary.relinquishedSeaTurtlesCount},
        ]);
      
        setHatchlingsEventsChips([
          {label: 'Acquired', avatar: homeSummary.acquiredHatchlingsEventsCount}, 
          {label: 'Died', avatar: homeSummary.diedHatchlingsEventsCount},
          {label: 'Released', avatar: homeSummary.releasedHatchlingsEventsCount},
          {label: 'DOA', avatar: homeSummary.doaHatchlingsEventsCount},
        ]);
      
        setWashbacksEventsChips([
          {label: 'Acquired', avatar: homeSummary.acquiredWashbacksEventsCount}, 
          {label: 'Died', avatar: homeSummary.diedWashbacksEventsCount},
          {label: 'Released', avatar: homeSummary.releasedWashbacksEventsCount},
          {label: 'DOA', avatar: homeSummary.doaWashbacksEventsCount},
        ]);
      
        setHoldingTanksChips([
          {label: 'Tanks', avatar: homeSummary.holdingTanksCount}, 
        ]);
      
        setReportsChips([
          {label: 'FWC', avatar: 4}, 
          {label: 'Other', avatar: 3},
        ]);
      
        setBlankFormsChips([
          {label: 'Forms', avatar: 18},
        ]);
      } 
      catch (err) {
        console.log(err);
        ToastService.error(constants.ERROR.GENERIC);
      }
      finally {
        setShowSpinner(false);
      }
    };
    fetchOrganization();
  }, []);

  return (
    <Box id='home' className={classes.root}>
      <Spinner isActive={showSpinner} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} className={classes.homeGridItem}>
          <HomeTile color='darkgreen' content='Sea Turtles' linkTo='/sea-turtles' chipData={seaTurtlesChips} />
        </Grid>
        <Grid item xs={12} md={4} className={classes.homeGridItem}>
          <HomeTile color='hsl(245, 100%, 25%)' content='Hatchlings Events' linkTo='/hatchlings-events' chipData={hatchlingsEventsChips} />
        </Grid>
        <Grid item xs={12} md={4} className={classes.homeGridItem}>
          <HomeTile color='hsl(245, 100%, 40%)' content='Washbacks Events' linkTo='/washbacks-events' chipData={washbacksEventsChips} />
        </Grid>
        <Grid item xs={12} md={5} className={classes.homeGridItem}>
          <HomeTile color='darkmagenta' content='Holding Tanks' linkTo='/holding-tanks' chipData={holdingTanksChips} />
        </Grid>
        <Grid item xs={12} md={3} className={classes.homeGridItem}>
          <HomeTile color='darkred' content='Reports' linkTo='/reports' chipData={reportsChips} />
        </Grid>
        <Grid item xs={12} md={4} className={classes.homeGridItem}>
          <HomeTile color='firebrick' content='Blank Forms' linkTo='/blank-forms' chipData={blankFormsChips} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
