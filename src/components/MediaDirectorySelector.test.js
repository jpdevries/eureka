import React from 'react';
import ReactDOM from 'react-dom';
import MediaDirectorySelector from './MediaDirectorySelector';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

const actions = require('../model/actions'),
store = require('../model/store');

import utility from '../utility/utility';

import { fetchMediaSourcesData, updateSourceTreeData, fetchDirectoryContentsData } from '../model/dummy';

store.dispatch(actions.fetchMediaSourcesSuccess(
  fetchMediaSourcesData
));

store.dispatch(actions.updateSourceTreeSuccess(
  updateSourceTreeData
));

store.dispatch(actions.fetchDirectoryContentsSuccess(
  fetchDirectoryContentsData
));

it('renders without crashing', () => {
  const div = document.createElement('div');

  const state = store.getState();
  const props = Object.assign({}, state, {
  });

  ReactDOM.render(<MediaDirectorySelector {...props} />, div);
});
