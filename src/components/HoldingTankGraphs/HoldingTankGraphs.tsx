import useMount from 'hooks/UseMount';
// import moment from 'moment';
import React, { useState } from 'react';
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
  const [currentHoldingTankGraph, setCurrentHoldingTankGraph] = useState({} as HoldingTankMeasurementModel);
  const [currentHoldingTankGraphs, setCurrentHoldingTankGraphs] = useState([] as Array<HoldingTankMeasurementModel>);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  useMount(() => {
    window.scrollTo(0, 0)
  });

  useMount(() => {
    // make async server request
    if (!appContext.holdingTank?.tankId) {
      browserHistory.push('/holding-tanks')
    } else {
      const getHoldingTankMeasurementsForTurtle = async () => {
        const holdingTankGraphs = await HoldingTankMeasurementService.getHoldingTankMeasurementsForTank(appContext.holdingTank?.tankId);
        setCurrentHoldingTankGraphs(holdingTankGraphs);
      };
      getHoldingTankMeasurementsForTurtle();
    }
  });

  const fetchHoldingTankGraph = (holdingTankGraphId: string) => {
    // make async server request
    const getHoldingTankMeasurement = async () => {
      const holdingTankGraph = await HoldingTankMeasurementService.getHoldingTankMeasurement(holdingTankGraphId);
      setCurrentHoldingTankGraph(holdingTankGraph);
    };
    getHoldingTankMeasurement();
  };

  const onEditHoldingTankGraphClick = (holdingTankGraphId: string, event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    fetchHoldingTankGraph(holdingTankGraphId);
  };

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

          <Line data={data} />

        </div>
      </div>
    </div>
  );
};

export default HoldingTankGraphs;
