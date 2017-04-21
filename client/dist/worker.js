'use strict';

var _React$createElement;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactWorkerDomWorker = require('react-worker-dom-worker');

var _reactWorkerDomWorker2 = _interopRequireDefault(_reactWorkerDomWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_reactWorkerDomWorker2.default.render(_react2.default.createElement(EurekaMediaBrowser, (_React$createElement = {
  basePath: '/assets/components/eureka/',
  allowUploads: true,
  lang: languageKey,
  useLocalStorage: true,
  allowRename: true,
  allowDelete: true,
  confirmBeforeDelete: true,
  allowFullscreen: true,
  enlargeFocusedRows: false,
  emphasisFocusedMediaItem: true,
  storagePrefix: 'eureka__'
}, _defineProperty(_React$createElement, 'lang', 'en-US'), _defineProperty(_React$createElement, 'callbacks', {
  choose: function choose(item) {
    alert(JSON.stringify(item));
  }
}), _defineProperty(_React$createElement, 'endpoints', {
  i18n: './assets/js/i18n/locales/'
}), _defineProperty(_React$createElement, 'headers', {
  foo: 'bar'
}), _defineProperty(_React$createElement, 'intervals', {
  searchBarPlaceholder: 60000
}), _React$createElement)));