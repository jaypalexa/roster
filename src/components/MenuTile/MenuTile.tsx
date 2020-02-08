import React from 'react';
import browserHistory from '../../browserHistory';
import './MenuTile.sass';

type MenuTileProps = {
  color: string;
  title: string;
  linkTo: string;
}

const MenuTile: React.FC<MenuTileProps> = ({color, title, linkTo}) => {
  return (
    <article className={'tile is-child notification ' + color}>
      <h1 className='title'>{title}</h1>
      <button className='button is-dark' onClick={() => browserHistory.push(linkTo)}>{title}</button>
    </article>
  );
};

export default MenuTile;
