import browserHistory from 'browserHistory';
import Spinner from 'components/Spinner/Spinner';
import { useAppContext } from 'contexts/AppContext';
import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import HoldingTankMeasurementService from 'services/HoldingTankMeasurementService';
import HoldingTankMeasurementModel from 'types/HoldingTankMeasurementModel';
import { constants } from 'utils';
import './HoldingTankGraphs.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const HoldingTankGraphs: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [graphTypeSettings, setGraphTypeSettings] = useState<Map<string, GraphTypeSettings>>();
  const [currentGraphType, setCurrentGraphType] = useState<string>();
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
          labelString: 'Measurement',
          fontSize: 20
        },
        ticks: {
          autoSkip: true
        }
      }]
    }
  }

  useMount(() => {
    const holdingTankId = appContext.holdingTank?.holdingTankId;
    if (!holdingTankId) {
      browserHistory.push('/holding-tanks')
    } else {
      const getHoldingTankMeasurementsForTank = async () => {
        try {
          setShowSpinner(true);
          const holdingTankMeasurements = await HoldingTankMeasurementService.getHoldingTankMeasurements(holdingTankId);
          setCurrentHoldingTankMeasurements(holdingTankMeasurements);
        }
        catch (err) {
          console.error(err);
          toast.error(constants.ERROR.GENERIC);
        }
        finally {
          setShowSpinner(false);
        }
      };
      getHoldingTankMeasurementsForTank();
    }
  });

  useEffect(() => {
    if (!currentGraphType || !currentHoldingTankMeasurements || currentHoldingTankMeasurements.length === 0) return;

    const buildNewDatasets = () => {
      const newDatasets = new Array<GraphDataset>();
      const newData = currentHoldingTankMeasurements.map(x => x[currentGraphType] as number);
      const newDataset = Object.assign({}, graphTypeSettings?.get(currentGraphType)?.dataset, { data: newData });
      newDatasets.push(Object.assign({}, newDataset))
      return newDatasets;
    }

    const newLabels = currentHoldingTankMeasurements.map(x => x.dateMeasured ? moment(x.dateMeasured).format('YYYY-MM-DD') : '');
    setData(data => Object.assign({}, data, { labels: newLabels }, { datasets: buildNewDatasets() }));
  }, [currentHoldingTankMeasurements, currentGraphType, graphTypeSettings]);

  const onGraphTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentGraphType(event.target.value);
  }

  return (
    <div id='holdingTankGraphs'>
      <Spinner isActive={showSpinner} />
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
          <h1 className='title has-text-centered'>Water Graphs for {appContext.holdingTank?.holdingTankName}</h1>

          <div className='field has-text-centered'>
            <input className='is-checkradio is-medium' id='temperature' type='radio' name='graphTypeGroup' value='temperature' checked={currentGraphType === 'temperature'} onChange={onGraphTypeChange} />
            <label htmlFor='temperature'>Temperature</label>
            <input className='is-checkradio is-medium' id='salinity' type='radio' name='graphTypeGroup' value='salinity' checked={currentGraphType === 'salinity'} onChange={onGraphTypeChange} />
            <label htmlFor='salinity'>Salinity</label>
            <input className='is-checkradio is-medium' id='ph' type='radio' name='graphTypeGroup' value='ph' checked={currentGraphType === 'ph'} onChange={onGraphTypeChange} />
            <label htmlFor='ph'>pH</label>
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
