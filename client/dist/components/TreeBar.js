'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeBar = function TreeBar(props) {
  var formatMessage = props.intl.formatMessage,
      uploadFileToMessage = formatMessage(_definedMessages2.default.uploadFileTo, {
    cd: props.content.cd
  }),
      uploadBtn = props.config.allowUploads ? _react2.default.createElement(
    'button',
    { title: uploadFileToMessage, onClick: function onClick(event) {
        try {
          event.target.parentNode.parentNode.querySelector('.eureka__drop-area-zone').click();
        } catch (e) {}
      } },
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      uploadFileToMessage
    ),
    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'upload' }))
  ) : undefined,
      createDirectoryInMessage = formatMessage(_definedMessages2.default.createNewDirectoryIn, {
    cd: props.content.cd
  });

  return _react2.default.createElement(
    'div',
    { className: 'eureka__tree-bar' },
    _react2.default.createElement(
      'button',
      { title: createDirectoryInMessage, onClick: props.onCreateDirectory },
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden' },
        createDirectoryInMessage
      ),
      _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'plus-square' }))
    ),
    uploadBtn
  );
};

exports.default = TreeBar;