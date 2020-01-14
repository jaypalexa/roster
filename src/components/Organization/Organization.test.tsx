import { queryByAttribute, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import Organization from './Organization';

test('renders component', () => {
  const history = createMemoryHistory();
  const getById = queryByAttribute.bind(null, 'id');
  const dom = render(<Router history={history}><Organization /></Router>)
  const theComponent = getById(dom.container, 'organization');
  expect(theComponent).toBeInTheDocument();
});
