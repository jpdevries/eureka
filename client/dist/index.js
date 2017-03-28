'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactIntl = require('react-intl');

var _en = require('react-intl/locale-data/en');

var _en2 = _interopRequireDefault(_en);

var _EurekaMediaBrowser = require('./EurekaMediaBrowser');

var _EurekaMediaBrowser2 = _interopRequireDefault(_EurekaMediaBrowser);

var _data = require('./../i18n/locales/data.json');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Our translated strings


(0, _reactIntl.addLocaleData)([].concat(_toConsumableArray(_en2.default)));

var language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
var messages = _data2.default[languageWithoutRegionCode] || _data2.default[language] || _data2.default.en;

_reactDom2.default.render(_react2.default.createElement(
  _reactIntl.IntlProvider,
  { locale: language, messages: messages },
  _react2.default.createElement(_EurekaMediaBrowser2.default, {
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
  })
), document.getElementById('root'));