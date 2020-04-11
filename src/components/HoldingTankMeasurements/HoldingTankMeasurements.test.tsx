import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import HoldingTankMeasurements from './HoldingTankMeasurements';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HoldingTankMeasurements />);
  const theComponent = getById(dom.container, 'holding-tank-measurements');
  expect(theComponent).toBeInTheDocument();
});
