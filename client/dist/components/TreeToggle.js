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

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TreeToggle = function TreeToggle(props) {
  //<Icon icon={`caret-square-o-${props.view.sourceTreeOpen ? 'left' : 'right'}`} />&ensp;
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'button',
      { id: 'eureka__tree-toggle__button', 'aria-controls': 'eureka__pathbrowser', 'aria-expanded': props.view.sourceTreeOpen, onClick: function onClick(event) {
          _store2.default.dispatch(_actions2.default.updateView({
            sourceTreeOpen: !props.view.sourceTreeOpen
          }));
        } },
      (props.view.sourceTreeOpen ? 'Close' : 'Open') + ' Media Source Tree'
    )
  );
};

exports.default = TreeToggle;