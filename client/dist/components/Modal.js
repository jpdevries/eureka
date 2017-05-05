'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modal = function Modal(props) {
  var spinner = props.showSpinner ? _react2.default.createElement(
    'span',
    { className: 'spinner' },
    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'circle-o-notch' })),
    '\u2003'
  ) : undefined;
  return _react2.default.createElement(
    'div',
    { className: 'eureka__modal ' + props.className, role: 'dialog' },
    _react2.default.createElement(
      'div',
      { className: 'eureka__modal-panel' },
      _react2.default.createElement(
        'h2',
        null,
        spinner,
        props.title
      ),
      _react2.default.cloneElement(_react2.default.Children.only(props.children), props)
    ),
    _react2.default.createElement(
      'div',
      { role: 'button', tabIndex: '0',
        'aria-pressed': 'false', className: 'eureka__modal-scrim', onClick: props.onCancel },
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden test' },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'modal.closeWindow', defaultMessage: 'Close {title} Modal Window', values: {
            title: props.title
          } })
      )
    )
  );
};

exports.default = Modal;