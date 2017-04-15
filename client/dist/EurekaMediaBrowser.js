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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _Eureka = require('./Eureka');

var _Eureka2 = _interopRequireDefault(_Eureka);

var _reactIntl = require('react-intl');

var _utility = require('./utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _en = require('react-intl/locale-data/en');

var _en2 = _interopRequireDefault(_en);

var _i18n = require('./model/i18n.js');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var actions = require('./model/actions'),
    store = require('./model/store');
//import localeData from './../i18n/locales/en.json';

//import dutchData from './../i18n/locales/nl.json';
//console.log('en',en);
//console.log('localeData',localeData);
(0, _reactIntl.addLocaleData)([].concat(_toConsumableArray(_en2.default)));

var defaultLang = 'en';

var EurekaMediaBrowser = function (_Component) {
  _inherits(EurekaMediaBrowser, _Component);

  function EurekaMediaBrowser(props) {
    _classCallCheck(this, EurekaMediaBrowser);

    //console.log(props.lang);

    //console.log('A');
    //console.log(navigator.languages, navigator.languages[0], navigator.language, navigator.userLanguage);

    var _this = _possibleConstructorReturn(this, (EurekaMediaBrowser.__proto__ || Object.getPrototypeOf(EurekaMediaBrowser)).call(this, props));

    var language = _this.getLanguage(props);

    //console.log('B', language);

    var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

    var config = Object.assign({}, props, {});

    if (props.storagePrefix !== 'eureka__' || true) {
      // they are using a non-default localStorage prefix
      var _config = Object.assign({}, {
        currentDirectory: function () {
          try {
            return localStorage.getItem(props.storagePrefix + 'currentDirectory') || undefined;
          } catch (e) {
            return undefined;
          }
        }(),
        mode: function () {
          try {
            return localStorage.getItem(props.storagePrefix + 'mode') || undefined;
          } catch (e) {
            return undefined;
          }
        }(),
        sort: function () {
          try {
            return localStorage.getItem(props.storagePrefix + 'sort') || undefined;
          } catch (e) {
            return undefined;
          }
        }(),
        /*source:(() => {
          try {
            return JSON.parse(localStorage.getItem(`${props.storagePrefix}source`)) || undefined
          } catch(e) { return undefined }
        })(),*/
        treeHidden: function () {
          try {
            return !JSON.parse(localStorage.getItem(props.storagePrefix + 'view')).sourceTreeOpen;
          } catch (e) {
            return undefined;
          }
        }()
      }, props);

      var localSources = function () {
        try {
          return JSON.parse(localStorage.getItem(props.storagePrefix + 'source')) || undefined;
        } catch (e) {
          return undefined;
        }
      }();

      var localContent = function () {
        try {
          return JSON.parse(localStorage.getItem(props.storagePrefix + 'content')) || undefined;
        } catch (e) {
          return undefined;
        }
      }();

      if (localSources) {
        if (localSources.sources !== undefined) store.dispatch(actions.fetchMediaSourcesSuccess(localSources.sources));
        if (localSources.currentSource !== undefined) store.dispatch(actions.updateSource(localSources.currentSource.toString()));
      }

      if (localContent) {
        store.dispatch(actions.updateContent(localContent));
      }

      /*console.log(
        config,
        localStorage.getItem(`${props.storagePrefix}currentDirectory`),
        localStorage.getItem(`${props.storagePrefix}mode`),
        localStorage.getItem(`${props.storagePrefix}sort`),
        localStorage.getItem(`${props.storagePrefix}source`),
        localStorage.getItem(`${props.storagePrefix}treeHidden`)
      );*/
    }

    //console.log('bolo', languageWithoutRegionCode);
    console.log('config', config);
    store.dispatch(actions.updateConfig(config));

    var i18nEdpoint = function () {
      try {
        return props.endpoints.i18n;
      } catch (e) {
        return _path2.default.join(store.getState().config.assetsBasePath, './js/i18n/locales/');
      }
    }();

    var shouldFetch = function () {
      console.log('shouldFetch', props.lang);
      if (_utility2.default.serverSideRendering) return false;
      try {
        return !props.lang || languageWithoutRegionCode == 'en' || _this.state.i18n[props.lang] !== undefined || _this.state.i18n[languageWithoutRegionCode] !== undefined ? false : true;
      } catch (err) {
        return props.lang !== 'en' ? true : false;
      }
    }();

    if (shouldFetch) fetch('' + i18nEdpoint + languageWithoutRegionCode + '.json').then(function (response) {
      response.json().then(function (json) {
        var state = _this.state;
        _this.setState({
          i18n: json
        });
      });
    });

    store.subscribe(function () {
      var state = store.getState();
      console.log(state);

      // whenever the state changes we store pieces of the state locally so that next time Eureka fires up it can render the user interface without delay
      if (state.config.useLocalStorage) {
        try {
          localStorage.setItem(state.config.storagePrefix + 'currentDirectory', state.content.cd);
          localStorage.setItem(state.config.storagePrefix + 'directory', JSON.stringify(state.directory));
          localStorage.setItem(state.config.storagePrefix + 'currentSource', state.source.currentSource);
          localStorage.setItem(state.config.storagePrefix + 'source', JSON.stringify(state.source));
          //localStorage.setItem(`${state.config.storagePrefix}mode`, state.view.mode);
          //localStorage.setItem(`${state.config.storagePrefix}sort`, state.view.sort);
          //localStorage.setItem(`${state.config.storagePrefix}treeHidden`, !state.view.sourceTreeOpen);
          localStorage.setItem(state.config.storagePrefix + 'content', JSON.stringify(state.content));
          localStorage.setItem(state.config.storagePrefix + 'tree', JSON.stringify(state.tree));
          console.log(state.view, JSON.stringify(state.view));
          localStorage.setItem(state.config.storagePrefix + 'view', JSON.stringify(state.view));
        } catch (e) {}
      }
    });
    return _this;
  }

  _createClass(EurekaMediaBrowser, [{
    key: 'getLanguage',
    value: function getLanguage(props) {
      try {
        return props.lang ? props.lang : document.documentElement.lang || navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
      } catch (e) {
        return 'en-US';
      }
    }
  }, {
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
      var _this2 = this;

      var props = this.props;
      var state = this.state;

      var language = this.getLanguage(props);
      var languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
      var messages = function () {
        if (_utility2.default.serverSideRendering) return props.messages;

        if (languageWithoutRegionCode == 'en') {
          return _i18n2.default[languageWithoutRegionCode] || _i18n2.default[language] || _i18n2.default.en;
        } else {
          var fetchedLexiconData = function () {
            try {
              return _this2.state.i18n;
            } catch (e) {
              return _i18n2.default;
            }
          }();
          return fetchedLexiconData || _i18n2.default;
          //return fetchedLexiconData[languageWithoutRegionCode] || fetchedLexiconData[language] || localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
        }
      }();

      //console.log('messages',messages);

      var lang = function () {
        //console.log(props);
        //return 'nl';
        try {
          return _this2.state.i18n ? props.lang : EurekaMediaBrowser.defaultProps.lang; // the component is en-US unless/until the lexicons have async loaded
        } catch (e) {
          return EurekaMediaBrowser.defaultProps.lang;
        }
      }();

      return _react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(
          _reactIntl.IntlProvider,
          _extends({}, props, { locale: language, messages: messages }),
          _react2.default.createElement(this.EurekaController, _extends({}, props, { lang: lang }))
        )
      );
    }
  }]);

  return EurekaMediaBrowser;
}(_react.Component);

EurekaMediaBrowser.defaultProps = {
  i18n: 'assets/js/i18n/locales/',
  lang: 'en-US'
};

exports.default = EurekaMediaBrowser;