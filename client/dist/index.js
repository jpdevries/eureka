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

var language = document.documentElement.lang || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
var languageKey = languageWithoutRegionCode.toLowerCase();

if (languageKey != 'en') {
  Promise.all([(0, _lazyloadScript2.default)('https://unpkg.com/react-intl@latest/locale-data/' + languageKey + '.js', 'react-intl-' + languageKey.toLowerCase() + '.js')]).then(function (data) {
    console.log('YloLo!');
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
  _reactDom2.default.render(_react2.default.createElement(_EurekaMediaBrowser2.default, {
    basePath: '/core/components/eureka/',
    allowUploads: true,
    treeHidden: true,
    lang: languageKey,
    useLocalStorage: true,
    allowRename: true,
    allowDelete: true,
    mode: 'table',
    confirmBeforeDelete: true,
    enlargeFocusedRows: false,
    currentDirectory: 'assets/img/hawaii',
    allowFullscreen: true,
    emphasisFocusedMediaItem: true,
    endpoints: {
      i18n: 'assets/js/i18n/'
    }
  }), document.getElementById('root'));
}