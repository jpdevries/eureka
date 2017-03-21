'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SearchBar = require('./SearchBar');

var _SearchBar2 = _interopRequireDefault(_SearchBar);

var _redux = require('redux');

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

it('renders without crashing', function () {
  var div = document.createElement('div');

  var SearchBarController = (0, _reactRedux.connect)(function (state, props) {
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
  })(_SearchBar2.default);

  _reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(SearchBarController, null)
  ), div);
});

var filter = new Date().getTime().toString();
store.dispatch(actions.updateView({
  filter: filter
}));

it('the search bar input should reflect the value of view.filter', function () {
  var div = document.createElement('div');
  var SearchBarController = (0, _reactRedux.connect)(function (state, props) {
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
  })(_SearchBar2.default);

  _reactDom2.default.render(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(SearchBarController, null)
  ), div);

  if (div.querySelector('input').value !== filter) {
    var err = 'the search bar input should reflect the value of view.filter expecing ' + filter;
    console.log(err);
    throw new Error(err);
  }
});