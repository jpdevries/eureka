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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ContextButtons = function ContextButtons(props) {
  var item = props.item;

  var renameBtn = props.config.allowRename ? _react2.default.createElement(
    'button',
    { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'rename__' + (0, _utility.cssSafe)(item.filename), role: 'option', title: 'Rename ' + item.filename, onClick: props.onRenameItem ? props.onRenameItem.bind(null, item) : undefined },
    'Rename',
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
        _store2.default.dispatch(_actions2.default.deleteMediaItem(props.source.currentSource, item.absolutePath));
      }, title: 'Delete ' + item.filename, className: 'dangerous' },
    'Delete',
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' ',
      item.filename
    )
  ) : undefined;

  return _react2.default.createElement(
    'div',
    { className: 'eureka__button-bar eureka__context-buttons', role: 'listbox', 'aria-label': 'Perform Actions such as Expand or Choose on ' + item.filename, tabIndex: '0', 'aria-activedescendant': 'expand__' + (0, _utility.cssSafe)(item.filename) },
    _react2.default.createElement(
      'a',
      { role: 'option', id: 'expand__' + (0, _utility.cssSafe)(item.filename), href: item.absoluteURL, target: '_' + encodeURI(item.absoluteURL), className: 'button', title: 'Expand ' + item.filename },
      'Expand',
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden' },
        ' ',
        item.filename
      )
    ),
    _react2.default.createElement(
      'button',
      { role: 'option', id: 'choose__' + (0, _utility.cssSafe)(item.filename), title: 'Choose ' + item.filename, onClick: function onClick(event) {
          document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
            detail: item
          }));
        } },
      'Choose',
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden' },
        ' ',
        item.filename
      )
    ),
    renameBtn,
    deleteBtn
  );
};

exports.default = ContextButtons;