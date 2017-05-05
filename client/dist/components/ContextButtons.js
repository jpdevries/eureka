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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathParse = require('path-parse');

var ContextButtons = function ContextButtons(props) {
  //console.log('ContextButtons', props);
  var item = props.item;

  var _pathParse = pathParse(item.filename),
      ext = _pathParse.ext;

  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;

  var formatMessage = props.intl.formatMessage,
      renameMessage = formatMessage(_definedMessages2.default.rename),
      renameItemMessage = formatMessage(_definedMessages2.default.renameItem, {
    item: ' ' + item.filename
  }),
      performContextualActionsMessage = formatMessage(_definedMessages2.default.performContextualActions, {
    filename: item.filename
  }),
      expandMessage = formatMessage(_definedMessages2.default.expand),
      chooseItemMessage = formatMessage(_definedMessages2.default.chooseItem, {
    filename: item.filename
  }),
      chooseMessage = formatMessage(_definedMessages2.default.choose),
      cropMessage = formatMessage(_definedMessages2.default.crop),
      deleteMessage = formatMessage(_definedMessages2.default.delete),
      deleteItemMessage = formatMessage(_definedMessages2.default.deleteItem, {
    filename: item.filename
  }),
      deletedItemMessage = formatMessage(_definedMessages2.default.deletedItem, {
    filename: item.filename
  }),
      expandItemMessage = formatMessage(_definedMessages2.default.expandItem, {
    filename: item.filename
  }),
      downloadMessage = formatMessage(_definedMessages2.default.download),
      downloadItemMessage = formatMessage(_definedMessages2.default.downloadItem, {
    filename: item.filename
  }),
      deleteAreYouSureMessage = formatMessage(_definedMessages2.default.deleteAreYouSureMessage, {
    filename: item.filename
  });

  var chooseBtn = props.config.allowChoose ? _react2.default.createElement(
    'button',
    { role: 'option', id: 'choose__' + (0, _utility.cssSafe)(item.filename), title: chooseItemMessage, onClick: function onClick(event) {
        if (!props.view.focusedMediaItem) return;
        try {
          props.config.callbacks.choose(item);
        } catch (e) {
          console.log(e);
        }
        /*document.dispatchEvent(new CustomEvent('EurekaFoundIt', {
          detail: item
        }));*/
      } },
    chooseMessage,
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' ',
      item.filename
    )
  ) : undefined,
      cropBtn = props.config.allowCrop && (ext.toLowerCase() == '.jpg' || ext.toLowerCase() == '.jpeg' || ext.toLowerCase() == '.png' || ext.toLowerCase() == '.gif') ? _react2.default.createElement(
    'button',
    { className: 'eureka__crop-btn', role: 'option', id: 'choose__' + (0, _utility.cssSafe)(item.filename), title: chooseItemMessage, onClick: props.onCropItem ? props.onCropItem.bind(null, item) : undefined },
    cropMessage,
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' ',
      item.filename
    )
  ) : undefined,
      renameBtn = props.config.allowRename ? _react2.default.createElement(
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
        if (!props.config.confirmBeforeDelete) {
          deleteIt();
        } else if (confirm(deleteAreYouSureMessage)) {
          deleteIt();
        }
        function deleteIt() {
          _store2.default.dispatch(decoratedActions.deleteMediaItem(props.source.currentSource, item.path, props.config.headers)).then(function () {
            _store2.default.dispatch(_actions2.default.notify(deletedItemMessage, _utility.DANGEROUS));
          });
        }
      }, title: deleteItemMessage, className: 'dangerous' },
    deleteMessage,
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' ',
      item.filename
    )
  ) : undefined,
      downloadID = (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'download__' + (0, _utility.cssSafe)(item.filename),
      downloadBtn = props.config.allowDownload ? _react2.default.createElement(
    'a',
    { download: item.filename, href: item.absoluteURL, id: downloadID, className: 'button', target: '_' + downloadID, title: downloadItemMessage },
    downloadMessage,
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
        { onBlur: props.onBlur, role: 'option', id: 'expand__' + (0, _utility.cssSafe)(item.filename), href: item.absoluteURL, target: '_' + encodeURI(item.absoluteURL), className: 'button', title: expandItemMessage },
        expandMessage,
        _react2.default.createElement(
          'span',
          { className: 'visually-hidden' },
          ' ',
          item.filename
        )
      ),
      chooseBtn,
      cropBtn,
      renameBtn,
      deleteBtn,
      downloadBtn
    )
  );
};

exports.default = ContextButtons;