'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utility = require('../utility/utility');

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

var _FullScreenPureComponent = require('./FullScreenPureComponent');

var _FullScreenPureComponent2 = _interopRequireDefault(_FullScreenPureComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewChooser = function (_FullScreenPureCompon) {
  _inherits(ViewChooser, _FullScreenPureCompon);

  function ViewChooser() {
    _classCallCheck(this, ViewChooser);

    return _possibleConstructorReturn(this, (ViewChooser.__proto__ || Object.getPrototypeOf(ViewChooser)).apply(this, arguments));
  }

  _createClass(ViewChooser, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var props = this.props,
          formatMessage = props.intl.formatMessage,
          tabularLayoutMessage = formatMessage(_definedMessages2.default.tabularLayoutDescription),
          thumbLayoutMessage = formatMessage(_definedMessages2.default.thumbnailLayoutDescription),
          gridLayoutMessage = formatMessage(_definedMessages2.default.gridLayoutDescription),
          listLayoutMessage = formatMessage(_definedMessages2.default.listLayoutDescription),
          fullscreenToggle = this.state.supportsFullscreen ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('input', { type: 'checkbox', id: 'eureka__fullscreen-toggle', name: 'eureka__fullscreen-toggle', value: '1', onChange: function onChange(event) {
            var closestRoot = event.target.closest('.eureka-root');
            var isFullscreen = false;
            if (event.target.checked) {
              try {
                closestRoot.requestFullscreen();
              } catch (e) {
                (0, _utility.runPrefixMethod)(closestRoot, 'RequestFullscreen');
              }
              isFullscreen = true;
            } else {
              try {
                closestRoot.exitFullscreen();
              } catch (e) {
                (0, _utility.runPrefixMethod)(document, 'ExitFullscreen');
                (0, _utility.runPrefixMethod)(document, 'CancelFullscreen');
              }
            }
            _this2.setState({
              isFullscreen: isFullscreen
            });
          } }),
        _react2.default.createElement(
          'label',
          { className: (0, _classnames2.default)({
              'eureka__checked-active': this.state.isFullscreen
            }), htmlFor: 'eureka__fullscreen-toggle' },
          _react2.default.createElement(
            'span',
            { className: 'visually-hidden' },
            _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.fullscreenMode', defaultMessage: 'Fullscreen Mode' })
          ),
          _react2.default.createElement(_Icon2.default, _extends({}, props, { 'aria-hidden': 'true', icon: this.state.isFullscreen ? 'compress' : 'expand' }))
        )
      ) : undefined;

      return _react2.default.createElement(
        'form',
        { className: 'eureka__layout-chooser' },
        _react2.default.createElement(
          'fieldset',
          null,
          _react2.default.createElement(
            'legend',
            null,
            'Choose a Layout Mode'
          ),
          _react2.default.createElement(
            'div',
            { className: 'eureka__icon-radio-btns' },
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-table', name: 'eureka__view', onChange: function onChange(event) {
                  return _store2.default.dispatch(_actions2.default.updateView({
                    mode: event.target.value
                  }));
                }, checked: props.view.mode === 'table', value: 'table' }),
              '\u2003',
              _react2.default.createElement(
                'label',
                { htmlFor: 'eureka__view-table', title: tabularLayoutMessage },
                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'th-list' })),
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.table', defaultMessage: 'Table Layout' })
                )
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-thumb', name: 'eureka__view', onChange: function onChange(event) {
                  return _store2.default.dispatch(_actions2.default.updateView({
                    mode: event.target.value
                  }));
                }, checked: props.view.mode === 'thumb', value: 'thumb' }),
              '\u2003',
              _react2.default.createElement(
                'label',
                { htmlFor: 'eureka__view-thumb', title: thumbLayoutMessage },
                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'th-large' })),
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.thumb', defaultMessage: 'Thumbnail Layout' })
                )
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-grid', name: 'eureka__view', onChange: function onChange(event) {
                  return _store2.default.dispatch(_actions2.default.updateView({
                    mode: event.target.value
                  }));
                }, checked: props.view.mode === 'grid', value: 'grid' }),
              '\u2003',
              _react2.default.createElement(
                'label',
                { htmlFor: 'eureka__view-grid', title: gridLayoutMessage },
                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'square' })),
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.grid', defaultMessage: 'Grid Layout' })
                )
              )
            ),
            _react2.default.createElement(
              'div',
              null,
              _react2.default.createElement('input', { type: 'radio', id: 'eureka__view-list', name: 'eureka__view', onChange: function onChange(event) {
                  return _store2.default.dispatch(_actions2.default.updateView({
                    mode: event.target.value
                  }));
                }, checked: props.view.mode === 'list', value: 'list' }),
              '\u2003',
              _react2.default.createElement(
                'label',
                { htmlFor: 'eureka__view-list', title: listLayoutMessage },
                _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'list' })),
                _react2.default.createElement(
                  'span',
                  { className: 'visually-hidden' },
                  _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'layout.list', defaultMessage: 'List Layout' })
                )
              )
            ),
            fullscreenToggle
          )
        )
      );
    }
  }]);

  return ViewChooser;
}(_FullScreenPureComponent2.default);

exports.default = ViewChooser;