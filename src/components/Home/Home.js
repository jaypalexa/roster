import React from 'react';
import Columns from 'react-bulma-components/lib/components/columns';
import Tile from 'react-bulma-components/lib/components/tile';
import MenuTile from '../MenuTile/MenuTile';
import './Home.sass';

export default props => (
  <Columns className='is-centered'>
    <Columns.Column className='is-four-fifths has-text-centered'>
      <Tile kind='ancestor'>
        <Tile size={6} vertical kind='parent'>
          <MenuTile color='primary' title='Sea Turtles' linkTo='/sea-turtles' />
          <MenuTile color='warning' title='Hatchling Events' linkTo='/hatchling-events' />
        </Tile>
        <Tile size={6} vertical kind='parent'>
          <MenuTile color='danger' title='Holding Tanks' linkTo='/holding-tanks' />
          <MenuTile title='Reports' linkTo='/reports' />
        </Tile>
      </Tile>
    </Columns.Column>
  </Columns>
);
