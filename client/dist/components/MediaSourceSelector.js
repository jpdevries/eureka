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
  var decoratedActions = props.decoratedActions ? Object.assign({}, _actions2.default, props.decoratedActions) : _actions2.default;
  //console.log('MediaSourceSelector',decoratedActions);
  var options = props.source.sources.map(function (source, index) {
    return _react2.default.createElement(
      'option',
      { key: source.name + '__' + (source.id === undefined ? index : source.id), value: source.id === undefined ? index : source.id },
      source.name
    );
  });

  return (// future-role="complementary composite"
    _react2.default.createElement(
      'div',
      { className: 'eureka__media-source-selector', role: 'complementary' },
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
            props.dispatch(decoratedActions.updateSource(event.target.value));
            props.dispatch(decoratedActions.updateSourceTree(event.target.value, props.config.headers));
          } },
        options
      )
    )
  );
};

exports.default = MediaSourceSelector;