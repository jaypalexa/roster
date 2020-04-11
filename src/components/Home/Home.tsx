import MenuTile from '../MenuTile/MenuTile';
import React, { useEffect } from 'react';
import './Home.sass';

const Home: React.FC = () => {

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  return (
    <div id='home' className='home-component'>
      <div className='columns'>
        <div className='column has-text-centered'>
          <div className='tile is-ancestor'>
            <div className='tile is-parent is-vertical is-6'>
              <MenuTile color='darkgreen' title='Sea Turtles' linkTo='/sea-turtles' />
              <MenuTile color='darkmagenta' title='Holding Tanks' linkTo='/holding-tanks' />
            </div>
            <div className='tile is-parent is-vertical is-6'>
              <MenuTile color='darkblue' title='Hatchling and Washback Events' linkTo='/hatchling-and-washback-events' />
              <MenuTile color='darkred' title='Reports' linkTo='/reports' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
