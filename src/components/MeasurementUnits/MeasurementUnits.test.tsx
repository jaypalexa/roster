import MeasurementUnits from './MeasurementUnits';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<MeasurementUnits />);
  const theComponent = getById(dom.container, 'measurement-units');
  expect(theComponent).toBeInTheDocument();
});
