'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _reactIntl = require('react-intl');

var _definedMessages = require('../i18n/definedMessages');

var _definedMessages2 = _interopRequireDefault(_definedMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewChooser = function ViewChooser(props) {
  var formatMessage = props.intl.formatMessage,
      tabularLayoutMessage = formatMessage(_definedMessages2.default.tabularLayoutDescription),
      thumbLayoutMessage = formatMessage(_definedMessages2.default.thumbnailLayoutDescription),
      gridLayoutMessage = formatMessage(_definedMessages2.default.gridLayoutDescription),
      listLayoutMessage = formatMessage(_definedMessages2.default.listLayoutDescription);

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
        )
      )
    )
  );
};

exports.default = ViewChooser;