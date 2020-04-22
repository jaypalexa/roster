import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import browserHistory from '../../browserHistory';
import { useAppContext } from '../../contexts/AppContext';
import SeaTurtleMorphometricService from '../../services/SeaTurtleMorphometricService';
import SeaTurtleMorphometricModel from '../../types/SeaTurtleMorphometricModel';
import './SeaTurtleMorphometricsGraphs.sass';

/* eslint-disable jsx-a11y/anchor-is-valid */

const SeaTurtleMorphometricsGraphs: React.FC = () => {

  // eslint-disable-next-line
  const [appContext, setAppContext] = useAppContext();
  const [graphTypeSettings, setGraphTypeSettings] = useState<Map<string, GraphTypeSettings>>();
  const [currentGraphTypes, setCurrentGraphTypes] = useState<Map<string, boolean>>();
  const [currentSeaTurtleMorphometrics, setCurrentSeaTurtleMorphometrics] = useState([] as Array<SeaTurtleMorphometricModel>);
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
      graphTypes.set(key, false);
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
    }
  }

  useMount(() => {
    // make async server request
    if (!appContext.seaTurtle?.turtleId) {
      browserHistory.push('/sea-turtles')
    } else {
      const getSeaTurtleMorphometricsForTurtle = async () => {
        const seaTurtleMeasurements = await SeaTurtleMorphometricService.getSeaTurtleMorphometricsForTurtle(appContext.seaTurtle?.turtleId);
        setCurrentSeaTurtleMorphometrics(seaTurtleMeasurements);
      };
      getSeaTurtleMorphometricsForTurtle();
    }
  });

  useEffect(() => {
    if (!currentGraphTypes || !currentSeaTurtleMorphometrics || currentSeaTurtleMorphometrics.length === 0) return;

    const buildNewDatasets = () => {
      const newDatasets = new Array<GraphDataset>();
      currentGraphTypes.forEach((isChecked: boolean, graphType: string) => {
        if (isChecked === true) {
          const newData = currentSeaTurtleMorphometrics.map(x => x[graphType] as number);
          const newDataset = Object.assign({}, graphTypeSettings?.get(graphType)?.dataset, { data: newData });
          newDatasets.push(newDataset);
        }
      });
      return newDatasets;
    }

    const newLabels = currentSeaTurtleMorphometrics.map(x => x.dateMeasured ? moment(x.dateMeasured).format('YYYY-MM-DD') : '');
    setData(data => Object.assign({}, data, { labels: newLabels }, { datasets: buildNewDatasets() }));
  }, [currentSeaTurtleMorphometrics, currentGraphTypes, graphTypeSettings]);

  const onGraphTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const graphTypes = new Map<string, boolean>(currentGraphTypes || new Map<string, boolean>());
    graphTypes.set(event.target.value, event.target.checked);
    setCurrentGraphTypes(graphTypes);
  }

  return (
    <div id='seaTurtleMorphometricsGraphs'>
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/sea-turtles'>Sea Turtles</Link></li>
          <li className='is-active'><a href='#' aria-current='page'>Morphometrics Graphs</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/sea-turtles'>&#10094; Sea Turtles</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>Morphometrics Graphs for {appContext.seaTurtle?.turtleName}</h1>

          <div className='field has-text-centered'>
            <input className='is-checkradio is-black' id='sclNotchNotchValue' type='checkbox' name='sclNotchNotchValue' value='sclNotchNotchValue' onChange={onGraphTypeChange} />
            <label htmlFor='sclNotchNotchValue'>SCL notch-notch</label>
            <input className='is-checkradio is-black' id='sclNotchTipValue' type='checkbox' name='sclNotchTipValue' value='sclNotchTipValue' onChange={onGraphTypeChange} />
            <label htmlFor='sclNotchTipValue'>SCL notch-tip</label>
            <input className='is-checkradio is-black' id='sclTipTipValue' type='checkbox' name='sclTipTipValue' value='sclTipTipValue' onChange={onGraphTypeChange} />
            <label htmlFor='sclTipTipValue'>SCL tip-tip</label>
            <input className='is-checkradio is-black' id='scwValue' type='checkbox' name='scwValue' value='scwValue' onChange={onGraphTypeChange} />
            <label htmlFor='scwValue'>SCW</label>
          </div>
          <div className='field has-text-centered'>
            <input className='is-checkradio is-black' id='cclNotchNotchValue' type='checkbox' name='cclNotchNotchValue' value='cclNotchNotchValue' onChange={onGraphTypeChange} />
            <label htmlFor='cclNotchNotchValue'>CCL notch-notch</label>
            <input className='is-checkradio is-black' id='cclNotchTipValue' type='checkbox' name='cclNotchTipValue' value='cclNotchTipValue' onChange={onGraphTypeChange} />
            <label htmlFor='cclNotchTipValue'>CCL notch-tip</label>
            <input className='is-checkradio is-black' id='cclTipTipValue' type='checkbox' name='cclTipTipValue' value='cclTipTipValue' onChange={onGraphTypeChange} />
            <label htmlFor='cclTipTipValue'>CCL tip-tip</label>
            <input className='is-checkradio is-black' id='ccwValue' type='checkbox' name='ccwValue' value='ccwValue' onChange={onGraphTypeChange} />
            <label htmlFor='ccwValue'>CCW</label>
          </div>
          <div className='field has-text-centered'>
            <input className='is-checkradio is-black' id='weightValue' type='checkbox' name='weightValue' value='weightValue' onChange={onGraphTypeChange} />
            <label htmlFor='weightValue'>Weight</label>
          </div>

          <div className='three-quarters'>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeaTurtleMorphometricsGraphs;
