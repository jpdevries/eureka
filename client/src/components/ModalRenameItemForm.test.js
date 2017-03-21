import React from 'react';
import ReactDOM from 'react-dom';
import ModalRenameItemForm from './ModalRenameItemForm';

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
  const div = document.createElement('div'),
  state = store.getState(),
  props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    }
  });

  ReactDOM.render(<ModalRenameItemForm {...props} />, div);
});
