import React from 'react';
import ReactDOM from 'react-dom';
import MediaSourceSelector from './MediaSourceSelector';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

import renderer from 'react-test-renderer';

const actions = require('../model/actions'),
store = require('../model/store');

function getMediaSourceSelectorController() {
  return connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    }
  })(MediaSourceSelector);
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  const MediaSourceSelectorController = getMediaSourceSelectorController();

  ReactDOM.render((
    <Provider store={store}>
        <MediaSourceSelectorController />
    </Provider>
  ), div);
});



it('renders a snapshot', () => {
  const MediaSourceSelectorController = getMediaSourceSelectorController();
  const mediaSource = renderer.create(
    <Provider store={store}>
        <MediaSourceSelectorController />
    </Provider>
  ).toJSON();

  expect(mediaSource).toMatchSnapshot();
});
