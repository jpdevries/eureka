import React from 'react';
import ReactDOM from 'react-dom';
import DropArea from './DropArea';

import {cssSafe} from '../utility/utility';

const actions = require('../model/actions'),
store = require('../model/store');

store.dispatch(actions.updateConfig({
  allowUploads: false
}));

it('renders without crashing', () => {
  const div = document.createElement('div'),
  item = {
    filename: 'sky.jpg'
  };

  ReactDOM.render(<DropArea config={{
    storagePrefix:'eureka__'
  }} view={{
    sourceTreeOpen: true
  }} content={{
    cd: './'
  }} />, div);

});
