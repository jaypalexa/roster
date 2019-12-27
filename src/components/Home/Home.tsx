import MenuTile from '../MenuTile/MenuTile';
import React from 'react';
import { Columns, Tile } from 'react-bulma-components';
import './Home.sass';

const Home: React.FC = () => {
  return (
    <div id='home' className='home-component'>
      <Columns className='is-centered'>
        <Columns.Column className='is-four-fifths has-text-centered'>
          <Tile kind='ancestor'>
            <Tile size={6} vertical kind='parent'>
              <MenuTile color='primary' title='Sea Turtles' linkTo='/sea-turtles' />
              <MenuTile color='warning' title='Hatchling Events' linkTo='/hatchling-events' />
            </Tile>
            <Tile size={6} vertical kind='parent'>
              <MenuTile color='danger' title='Holding Tanks' linkTo='/holding-tanks' />
              <MenuTile color='light' title='Reports' linkTo='/reports' />
            </Tile>
          </Tile>
        </Columns.Column>
      </Columns>
    </div>
  );
};

export default Home;
