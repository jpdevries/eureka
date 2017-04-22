'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _utility = require('../utility/utility');

var _utility2 = _interopRequireDefault(_utility);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBar = function (_Component) {
  _inherits(SearchBar, _Component);

  function SearchBar(props) {
    _classCallCheck(this, SearchBar);

    var _this = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

    _this.state = {
      placeholderField: 'filename',
      lastDir: '/'
    };
    if (!_utility2.default.serverSideRendering && _this.props.view.intervals.searchBarPlaceholder) {
      setInterval(function () {
        _this.pickRandomField();
      }, _this.props.view.intervals.searchBarPlaceholder);
    }

    return _this;
  }

  _createClass(SearchBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      //console.log('componentDidMount');
      this.pickRandomField();

      /*store.subscribe(() => {
        if(this.state.lastDir !== store.getState().content.cd) this.pickRandomField();
         this.setState({
          lastDir:store.getState().content.cd
        })
      });*/
    }
  }, {
    key: 'pickRandomField',
    value: function pickRandomField() {
      var random = Math.random();
      var cases = ['filename', 'dimensions', 'editedOn', 'fileSize'];
      this.setState({
        placeholderField: cases[Math.round(Math.random() * (cases.length - 1))]
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props;

      var formatMessage = props.intl.formatMessage;

      var options = [_react2.default.createElement(
        'option',
        { key: '0' },
        'FileSystem'
      )];

      var placeholder = function () {
        try {
          if (!props.content.contents.length) return "";
        } catch (e) {
          return "";
        }

        var randomItem = props.content.contents[Math.round(Math.random() * (props.content.contents.length - 1))];

        switch (_this2.state.placeholderField) {
          case 'filename':
            return randomItem.filename;

          case 'dimensions':
            return randomItem.dimensions.join('x');

          case 'editedOn':
            return Math.random() < .5 ? new Date(randomItem.editedOn).toLocaleString() : new Date(randomItem.editedOn).toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

          case 'fileSize':
            return (0, _filesize2.default)(randomItem.fileSize, { round: 0 });
        }
      }();

      //console.log('props',props);

      var list = _react2.default.createElement(
        'datalist',
        { id: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + '__datalist' },
        props.content.contents.map(function (item) {
          return _react2.default.createElement('option', { key: item.filename, value: item.filename });
        })
      );

      var filterTitle = formatMessage(_definedMessages2.default.filterContentsOfBy, {
        cd: props.content.cd
      });

      var contentsOfBy = formatMessage(_definedMessages2.default.contentsOfBy, {
        cd: props.content.cd
      });

      var filterMessage = _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'filter', defaultMessage: 'Filter' });

      return !_utility2.default.serverSideRendering ? _react2.default.createElement(
        'form',
        { role: 'search', className: 'eureka__search-bar', onSubmit: function onSubmit(event) {
            return event.preventDefault();
          } },
        _react2.default.createElement(
          'label',
          { htmlFor: 'eureka__filter', title: filterTitle },
          filterMessage,
          _react2.default.createElement(
            'span',
            { className: 'visually-hidden' },
            ' ',
            contentsOfBy
          ),
          ':\u2002'
        ),
        _react2.default.createElement('input', { list: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + '__datalist', type: 'text', name: 'eureka__filter', id: 'eureka__filter', placeholder: placeholder, value: props.view.filter, onChange: function onChange(event) {
            _store2.default.dispatch(_actions2.default.updateView({
              filter: event.target.value || undefined
            }));
          } }),
        list
      ) : _react2.default.createElement(
        'div',
        { className: 'eureka__search-bar' },
        _react2.default.createElement(
          'label',
          { htmlFor: 'eureka__filter', title: filterTitle },
          filterMessage,
          _react2.default.createElement(
            'span',
            { className: 'visually-hidden' },
            ' ',
            contentsOfBy
          ),
          ':\u2002'
        ),
        _react2.default.createElement('input', { list: (props.config.storagePrefix !== undefined ? props.config.storagePrefix : 'eureka__') + '__datalist', type: 'text', name: 'eureka__filter', id: 'eureka__filter', placeholder: placeholder, value: props.view.filter, onChange: function onChange(event) {
            _store2.default.dispatch(_actions2.default.updateView({
              filter: event.target.value || undefined
            }));
          } }),
        list
      );
    }
  }]);

  return SearchBar;
}(_react.Component);

exports.default = SearchBar;