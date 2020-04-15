import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import HatchlingEvents from './HatchlingEvents';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HatchlingEvents />);
  const theComponent = getById(dom.container, 'hatchling-events');
  expect(theComponent).toBeInTheDocument();
});
