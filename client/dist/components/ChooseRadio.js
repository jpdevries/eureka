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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ChooseRadio(props) {
  var invert = props.view.chooseMultiple ? _react2.default.createElement(
    'label',
    { htmlFor: 'eureka__invert_selection' },
    '\u2003',
    _react2.default.createElement('input', { checked: props.view.selectionInverted, onChange: function onChange(event) {
        _store2.default.dispatch(_actions2.default.updateView({
          selectionInverted: event.target.checked
        }));
      }, type: 'checkbox', id: props.storagePrefix + 'invert_selection', name: 'eureka__invert_selection' }),
    '\u2002Invert',
    _react2.default.createElement(
      'span',
      { className: 'visually-hidden' },
      ' Selection'
    ),
    '\u2003'
  ) : undefined,
      maybeSpace = props.view.chooseMultiple ? undefined : _react2.default.createElement(
    'span',
    null,
    '\u2003'
  );
  return _react2.default.createElement(
    'div',
    { className: 'eureka__choose-radio' },
    _react2.default.createElement(
      'fieldset',
      null,
      _react2.default.createElement(
        'div',
        { className: 'eureka__fieldset' },
        _react2.default.createElement(
          'legend',
          null,
          'Choose Items:\u2002'
        ),
        _react2.default.createElement('input', { onChange: function onChange(event) {
            _store2.default.dispatch(_actions2.default.updateView({
              chooseMultiple: false
            }));
          }, checked: !props.view.chooseMultiple, type: 'radio', name: props.storagePrefix + '__choose_items', id: props.storagePrefix + '__choose_item' }),
        _react2.default.createElement(
          'label',
          { htmlFor: props.storagePrefix + '__choose_item' },
          '\u2002Single\u2003'
        ),
        _react2.default.createElement('input', { onChange: function onChange(event) {
            _store2.default.dispatch(_actions2.default.updateView({
              chooseMultiple: true
            }));
          }, checked: props.view.chooseMultiple, type: 'radio', name: props.storagePrefix + '__choose_items', id: props.storagePrefix + '__choose_items' }),
        _react2.default.createElement(
          'label',
          { htmlFor: props.storagePrefix + '__choose_items' },
          '\u2002Multiple',
          maybeSpace
        )
      )
    ),
    invert
  );
}

exports.default = ChooseRadio;