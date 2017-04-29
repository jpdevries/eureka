'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _ContextButtons = require('./ContextButtons');

var _ContextButtons2 = _interopRequireDefault(_ContextButtons);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _definedMessages = require('./../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathParse = require('path-parse');

/*
Example of file
Example of file-archive-o
Example of file-audio-o
Example of file-code-o
Example of file-excel-o
Example of file-image-o
Example of file-movie-o (alias)
Example of file-o
Example of file-pdf-o
Example of file-photo-o (alias)
Example of file-picture-o (alias)
Example of file-powerpoint-o
Example of file-sound-o (alias)
Example of file-text
Example of file-text-o
Example of file-video-o
Example of file-word-o
Example of file-zip-o
*/

var PathBar = function PathBar(props) {
  var formatMessage = props.intl.formatMessage;
  var contextBtns = props.view.focusedMediaItem ? _react2.default.createElement(_ContextButtons2.default, _extends({}, props, { item: props.view.focusedMediaItem })) : undefined;

  var copyListofSelectedFiles = formatMessage(_definedMessages2.default.copyListofSelectedFiles);

  var icon = _utility2.default.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);
  var p = props.view.chooseMultiple && props.content.chosenMediaItems.length > 1 ? props.view.focusedMediaItem.directory : _path2.default.join(props.view.focusedMediaItem.directory, props.view.focusedMediaItem.filename);
  var fileNames = props.content.chosenMediaItemsInverted.map(function (item) {
    return item.filename;
  });
  //console.log('props.content.chosenMediaItems', props.content.chosenMediaItems);
  //console.log('fileNames', fileNames);
  var len = props.view.selectionInverted ? props.content.contents.length - props.content.chosenMediaItems.length : props.content.chosenMediaItems.length;
  var fileNamesIf = len > 1 && props.view.chooseMultiple ? _react2.default.createElement('textarea', { 'aria-readonly': 'true', 'aria-label': copyListofSelectedFiles, rows: '10', cols: '50', onClick: function onClick(event) {
      event.target.focus();
      event.target.select();
    }, style: {
      margin: '0'
    }, readOnly: 'readonly', value: fileNames.join(', ') }) : undefined,
      a = len < 2 ? _react2.default.createElement(
    'a',
    { id: props.config.storagePrefix + 'selected_file_names', role: 'presentation', href: props.view.focusedMediaItem.absoluteURL, target: '_' + encodeURI(props.view.focusedMediaItem.absoluteURL) },
    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
    '\u2002',
    p,
    fileNamesIf
  ) : _react2.default.createElement(
    'div',
    { id: props.config.storagePrefix + 'selected_file_names' },
    _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
    '\u2002',
    p,
    fileNamesIf
  );

  var selectedPaths = len > 12 ? _react2.default.createElement(
    'details',
    { open: true },
    _react2.default.createElement(
      'summary',
      null,
      'Selected Paths'
    ),
    fileNamesIf
  ) : fileNamesIf;

  return _react2.default.createElement(
    'div',
    { className: 'eureka__pathbar' },
    _react2.default.createElement(
      'div',
      { className: 'eureka__hide-for-mobile-up', 'aria-hidden': 'true' },
      _react2.default.createElement(
        'details',
        null,
        _react2.default.createElement(
          'summary',
          null,
          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
          '\u2002',
          props.view.chooseMultiple ? '' + props.view.focusedMediaItem.directory : '' + props.view.focusedMediaItem.directory + props.view.focusedMediaItem.filename
        ),
        selectedPaths,
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('img', { src: props.view.focusedMediaItem.absoluteURL, alt: '' })
          ),
          contextBtns
        )
      )
    ),
    _react2.default.createElement(
      'div',
      { role: 'status', className: 'eureka__show-for-mobile-up' },
      a
    )
  );
};

exports.default = PathBar;