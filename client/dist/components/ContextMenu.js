'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _ContextButtons = require('./ContextButtons');

var _ContextButtons2 = _interopRequireDefault(_ContextButtons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContextMenu = function ContextMenu(props) {
  var item = props.item;
  return _react2.default.createElement(
    'td',
    { className: props.className, hidden: props.hidden === undefined ? true : props.hidden },
    _react2.default.createElement(_ContextButtons2.default, _extends({ onBlur: props.onBlur, onFirstFocus: props.onFirstFocus }, props))
  );
};

exports.default = ContextMenu;