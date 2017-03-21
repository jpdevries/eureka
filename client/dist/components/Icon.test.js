'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var div = document.createElement('div');
  _reactDom2.default.render(_react2.default.createElement(_Icon2.default, { icon: 'kaas' }), div);
});

it('renders a snapshot', function () {
  var icon = _reactTestRenderer2.default.create(_react2.default.createElement(_Icon2.default, null)).toJSON();
  expect(icon).toMatchSnapshot();
});