import browserHistory from '../../browserHistory';
import React from 'react';
import { Button, Heading, Tile, TileProps } from 'react-bulma-components';
import './MenuTile.sass';

type MenuTileProps = {
  color: TileProps["color"],
  title: string,
  linkTo: string
}

const MenuTile: React.FC<MenuTileProps> = ({color, title, linkTo}) => {
  return (
    <Tile renderAs='article' kind='child' notification color={color}>
      <Heading>{title}</Heading>
      <Button color='dark' onClick={() => browserHistory.push(linkTo)}>{title}</Button>
    </Tile>
  );
};

export default MenuTile;
