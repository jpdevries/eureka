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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewChooser = function ViewChooser(props) {

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
            { htmlFor: 'eureka__view-table', title: 'Tabular Layout displays image thumbnails along with Name, Description, File Size and Edited On columns' },
            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'th-list' })),
            _react2.default.createElement(
              'span',
              { className: 'visually-hidden' },
              'Table Layout'
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
            { htmlFor: 'eureka__view-thumb', title: 'Thumbnail layout displays a grid of medium sized thumbnails' },
            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'th-large' })),
            _react2.default.createElement(
              'span',
              { className: 'visually-hidden' },
              'Thumbnail Layout'
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
            { htmlFor: 'eureka__view-grid', title: 'Grid View displays images a grid of large images' },
            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'square' })),
            _react2.default.createElement(
              'span',
              { className: 'visually-hidden' },
              'Grid View'
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
            { htmlFor: 'eureka__view-list', title: 'List Layout displays Name, Description, File Size and Edited On columns' },
            _react2.default.createElement(_Icon2.default, _extends({}, props, { icon: 'list' })),
            _react2.default.createElement(
              'span',
              { className: 'visually-hidden' },
              'List Layout'
            )
          )
        )
      )
    )
  );
};

exports.default = ViewChooser;