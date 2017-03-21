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