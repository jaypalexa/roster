import { Box, Breadcrumbs, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import SeaTurtleMorphometricModel from 'models/SeaTurtleMorphometricModel';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import SeaTurtleMorphometricService from 'services/SeaTurtleMorphometricService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { constants } from 'utils';

const SeaTurtleMorphometricsGraphs: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles(sharedStyles(theme))
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const [graphTypeSettings, setGraphTypeSettings] = useState<Map<string, GraphTypeSettings>>();
  const [currentGraphTypes, setCurrentGraphTypes] = useState<Map<string, boolean>>();
  const [currentSeaTurtleMorphometrics, setCurrentSeaTurtleMorphometrics] = useState([] as Array<SeaTurtleMorphometricModel>);
  const [data, setData] = useState<GraphData>({} as GraphData);
  const [showSpinner, setShowSpinner] = useState(false);

  /* scroll to top */
  useMount(() => {
    window.scrollTo(0, 0);
  });

  interface GraphDataset {
    label: string;
    fill: boolean;
    lineTension: number;
    backgroundColor: string;
    borderColor: string;
    borderCapStyle: string;
    borderDash: Array<any>,
    borderDashOffset: number;
    borderJoinStyle: string;
    pointBorderColor: string;
    pointBackgroundColor: string;
    pointBorderWidth: number;
    pointHoverRadius: number;
    pointHoverBackgroundColor: string;
    pointHoverBorderColor: string;
    pointHoverBorderWidth: number;
    pointRadius: number;
    pointHitRadius: number;
    data: Array<number>;
  }

  interface GraphData {
    labels: Array<string>;
    datasets: Array<GraphDataset>;
  }

  interface GraphTypeSettings {
    displayName: string;
    dataset: GraphDataset;
  }

  useMount(() => {
    const defaultGraphDataset: GraphDataset = {
      label: '',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 3,
      pointHitRadius: 10,
      data: []
    }

    const defaultGraphData: GraphData = {
      labels: [],
      datasets: [defaultGraphDataset]
    }

    setData(defaultGraphData);

    const createGraphDataset = (label: string, color: string) => {
      return Object.assign({}, defaultGraphDataset, {
        label: label,
        backgroundColor: color,
        borderColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: color,
      });
    }

    const createGraphTypeSetting = (label: string, color: string) => {
      return { displayName: label, dataset: createGraphDataset(label, color) };
    }

    const settings = new Map<string, GraphTypeSettings>();
    settings.set('sclNotchNotchValue', createGraphTypeSetting('SCL notch-notch', 'rgba(240,128,128,1)'));
    settings.set('sclNotchTipValue', createGraphTypeSetting('SCL notch-tip', 'rgba(255,0,0,1)'));
    settings.set('sclTipTipValue', createGraphTypeSetting('SCL tip-tip', 'rgba(139,0,0,1)'));
    settings.set('scwValue', createGraphTypeSetting('SCW', 'rgba(255,140,0,1)'));
    settings.set('cclNotchNotchValue', createGraphTypeSetting('CCL notch-notch', 'rgba(144,238,144,1)'));
    settings.set('cclNotchTipValue', createGraphTypeSetting('CCL notch-tip', 'rgba(50,205,50,1)'));
    settings.set('cclTipTipValue', createGraphTypeSetting('CCL tip-tip', 'rgba(0,100,0,1)'));
    settings.set('ccwValue', createGraphTypeSetting('CCW', 'rgba(72,209,204,1)'));
    settings.set('weightValue', createGraphTypeSetting('Weight', 'rgba(238,130,238,1)'));
    setGraphTypeSettings(settings);

    const graphTypes = new Map<string, boolean>();
    settings.forEach((value, key) => {
      graphTypes.set(key, true);
    })
    setCurrentGraphTypes(graphTypes);
  });

  const options = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Date',
          fontSize: 20
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Measurement',
          fontSize: 20
        },
        ticks: {
          autoSkip: true
        }
      }]
    },
    spanGaps: true,
  }

  useMount(() => {
    const seaTurtleId = appContext.seaTurtle?.seaTurtleId;
    if (!seaTurtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleMorphometricsForTurtle = async () => {
        try {
          setShowSpinner(true);
          const seaTurtleMorphometrics = await SeaTurtleMorphometricService.getSeaTurtleMorphometrics(seaTurtleId);
          setCurrentSeaTurtleMorphometrics(seaTurtleMorphometrics);
        }
        catch (err) {
          console.log(err);
          ToastService.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getSeaTurtleMorphometricsForTurtle();
    }
  });

  useEffect(() => {
    if (!currentGraphTypes || !currentSeaTurtleMorphometrics || currentSeaTurtleMorphometrics.length === 0) return;

    const buildNewDatasets = () => {
      const newDatasets = new Array<GraphDataset>();
      currentGraphTypes.forEach((isChecked: boolean, graphType: string) => {
        if (isChecked) {
          const newData = currentSeaTurtleMorphometrics.map(x => x[graphType] as number === 0 ? null : x[graphType] as number);
          const newDataset = Object.assign({}, graphTypeSettings?.get(graphType)?.dataset, { data: newData });
          newDatasets.push(newDataset);
        }
      });
      return newDatasets;
    }

    const newLabels = currentSeaTurtleMorphometrics.map(x => x.dateMeasured ? moment(x.dateMeasured).format('YYYY-MM-DD') : '');
    setData(data => Object.assign({}, data, { labels: newLabels }, { datasets: buildNewDatasets() }));
  }, [currentSeaTurtleMorphometrics, currentGraphTypes, graphTypeSettings]);

  return (
    <Box id='seaTurtleMorphometricsGraphs'>
      <Spinner isActive={showSpinner} />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Link to='/sea-turtles'>Sea Turtles</Link>
        <Typography color='textPrimary'>Water Graphs</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/sea-turtles'>&#10094; Sea Turtles</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Morphometrics Graphs for {appContext.seaTurtle?.seaTurtleName}</Typography>

          <Box>
            <Line data={data} options={options} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SeaTurtleMorphometricsGraphs;
