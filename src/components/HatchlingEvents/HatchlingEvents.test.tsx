import HatchlingEvents from './HatchlingEvents';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HatchlingEvents />);
  const theComponent = getById(dom.container, 'hatchling-events');
  expect(theComponent).toBeInTheDocument();
});
