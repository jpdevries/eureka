'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _MediaSourceSelector = require('./MediaSourceSelector');

var _MediaSourceSelector2 = _interopRequireDefault(_MediaSourceSelector);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

function getMediaSourceSelectorController() {
  return (0, _reactRedux.connect)(function (state, props) {
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
  })(_MediaSourceSelector2.default);
}

it('renders without crashing', function () {
  var div = document.createElement('div');
  var MediaSourceSelectorController = getMediaSourceSelectorController();

  _reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(MediaSourceSelectorController, null)
  ), div);
});

it('renders a snapshot', function () {
  var MediaSourceSelectorController = getMediaSourceSelectorController();
  var mediaSource = _reactTestRenderer2.default.create(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(MediaSourceSelectorController, null)
  )).toJSON();

  expect(mediaSource).toMatchSnapshot();
});