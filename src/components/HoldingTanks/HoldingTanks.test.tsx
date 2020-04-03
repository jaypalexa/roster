import { queryByAttribute, render } from '@testing-library/react';
import React from 'react';
import HoldingTanks from './HoldingTanks';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HoldingTanks />);
  const theComponent = getById(dom.container, 'holding-tanks');
  expect(theComponent).toBeInTheDocument();
});
