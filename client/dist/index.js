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
    basePath: '/assets/components/eureka/',
    allowUploads: true,
    doDragNDrop: true,
    lang: languageKey,
    useLocalStorage: true,
    allowRename: true,
    allowDelete: true,
    allowInvertSelection: true,
    confirmBeforeDelete: false,
    alwaysWelcome: true,
    allowFullscreen: true,
    enlargeFocusedRows: false,
    emphasisFocusedMediaItem: true,
    storagePrefix: 'eureka__'
  }, _defineProperty(_React$createElement, 'lang', 'en-US'), _defineProperty(_React$createElement, 'callbacks', {
    choose: function choose(item) {
      alert(JSON.stringify(item));
      console.log(item);
    }
  }), _defineProperty(_React$createElement, 'handlers', {
    createFile: function createFile(source, directory) {
      return {
        href: 'javascript:alert("create a file in ' + directory + ' of media source ' + source + '")',
        target: '_blank',
        onClick: function onClick(source, directory) {
          console.log('onClick', source, directory);
        }
      };
    }
  }), _defineProperty(_React$createElement, 'endpoints', {
    i18n: './assets/js/i18n/locales/'
  }), _defineProperty(_React$createElement, 'headers', {
    foo: 'bar'
  }), _defineProperty(_React$createElement, 'intervals', {
    searchBarPlaceholder: 12000
  }), _React$createElement)), document.getElementById('root'));
}