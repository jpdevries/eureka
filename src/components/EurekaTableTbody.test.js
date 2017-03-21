import React from 'react';
import ReactDOM from 'react-dom';
import EurekaTable from './EurekaTable';

import { createStore } from 'redux';

import { connect } from 'react-redux';
import { Provider } from 'react-redux';

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

function getEurekaTableControllerProvider() {
  const EurekaTableController = connect(function(state, props) { // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    }
  })(EurekaTable);

  return (
    <Provider store={store}>
        <EurekaTableController />
    </Provider>
  );
}

it('renders without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(getEurekaTableControllerProvider(), div);
});
