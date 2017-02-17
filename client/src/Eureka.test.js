import React from 'react';
import ReactDOM from 'react-dom';
import Eureka from './Eureka';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Eureka />, div);
});
