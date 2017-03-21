'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _DropArea = require('./DropArea');

var _DropArea2 = _interopRequireDefault(_DropArea);

var _utility = require('../utility/utility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = require('../model/actions'),
    store = require('../model/store');

store.dispatch(actions.updateConfig({
  allowUploads: false
}));

it('renders without crashing', function () {
  var div = document.createElement('div'),
      item = {
    filename: 'sky.jpg'
  };

  _reactDom2.default.render(_react2.default.createElement(_DropArea2.default, { config: {
      storagePrefix: 'eureka__'
    }, view: {
      sourceTreeOpen: true
    }, content: {
      cd: './'
    } }), div);
});