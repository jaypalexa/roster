import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as serviceWorker from 'serviceWorker';
import './AboutRoster.sass';

const AboutRoster: React.FC = () => {
  const [isShowUpdateAvailable, setIsShowUpdateAvailable] = useState(false);
  const [lastUpdateCheckDateTime, setLastUpdateCheckDateTime] = useState<string | null>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newServiceWorker, setNewServiceWorker] = useState<ServiceWorker | null>(null);
  
  const onUpdateAvailableClick = () => {
    console.log('onUpdateAvailableClick::newServiceWorker = ', newServiceWorker);
    if (newServiceWorker) {
      newServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      if ('serviceWorker' in navigator) {
        console.log('onUpdateAvailableClick::\'serviceWorker\' in navigator...');
        navigator.serviceWorker.ready.then(registration => {
          console.log('onUpdateAvailableClick::registration.update().then()::registration = ', registration);
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('onUpdateAvailableClick::registration.update().then()::serviceWorker = ', serviceWorker);
          if (serviceWorker) {
            serviceWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        })
      } else {
        console.log('onUpdateAvailableClick::\'serviceWorker\' NOT in navigator...');
      }
    }
    setIsUpdateAvailable(false);
    window.location.reload(true);
  };

  const onCheckForUpdateClick = () => {
    setLastUpdateCheckDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));

    const isIosDevice = /iphone|ipod|ipad/i.test(navigator.userAgent);
    // const isChromeOnIosDevice = /CriOS/i.test(navigator.userAgent) && isIosDevice;

    if (isIosDevice) {
      alert(`You must close and re-open the app or browser tab to check for updates when running on an iOS device.\n\n:-(`);
    } else {
      checkForUpdate();
    }
  }

  const checkForUpdate = useCallback(() => {
    setLastUpdateCheckDateTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('checkForUpdate::navigator.serviceWorker.ready...');
        registration.update().then(() => {
          console.log('checkForUpdate::registration.update().then()::registration = ', registration);
          const serviceWorker = (registration.installing || registration.waiting);
          console.log('checkForUpdate::registration.update().then()::serviceWorker = ', serviceWorker);
          if (serviceWorker) {
            setNewServiceWorker(serviceWorker);
            setIsUpdateAvailable(true);
          }
        });
      })
    }
    else {
      console.log('checkForUpdate::\'serviceWorker\' NOT in navigator...');
    }
  }, []);
  
  /* register service worker onUpdate() */
  useMount(() => {
    const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      setNewServiceWorker(registration.installing || registration.waiting);
      setIsUpdateAvailable(true);
    }
    serviceWorker.register({ onUpdate: onServiceWorkerUpdate });

    return () => { serviceWorker.unregister() }
  });

  /* check for update */
  useMount(() => {
    checkForUpdate();
  });

  useEffect(() => {
    setIsShowUpdateAvailable(isUpdateAvailable);
  }, [isUpdateAvailable]);

  return (
    <div id='aboutRoster'>
      <nav className='breadcrumb shown-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>About ROSTER</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb shown-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>About ROSTER</h1>
          <div className='has-text-centered'>
            Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
            &nbsp;|&nbsp;
            <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
              GitHub
            </a>
            &nbsp;|&nbsp;v0.20200522.0900 
            {isShowUpdateAvailable ? <p><span>(</span><span className='span-link' onClick={onUpdateAvailableClick}>update available</span><span>)</span></p> : null}
            {!isShowUpdateAvailable ? <p><span>(</span><span className='span-link' onClick={onCheckForUpdateClick}>check for update</span>{lastUpdateCheckDateTime ? <span> - last checked: {lastUpdateCheckDateTime}</span> : null}<span>)</span></p> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutRoster;
