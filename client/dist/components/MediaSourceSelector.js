'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _actions = require('../model/actions');

var _actions2 = _interopRequireDefault(_actions);

var _reactIntl = require('react-intl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MediaSourceSelector = function MediaSourceSelector(props) {
  var options = props.source.sources.map(function (source, index) {
    return _react2.default.createElement(
      'option',
      { key: index, value: source.id === undefined ? index : source.id },
      source.name
    );
  });

  return _react2.default.createElement(
    'div',
    { className: 'eureka__media-source-selector' },
    _react2.default.createElement(
      'h2',
      null,
      _react2.default.createElement(
        'label',
        { htmlFor: 'media-source-selector__select' },
        _react2.default.createElement(
          'span',
          { className: 'visually-hidden' },
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'choose', defaultMessage: 'Choose' }),
          ' ',
          _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'grammar.a', defaultMessage: 'a' }),
          ' '
        ),
        _react2.default.createElement(_reactIntl.FormattedMessage, { id: 'media.source', defaultMessage: 'Media Source' })
      )
    ),
    _react2.default.createElement(
      'select',
      { value: props.source.currentSource, id: 'media-source-selector__select', onChange: function onChange(event) {
          props.dispatch(_actions2.default.updateSource(event.target.value));
          props.dispatch(_actions2.default.updateSourceTree(event.target.value));
        } },
      options
    )
  );
};

exports.default = MediaSourceSelector;