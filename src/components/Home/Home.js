import React from 'react';
import { Link } from '@reach/router';
import Columns from 'react-bulma-components/lib/components/columns';
import Tile from 'react-bulma-components/lib/components/tile';
import './Home.sass';

export default props => (
  <Columns className='is-centered'>
    <Columns.Column className='is-four-fifths has-text-centered'>
      <Tile kind='ancestor'>
        <Tile size='{6}' vertical kind='parent'>
          <Tile renderAs='article' kind='child' notification color='primary'>
            <p className='title'>Sea Turtles</p>
            <Link to='/sea-turtles'>Sea Turtles</Link>
          </Tile>
          <Tile renderAs='article' kind='child' notification color='warning'>
            <p className='title'>Hatchling Events</p>
            <Link to='/sea-turtles'>Hatchling Events</Link>
          </Tile>
        </Tile>
        <Tile size='{6}' vertical kind='parent'>
          <Tile renderAs='article' kind='child' notification color='danger'>
            <p className='title'>Holding Tanks</p>
            <Link to='/sea-turtles'>Holding Tanks</Link>
          </Tile>
          <Tile renderAs='article' kind='child' notification>
            <p className='title'>Organization</p>
            <Link to='/sea-turtles'>Organization</Link>
          </Tile>
        </Tile>
      </Tile>
      {props.children}
    </Columns.Column>
  </Columns>
);
