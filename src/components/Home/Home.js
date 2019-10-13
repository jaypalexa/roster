import React from 'react';
import { Link } from '@reach/router';
import './Home.sass';

export default props => (
  <div className='columns is-centered'>
    <div className='column is-four-fifths has-text-centered'>
      <div className='tile is-ancestor'>
        <div className='tile is-6 is-parent is-vertical'>
          <article className='tile is-child notification is-primary'>
            <p className='title'>Sea Turtles</p>
            <Link to='/sea-turtles'>Sea Turtles</Link>
          </article>
          <article className='tile is-child notification is-warning'>
            <p className='title'>Hatchling Events</p>
            <Link to='/sea-turtles'>Hatchling Events</Link>
          </article>
        </div>
        <div className='tile is-6 is-parent is-vertical'>
          <article className='tile is-child notification is-danger'>
            <p className='title'>Holding Tanks</p>
            <Link to='/sea-turtles'>Holding Tanks</Link>
          </article>
          <article className='tile is-child notification'>
            <p className='title'>Organization</p>
            <Link to='/sea-turtles'>Organization</Link>
          </article>
        </div>
      </div>
      {props.children}
    </div>
  </div>
);
