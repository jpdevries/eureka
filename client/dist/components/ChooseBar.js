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
      fileNames = props.content.chosenMediaItemsInverted.map(function (item) {
    return item.filename;
  }),
      deleteBtnFormFileNames = props.content.chosenMediaItemsInverted.map(function (item) {
    return _react2.default.createElement('input', { type: 'hidden', name: 'delete_file[]', key: item.filename, value: item.filename });
  }),
      downloadBtnFormFileNames = props.content.chosenMediaItemsInverted.map(function (item) {
    return _react2.default.createElement('input', { type: 'hidden', name: 'zip_file[]', key: item.filename, value: item.filename });
  }),
      len = props.content.chosenMediaItemsInverted.length,
      pluralChooseItemPlaceholder = _definedMessages2.default.pluralChoose[formatPlural({
    value: len
  })],
      cancelMessage = formatMessage(_definedMessages2.default.cancel),
      postChooseMessage = len > 1 && props.view.chooseMultiple ? ' ' + len + ' ' + pluralChooseItemPlaceholder : _react2.default.createElement(
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
  ),
      downloadBtn = len > 1 && props.view.chooseMultiple && props.config.allowDownloadMultiple ? _react2.default.createElement(
    'form',
    { target: '_blank', encType: 'multipart/form-data', method: 'POST', action: '/assets/components/eureka/media/attachments/' + props.source.currentSource, onSubmit: function onSubmit(event) {} },
    _react2.default.createElement('input', { type: 'hidden', name: 'cd', value: props.content.cd }),
    _react2.default.createElement('input', { type: 'hidden', name: 'cs', value: props.source.currentSource }),
    downloadBtnFormFileNames,
    _react2.default.createElement(
      'button',
      { className: 'eureka__gratious' },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'download', defaultValue: 'Download' }),
      postChooseMessage
    )
  ) : undefined,
      chooseBtn = props.config.allowChoose ? _react2.default.createElement(
    'button',
    { 'aria-describedby': props.config.storagePrefix + 'selected_file_names', id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'choose-button', className: 'eureka__primary', disabled: !props.view.focusedMediaItem && !_utility2.default.serverSideRendering, onClick: function onClick(event) {
        if (props.view.chooseMultiple) {
          if (props.view.selectionInverted) props.config.callbacks.choose(props.content.chosenMediaItemsInverted);else props.config.callbacks.choose(props.content.chosenMediaItems);
          return;
        }
        if (!props.view.focusedMediaItem) return;
        try {
          props.config.callbacks.choose(props.view.focusedMediaItem);
        } catch (e) {
          console.log(e);
        }
      } },
    chooseMessage,
    postChooseMessage
  ) : undefined,
      deleteAreYouSureMessage = formatMessage(_definedMessages2.default.deleteAreYouSureMessage, {
    filename: len + ' ' + _definedMessages2.default.pluralItem[formatPlural({
      value: len
    })]
  }),
      deleteBtn = len > 1 && props.view.chooseMultiple && props.config.allowDelete ? _react2.default.createElement(
    'form',
    { onSubmit: function onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        var formData = new FormData(event.target);
        /*for(var pair of formData.entries()) {
           console.log(pair[0]+ ', '+ pair[1]);
        }*/

        //console.log('yolo', formData.getAll('delete_file[]'));

        if (!props.config.confirmBeforeDelete) {
          deleteIt();
        } else if (confirm(deleteAreYouSureMessage)) {
          deleteIt();
        }

        function deleteIt() {
          _store2.default.dispatch(_actions2.default.deleteMediaItems(props.source.currentSource, formData, props.config.headers)).then(function () {
            _store2.default.dispatch(_actions2.default.notify('Deleted ' + formData.getAll('delete_file[]').length + ' ' + _definedMessages2.default.pluralItem[formatPlural({
              value: formData.getAll('delete_file[]').length
            })], _utility2.default.DANGEROUS));
          });
        }

        /*for (var value of formData.values()) {
          console.log(value);
        }*/
      } },
    _react2.default.createElement('input', { type: 'hidden', name: 'cd', value: props.content.cd }),
    _react2.default.createElement('input', { type: 'hidden', name: 'cs', value: props.source.currentSource }),
    deleteBtnFormFileNames,
    _react2.default.createElement(
      'button',
      { className: 'dangerous' },
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'delete', defaultValue: 'Delete' }),
      postChooseMessage
    )
  ) : undefined;

  return _react2.default.createElement(
    'div',
    { 'aria-hidden': props.ariaHidden, className: 'eureka__button-bar eureka__choose-bar' },
    _react2.default.createElement(
      'button',
      { className: 'dangerous', 'aria-label': closeMediaBrowserMessage, onClick: function onClick(event) {
          //console.log('closing');
          try {
            props.config.callbacks.close();
          } catch (e) {
            console.log(e);
          }
        } },
      cancelMessage
    ),
    downloadBtn,
    deleteBtn,
    chooseBtn
  );
};

exports.default = ChooseBar;