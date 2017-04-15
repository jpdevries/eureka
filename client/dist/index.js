'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _EurekaMediaBrowser = require('./EurekaMediaBrowser');

var _EurekaMediaBrowser2 = _interopRequireDefault(_EurekaMediaBrowser);

var _lazyloadScript = require('lazyload-script');

var _lazyloadScript2 = _interopRequireDefault(_lazyloadScript);

var _reactIntl = require('react-intl');

var _reactIntl2 = _interopRequireDefault(_reactIntl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var language = document.documentElement.lang || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
var languageKey = languageWithoutRegionCode.toLowerCase();

if (languageKey != 'en') {
  Promise.all([(0, _lazyloadScript2.default)('https://unpkg.com/react-intl@latest/locale-data/' + languageKey + '.js', 'react-intl-' + languageKey.toLowerCase() + '.js')]).then(function (data) {
    console.log(data);
    console.log('window.ReactIntlLocaleData[languageKey]', window.ReactIntlLocaleData[languageKey]);
    (0, _reactIntl.addLocaleData)(window.ReactIntlLocaleData[languageKey]);
  }).then(function () {
    return render();
  });
} else {
  render();
}

function render() {
  var _React$createElement;

  _reactDom2.default.render(_react2.default.createElement(_EurekaMediaBrowser2.default, (_React$createElement = {
    basePath: '/core/components/eureka/',
    allowUploads: true,
    lang: languageKey,
    useLocalStorage: false,
    allowRename: true,
    allowDelete: true,
    confirmBeforeDelete: true,
    allowFullscreen: true,
    enlargeFocusedRows: false
  }, _defineProperty(_React$createElement, 'allowFullscreen', true), _defineProperty(_React$createElement, 'emphasisFocusedMediaItem', true), _defineProperty(_React$createElement, 'storagePrefix', 'eureka__'), _defineProperty(_React$createElement, 'lang', 'en-US'), _defineProperty(_React$createElement, 'callbacks', {
    choose: function choose(item) {
      alert('yolo');
    }
  }), _defineProperty(_React$createElement, 'endpoints', {
    i18n: './assets/js/i18n/locales/'
  }), _defineProperty(_React$createElement, 'intervals', {
    searchBarPlaceholder: 3000
  }), _React$createElement)), document.getElementById('root'));
}
