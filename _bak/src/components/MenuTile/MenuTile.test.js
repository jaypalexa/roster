import React from 'react';
import ReactDOM from 'react-dom';
import MenuTile from './MenuTile';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MenuTile title='TEST' linkTo='/' />, div);
  ReactDOM.unmountComponentAtNode(div);
});
