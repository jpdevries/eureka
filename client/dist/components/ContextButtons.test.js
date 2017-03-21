'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ContextButtons = require('./ContextButtons');

var _ContextButtons2 = _interopRequireDefault(_ContextButtons);

var _utility = require('../utility/utility');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('renders without crashing', function () {
  var div = document.createElement('div');
  var item = {
    filename: 'sky.jpg'
  };

  var props = {
    config: {
      allowRename: true,
      storagePrefix: 'eureka__'
    }
  };

  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextButtons2.default, _extends({ item: item }, props)), div);
});

it('should add a rename button if config.allowRename is true', function () {
  var div = document.createElement('div');
  var item = {
    filename: 'sky.jpg'
  };

  var props = {
    config: {
      allowRename: true,
      storagePrefix: 'eureka__'
    }
  };

  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextButtons2.default, _extends({ item: item }, props)), div);

  if (!div.querySelector('#' + props.config.storagePrefix + 'rename__' + (0, _utility.cssSafe)(item.filename))) {
    var err = 'should add a rename button if config.allowRename is true';
    throw new Error(err);
  }
});

it('should not add a rename button if config.allowRename is not true', function () {
  var div = document.createElement('div');
  var item = {
    filename: 'sky.jpg'
  };

  var props = {
    config: {
      allowRename: false,
      storagePrefix: 'eureka__'
    }
  };

  //props.view.sourceTreeOpen}
  _reactDom2.default.render(_react2.default.createElement(_ContextButtons2.default, _extends({ item: item }, props)), div);

  if (div.querySelector('#' + props.config.storagePrefix + 'rename__' + (0, _utility.cssSafe)(item.filename))) {
    var err = 'should not add a rename button if config.allowRename is not true';
    throw new Error(err);
  }
});

it('renders a snapshot', function () {
  var item = {
    filename: 'sky.jpg'
  };

  var props = {
    config: {
      allowRename: false,
      storagePrefix: 'eureka__'
    }
  };
  var contextButtons = _reactTestRenderer2.default.create(_react2.default.createElement(_ContextButtons2.default, _extends({ item: item }, props))).toJSON();
  expect(contextButtons).toMatchSnapshot();
});