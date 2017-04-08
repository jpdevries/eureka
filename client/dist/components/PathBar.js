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
  var contextBtns = props.view.focusedMediaItem ? _react2.default.createElement(_ContextButtons2.default, _extends({}, props, { item: props.view.focusedMediaItem })) : undefined;

  var icon = _utility2.default.getIconByExtension(pathParse(props.view.focusedMediaItem.filename).ext);

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
          '' + props.view.focusedMediaItem.directory + props.view.focusedMediaItem.filename
        ),
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
      _react2.default.createElement(
        'a',
        { role: 'presentation', href: props.view.focusedMediaItem.absoluteURL, target: '_' + encodeURI(props.view.focusedMediaItem.absoluteURL) },
        _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: icon })),
        '\u2002',
        _path2.default.join(props.view.focusedMediaItem.directory, props.view.focusedMediaItem.filename)
      )
    )
  );
};

exports.default = PathBar;