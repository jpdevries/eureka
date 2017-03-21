'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var div = document.createElement('div');

  _reactDom2.default.render(_react2.default.createElement(
    _Modal2.default,
    null,
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hello World'
      )
    )
  ), div);
});

it('renders a snapshot', function () {
  var modal = _reactTestRenderer2.default.create(_react2.default.createElement(
    _Modal2.default,
    null,
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'p',
        null,
        'Hello World'
      )
    )
  )).toJSON();
  expect(modal).toMatchSnapshot();
});