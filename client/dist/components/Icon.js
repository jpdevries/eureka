'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Icon = function Icon(props) {
  var config = Object.assign({}, {
    assetsBasePath: './assets/',
    iconSVG: './img/icons.svg'
  }, props.config);
  return _react2.default.createElement(
    'svg',
    { 'aria-hidden': props.ariaHidden === undefined ? true : props.ariaHidden, className: 'icon icon-' + props.icon },
    _react2.default.createElement('use', { xlinkHref: _path2.default.join(config.assetsBasePath, config.iconSVG) + '#icon-' + props.icon })
  );
};

exports.default = Icon;