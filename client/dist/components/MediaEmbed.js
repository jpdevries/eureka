'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = MediaEmbed;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

var _utility = require('./../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathParse = require('path-parse');

function MediaEmbed(props) {
  var src = props.item.absolutePreviewURL || props.item.absoluteURL,
      alt = props.item.alt || '',
      ext = pathParse(props.item.absoluteURL.split('?')[0]).ext,
      onMediaClick = props.onMediaClick || undefined;

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
      return _react2.default.createElement('img', { src: src, alt: alt, onClick: onMediaClick });
      break;

    case '.mp4':
    case '.mov':
      return _react2.default.createElement(
        'video',
        { key: src, width: '320', height: '240', controls: props.view.mode !== 'list' },
        _react2.default.createElement('source', { src: src, type: 'video/mp4' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support HTML5 Video.' })
      );
      break;

    case '.ogv':
      return _react2.default.createElement(
        'video',
        { key: src, width: '320', height: '240', controls: props.view.mode !== 'list' },
        _react2.default.createElement('source', { src: src, type: 'video/ogg' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support HTML5 Video.' })
      );
      break;

    case '.webm':
    case '.wbm':
      return _react2.default.createElement(
        'video',
        { key: src, width: '320', height: '240', controls: props.view.mode !== 'list' },
        _react2.default.createElement('source', { src: src, type: 'video/webm' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noVideo', defaultMessage: 'Your browser does not support HTML5 Video.' })
      );
      break;

    case '.pdf':
      return _react2.default.createElement('embed', { key: src, src: src, width: '320', height: '240' });
      break;

    case '.ogg':
      return _react2.default.createElement(
        'audio',
        { key: src, controls: true },
        _react2.default.createElement('source', { src: src, type: 'audio/ogg' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support HTML5 Audio.' })
      );
      break;

    case '.mp3':
      return _react2.default.createElement(
        'audio',
        { key: src, controls: true },
        _react2.default.createElement('source', { src: src, type: 'audio/mpeg' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support HTML5 Audio.' })
      );
      break;

    case '.wav':
      return _react2.default.createElement(
        'audio',
        { key: src, controls: true },
        _react2.default.createElement('source', { src: src, type: 'audio/wav' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support HTML5 Audio.' })
      );
      break;

    case '.flac':
      return _react2.default.createElement(
        'audio',
        { key: src, controls: true },
        _react2.default.createElement('source', { src: src, type: 'audio/flac' }),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'support.noAudio', defaultMessage: 'Your browser does not support HTML5 Audio.' })
      );
      break;

    default:
      var icon = _utility2.default.getIconByExtension(pathParse(props.item.filename).ext);
      return _react2.default.createElement(
        'p',
        { onClick: onMediaClick },
        _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
        '\u2002',
        props.item.absoluteURL
      );
  }
}

module.exports = MediaEmbed;