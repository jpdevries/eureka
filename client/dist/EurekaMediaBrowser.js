'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _Eureka = require('./Eureka');

var _Eureka2 = _interopRequireDefault(_Eureka);

var _reactIntl = require('react-intl');

var _en = require('react-intl/locale-data/en');

var _en2 = _interopRequireDefault(_en);

var _en3 = require('./../i18n/locales/en.json');

var _en4 = _interopRequireDefault(_en3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var actions = require('./model/actions'),
    store = require('./model/store');

(0, _reactIntl.addLocaleData)([].concat(_toConsumableArray(_en2.default)));

var language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
var messages = _en4.default[languageWithoutRegionCode] || _en4.default[language] || _en4.default.en;

var EurekaMediaBrowser = function (_Component) {
  _inherits(EurekaMediaBrowser, _Component);

  function EurekaMediaBrowser(props) {
    _classCallCheck(this, EurekaMediaBrowser);

    var _this = _possibleConstructorReturn(this, (EurekaMediaBrowser.__proto__ || Object.getPrototypeOf(EurekaMediaBrowser)).call(this, props));

    store.dispatch(actions.updateConfig(props));

    store.subscribe(function () {
      var state = store.getState();
      /*try {
        const siteName = title.dataset.siteName,
        title = document.querySelector('head > title'),
        ct = (`${state.content.cd} of ${state.source.sources[state.source.currentSource].name} media source`);
        title.innerHTML = `${ct} | ${siteName}`;
      } catch (e) {}*/

      if (state.config.useLocalStorage) {
        try {
          localStorage.setItem(state.config.storagePrefix + 'currentDirectory', state.content.cd);
          localStorage.setItem(state.config.storagePrefix + 'source', JSON.stringify(state.source));
          localStorage.setItem(state.config.storagePrefix + 'mode', state.view.mode);
          localStorage.setItem(state.config.storagePrefix + 'sort', state.view.sort);
          localStorage.setItem(state.config.storagePrefix + 'treeHidden', !state.view.sourceTreeOpen);
        } catch (e) {}
      }
    });
    return _this;
  }

  _createClass(EurekaMediaBrowser, [{
    key: 'componentWillMount',
    value: function componentWillMount() {

      this.EurekaController = (0, _reactRedux.connect)(function (state, props) {
        // todo list
        return {
          content: state.content,
          view: state.view,
          tree: state.tree,
          source: state.source,
          directory: state.directory,
          fetched: state.fetched,
          config: state.config
        };
      })((0, _reactIntl.injectIntl)(_Eureka2.default)); // shoot it up with some i18n
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;

      return _react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          _reactIntl.IntlProvider,
          _extends({}, props, { locale: language, messages: messages }),
          _react2.default.createElement(this.EurekaController, props)
        )
      );
    }
  }]);

  return EurekaMediaBrowser;
}(_react.Component);

// i18n FTW


exports.default = EurekaMediaBrowser;