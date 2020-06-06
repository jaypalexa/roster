import { Box, Breadcrumbs, Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import browserHistory from 'browserHistory';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import HoldingTankMeasurementModel from 'models/HoldingTankMeasurementModel';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import HoldingTankMeasurementService from 'services/HoldingTankMeasurementService';
import ToastService from 'services/ToastService';
import sharedStyles from 'styles/sharedStyles';
import { constants } from 'utils';

const HoldingTankGraphs: React.FC = () => {

  const useStyles = makeStyles((theme: Theme) => 
    createStyles({...sharedStyles(theme)})
  );
  const classes = useStyles();

  const [appContext] = useAppContext();
  const [graphTypeSettings, setGraphTypeSettings] = useState<Map<string, GraphTypeSettings>>();
  const [currentGraphTypes, setCurrentGraphTypes] = useState<Map<string, boolean>>();
  const [currentHoldingTankMeasurements, setCurrentHoldingTankMeasurements] = useState([] as Array<HoldingTankMeasurementModel>);
  const [data, setData] = useState<GraphData>({} as GraphData);
  const [showSpinner, setShowSpinner] = useState(false);

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
    settings.set('temperature', createGraphTypeSetting('Temperature', 'rgba(0,0,139,1)'));
    settings.set('salinity', createGraphTypeSetting('Salinity', 'rgba(139,0,00,1)'));
    settings.set('ph', createGraphTypeSetting('pH', 'rgba(0,100,0,1)'));
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
          autoSkip: true,
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
    const holdingTankId = appContext.holdingTank?.holdingTankId;
    if (!holdingTankId) {
      browserHistory.push('/holding-tanks')
    } else {
      const getHoldingTankMeasurements = async () => {
        try {
          setShowSpinner(true);
          const holdingTankMeasurements = await HoldingTankMeasurementService.getHoldingTankMeasurements(holdingTankId);
          setCurrentHoldingTankMeasurements(holdingTankMeasurements);
        }
        catch (err) {
          console.log(err);
          ToastService.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getHoldingTankMeasurements();
    }
  });

  useEffect(() => {
    if (!currentGraphTypes || !currentHoldingTankMeasurements || currentHoldingTankMeasurements.length === 0) return;

    const buildNewDatasets = () => {
      const newDatasets = new Array<GraphDataset>();
      currentGraphTypes.forEach((isChecked: boolean, graphType: string) => {
        if (isChecked) {
          const newData = currentHoldingTankMeasurements.map(x => x[graphType] as number === 0 ? null : x[graphType] as number);
          const newDataset = Object.assign({}, graphTypeSettings?.get(graphType)?.dataset, { data: newData });
          newDatasets.push(newDataset);
        }
      });
      return newDatasets;
    }

    const newLabels = currentHoldingTankMeasurements.map(x => x.dateMeasured ? moment(x.dateMeasured).format('YYYY-MM-DD') : '');
    setData(data => Object.assign({}, data, { labels: newLabels }, { datasets: buildNewDatasets() }));
  }, [currentHoldingTankMeasurements, currentGraphTypes, graphTypeSettings]);

  return (
    <Box id='holdingTankGraphs'>
      <Spinner isActive={showSpinner} />

      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenMobile}>
        <Link to='/'>Home</Link>
        <Link to='/holding-tanks'>Holding Tanks</Link>
        <Typography color='textPrimary'>Water Graphs</Typography>
      </Breadcrumbs>
      <Breadcrumbs aria-label='breadcrumb' className={classes.hiddenWhenNotMobile}>
        <Link to='/holding-tanks'>&#10094; Holding Tanks</Link>
      </Breadcrumbs>

      <Grid container justify='center'>
        <Grid item xs={12} md={8}>
          <Typography variant='h1' align='center' gutterBottom={true}>Water Graphs for {appContext.holdingTank?.holdingTankName}</Typography>

          <Box>
            <Line data={data} options={options} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HoldingTankGraphs;
