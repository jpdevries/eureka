'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _MediaDirectorySelector = require('./MediaDirectorySelector');

var _MediaDirectorySelector2 = _interopRequireDefault(_MediaDirectorySelector);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _dummy = require('../model/dummy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

store.dispatch(actions.fetchMediaSourcesSuccess(_dummy.fetchMediaSourcesData));

store.dispatch(actions.updateSourceTreeSuccess(_dummy.updateSourceTreeData));

store.dispatch(actions.fetchDirectoryContentsSuccess(_dummy.fetchDirectoryContentsData));

it('renders without crashing', function () {
  var div = document.createElement('div');

  var state = store.getState();
  var props = Object.assign({}, state, {});

  _reactDom2.default.render(_react2.default.createElement(_MediaDirectorySelector2.default, props), div);
});