import React from 'react';
import ReactDOM from 'react-dom';
import MediaRow from './MediaRow';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

import { fetchMediaSourcesData, updateSourceTreeData, fetchDirectoryContentsData } from '../model/dummy';

const actions = require('../model/actions'),
store = require('../model/store');

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
  const tbody = document.createElement('tbody');

  const state = store.getState();
  const props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    },
    onFocus:function(){}
  });

  ReactDOM.render(<MediaRow {...props} />, tbody);
});


it('renders a snapshot', () => {
  const state = store.getState();
  const props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    },
    onFocus:function(){}
  });

  const mediaRow = renderer.create(<MediaRow {...props} />).toJSON();
  expect(mediaRow).toMatchSnapshot();
});
