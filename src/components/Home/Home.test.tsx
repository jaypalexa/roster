import Home from './Home';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<Home />);
  const theComponent = getById(dom.container, 'home');
  expect(theComponent).toBeInTheDocument();
});
