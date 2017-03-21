'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ModalCreateDirectoryForm = require('./ModalCreateDirectoryForm');

var _ModalCreateDirectoryForm2 = _interopRequireDefault(_ModalCreateDirectoryForm);

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
  var div = document.createElement('div');

  var state = store.getState();
  var props = Object.assign({}, state, {
    item: state.content.contents[0],
    view: {
      focusedMediaItem: state.content.contents[0]
    }
  });

  _reactDom2.default.render(_react2.default.createElement(_ModalCreateDirectoryForm2.default, props), div);
});