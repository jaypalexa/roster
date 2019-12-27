import HoldingTanks from './HoldingTanks';
import React from 'react';
import { queryByAttribute, render } from '@testing-library/react';

test('renders component', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<HoldingTanks />);
  const theComponent = getById(dom.container, 'holding-tanks');
  expect(theComponent).toBeInTheDocument();
});
