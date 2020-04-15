import React, { useEffect } from 'react';
import MenuTile from '../MenuTile/MenuTile';
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
            <div className='tile is-vertical is-6'>
              <div className='tile'>
                <div className='tile is-parent is-6'>
                  <MenuTile color='hsl(245, 100%, 25%)' title='Hatchling Events' linkTo='/hatchling-events' />
                </div>
                <div className='tile is-parent is-6'>
                  <MenuTile color='hsl(245, 100%, 40%)' title='Washback Events' linkTo='/washback-events' />
                </div>
              </div>
              <div className='tile is-parent'>
                <MenuTile color='darkred' title='Reports' linkTo='/reports' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
