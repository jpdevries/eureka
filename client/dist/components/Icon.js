'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Icon = function Icon(props) {
  return _react2.default.createElement(
    'svg',
    { 'aria-hidden': props.ariaHidden === undefined ? true : props.ariaHidden, className: 'icon icon-' + props.icon },
    _react2.default.createElement('use', { xlinkHref: 'assets/img/icons.svg#icon-' + props.icon })
  );
};

exports.default = Icon;