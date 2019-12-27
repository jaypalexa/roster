import React from 'react';
import SeaTurtles from './SeaTurtles';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<SeaTurtles />);
  const theComponent = getById(dom.container, 'sea-turtles');
  expect(theComponent).toBeInTheDocument();
});
