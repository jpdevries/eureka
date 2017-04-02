'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _ContextMenu = require('./ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Entities = require('html-entities').AllHtmlEntities;

var pathParse = require('path-parse');

var MediaRow = function MediaRow(props) {
  var _React$createElement;

  //console.log('MediaRow', props);
  var entities = new Entities();
  var item = props.item;
  var index = props.index;

  var formatMessage = props.intl.formatMessage;

  var ariaLabel = props.item.filename + ' displays at ' + props.item.dimensions.join('x') + ', weighs ' + (0, _filesize2.default)(props.item.fileSize, { round: 0 }) + ', and was edited on ' + new Date(props.item.editedOn).toLocaleString(props.view.locale, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' });

  function shouldHide(item) {

    try {
      //console.log('shouldHide',props.view.focusedMediaItem.path,item.path,props.view.focusedMediaItem.path !== item.path);
      return props.view.focusedMediaItem.path !== item.path;
    } catch (e) {
      //console.log('shouldHide',true);
      return true;
    }
  }

  var contentEditable = false;

  var media = function (ext) {
    // consider abstracting this to its own module
    //console.log(pathParse(props.item.filename).ext,'props.item',props.item);

    switch (ext.toLowerCase()) {
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.png':
      case '.png8':
      case '.png24':
      case '.svg':
      case '.bmp':
      case '.tiff':
        return _react2.default.createElement('img', { src: props.item.absoluteURL, alt: '' });
        break;

      case '.mp4':
      case '.mov':
        return _react2.default.createElement(
          'video',
          { width: '320', height: '240', controls: props.view.mode !== 'list' },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'video/mp4' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support the video tag.' })
        );
        break;

      case '.ogv':
        return _react2.default.createElement(
          'video',
          { width: '320', height: '240', controls: props.view.mode !== 'list' },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'video/ogg' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support the video tag.' })
        );
        break;

      case '.webm':
      case '.wbm':
        return _react2.default.createElement(
          'video',
          { width: '320', height: '240', controls: props.view.mode !== 'list' },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'video/webm' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support the video tag.' })
        );
        break;

      case '.pdf':
        return _react2.default.createElement('embed', { src: props.item.absoluteURL, width: '320', height: '240' });
        break;

      case '.ogg':
        return _react2.default.createElement(
          'audio',
          { controls: true },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'audio/ogg' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
        );
        break;

      case '.mp3':
        return _react2.default.createElement(
          'audio',
          { controls: true },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'audio/mpeg' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
        );
        break;

      case '.wav':
        return _react2.default.createElement(
          'audio',
          { controls: true },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'audio/wav' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
        );
        break;

      case '.flac':
        return _react2.default.createElement(
          'audio',
          { controls: true },
          _react2.default.createElement('source', { src: props.item.absoluteURL, type: 'audio/flac' }),
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support the audio tag.' })
        );
        break;

      default:
        var icon = _utility2.default.getIconByExtension(pathParse(props.item.filename).ext);
        return _react2.default.createElement(
          'p',
          null,
          _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
          '\u2002',
          props.item.absoluteURL
        );
    }
  }(pathParse(props.item.filename).ext);

  //classNames();

  var mediaId = (props.config.storagePrefix || 'eureka__') + '__media__' + _utility2.default.cssSafe(props.item.filename),
      mediaSelectId = (props.config.storagePrefix || 'eureka__') + '__radio_' + _utility2.default.cssSafe(props.item.filename),
      mediaSelect = _utility2.default.serverSideRendering ? _react2.default.createElement(
    'td',
    null,
    _react2.default.createElement('input', { id: mediaSelectId, value: props.item.filename, name: 'eureka__chosen_item', type: 'radio', 'aria-labelledby': (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'choose-button', 'aria-describedby': mediaId + ' ' + _utility2.default.cssSafe(props.item.filename) }),
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      '\u2002',
      _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'select', defaultMessage: 'Select' }),
      ' $',
      props.item.filename
    )
  ) : undefined,
      className = props.config.emphasisFocusedMediaItem && props.item == props.view.focusedMediaItem ? { 'eureka__focused-media-item': true } : {},
      tabIndex = _utility2.default.serverSideRendering ? undefined : "0",
      ext = pathParse(props.item.absoluteURL).ext,
      isLinkableFileType = function (ext) {
    switch (ext.toLowerCase()) {
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.png':
      case '.png8':
      case '.png24':
      case '.svg':
      case '.bmp':
      case '.tiff':
        return true;
        break;

      default:
        return false;
    }
  }(ext);

  var openInANewTabMessage = formatMessage(_definedMessages2.default.openFileInNewTab, {
    filename: props.item.fileName
  });

  if (_utility2.default.serverSideRendering && isLinkableFileType) {
    //media = <label style={{display:'block'}} htmlFor={mediaSelectId} aria-labelledby={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }filename__${utility.cssSafe(props.item.filename)}`}>{media}</label>;
    media = _react2.default.createElement(
      'a',
      { href: props.item.absoluteURL, target: '_' + mediaSelectId, 'aria-label': openInANewTabMessage, role: 'presentation' },
      media
    );
  }

  var fileName = _utility2.default.wordBreaksEvery(props.item.filename);
  if (_utility2.default.serverSideRendering) {
    //fileName = <a href={`#${mediaSelectId}`} role="presentation" tabIndex="-1" id={`${props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__' }filename__${utility.cssSafe(props.item.filename)}`}>{fileName}</a>
    fileName = _react2.default.createElement(
      'label',
      { htmlFor: mediaSelectId },
      fileName
    );
  }
  return _react2.default.createElement(
    'tr',
    (_React$createElement = { role: 'row', className: (0, _classnames2.default)(className), id: _utility2.default.cssSafe(props.item.filename), 'aria-label': ariaLabel }, _defineProperty(_React$createElement, 'role', 'row'), _defineProperty(_React$createElement, 'tabIndex', tabIndex), _defineProperty(_React$createElement, 'onFocus', props.onFocus.bind(undefined)), _defineProperty(_React$createElement, 'contextMenu', 'context_menu__tbody-' + props.index), _React$createElement),
    mediaSelect,
    _react2.default.createElement(
      'td',
      { role: 'gridcell', id: mediaId, title: ariaLabel, className: 'eureka__td-media', onDoubleClick: function onDoubleClick(event) {
          console.log(event, props.item);
        } },
      _react2.default.createElement(
        'span',
        { className: 'visually-hidden' },
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.contents', defaultMessage: 'Media Contents' })
      ),
      media
    ),
    _react2.default.createElement(
      'td',
      { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + 'filename__' + _utility2.default.cssSafe(props.item.filename), role: 'gridcell', className: 'eureka__td-filename', contentEditable: contentEditable, onBlur: function onBlur(event) {
          try {
            if (!entities.decode(event.target.innerHTML).trim()) {
              event.target.innerHTML = props.item.filename;
              //alert('file name cannot be empty'); // i mostly hate alerts
              throw new Error('file name cannot be empty');
            }

            console.log(event.target.innerHTML, event.target.innerHTML.trim());
            console.log('test', entities.decode('&lt;&nbsp;&gt;&quot;&apos;&amp;&copy;&reg;&#8710;'));
            console.log('props.item!', props.item);
            props.onRenameItemModalSubmit(entities.decode(event.target.innerHTML.trim()), props.item);
          } catch (e) {
            console.log(e);
          }
        },
        onKeyUp: function onKeyUp(event) {
          console.log('onKeyUp', event);
        },
        onKeyDown: function onKeyDown(event) {
          console.log('onKeyDown', event, event.keyCode);
          if (event.keyCode === 13) {
            event.preventDefault();
            event.target.blur();
          }
        },
        onPaste: function onPaste(event) {
          console.log('onPaste', event);
        },
        onCopy: function onCopy(event) {
          console.log('onCopy', event);
        },
        onCut: function onCut(event) {
          console.log('onCut', event);
        }
      },
      fileName
    ),
    _react2.default.createElement(_ContextMenu2.default, _extends({ className: 'eureka__context-row' }, props, { item: item, hidden: shouldHide(item), key: 'cm__' + index })),
    _react2.default.createElement(
      'td',
      { role: 'gridcell' },
      props.item.dimensions[0] + 'x' + props.item.dimensions[1]
    ),
    _react2.default.createElement(
      'td',
      { role: 'gridcell' },
      (0, _filesize2.default)(props.item.fileSize)
    ),
    _react2.default.createElement(
      'td',
      { role: 'gridcell', title: new Date(props.item.editedOn).toLocaleString(props.view.locale, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', timeZoneName: 'long' }) },
      new Date(props.item.editedOn).toLocaleString(props.view.locale, { year: '2-digit', month: '2-digit', day: '2-digit' })
    )
  );
};

exports.default = MediaRow;