'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChooseBar = function ChooseBar(props) {
  //console.log('ChooseBar',props);


  var _props$intl = props.intl,
      formatMessage = _props$intl.formatMessage,
      formatPlural = _props$intl.formatPlural,
      closeMediaBrowserMessage = formatMessage(_definedMessages2.default.closeMediaBrowser),
      chooseMessage = formatMessage(_definedMessages2.default.choose),
      mediaItem = formatMessage(_definedMessages2.default.mediaItem),
      pluralItemPlaceholder = formatPlural(_definedMessages2.default.pluralItem),
      cancelMessage = formatMessage(_definedMessages2.default.cancel);


  return _react2.default.createElement(
    'div',
    { 'aria-hidden': props.ariaHidden, className: 'eureka__button-bar eureka__choose-bar' },
    _react2.default.createElement(
      'button',
      { 'aria-label': closeMediaBrowserMessage, onClick: function onClick(event) {
          //console.log('closing');
          try {
            props.config.callbacks.close();
          } catch (e) {
            //console.log(e);
          }
        } },
      cancelMessage
    ),
    _react2.default.createElement(
      'button',
      { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'choose-button', className: 'eureka__primary', disabled: !props.view.focusedMediaItem && !_utility2.default.serverSideRendering, onClick: function onClick(event) {
          if (!props.view.focusedMediaItem) return;
          try {
            props.config.callbacks.choose(props.view.focusedMediaItem);
          } catch (e) {
            //console.log(e);
          }
        } },
      chooseMessage,
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden' },
        ' ',
        function () {
          try {
            return props.view.focusedMediaItem.filename || ' ' + pluralItemPlaceholder;
          } catch (e) {
            return ' ' + mediaItem;
          }
        }()
      )
    )
  );
};

exports.default = ChooseBar;
