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

it('should list the current media items of the current directory of the current media source', () => {
  const div = document.createElement('div');

  ReactDOM.render(getEurekaTableControllerProvider(), div);

  const state = store.getState();
  state.content.contents.map((item) => {
    const mediaId = `${state.config.storagePrefix}__media__${utility.cssSafe(item.filename)}`;
    if(!div.querySelector(`#${mediaId}`)) {
      const error = `should list the current media items of the current directory of the current media source, expecting ${mediaId} for ${item.filename}`;
      throw new Error(error);
    }
  })
});

/*
it('should list the current media items of the current directory of the current media source in the order specified by view.sort', () => {
  const div = document.createElement('div');

  const sort = store.getState().view.sort; // the current sort

  const sorts = ['dimensions','editedOn','filename'];
  // change the sort
  store.dispatch(actions.updateView({
    sort: sorts[Math.floor(Math.random() * sorts.length)]
  }));

  // hit the DOM
  ReactDOM.render(getEurekaTableControllerProvider(), div);

  // get the state after our random sort
  const state = store.getState(),
  // loop through the <tr>s
  trs = div.querySelectorAll('tbody > tr');
  for(let i = 0; i < trs.length; i++) {
    const tr = trs[i],
    id = tr.getAttribute('id');

    // the order in our DOM should match the order in our state
    if(utility.cssSafe(state.content.contents[i].filename) !== id) {
      const err = `should list the current media items of the current directory of the current media source in the order specified by view.sort`;
      throw new Error(err);
    }
  }

  store.dispatch(actions.updateView({
    sort: sort // put it back to the current sort
  }));
});
*/
