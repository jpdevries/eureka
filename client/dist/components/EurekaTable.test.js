'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _EurekaTable = require('./EurekaTable');

var _EurekaTable2 = _interopRequireDefault(_EurekaTable);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _dummy = require('../model/dummy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

store.dispatch(actions.fetchMediaSourcesSuccess(_dummy.fetchMediaSourcesData));

store.dispatch(actions.updateSourceTreeSuccess(_dummy.updateSourceTreeData));

store.dispatch(actions.fetchDirectoryContentsSuccess(_dummy.fetchDirectoryContentsData));

function getEurekaTableControllerProvider() {
  var EurekaTableController = (0, _reactRedux.connect)(function (state, props) {
    // todo list
    return {
      content: state.content,
      view: state.view,
      tree: state.tree,
      source: state.source,
      directory: state.directory,
      fetched: state.fetched,
      config: state.config
    };
  })(_EurekaTable2.default);

  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(EurekaTableController, null)
  );
}

it('renders without crashing', function () {
  var div = document.createElement('div');

  _reactDom2.default.render(getEurekaTableControllerProvider(), div);
});

it('should list the current media items of the current directory of the current media source', function () {
  var div = document.createElement('div');

  _reactDom2.default.render(getEurekaTableControllerProvider(), div);

  var state = store.getState();
  state.content.contents.map(function (item) {
    var mediaId = state.config.storagePrefix + '__media__' + _utility2.default.cssSafe(item.filename);
    if (!div.querySelector('#' + mediaId)) {
      var error = 'should list the current media items of the current directory of the current media source, expecting ' + mediaId + ' for ' + item.filename;
      throw new Error(error);
    }
  });
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