'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('../utility/utility');

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContextButtons = function ContextButtons(props) {
  //console.log('ContextButtons', props);
  var item = props.item;

  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

  var formatMessage = props.intl.formatMessage,
      renameMessage = formatMessage(_definedMessages2.default.rename),
      renameItemMessage = formatMessage(_definedMessages2.default.renameItem, {
    filename: ' ' + item.filename
  }),
      performContextualActionsMessage = formatMessage(_definedMessages2.default.performContextualActions, {
    filename: item.filename
  }),
      expandMessage = formatMessage(_definedMessages2.default.expand),
      chooseItemMessage = formatMessage(_definedMessages2.default.chooseItem, {
    filename: item.filename
  }),
      chooseMessage = formatMessage(_definedMessages2.default.choose),
      deleteMessage = formatMessage(_definedMessages2.default.delete),
      deleteItemMessage = formatMessage(_definedMessages2.default.deleteItem, {
    filename: item.filename
  }),
      expandItemMessage = formatMessage(_definedMessages2.default.expandItem, {
    filename: item.filename
  });


  var renameBtn = props.config.allowRename ? _react2.default.createElement(
    'button',
    { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'rename__' + (0, _utility.cssSafe)(item.filename), role: 'option', title: renameItemMessage, onClick: props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined },
    renameMessage,
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' ',
      item.filename
    )
  ) : undefined,
      deleteBtn = props.config.allowDelete ? _react2.default.createElement(
    'button',
    { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'delete__' + (0, _utility.cssSafe)(item.filename), role: 'option', onClick: function onClick(event) {
        _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers));
      }, title: deleteItemMessage, className: 'dangerous' },
    deleteMessage,
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' ',
      item.filename
    )
  ) : undefined;

  return (// future-role="toolbar listbox"
    _react2.default.createElement(
      'div',
      { className: 'eureka__button-bar eureka__context-buttons', role: 'listbox', 'aria-label': performContextualActionsMessage, tabIndex: '0', 'aria-activedescendant': 'expand__' + (0, _utility.cssSafe)(item.filename) },
      _react2.default.createElement(
        'a',
        { role: 'option', id: 'expand__' + (0, _utility.cssSafe)(item.filename), href: item.absoluteURL, target: '_' + encodeURI(item.absoluteURL), className: 'button', title: expandItemMessage },
        expandMessage,
        _react2.default.createElement(
          'span',
          { className: 'visually-hidden' },
          ' ',
          item.filename
        )
      ),
      _react2.default.createElement(
        'button',
        { role: 'option', id: 'choose__' + (0, _utility.cssSafe)(item.filename), title: chooseItemMessage, onClick: function onClick(event) {
            document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
              detail: item
            }));
          } },
        chooseMessage,
        _react2.default.createElement(
          'span',
          { className: 'visually-hidden' },
          ' ',
          item.filename
        )
      ),
      renameBtn,
      deleteBtn
    )
  );
};

exports.default = ContextButtons;