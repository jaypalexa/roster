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
  const [graphTypeOptions, setGraphTypeOptions] = useState<any>();
  const [currentGraphType, setCurrentGraphType] = useState<string>();
  const [currentHoldingTankMeasurements, setCurrentHoldingTankMeasurements] = useState([] as Array<HoldingTankMeasurementModel>);
  const [data, setData] = useState<ChartData>({} as ChartData);

  interface ChartDataset {
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

  interface ChartData {
    labels: Array<string>;
    datasets: Array<ChartDataset>;
  }

  useMount(() => {
    setGraphTypeOptions({
      temperature: {
        displayName: 'Temperature',
      },
      salinity: {
        displayName: 'Salinity',
      },
      ph: {
        displayName: 'pH',
      },
    });
    setData({
      //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'My First dataset',
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
          //data: [65, 59, 80, 81, 56, 55, 40]
          data: [65, 59, 80, 81]
        }
      ]
    });
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
    console.log('Graph type selection changed to ' + currentGraphType);
    const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

    const labels = currentHoldingTankMeasurements.map(x => x.dateMeasured ? moment(x.dateMeasured).format('YYYY-MM-DD') : '');
    const values = currentHoldingTankMeasurements.map(x => x[currentGraphType] as number);
    const datasets = new Array<ChartDataset>();
    const buildDatasets = (datasets: Array<ChartDataset>, currentDataset: ChartDataset, values: number[]) => {
      datasets.push(Object.assign({}, currentDataset, { label: getKeyValue(currentGraphType)(graphTypeOptions).displayName, data: values }) )
      return datasets;
    }

    console.log('labels', labels);
    console.log('values', values);
    setData(data => Object.assign({}, data, { labels: labels }, { datasets: buildDatasets(datasets, data?.datasets[0], values)  }));
  }, [currentHoldingTankMeasurements, currentGraphType, graphTypeOptions]);

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

          <label>
            <input
              type='radio'
              value='temperature'
              name='graphTypeGroup'
              checked={currentGraphType === 'temperature'}
              onChange={onGraphTypeChange}
            />
            Temperature
          </label>

          <label>
            <input
              type='radio'
              value='salinity'
              name='graphTypeGroup'
              checked={currentGraphType === 'salinity'}
              onChange={onGraphTypeChange}
            />
            Salinity
          </label>

          <label>
            <input
              type='radio'
              value='ph'
              name='graphTypeGroup'
              checked={currentGraphType === 'ph'}
              onChange={onGraphTypeChange}
            />
            pH
          </label>

          <div className='three-quarters'>
            <Line data={data} options={options} redraw={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingTankGraphs;
