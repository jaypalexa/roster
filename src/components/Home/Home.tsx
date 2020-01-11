import React from 'react';
import MenuTile from '../MenuTile/MenuTile';
import './Home.sass';

const Home: React.FC = () => {
  return (
    <div id='home' className='home-component'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <div className='tile is-ancestor'>
            <div className='tile is-parent is-vertical is-6'>
              <MenuTile color='is-success' title='Sea Turtles' linkTo='/sea-turtles' />
              <MenuTile color='is-warning' title='Hatchling Events' linkTo='/hatchling-events' />
            </div>
            <div className='tile is-parent is-vertical is-6'>
              <MenuTile color='is-info' title='Holding Tanks' linkTo='/holding-tanks' />
              <MenuTile color='is-light' title='Reports' linkTo='/reports' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
