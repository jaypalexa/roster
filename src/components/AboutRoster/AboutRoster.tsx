import useMount from 'hooks/UseMount';
import moment from 'moment';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppService from 'services/AppService';
import MessageService from 'services/MessageService';
import './AboutRoster.sass';

const AboutRoster: React.FC = () => {

  const [lastUpdateCheckDateTime, setLastUpdateCheckDateTime] = useState<string | null>(moment().format('YYYY-MM-DD HH:mm:ss'));
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  
  const onInstallUpdateClick = () => {
    AppService.installUpdate();
  };

  const onCheckForUpdateClick = () => {
    AppService.checkForUpdate();
  }

  /* check for update */
  useMount(() => {
    AppService.checkForUpdate();
  });

  /* listen for 'is update available' notifications */
  useMount(() => {
    const subscription = MessageService.observeIsUpdateAvailableChanged().subscribe(message => {
      if (message) {
        setIsUpdateAvailable(message.isUpdateAvailable);
      }
    });
    return () => subscription.unsubscribe();
  });

  /* listen for 'last update check datetime' notifications */
  useMount(() => {
    const subscription = MessageService.observeLastUpdateCheckDateTimeChanged().subscribe(message => {
      if (message) {
        setLastUpdateCheckDateTime(message.lastUpdateCheckDateTime);
      }
    });
    return () => subscription.unsubscribe();
  });

  return (
    <div id='aboutRoster'>
      <nav className='breadcrumb hidden-when-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li className='is-active'><a href='/#' aria-current='page'>About ROSTER</a></li>
        </ul>
      </nav>
      <nav className='breadcrumb hidden-when-not-mobile' aria-label='breadcrumbs'>
        <ul>
          <li><Link to='/'>&#10094; Home</Link></li>
        </ul>
      </nav>
      <div className='columns is-centered'>
        <div className='column is-four-fifths'>
          <h1 className='title has-text-centered'>About ROSTER</h1>
          <div className='has-text-centered'>
            <p>v0.20200526.1325</p>
            {isUpdateAvailable
              ? <p>
                  <span>(</span>
                  <span className='span-link' onClick={onInstallUpdateClick}>install update</span>
                  <span>)</span>
                </p>
              : <p>
                  <span>(</span>
                  <span className='span-link' onClick={onCheckForUpdateClick}>check for update</span>
                  {lastUpdateCheckDateTime ? <span> - last checked: {lastUpdateCheckDateTime}</span> : null}
                  <span>)</span>
                </p>
            }
            <br />
            <p>
              Copyright &copy; 2006-2020 <a href='http://www.turtlegeek.com' target='_blank' rel='noopener noreferrer' title='TurtleGeek.com'>TurtleGeek.com</a>
              &nbsp;|&nbsp;
              <a href='https://github.com/jaypalexa/roster' target='_blank' rel='noopener noreferrer' title='GitHub'>
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutRoster;
