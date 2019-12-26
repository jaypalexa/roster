import React from 'react';
import { Link } from '@reach/router';
import Heading from 'react-bulma-components/lib/components/heading';
import Tile from 'react-bulma-components/lib/components/tile';
import './MenuTile.sass';

export default props => (
  <Tile renderAs='article' kind='child' notification color={props.color}>
    <Heading>{props.title}</Heading>
    <Link to={props.linkTo}>{props.title}</Link>
  </Tile>
);
