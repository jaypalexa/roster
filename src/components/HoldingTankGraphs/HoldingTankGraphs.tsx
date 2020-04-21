import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import HoldingTankMeasurementService from '../../services/HoldingTankMeasurementService';
import HoldingTankMeasurementModel from '../../types/HoldingTankMeasurementModel';
import './HoldingTankGraphs.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HoldingTankGraphs: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [graphTypeSettings, setGraphTypeSettings] = useState<Map<string, GraphTypeSettings>>();
  const [currentGraphType, setCurrentGraphType] = useState<string>();
  const [currentHoldingTankMeasurements, setCurrentHoldingTankMeasurements] = useState([] as Array<HoldingTankMeasurementModel>);
  const [data, setData] = useState<GraphData>({} as GraphData);

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
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    }

    const defaultGraphData: GraphData = {
      labels: [],
      datasets: [defaultGraphDataset]
    }

    const darkBlue = '0,0,139';

    const temperatureGraphDataset = {
      label: 'Temperature',
      backgroundColor: `rgba(${darkBlue},0.4)`,
      borderColor: `rgba(${darkBlue},1)`,
      pointBorderColor: `rgba(${darkBlue},1)`,
      pointHoverBackgroundColor: `rgba(${darkBlue},1)`,
    }

    const darkRed = '139,0,0';

    const salinityGraphDataset = {
      label: 'Salinity',
      backgroundColor: `rgba(${darkRed},0.4)`,
      borderColor: `rgba(${darkRed},1)`,
      pointBorderColor: `rgba(${darkRed},1)`,
      pointHoverBackgroundColor: `rgba(${darkRed},1)`,
    }

    const darkGreen = '0,100,0';

    const phGraphDataset = {
      label: 'pH',
      backgroundColor: `rgba(${darkGreen},0.4)`,
      borderColor: `rgba(${darkGreen},1)`,
      pointBorderColor: `rgba(${darkGreen},1)`,
      pointHoverBackgroundColor: `rgba(${darkGreen},1)`,
    }

    setData(defaultGraphData);

    const settings = new Map<string, GraphTypeSettings>();
    settings.set('temperature', { displayName: 'Temperature', dataset: Object.assign({} ,defaultGraphDataset, temperatureGraphDataset) });
    settings.set('salinity', { displayName: 'Salinity', dataset: Object.assign({} ,defaultGraphDataset, salinityGraphDataset) });
    settings.set('ph', { displayName: 'pH', dataset: Object.assign({} ,defaultGraphDataset, phGraphDataset)  });
    setGraphTypeSettings(settings);

    setCurrentGraphType('temperature');
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
          labelString: 'Value',
          fontSize: 20
        },
        ticks: {
          autoSkip: true
        }
      }]
    }
  }

  useMount(() => {
    // make async server request
    if (!appContext.holdingTank?.tankId) {
      browserHistory.push('/holding-tanks')
    } else {
      const getHoldingTankMeasurementsForTank = async () => {
        const holdingTankMeasurements = await HoldingTankMeasurementService.getHoldingTankMeasurementsForTank(appContext.holdingTank?.tankId);
        setCurrentHoldingTankMeasurements(holdingTankMeasurements);
      };
      getHoldingTankMeasurementsForTank();
    }
  });

  useEffect(() => {
    if (!currentGraphType || !currentHoldingTankMeasurements || currentHoldingTankMeasurements.length === 0) return;

    const buildNewDatasets = (currentDataset: GraphDataset, newData: number[]) => {
      const datasets = new Array<GraphDataset>();
      const newDataset = Object.assign({}, graphTypeSettings?.get(currentGraphType)?.dataset, { data: newData });
      datasets.push(Object.assign({}, currentDataset, newDataset))
      return datasets;
    }

    const newLabels = currentHoldingTankMeasurements.map(x => x.dateMeasured ? moment(x.dateMeasured).format('YYYY-MM-DD') : '');
    const newData = currentHoldingTankMeasurements.map(x => x[currentGraphType] as number);
    setData(data => Object.assign({}, data, { labels: newLabels }, { datasets: buildNewDatasets(data?.datasets[0], newData) }));
  }, [currentHoldingTankMeasurements, currentGraphType, graphTypeSettings]);

  const onGraphTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentGraphType(event.target.value);
  }

  return (
    <div id='holdingTankGraph'>
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/holding-tanks'>Holding Tanks</Link></li>
          <li className='is-active'><a href='#' aria-current='page'>Water Graphs</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/holding-tanks'>&#10094; Holding Tanks</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Graphs for {appContext.holdingTank?.tankName}</h1>

          <div className='field has-text-centered'>
            <input className='is-checkradio is-medium' id='temperature' type='radio' name='graphTypeGroup' value='temperature' checked={currentGraphType === 'temperature'} onChange={onGraphTypeChange} />
            <label htmlFor="temperature">Temperature</label>
            <input className='is-checkradio is-medium' id='salinity' type='radio' name='graphTypeGroup' value='salinity' checked={currentGraphType === 'salinity'} onChange={onGraphTypeChange} />
            <label htmlFor="salinity">Salinity</label>
            <input className='is-checkradio is-medium' id='ph' type='radio' name='graphTypeGroup' value='ph' checked={currentGraphType === 'ph'} onChange={onGraphTypeChange} />
            <label htmlFor="ph">pH</label>
          </div>

          <div className='three-quarters'>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingTankGraphs;
