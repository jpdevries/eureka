'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _MediaRow = require('./MediaRow');

var _MediaRow2 = _interopRequireDefault(_MediaRow);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _dummy = require('../model/dummy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

store.dispatch(actions.fetchMediaSourcesSuccess(_dummy.fetchMediaSourcesData));

store.dispatch(actions.updateSourceTreeSuccess(_dummy.updateSourceTreeData));

store.dispatch(actions.fetchDirectoryContentsSuccess(_dummy.fetchDirectoryContentsData));

it('renders without crashing', function () {
  var tbody = document.createElement('tbody');

  var state = store.getState();
  var props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    },
    onFocus: function onFocus() {}
  });

  _reactDom2.default.render(_react2.default.createElement(_MediaRow2.default, props), tbody);
});

it('renders a snapshot', function () {
  var state = store.getState();
  var props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    },
    onFocus: function onFocus() {}
  });

  var mediaRow = _reactTestRenderer2.default.create(_react2.default.createElement(_MediaRow2.default, props)).toJSON();
  expect(mediaRow).toMatchSnapshot();
});