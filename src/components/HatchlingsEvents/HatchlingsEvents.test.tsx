import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import HatchlingsEvents from './HatchlingsEvents';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HatchlingsEvents />);
  const theComponent = getById(dom.container, 'hatchlings-events');
  expect(theComponent).toBeInTheDocument();
});
