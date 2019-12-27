import MenuTile from './MenuTile';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  // const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<MenuTile color="primary" title="TEST TITLE" linkTo="/" />);
  // const theComponent = getById(dom.container, 'menu-tile');
  // expect(theComponent).toBeInTheDocument();
});
