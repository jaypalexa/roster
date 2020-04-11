import HatchlingEvents from './HatchlingAndWashbackEvents';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HatchlingEvents />);
  const theComponent = getById(dom.container, 'hatchling-and-washback-events');
  expect(theComponent).toBeInTheDocument();
});
