'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChooseBar = function ChooseBar(props) {
  //console.log('ChooseBar',props);
  return _react2.default.createElement(
    'div',
    { 'aria-hidden': props.ariaHidden, className: 'eureka__button-bar eureka__choose-bar' },
    _react2.default.createElement(
      'button',
      { 'aria-label': 'Close Media Browser' },
      'Cancel'
    ),
    _react2.default.createElement(
      'button',
      { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'choose-button', className: 'eureka__primary', disabled: !props.view.focusedMediaItem && !_utility2.default.serverSideRendering },
      'Choose ',
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden' },
        ' ',
        function () {
          try {
            return props.view.focusedMediaItem.filename || ' an image';
          } catch (e) {
            return ' media item';
          }
        }()
      )
    )
  );
};

exports.default = ChooseBar;