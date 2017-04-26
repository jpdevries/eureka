'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeToggle = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeToggle = exports.TreeToggle = function TreeToggle(props) {
  var formatMessage = props.intl.formatMessage,

  //closeMessage = formatMessage(definedMessages.close),
  //openMessage = formatMessage(definedMessages.open),
  //toggleMessage = formatMessage(definedMessages.toggle),
  mediaSourceTreeMessage = formatMessage(_definedMessages2.default.mediaSourceTreeMessage);
  //<Icon {...props} icon={`caret-square-o-${props.view.sourceTreeOpen ? 'left' : 'right'}`} />&ensp;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'button',
      { role: 'menuitem', id: 'eureka__tree-toggle__button', 'aria-controls': 'eureka__pathbrowser', 'aria-pressed': props.view.sourceTreeOpen, 'aria-expanded': props.view.sourceTreeOpen, onClick: function onClick(event) {
          _store2.default.dispatch(_actions2.default.updateView({
            sourceTreeOpen: !props.view.sourceTreeOpen
          }));
        } },
      '' + mediaSourceTreeMessage
    )
  );
};

//import { FormattedMessage } from 'react-intl';
exports.default = TreeToggle;