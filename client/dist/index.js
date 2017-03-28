'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _EurekaMediaBrowser = require('./EurekaMediaBrowser');

var _EurekaMediaBrowser2 = _interopRequireDefault(_EurekaMediaBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_EurekaMediaBrowser2.default, {
  basePath: '/core/components/eureka/',
  allowUploads: true,
  treeHidden: false,
  useLocalStorage: true,
  allowRename: true,
  allowDelete: true,
  mode: 'table',
  confirmBeforeDelete: true,
  enlargeFocusedRows: false,
  currentDirectory: 'assets/img/hawaii',
  allowFullscreen: true,
  emphasisFocusedMediaItem: true
}), document.getElementById('root'));